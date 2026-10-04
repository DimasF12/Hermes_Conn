-- CreateTable
CREATE TABLE "briefing_editions" (
    "id" TEXT NOT NULL,
    "schema_version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'approved',
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "eyebrow" TEXT,
    "edition_date" TEXT NOT NULL,
    "data_as_of" TEXT,
    "state" TEXT,
    "source_label" TEXT,
    "source_note" TEXT,
    "featured_id" TEXT,
    "contributing_bots" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "briefing_editions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signals" (
    "id" TEXT NOT NULL,
    "edition_id" TEXT NOT NULL,
    "bot_name" TEXT,
    "category" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "metric" JSONB,
    "action" JSONB NOT NULL,
    "sources" JSONB,
    "evidence" TEXT[],
    "visual" JSONB,
    "extensions" JSONB,
    "tone" TEXT,
    "signal_status" TEXT,
    "data_as_of" TEXT,
    "bot" JSONB,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "signals_edition_id_idx" ON "signals"("edition_id");

-- CreateIndex
CREATE INDEX "signals_category_idx" ON "signals"("category");

-- CreateIndex
CREATE INDEX "signals_priority_idx" ON "signals"("priority");

-- AddForeignKey
ALTER TABLE "signals" ADD CONSTRAINT "signals_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "briefing_editions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
