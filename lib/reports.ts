import { promises as fs } from 'fs';
import path from 'path';
import { BlobServiceClient } from '@azure/storage-blob';

/** Local folder fallback */
const REPORTS_DIR = path.join(process.cwd(), 'public', 'reports');

export interface ReportEntry {
  /** Nama file, contoh: "2026-10-05.html" */
  file: string;
  /** URL untuk iframe / preview */
  url: string;
  /** Judul dari nama file */
  title: string;
  /** Tanggal edisi ISO (YYYY-MM-DD) */
  date: string;
  /** Tanggal edisi terformat (misal: "5 October 2026") */
  editionDate: string;
  /** Ukuran file dalam byte */
  size: number;
  /** Waktu terakhir file diubah (ISO) */
  updatedAt: string;
}

import { formatReportDate } from './dateUtils';

const DATE_PATTERN = /(\d{4}-\d{2}-\d{2})/;

function prettifyFileName(file: string): string {
  const base = path.basename(file).replace(/\.html?$/i, '');
  const dateMatch = base.match(DATE_PATTERN);
  const remainder = dateMatch
    ? base.replace(dateMatch[0], '').replace(/^[_-]+|[_-]+$/g, '')
    : base;
  return remainder
    ? remainder.replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'AI Sales Intelligence';
}

function getAzureContainerClient() {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const account = process.env.AZURE_STORAGE_ACCOUNT;
  const key = process.env.AZURE_STORAGE_KEY;
  const containerName = process.env.AZURE_STORAGE_CONTAINER || 'gyssignal';

  if (connStr) {
    const serviceClient = BlobServiceClient.fromConnectionString(connStr);
    return serviceClient.getContainerClient(containerName);
  } else if (account && key) {
    const serviceClient = new BlobServiceClient(
      `https://${account}.blob.core.windows.net`,
      undefined // credentials handled if SAS or connection string
    );
    return serviceClient.getContainerClient(containerName);
  }
  return null;
}

/**
 * Scan laporan dari Azure Blob Storage (gyssignal/scheduled/sales-intelligence/clevel-html)
 * dengan fallback otomatis ke folder lokal public/reports.
 */
export async function listReports(): Promise<ReportEntry[]> {
  const container = getAzureContainerClient();
  const folder = (process.env.AZURE_STORAGE_FOLDER || 'scheduled/sales-intelligence/clevel-html').replace(/\/+$/, '');

  if (container) {
    try {
      const entries: ReportEntry[] = [];
      for await (const blob of container.listBlobsFlat({ prefix: folder })) {
        if (!/\.html?$/i.test(blob.name)) continue;

        const fileName = path.basename(blob.name);
        const dateMatch = fileName.match(DATE_PATTERN);
        const date = dateMatch
          ? dateMatch[1]
          : (blob.properties.lastModified?.toISOString().slice(0, 10) ?? '');

        entries.push({
          file: fileName,
          url: `/api/reports/view?file=${encodeURIComponent(fileName)}`,
          title: prettifyFileName(fileName),
          date,
          editionDate: formatReportDate(date, 'long'),
          size: blob.properties.contentLength ?? 0,
          updatedAt: blob.properties.lastModified?.toISOString() ?? new Date().toISOString(),
        });
      }

      if (entries.length > 0) {
        return entries.sort(
          (a, b) => b.date.localeCompare(a.date) || b.file.localeCompare(a.file)
        );
      }
    } catch (err) {
      console.error('Azure Blob listReports error, falling back to local:', err);
    }
  }

  // Fallback to local public/reports folder
  let files: string[];
  try {
    files = await fs.readdir(REPORTS_DIR);
  } catch {
    return [];
  }

  const htmlFiles = files.filter(f => /\.html?$/i.test(f));

  const entries = await Promise.all(
    htmlFiles.map(async (file): Promise<ReportEntry> => {
      const filePath = path.join(REPORTS_DIR, file);
      const stat = await fs.stat(filePath);
      const date = file.match(DATE_PATTERN)?.[1] ?? stat.mtime.toISOString().slice(0, 10);

      return {
        file,
        url: `/api/reports/view?file=${encodeURIComponent(file)}`,
        title: prettifyFileName(file),
        date,
        editionDate: formatReportDate(date, 'long'),
        size: stat.size,
        updatedAt: stat.mtime.toISOString(),
      };
    })
  );

  return entries.sort(
    (a, b) => b.date.localeCompare(a.date) || b.file.localeCompare(a.file)
  );
}

/**
 * Ambil konten HTML laporan (dari Azure Blob atau lokal) untuk disajikan ke iframe.
 */
export async function getReportHtml(fileName: string): Promise<string | null> {
  const sanitized = path.basename(fileName);
  const container = getAzureContainerClient();
  const folder = (process.env.AZURE_STORAGE_FOLDER || 'scheduled/sales-intelligence/clevel-html').replace(/\/+$/, '');

  if (container) {
    try {
      const blobClient = container.getBlobClient(`${folder}/${sanitized}`);
      const downloadRes = await blobClient.downloadToBuffer();
      return downloadRes.toString('utf-8');
    } catch {
      // Fall through to local fallback
    }
  }

  // Local fallback
  try {
    const filePath = path.join(REPORTS_DIR, sanitized);
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}
