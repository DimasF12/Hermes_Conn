'use client';

import React from 'react';
import type { ReportEntry } from '@/lib/reports';
import { Icons } from '@/components/icons/Icons';
import { DateStepper } from '@/components/viewer/DateStepper';

interface ReportTopbarProps {
  reports: ReportEntry[];
  selectedReport: ReportEntry | null;
  onSelect: (file: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  onPrint: () => void;
  onFullscreen: () => void;
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
      {/* TITLE & STATUS */}
      <div className="viewer-brand">
        <span className="viewer-brand-name">Sales Intelligence</span>
        <div className="viewer-status">
          <span className="viewer-status-dot" aria-hidden="true" />
          {reports.length} edisi
        </div>
      </div>

      {/* EDITION PICKER: ‹ (date) › */}
      <DateStepper
        id="reportDate"
        reports={reports}
        selectedFile={selectedReport?.file ?? ''}
        onSelect={onSelect}
      />
      {selectedReport && (
        <div className="viewer-report-badge" title={`File: ${selectedReport.file}`}>
          {/* <span className="viewer-file-badge">{selectedReport.file}</span> */}
          <span className="viewer-report-title">{selectedReport.title}</span>
        </div>
      )}

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
