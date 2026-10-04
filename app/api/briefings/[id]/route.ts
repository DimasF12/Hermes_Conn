import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Handle "latest" — ambil edisi terbaru berdasarkan createdAt
  if (id === 'latest') {
    const latest = await prisma.briefingEdition.findFirst({
      orderBy: { createdAt: 'desc' },
      include: { signals: { orderBy: { createdAt: 'asc' } } },
    });

    if (!latest) {
      return NextResponse.json({ error: 'No editions found' }, { status: 404 });
    }

    return NextResponse.json(mapEditionToFrontend(latest));
  }

  // Ambil edisi berdasarkan ID
  const edition = await prisma.briefingEdition.findUnique({
    where: { id },
    include: { signals: { orderBy: { createdAt: 'asc' } } },
  });

  if (!edition) {
    return NextResponse.json({ error: 'Edition not found' }, { status: 404 });
  }

  return NextResponse.json(mapEditionToFrontend(edition));
}

/**
 * Map Prisma result ke format BriefEdition yang dipakai komponen frontend
 */
function mapEditionToFrontend(edition: any) {
  return {
    id: edition.id,
    schemaVersion: edition.schemaVersion,
    status: edition.status,
    meta: {
      title: edition.title,
      subtitle: edition.subtitle,
      eyebrow: edition.eyebrow,
      editionDate: edition.editionDate,
      dataAsOf: edition.dataAsOf,
      state: edition.state,
      sourceLabel: edition.sourceLabel,
      sourceNote: edition.sourceNote,
      contributingBots: edition.contributingBots,
    },
    featuredId: edition.featuredId,
    updatedAt: edition.updatedAt?.toISOString(),
    signals: edition.signals.map((s: any) => ({
      // Hapus prefix editionId (e.g. "edition-2026-09-30__commercial" → "commercial")
      id: s.id.includes('__') ? s.id.split('__').slice(1).join('__') : s.id,
      category: s.category,
      tone: s.tone,
      status: s.signalStatus,
      priority: s.priority,
      source: s.botName,
      title: s.title,
      summary: s.summary,
      metric: s.metric,
      evidence: s.evidence,
      action: s.action,
      dataAsOf: s.dataAsOf,
      sources: s.sources,
      visual: s.visual,
      bot: s.bot,
      tags: s.tags,
      extensions: s.extensions,
    })),
  };
}
