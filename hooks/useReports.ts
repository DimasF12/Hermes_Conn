'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ReportEntry } from '@/lib/reports';

/**
 * Ambil daftar laporan HTML dari /api/reports dan kelola edisi yang dipilih.
 * Edisi terbaru otomatis terpilih; pilihan user dipertahankan saat refresh.
 */
export function useReports() {
  const [reports, setReports] = useState<ReportEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reports', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ReportEntry[] = await res.json();

      setReports(data);
      setError(null);
      setSelectedFile(current =>
        data.some(r => r.file === current) ? current : data[0]?.file ?? ''
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat daftar laporan');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selectedReport = reports.find(r => r.file === selectedFile) ?? null;

  return { reports, selectedReport, setSelectedFile, isLoading, error, refresh };
}
