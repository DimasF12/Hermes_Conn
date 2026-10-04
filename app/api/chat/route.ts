import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface ChatPayload {
  message: string;
  history?: Array<{
    sender: 'user' | 'assistant';
    text: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatPayload;
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const hermesApiUrl = process.env.HERMES_API_URL || 'http://localhost:8000/v1/chat/completions';
    const hermesModel = process.env.HERMES_MODEL || 'hermes';

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

    // 2. Format conversation history for OpenAI-compatible schema
    const formattedMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      {
        role: 'system',
        content:
          'You are Hermes Executive Intelligence Assistant for C-Level leadership. Provide direct, highly concise, and actionable strategic insights.' +
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

    // 3. Send HTTP POST to Hermes API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

    let res: Response;
    try {
      res = await fetch(hermesApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: hermesModel,
          messages: formattedMessages,
          temperature: 0.3,
          max_tokens: 1500,
        }),
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      const isConnectionRefused = fetchErr.cause?.code === 'ECONNREFUSED' || fetchErr.message?.includes('fetch failed');
      
      return NextResponse.json({
        reply: isConnectionRefused
          ? `⚠️ **Hermes API Server Unreachable**\n\nCould not connect to Hermes at \`${hermesApiUrl}\`.\n\nPlease verify that your Hermes agent service is actively running on port 8000.\n\n*Command to start:* \`hermes gateway\` or check your port configuration.`
          : `⚠️ **Connection Error:** ${fetchErr.message || 'Unable to reach Hermes API'}`,
        citations: ['System Diagnostic: Hermes API Offline'],
        isDiagnostic: true,
      });
    }

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        reply: `⚠️ **Hermes API Error (${res.status}):** ${errText.slice(0, 300)}`,
        citations: ['System Diagnostic: Upstream Error'],
        isDiagnostic: true,
      });
    }

    const data = await res.json();
    const botReply =
      data.choices?.[0]?.message?.content ||
      data.reply ||
      data.response ||
      'Hermes returned an empty response.';

    const citations = latestReportFile ? [`Latest Briefing: ${latestReportFile}`] : ['Hermes Intelligence Engine'];

    return NextResponse.json({
      reply: botReply,
      citations,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json(
      {
        reply: `⚠️ Internal Error: ${err.message || 'Unknown server error'}`,
        citations: ['System Diagnostic: Exception'],
        isDiagnostic: true,
      },
      { status: 500 }
    );
  }
}
