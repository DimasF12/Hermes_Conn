/**
 * Timezone-safe date formatting and calendar utilities for reports.
 * Pure string parsing avoids off-by-one errors from local timezone offsets.
 */

const DATE_PATTERN = /(\d{4}-\d{2}-\d{2})/;

export const MONTHS_SHORT_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
export const MONTHS_LONG_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const DAYS_SHORT_MON_START = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export interface ParsedDate {
  year: number;
  month: number; // 1-12
  day: number;
}

export function parseIsoDate(iso: string): ParsedDate | null {
  const match = iso.match(DATE_PATTERN);
  if (!match) return null;
  const parts = match[0].split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return null;
  return { year, month, day };
}

/**
 * Format string tanggal YYYY-MM-DD secara konsisten dalam Bahasa Indonesia.
 * - 'short': "5 Okt 2026"
 * - 'long': "5 Oktober 2026"
 */
export function formatReportDate(iso: string, format: 'short' | 'long' = 'long'): string {
  const parsed = parseIsoDate(iso);
  if (!parsed) return iso;
  const { year, month, day } = parsed;
  const monthIdx = month - 1;
  if (monthIdx < 0 || monthIdx > 11) return iso;
  const monthName = format === 'short' ? MONTHS_SHORT_ID[monthIdx] : MONTHS_LONG_ID[monthIdx];
  const dayPadded = String(day).padStart(2, '0');
  return `${dayPadded} ${monthName} ${year}`;
}

export interface CalendarDay {
  day: number;
  iso: string;
  isCurrentMonth: boolean;
  hasReport: boolean;
  isSelected: boolean;
}

/**
 * Menghasilkan grid kalender bulanan (dimulai hari Senin)
 */
export function generateMonthDays(
  year: number,
  month: number, // 1-12
  availableIsoDates: Set<string>,
  selectedIsoDate: string
): CalendarDay[] {
  // First day of current month (0=Sun, 1=Mon, ..., 6=Sat)
  const firstDay = new Date(year, month - 1, 1).getDay();
  // Convert so Monday = 0, Sunday = 6
  const startDay = (firstDay + 6) % 7;

  // Days in current month
  const daysInCurrent = new Date(year, month, 0).getDate();
  // Days in previous month
  const daysInPrev = new Date(year, month - 1, 0).getDate();

  const days: CalendarDay[] = [];

  // Previous month padding
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  for (let i = startDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const iso = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      day: d,
      iso,
      isCurrentMonth: false,
      hasReport: availableIsoDates.has(iso),
      isSelected: iso === selectedIsoDate,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrent; d++) {
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      day: d,
      iso,
      isCurrentMonth: true,
      hasReport: availableIsoDates.has(iso),
      isSelected: iso === selectedIsoDate,
    });
  }

  // Next month padding to fill complete grid of 35 or 42 cells
  const remaining = (7 - (days.length % 7)) % 7;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  for (let d = 1; d <= remaining; d++) {
    const iso = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push({
      day: d,
      iso,
      isCurrentMonth: false,
      hasReport: availableIsoDates.has(iso),
      isSelected: iso === selectedIsoDate,
    });
  }

  return days;
}
