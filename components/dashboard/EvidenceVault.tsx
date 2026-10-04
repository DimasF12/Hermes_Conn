import React from 'react';
import { BriefSignal } from '@/types/briefing';
import { Icons } from '@/components/icons/Icons';

interface EvidenceVaultProps {
  signals: BriefSignal[];
}

export function EvidenceVault({ signals }: EvidenceVaultProps) {
  return (
    <section id="evidencePanel" role="tabpanel">
      <div className="view-heading" style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-0.04em' }}>See what sits behind the signal.</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Full ground truth, quantitative citations, and operational notes behind every observation.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {signals.map((sig, idx) => (
          <details key={sig.id} className="evidence-card" open={idx === 0}>
            <summary>
              <div>
                <span className={`category category-${sig.tone}`}>{sig.category}</span>
                <h3 style={{ fontSize: '16px', margin: '6px 0 0' }}>{sig.title}</h3>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="count">{sig.evidence.length} notes</span>
                <span className="chevron">{Icons.chevron}</span>
              </span>
            </summary>

            <div className="evidence-body" style={{ padding: '0 24px 20px' }}>
              <ol className="evidence-list" style={{ paddingLeft: '20px', margin: '12px 0' }}>
                {sig.evidence.map((ev, i) => (
                  <li key={i} style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '8px' }}>{ev}</li>
                ))}
              </ol>

              {sig.managementContext && (
                <section className="drawer-section" style={{ marginTop: '16px', background: 'var(--subtle)', padding: '14px', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--brand)' }}>Management context</h3>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>{sig.managementContext}</p>
                </section>
              )}

              <section className="guardrail" style={{ marginTop: '16px' }}>
                <h3>{Icons.shield} What remains unknown</h3>
                <p>{sig.uncertainty || 'Not specified in this edition.'}</p>
              </section>

              <div style={{ marginTop: '16px' }}>
                {sig.sources.map((src, i) => (
                  <div key={i} className="source-note" style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    <strong>Source: </strong>
                    {src.url ? (
                      <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{src.label}</a>
                    ) : (
                      <span>{src.label}</span>
                    )}
                    {src.date && ` · ${src.date}`}
                    <span style={{ marginLeft: '8px', color: 'var(--brand)' }}>🤖 Verified by {sig.bot?.name || 'Agent'}</span>
                  </div>
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
