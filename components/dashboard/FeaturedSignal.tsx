'use client';

import React from 'react';
import { BriefSignal } from '@/types/briefing';
import { Icons } from '@/components/icons/Icons';
import { VisualRenderer } from '@/components/visuals/VisualRenderer';

interface FeaturedSignalProps {
  signal: BriefSignal;
  readingDepth: 'brief' | 'deep';
  onChangeReadingDepth: (depth: 'brief' | 'deep') => void;
  onOpenDrawer: (signal: BriefSignal) => void;
  onNavigateToQueue: () => void;
  dataAsOfDefault: string;
}

export function FeaturedSignal({
  signal,
  readingDepth,
  onChangeReadingDepth,
  onOpenDrawer,
  onNavigateToQueue,
  dataAsOfDefault,
}: FeaturedSignalProps) {
  const botInfo = signal.bot?.name || signal.source;
  const confidenceText = signal.bot?.confidenceScore
    ? `(${Math.round(signal.bot.confidenceScore * 100)}% conf)`
    : '';

  return (
    <div id="focusWorkspace" style={{ marginTop: '36px' }}>
      {/* SECTION HEADING & READING DEPTH TOGGLE */}
      <div className="section-heading">
        <div className="section-title">
          <span className="section-index">01 — FOCUS</span>
          Priority in focus
        </div>

        <div className="segment" role="group" aria-label="Reading depth">
          <button
            data-depth="brief"
            aria-pressed={readingDepth === 'brief'}
            onClick={() => onChangeReadingDepth('brief')}
          >
            {Icons.align} Brief
          </button>
          <button
            data-depth="deep"
            aria-pressed={readingDepth === 'deep'}
            onClick={() => onChangeReadingDepth('deep')}
          >
            {Icons.layers} Deep read
          </button>
        </div>
      </div>

      <div className="focus-grid">
        {/* LEFT ARTICLE CARD */}
        <article className="focus-card">
          <div className="article-kicker">
            <span className={`category category-${signal.tone}`}>
              {signal.category}
            </span>
            <span className="source-tag" title="Source & Agent Info">
              🤖 {botInfo} {confidenceText}
            </span>
          </div>

          <h2>{signal.title}</h2>
          <p className="dek">{signal.summary}</p>

          {/* DYNAMIC VISUAL RENDERER */}
          <VisualRenderer visual={signal.visual} />

          {/* DEEP READ EXPANSION */}
          {readingDepth === 'deep' && (
            <section className="deep-content" style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              {signal.managementContext && (
                <>
                  <h3 style={{ fontSize: '13px', fontWeight: 650, marginBottom: '6px' }}>Management Context</h3>
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{signal.managementContext}</p>
                </>
              )}

              <h3 style={{ fontSize: '13px', fontWeight: 650, marginTop: '16px', marginBottom: '8px' }}>Supporting Evidence</h3>
              <ol className="evidence-list" style={{ paddingLeft: '18px', margin: 0 }}>
                {signal.evidence.map((ev, i) => (
                  <li key={i} style={{ fontSize: '12px', color: 'var(--ink-soft)', marginBottom: '6px' }}>{ev}</li>
                ))}
              </ol>

              <div style={{ marginTop: '14px' }}>
                {signal.sources.map((src, i) => (
                  <div key={i} className="source-note" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    <strong>Source: </strong>
                    {src.url ? (
                      <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{src.label}</a>
                    ) : (
                      <span>{src.label}</span>
                    )}
                    {src.date && ` · ${src.date}`}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CARD FOOTER */}
          <div className="card-footer" style={{ marginTop: '24px' }}>
            <button
              className="btn"
              onClick={() => onOpenDrawer(signal)}
            >
              {Icons.layers} View evidence <span className="count">{signal.evidence.length}</span> {Icons.arrowRight}
            </button>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
              Data as of {signal.dataAsOf || dataAsOfDefault}
            </span>
          </div>
        </article>

        {/* RIGHT ASIDE: RECOMMENDED MOVE & RISK GUARDRAIL */}
        <aside className="action-aside" aria-label="Recommended move and uncertainty">
          {/* RECOMMENDED MOVE */}
          <section className="action-panel">
            <div className="action-header">
              <h3>Recommended move</h3>
              {Icons.arrowUp}
            </div>
            <p className="action-text">{signal.action?.text || 'No recommended move provided.'}</p>

            {signal.action?.owner && (
              <div style={{ fontSize: '11px', color: 'var(--forest-muted)', marginTop: '8px' }}>
                <strong>Owner: </strong>{signal.action.owner}
                {signal.action.checkpoint && ` · ${signal.action.checkpoint}`}
              </div>
            )}

            <div className="action-controls" style={{ marginTop: '16px' }}>
              <button className="btn btn-dark" onClick={onNavigateToQueue}>
                Decision queue {Icons.arrowRight}
              </button>
            </div>
          </section>

          {/* GUARDRAIL (WHAT REMAINS UNKNOWN) */}
          <section className="guardrail">
            <h3>
              {Icons.shield} What remains unknown
            </h3>
            <p>{signal.uncertainty || 'Uncertainty was not specified. Review supporting evidence before committing capital or capacity.'}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
