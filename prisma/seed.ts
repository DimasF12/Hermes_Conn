import { PrismaClient } from '@prisma/client';
import { mockEditions } from '../data/mockBriefings';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database dari mockBriefings.ts...');

  for (const edition of mockEditions) {
    const editionData = {
      schemaVersion: edition.schemaVersion,
      status: edition.status,
      title: edition.meta.title,
      subtitle: edition.meta.subtitle,
      eyebrow: edition.meta.eyebrow,
      editionDate: edition.meta.editionDate,
      dataAsOf: edition.meta.dataAsOf,
      state: edition.meta.state,
      sourceLabel: edition.meta.sourceLabel,
      sourceNote: edition.meta.sourceNote,
      featuredId: edition.featuredId,
      // Cast as any untuk bypass Prisma JSON type — data valid, hanya type-system conflict
      contributingBots: (edition.meta.contributingBots ?? []) as any,
    };

    const signalRows: any[] = edition.signals.map((s: any) => ({
      id: `${edition.id}__${s.id}`,  // prefix dengan editionId agar unik antar edisi
      category: s.category,
      tone: s.tone,
      signalStatus: s.status,
      priority: s.priority || 'MEDIUM',
      botName: s.source || s.bot?.name || 'Intelligence Source',
      title: s.title,
      summary: s.summary,
      metric: s.metric ?? undefined,
      evidence: s.evidence ?? [],
      action: s.action as any,
      dataAsOf: s.dataAsOf,
      sources: (s.sources ?? undefined) as any,
      visual: (s.visual ?? undefined) as any,
      bot: (s.bot ?? undefined) as any,
      tags: s.tags ?? [],
      extensions: (s.extensions ?? undefined) as any,
    }));

    await prisma.briefingEdition.upsert({
      where: { id: edition.id },
      create: {
        id: edition.id,
        ...editionData,
        signals: { create: signalRows },
      } as any,
      update: {
        ...editionData,
        signals: {
          deleteMany: {},
          create: signalRows,
        },
      } as any,
    });

    console.log(`  ✅ Seeded: ${edition.id} (${signalRows.length} signals)`);
  }

  console.log(`\n🎉 Seed selesai! Total ${mockEditions.length} edisi tersimpan ke database.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
