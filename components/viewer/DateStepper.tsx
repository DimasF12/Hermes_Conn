'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Icons } from '@/components/icons/Icons';
import type { ReportEntry } from '@/lib/reports';
import {
  formatReportDate,
  parseIsoDate,
  generateMonthDays,
  MONTHS_LONG_ID,
  DAYS_SHORT_MON_START,
} from '@/lib/dateUtils';

export interface DateStepperReportItem {
  file: string;
  date: string;
  editionDate?: string;
  title?: string;
}

interface DateStepperProps {
  /** Available report items, sorted newest first */
  reports: (DateStepperReportItem | ReportEntry)[];
  /** Currently selected file (e.g. "2026-10-05.html") */
  selectedFile: string;
  /** Callback when user selects another file */
  onSelect: (file: string) => void;
  id?: string;
}

/**
 * `< (tanggal) >` navigator dengan Kalender Picker interaktif.
 * - Tombol panah ‹ dan › untuk berganti tanggal mundur/maju.
 * - Tombol tengah menampilkan tanggal edisi terformat (misal: "05 Oktober 2026").
 * - Klik pada tanggal membuka Popover Kalender interaktif:
 *   - Hari-hari yang memiliki laporan ditandai dengan dot & aktif.
 *   - Hari tanpa laporan disabled.
 *   - Navigasi bulan (Oktober 2026, September 2026, dst).
 *   - Tombol shortcut "Edisi Terbaru" dan daftar cepat tanggal edisi.
 */
