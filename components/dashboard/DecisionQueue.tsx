import React from 'react';
import { BriefSignal } from '@/types/briefing';
import { Icons } from '@/components/icons/Icons';

interface DecisionQueueProps {
  signals: BriefSignal[];
  onOpenDrawer: (signal: BriefSignal) => void;
}

export function DecisionQueue({ signals, onOpenDrawer }: DecisionQueueProps) {
  const actionableSignals = signals.filter(s => s.action?.text);

  return (
    <section id="queuePanel" role="tabpanel">
      <div className="view-heading" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-0.04em' }}>From signal to next step.</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Actionable commercial moves prioritized from this executive intelligence briefing.</p>
      </div>

      <div className="queue-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {actionableSignals.map((sig, idx) => (
          <article key={sig.id} className="queue-card">
            <span className="queue-number">{String(idx + 1).padStart(2, '0')}</span>
            <div className="queue-main">
              <div className="signal-meta">
                <span className={`category category-${sig.tone}`}>{sig.category}</span>
                <span className={`badge badge-${sig.status.toLowerCase()}`}>
                  <span className="dot"></span>{sig.status}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--muted)', marginLeft: '6px' }}>
                  🤖 {sig.bot?.name || sig.source}
                </span>
              </div>
              <h3 style={{ fontSize: '16px', margin: '8px 0 4px', fontWeight: 600 }}>{sig.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>{sig.action.text}</p>
              {sig.action.owner && (
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
                  <strong>PIC: </strong>{sig.action.owner} {sig.action.checkpoint ? ` · ${sig.action.checkpoint}` : ''}
                </div>
              )}
            </div>
            <div className="queue-side">
              <button
                className="btn btn-quiet"
                onClick={() => onOpenDrawer(sig)}
              >
                View evidence {Icons.arrowRight}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
