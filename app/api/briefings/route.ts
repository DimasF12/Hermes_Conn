import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const editions = await prisma.briefingEdition.findMany({
    select: {
      id: true,
      title: true,
      editionDate: true,
      dataAsOf: true,
      status: true,
      _count: { select: { signals: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Map ke format EditionSummary yang dipakai frontend
  const summaries = editions.map((e) => ({
    id: e.id,
    title: e.title,
    editionDate: e.editionDate,
    dataAsOf: e.dataAsOf,
    signalsCount: e._count.signals,
    status: e.status,
  }));

  return NextResponse.json(summaries);
}
