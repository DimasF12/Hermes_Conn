import React from 'react';
import { BriefSignal } from '@/types/briefing';
import { Icons } from '@/components/icons/Icons';

interface SignalDrawerProps {
  signal: BriefSignal | null;
  onClose: () => void;
}

export function SignalDrawer({ signal, onClose }: SignalDrawerProps) {
  if (!signal) return null;

  const dynamicAttributes = signal.extensions || signal.metadata || {};
  const hasDynamicAttributes = Object.keys(dynamicAttributes).length > 0;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Signal Evidence and Detail"
    >
      <div
        className="drawer-panel"
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(620px, 92vw)',
          height: '100%',
          background: 'var(--surface)',
          padding: '28px',
          overflowY: 'auto',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* DRAWER HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand)' }}>
            Evidence & Decision Context
          </span>
          <button className="btn btn-quiet icon-btn" onClick={onClose} aria-label="Close drawer">
            {Icons.x}
          </button>
        </div>

        <div style={{ marginTop: '20px' }}>
          {/* BADGES & BOT ORIGIN */}
          <div className="signal-meta">
            <span className={`category category-${signal.tone}`}>{signal.category}</span>
            <span className={`badge badge-${signal.status.toLowerCase()}`}>
              <span className="dot"></span>
              {signal.status}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '6px' }}>
              🤖 {signal.bot?.name || signal.source}
            </span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 650, margin: '14px 0 8px' }}>{signal.title}</h2>
          <p className="dek" style={{ fontSize: '14px', color: 'var(--muted)' }}>{signal.summary}</p>

          {/* HEADLINE METRIC */}
          {signal.metric && (
            <div style={{ background: 'var(--subtle)', padding: '14px', borderRadius: '9px', margin: '18px 0' }}>
              <strong style={{ fontSize: '20px', display: 'block' }}>
                {signal.metric.value} {signal.metric.unit || ''}
              </strong>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{signal.metric.label}</span>
            </div>
          )}

          {/* EVIDENCE LIST */}
          <section style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>
              Supporting Evidence <span className="count">{signal.evidence.length}</span>
            </h3>
            <ol className="evidence-list" style={{ paddingLeft: '18px' }}>
              {signal.evidence.map((ev, i) => (
                <li key={i} style={{ fontSize: '13px', marginBottom: '8px', lineHeight: 1.5 }}>{ev}</li>
              ))}
            </ol>
          </section>

          {/* MANAGEMENT CONTEXT */}
          {signal.managementContext && (
            <section style={{ marginTop: '20px', background: 'var(--subtle)', padding: '14px', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand)' }}>Management Context</h3>
              <p style={{ fontSize: '13px', marginTop: '6px', lineHeight: 1.5 }}>{signal.managementContext}</p>
            </section>
          )}

          {/* UNCERTAINTY GUARDRAIL */}
          <section className="guardrail" style={{ marginTop: '20px' }}>
            <h3>{Icons.shield} What remains unknown</h3>
            <p>{signal.uncertainty || 'Not specified in this edition.'}</p>
          </section>

          {/* RECOMMENDED MOVE */}
          <section className="action-panel" style={{ marginTop: '20px' }}>
            <div className="action-header">
              <h3>Recommended move</h3>
              {Icons.arrowUp}
            </div>
            <p className="action-text">{signal.action?.text}</p>
            {signal.action?.owner && (
              <p style={{ fontSize: '11px', color: 'var(--forest-muted)', marginTop: '6px' }}>
                PIC: {signal.action.owner} · {signal.action.checkpoint}
              </p>
            )}
          </section>

          {/* EXTENSIONS & INTELLIGENCE ATTRIBUTES */}
          {hasDynamicAttributes && (
            <section style={{ marginTop: '20px', background: 'var(--subtle)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 750, color: 'var(--brand)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Additional Intelligence Attributes
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'max-content 1fr', gap: '6px 14px', fontSize: '13px' }}>
                {Object.entries(dynamicAttributes).map(([key, val]) => (
                  <React.Fragment key={key}>
                    <span style={{ fontWeight: 600, color: 'var(--muted)' }}>{key.replace(/_/g, ' ')}:</span>
                    <span style={{ fontWeight: 500 }}>{String(val)}</span>
                  </React.Fragment>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