export function DateStepper({
  reports,
  selectedFile,
  onSelect,
  id = 'reportDateStepper',
}: DateStepperProps) {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Cari laporan terpilih saat ini
  const currentIndex = reports.findIndex(r => r.file === selectedFile);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const current = reports[activeIndex] ?? null;

  // Arrow step navigation:
  // Laporan diurutkan terbaru ke terlama:
  // Edisi lebih lama (mundur) = activeIndex + 1
  // Edisi lebih baru (maju) = activeIndex - 1
  const older = activeIndex < reports.length - 1 ? reports[activeIndex + 1] : null;
  const newer = activeIndex > 0 ? reports[activeIndex - 1] : null;

  // State tampilan bulan di kalender
  const initialDate = current?.date ? parseIsoDate(current.date) : null;
  const [viewYear, setViewYear] = useState<number>(initialDate?.year ?? 2026);
  const [viewMonth, setViewMonth] = useState<number>(initialDate?.month ?? 10);
  const [prevDate, setPrevDate] = useState<string | null>(current?.date ?? null);

  // Sync bulan tampilan ketika tanggal edisi berubah
  if (current?.date && current.date !== prevDate) {
    setPrevDate(current.date);
    const parsed = parseIsoDate(current.date);
    if (parsed) {
      setViewYear(parsed.year);
      setViewMonth(parsed.month);
    }
  }

  // Close on click outside & Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  // Map tanggal ISO ke nama file laporan
  const isoToFileMap = useMemo(() => {
    const map = new Map<string, string>();
    reports.forEach(r => {
      if (r.date) map.set(r.date, r.file);
    });
    return map;
  }, [reports]);

  // Set tanggal yang memiliki laporan
  const availableIsoDates = useMemo(() => new Set(isoToFileMap.keys()), [isoToFileMap]);

  // Generate grid hari kalender untuk viewYear & viewMonth
  const calendarDays = useMemo(() => {
    return generateMonthDays(viewYear, viewMonth, availableIsoDates, current?.date ?? '');
  }, [viewYear, viewMonth, availableIsoDates, current?.date]);

  const prevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };


  const handleSelectDate = (iso: string) => {
    const targetFile = isoToFileMap.get(iso);
    if (targetFile) {
      onSelect(targetFile);
      setIsOpen(false);
    }
  };

  const toggleCalendar = () => {
    setIsOpen(open => {
      const nextOpen = !open;
      if (nextOpen && current?.date) {
        const parsed = parseIsoDate(current.date);
        if (parsed) {
          setViewYear(parsed.year);
          setViewMonth(parsed.month);
        }
      }
      return nextOpen;
    });
  };

  const displayDate = current ? formatReportDate(current.date, 'long') : 'Pilih Tanggal';

  return (
    <div ref={containerRef} className="date-stepper-root">
      {/* ‹ (TANGGAL) › STEPPER */}
      <div className="date-stepper" role="group" aria-label="Filter Tanggal Laporan">
        {/* ‹ PREVIOUS (OLDER) BUTTON */}
        <button
          id={`${id}Prev`}
          type="button"
          className="date-stepper-arrow"
          onClick={() => older && onSelect(older.file)}
          disabled={!older}
          aria-label={older ? `Edisi sebelumnya (${formatReportDate(older.date, 'short')})` : 'Edisi paling awal'}
          title={older ? `Edisi sebelumnya (${formatReportDate(older.date, 'short')})` : 'Edisi paling awal'}
        >
          {Icons.chevronLeft}
        </button>

        {/* CENTER PILL: TOMBOL BUKA KALENDER */}
        <button
          ref={triggerRef}
          id={`${id}Trigger`}
          type="button"
          className={`date-stepper-trigger ${isOpen ? 'is-active' : ''}`}
          onClick={toggleCalendar}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          title="Klik untuk membuka kalender filter tanggal"
        >
          <span className="date-stepper-icon">{Icons.calendar}</span>
          <span className="date-stepper-text">{displayDate}</span>
          {activeIndex === 0 && <span className="date-stepper-badge">Terbaru</span>}
          <span className="date-stepper-caret">{Icons.chevronDown}</span>
        </button>

        {/* › NEXT (NEWER) BUTTON */}
        <button
          id={`${id}Next`}
          type="button"
          className="date-stepper-arrow"
          onClick={() => newer && onSelect(newer.file)}
          disabled={!newer}
          aria-label={newer ? `Edisi berikutnya (${formatReportDate(newer.date, 'short')})` : 'Edisi paling baru'}
          title={newer ? `Edisi berikutnya (${formatReportDate(newer.date, 'short')})` : 'Edisi paling baru'}
        >
          {Icons.chevronRight}
        </button>
      </div>

      {/* POPOVER KALENDER INTERAKTIF */}
      {isOpen && (
        <div
          ref={popoverRef}
          id={`${id}Popover`}
          className="calendar-popover"
          role="dialog"
          aria-label="Kalender Pemilihan Tanggal Laporan"
        >
          {/* HEADER KALENDER: BULAN & NAVIGASI (SIMETRIS) */}
          <div className="calendar-popover-header">
            <button
              type="button"
              className="cal-month-nav"
              onClick={prevMonth}
              title="Bulan sebelumnya"
              aria-label="Bulan sebelumnya"
            >
              {Icons.chevronLeft}
            </button>

            <span className="cal-month-label">
              {MONTHS_LONG_ID[viewMonth - 1]} {viewYear}
            </span>

            <button
              type="button"
              className="cal-month-nav"
              onClick={nextMonth}
              title="Bulan berikutnya"
              aria-label="Bulan berikutnya"
            >
              {Icons.chevronRight}
            </button>
          </div>

          {/* NAMA HARI (SENIN - MINGGU) */}
          <div className="calendar-weekdays-row" aria-hidden="true">
            {DAYS_SHORT_MON_START.map(d => (
              <span key={d} className="calendar-weekday-cell">
                {d}
              </span>
            ))}
          </div>

          {/* GRID TANGGAL */}
          <div className="calendar-days-grid" role="grid">
            {calendarDays.map((item, idx) => {
              const isAvailable = item.hasReport;
              const isSelected = item.isSelected;

              return (
                <button
                  key={`${item.iso}-${idx}`}
                  type="button"
                  disabled={!isAvailable}
                  className={`calendar-day-btn ${!item.isCurrentMonth ? 'is-outside-month' : ''} ${
                    isAvailable ? 'has-report' : 'no-report'
                  } ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => isAvailable && handleSelectDate(item.iso)}
                  title={
                    isAvailable
                      ? `Laporan tersedia: ${formatReportDate(item.iso, 'long')}`
                      : `${item.day} ${MONTHS_LONG_ID[viewMonth - 1]} (Tidak ada laporan)`
                  }
                  aria-label={`${item.day} ${MONTHS_LONG_ID[viewMonth - 1]} ${viewYear}${
                    isAvailable ? ' - Laporan tersedia' : ''
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="calendar-day-number">{item.day}</span>
                  {isAvailable && <span className="calendar-day-dot" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
