'use client';

import React from 'react';
import type { ReportEntry } from '@/lib/reports';
import { Icons } from '@/components/icons/Icons';

interface ReportTopbarProps {
  reports: ReportEntry[];
  selectedReport: ReportEntry | null;
  onSelect: (file: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onPrint: () => void;
  onFullscreen: () => void;
}

function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function ReportTopbar({
  reports,
  selectedReport,
  onSelect,
  isRefreshing,
  onRefresh,
  onPrint,
  onFullscreen,
}: ReportTopbarProps) {
  const hasReport = selectedReport !== null;

  return (
    <header className="viewer-topbar">
      {/* BRAND */}
      <div className="viewer-brand">
        <span className="viewer-logo">AIKO</span>
        <div>
          <div className="viewer-brand-name">C-Level Command Center</div>
          <div className="viewer-status">
            <span className="viewer-status-dot" aria-hidden="true" />
            {reports.length} {reports.length === 1 ? 'edition' : 'editions'} available
          </div>
        </div>
      </div>

      {/* EDITION PICKER */}
      <label className="viewer-select">
        <span className="sr-only">Select briefing edition</span>
        <select
          id="reportSelector"
          value={selectedReport?.file ?? ''}
          onChange={e => onSelect(e.target.value)}
          disabled={reports.length === 0}
        >
          {reports.map((report, idx) => (
            <option key={report.file} value={report.file}>
              {formatDate(report.date)} · {report.title}{idx === 0 ? ' (Latest)' : ''}
            </option>
          ))}
        </select>
      </label>

      {/* ACTIONS */}
      <div className="viewer-actions">
        <button
          id="refreshReports"
          className="btn btn-quiet icon-btn"
          onClick={onRefresh}
          title="Check for new reports"
          aria-label="Check for new reports"
        >
          <span className={isRefreshing ? 'viewer-spin' : undefined}>{Icons.refresh}</span>
        </button>

        <a
          id="openReportNewTab"
          className="btn btn-quiet icon-btn"
          href={selectedReport?.url}
          target="_blank"
          rel="noopener noreferrer"
          title="Open in new tab"
          aria-label="Open in new tab"
          aria-disabled={!hasReport}
        >
          {Icons.external}
        </a>

        <a
          id="downloadReport"
          className="btn btn-quiet icon-btn"
          href={selectedReport?.url}
          download={selectedReport?.file}
          title="Download HTML report"
          aria-label="Download HTML report"
          aria-disabled={!hasReport}
        >
          {Icons.download}
        </a>

        <button
          id="printReport"
          className="btn btn-quiet icon-btn"
          onClick={onPrint}
          disabled={!hasReport}
          title="Print / Save as PDF"
          aria-label="Print or save as PDF"
        >
          {Icons.printer}
        </button>

        <button
          id="fullscreenReport"
          className="btn btn-primary"
          onClick={onFullscreen}
          disabled={!hasReport}
        >
          {Icons.expand}
          <span className="desktop-label">Fullscreen</span>
        </button>
      </div>
    </header>
  );
}
