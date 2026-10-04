import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid payload: Body must be a JSON object.' },
        { status: 400 }
      );
    }

    // Support payload from Hermes Agent / multi-bot (both lean format & legacy format)
    const rawDate = body.edition_date || body.editionDate || new Date().toISOString().split('T')[0];
    const editionId = body.id || `edition-${rawDate}`;

    // Normalize raw signals into DB rows (supporting both 3-container & flat schemas)
    const signalRows = Array.isArray(body.signals)
      ? body.signals.map((s: any, idx: number) => {
          const main = s.main || s;
          const pres = s.presentation || {};
          const ext = s.extensions || s.metadata || {};

          const priority = (main.priority || s.priority || 'MEDIUM').toUpperCase();
          const tone = main.tone || s.tone || (priority === 'HIGH' ? 'amber' : priority === 'LOW' ? 'neutral' : 'blue');
          const signalStatus = main.status || s.status || (priority === 'HIGH' ? 'Immediate' : priority === 'LOW' ? 'Information' : 'Opportunity');
          const botName = main.bot_name || main.bot?.name || s.bot_name || s.source || 'Intelligence Source';

          return {
            id: main.id || `sig-${idx + 1}`,
            category: main.category || 'General',
            tone,
            signalStatus,
            priority,
            botName,
            title: main.title || 'Untitled Signal',
            summary: main.summary || '',
            metric: main.metric || undefined,
            evidence: Array.isArray(main.evidence) ? main.evidence : [],
            action: {
              text: main.action?.text || main.action?.task || 'Review strategic implications.',
              owner: main.action?.owner || 'Executive Team',
              checkpoint: main.action?.checkpoint || main.action?.deadline
            },
            dataAsOf: main.dataAsOf || main.data_as_of || 'TODAY',
            sources: Array.isArray(main.sources)
              ? main.sources.map((src: any) => ({
                  label: src.label || src.name || 'Source',
                  url: src.url || '',
                  date: src.date
                }))
              : undefined,
            visual: pres.visual !== undefined ? pres.visual : (s.visual || undefined),
            bot: main.bot || { id: botName.toLowerCase().replace(/\s+/g, '-'), name: botName },
            tags: Array.isArray(main.tags) ? main.tags : (Array.isArray(s.tags) ? s.tags : []),
            extensions: Object.keys(ext).length > 0 ? ext : undefined,
          };
        })
      : [];

    // Tally contributing bots
    const botCounts: Record<string, { botId: string; botName: string; signalsCount: number }> = {};
    signalRows.forEach((sig: any) => {
      const bId = sig.bot?.id || 'hermes-news-agent';
      const bName = sig.bot?.name || 'Hermes News Agent';
      if (!botCounts[bId]) {
        botCounts[bId] = { botId: bId, botName: bName, signalsCount: 0 };
      }
      botCounts[bId].signalsCount += 1;
    });

    const editionData = {
      schemaVersion: 1,
      status: body.status || 'approved',
      title: body.title || body.meta?.title || 'Executive Intelligence Briefing',
      subtitle: body.subtitle || body.meta?.subtitle || 'Daily strategic signals and decisions.',
      eyebrow: body.eyebrow || body.meta?.eyebrow || 'The management edition',
      editionDate: body.editionDate || body.meta?.editionDate || rawDate,
      dataAsOf: body.dataAsOf || body.meta?.dataAsOf || 'TODAY',
      state: body.state || body.meta?.state || 'Approved edition',
      sourceLabel: body.sourceLabel || body.meta?.sourceLabel || 'Multi-Bot Intelligence',
      sourceNote: body.sourceNote || body.meta?.sourceNote || 'Grounded in approved executive source.',
      featuredId: body.featured_id || body.featuredId || signalRows[0]?.id || '',
      contributingBots: Object.values(botCounts).length > 0
        ? Object.values(botCounts)
        : [{ botId: 'hermes-news-agent', botName: 'Hermes News Intelligence', signalsCount: signalRows.length }],
    };

    // Upsert edition (buat baru atau overwrite edisi yang sama)
    await prisma.briefingEdition.upsert({
      where: { id: editionId },
      create: {
        id: editionId,
        ...editionData,
        signals: { create: signalRows },
      },
      update: {
        ...editionData,
        signals: {
          deleteMany: {},          // hapus sinyal lama dulu
          create: signalRows,     // tulis sinyal baru
        },
      },
    });

    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'Briefing ingested successfully and dashboard refreshed.',
      editionId,
      signalsCount: signalRows.length,
    });
  } catch (error: any) {
    console.error('[INGEST ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to ingest briefing', details: error.message },
      { status: 500 }
    );
  }
}
