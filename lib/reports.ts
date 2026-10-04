import { promises as fs } from 'fs';
import path from 'path';

/** Folder tempat AI menaruh file laporan .html */
export const REPORTS_DIR = path.join(process.cwd(), 'public', 'reports');

export interface ReportEntry {
  /** Nama file, contoh: "2026-10-02_sales-intelligence.html" */
  file: string;
  /** URL publik untuk iframe / download */
  url: string;
  /** Judul dari tag <title>, fallback ke nama file */
  title: string;
  /** Tanggal edisi (YYYY-MM-DD) dari nama file, fallback ke tanggal modifikasi */
  date: string;
  /** Ukuran file dalam byte */
  size: number;
  /** Waktu terakhir file diubah (ISO) */
  updatedAt: string;
}

const DATE_PREFIX = /^(\d{4}-\d{2}-\d{2})/;
const TITLE_TAG = /<title[^>]*>([\s\S]*?)<\/title>/i;

/** Ambil isi <title> dari 4KB pertama file (cukup untuk <head>). */
async function readTitle(filePath: string): Promise<string | null> {
  const handle = await fs.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(4096);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    const match = buffer.subarray(0, bytesRead).toString('utf8').match(TITLE_TAG);
    return match ? match[1].trim() : null;
  } finally {
    await handle.close();
  }
}

function prettifyFileName(file: string): string {
  return file
    .replace(/\.html?$/i, '')
    .replace(DATE_PREFIX, '')
    .replace(/[_-]+/g, ' ')
    .trim() || file;
}

/** Scan folder laporan dan kembalikan daftar edisi, terbaru di atas. */
export async function listReports(): Promise<ReportEntry[]> {
  let files: string[];
  try {
    files = await fs.readdir(REPORTS_DIR);
  } catch {
    return []; // Folder belum ada = belum ada laporan
  }

  const htmlFiles = files.filter(f => /\.html?$/i.test(f));

  const entries = await Promise.all(
    htmlFiles.map(async (file): Promise<ReportEntry> => {
      const filePath = path.join(REPORTS_DIR, file);
      const stat = await fs.stat(filePath);
      const title = (await readTitle(filePath)) || prettifyFileName(file);
      const date = file.match(DATE_PREFIX)?.[1] ?? stat.mtime.toISOString().slice(0, 10);

      return {
        file,
        url: `/reports/${encodeURIComponent(file)}`,
        title,
        date,
        size: stat.size,
        updatedAt: stat.mtime.toISOString(),
      };
    })
  );

  // Urutkan: tanggal edisi terbaru dulu, lalu waktu modifikasi terbaru
  return entries.sort(
    (a, b) => b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt)
  );
}
