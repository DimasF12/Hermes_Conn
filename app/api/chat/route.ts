import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface ChatPayload {
  message: string;
  persona?: 'data_analyst' | 'data_engineer';
  history?: Array<{
    sender: 'user' | 'assistant';
    text: string;
  }>;
}

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow up to 5 minutes for agent reasoning

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatPayload;
    const { message, history = [], persona = 'data_analyst' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const hermesApiUrl = process.env.HERMES_API_URL || 'http://localhost:8000/v1/chat/completions';
    const targetModel = persona; // Hermes agent: 'data_analyst' (gemini-3.5-flash-lite) or 'data_engineer' (glm-4.7-flash)
    const modelEngineName = persona === 'data_engineer' ? 'glm-4.7-flash' : 'gemini-3.5-flash-lite';

    // 1. Gather context from latest executive report in public/reports
    let reportContext = '';
    let latestReportFile = '';
    try {
      const reportsDir = path.join(process.cwd(), 'public', 'reports');
      const files = await fs.readdir(reportsDir);
      const htmlFiles = files.filter((f) => /\.html?$/i.test(f)).sort().reverse();

      if (htmlFiles.length > 0) {
        latestReportFile = htmlFiles[0];
        const rawHtml = await fs.readFile(path.join(reportsDir, latestReportFile), 'utf-8');
        // Clean out styles and tags, grab top 4000 characters for concise context
        reportContext = rawHtml
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 4000);
      }
    } catch {
      // Fallback if reports directory is unreadable
      reportContext = '';
    }

    // 2. Format conversation history with tailored system prompt per persona
    const personaSystemPrompt =
      persona === 'data_engineer'
        ? 'You are Hermes Data Engineer & Systems Architect (powered by glm-4.7-flash). Provide expert, actionable technical guidance on data pipeline architecture, ETL/ELT workflows, database schema design, indexing, query optimization, partitioned storage, and data reliability.'
        : 'You are Hermes Data Analyst & Executive Intelligence Specialist (powered by gemini-3.5-flash-lite). Provide quantitative analysis, KPI evaluations, sales performance trends, anomaly detection, and actionable business strategic insights based on executive briefing data.';

    const formattedMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content:
          personaSystemPrompt +
          (reportContext ? `\n\nLatest Executive Briefing Context:\n${reportContext}` : ''),
      },
    ];

    // Take last 4 turns for context
    const recentHistory = history.slice(-4);
    for (const item of recentHistory) {
      formattedMessages.push({
        role: item.sender === 'user' ? 'user' : 'assistant',
        content: item.text,
      });
    }

    formattedMessages.push({
      role: 'user',
      content: message,
    });

    const apiKey =
      process.env.HERMES_API_KEY ||
      process.env.API_SERVER_KEY ||
      'change-me-local-dev';

    // 3. Send HTTP POST to Hermes API with a 5-minute timeout window
    const timeoutMs = parseInt(process.env.HERMES_TIMEOUT_MS || '300000', 10);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    try {
      res = await fetch(hermesApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: targetModel,
          messages: formattedMessages,
          temperature: 0.3,
          max_tokens: 2048,
        }),
        signal: controller.signal,
      });
    } catch (fetchErr: unknown) {
      clearTimeout(timeoutId);
      const errorObj = fetchErr as Error & { cause?: { code?: string } };
      const isConnectionRefused = errorObj.cause?.code === 'ECONNREFUSED' || errorObj.message?.includes('fetch failed');
      const isTimeout = errorObj.name === 'AbortError' || errorObj.message?.includes('aborted');

      let replyMsg = `⚠️ **Connection Error:** ${errorObj.message || 'Unable to reach Hermes API'}`;
      if (isConnectionRefused) {
        replyMsg = `⚠️ **Hermes API Server Unreachable**\n\nCould not connect to Hermes at \`${hermesApiUrl}\`.\n\nPlease verify that your Hermes agent service is actively running on port 8000.`;
      } else if (isTimeout) {
        replyMsg = `⚠️ **Hermes Reasoning Timeout (${timeoutMs / 1000}s)**\n\nHermes Agent is still reasoning or executing tools. You can increase \`HERMES_TIMEOUT_MS\` in \`.env\` if your model requires more processing time.`;
      }

      return NextResponse.json({
        reply: replyMsg,
        citations: [`System Diagnostic: Gateway Timeout / Offline (${targetModel})`],
        persona,
        model: modelEngineName,
        isDiagnostic: true,
      });
    }

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        reply: `⚠️ **Hermes API Error (${res.status}):** ${errText.slice(0, 300)}`,
        citations: [`System Diagnostic: Upstream Error (${targetModel})`],
        persona,
        model: modelEngineName,
        isDiagnostic: true,
      });
    }

    const data = await res.json();
    const botReply =
      data.choices?.[0]?.message?.content ||
      data.reply ||
      data.response ||
      'Hermes returned an empty response.';

    const citations = latestReportFile
      ? [`Latest Briefing: ${latestReportFile}`, `${persona} (${modelEngineName})`]
      : [`Hermes: ${persona} (${modelEngineName})`];

    return NextResponse.json({
      reply: botReply,
      citations,
      persona,
      model: modelEngineName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (err: unknown) {
    console.error('Chat API Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    return NextResponse.json(
      {
        reply: `⚠️ Internal Error: ${errorMessage}`,
        citations: ['System Diagnostic: Exception'],
        isDiagnostic: true,
      },
      { status: 500 }
    );
  }
}
