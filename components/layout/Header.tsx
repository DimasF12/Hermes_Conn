'use client';

import React from 'react';
import { BriefEdition } from '@/types/briefing';
import { Icons } from '@/components/icons/Icons';

interface HeaderProps {
  editions: BriefEdition[];
  selectedEditionId: string;
  onSelectEdition: (id: string) => void;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  canPresent: boolean;
  onOpenPresentation: () => void;
}

export function Header({
  editions,
  selectedEditionId,
  onSelectEdition,
  isDarkTheme,
  onToggleTheme,
  isFullscreen,
  onToggleFullscreen,
  canPresent,
  onOpenPresentation,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* BRAND LOGO & TITLE */}
        <div className="brand">
          <div className="brand-logo" title="GYS Sales Intelligence">
            <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--brand)' }}>
              AIKO
            </span>
          </div>
          <div>
            <div className="brand-name">
              AIKO - Executive Intelligence
              <span>Sales Command Center</span>
            </div>
            <span className="brand-caption">C-Level Decision Intelligence</span>
          </div>
        </div>

        {/* HEADER CONTROLS */}
        <div className="header-actions">
          {/* EDITION SELECTOR */}
          <div className="edition-selector-box" style={{ marginRight: '10px' }}>
            <label htmlFor="editionSelector" className="sr-only">Pilih Edisi Briefing</label>
            <select
              id="editionSelector"
              value={selectedEditionId}
              onChange={e => onSelectEdition(e.target.value)}
              style={{
                background: 'var(--subtle)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--ink)',
                cursor: 'pointer',
              }}
            >
              {editions.map((ed, idx) => (
                <option key={ed.id} value={ed.id}>
                  📅 {ed.meta.editionDate} {idx === 0 ? '(Latest · Multi-Bot)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* THEME TOGGLE */}
          <button
            className="btn btn-quiet icon-btn"
            onClick={onToggleTheme}
            aria-label={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {isDarkTheme ? Icons.sun : Icons.moon}
          </button>

          {/* FULLSCREEN TOGGLE */}
          <button
            className="btn btn-quiet icon-btn"
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
            title={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
          >
            {isFullscreen ? Icons.collapse : Icons.expand}
          </button>

          {/* PRESENT BRIEF BUTTON */}
          <button
            className="btn btn-primary"
            onClick={onOpenPresentation}
            disabled={!canPresent}
            aria-label="Present this brief"
          >
            {Icons.play}
            <span className="desktop-label">Present brief</span>
          </button>
        </div>
      </div>
    </header>
  );
}
