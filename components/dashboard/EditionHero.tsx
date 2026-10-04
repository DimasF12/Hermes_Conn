import React from 'react';
import { BriefMeta } from '@/types/briefing';

interface EditionHeroProps {
  meta: BriefMeta;
  stats: {
    total: number;
    immediate: number;
    attention: number;
    opportunities: number;
  };
}

export function EditionHero({ meta, stats }: EditionHeroProps) {
  return (
    <section className="hero" aria-label="Edition overview">
      <div>
        <div className="eyebrow">
          <span className="dot" style={{ background: 'var(--brand)' }}></span>
          <span>{meta.eyebrow || 'The management edition'}</span>
        </div>
        <h1>{meta.title}</h1>
        <p className="hero-sub">{meta.subtitle}</p>

        {/* CONTRIBUTING BOTS ATTRIBUTION */}
        {meta.contributingBots && meta.contributingBots.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            {meta.contributingBots.map(bot => (
              <span
                key={bot.botId}
                style={{
                  fontSize: '11px',
                  background: 'var(--subtle)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                }}
              >
                🤖 {bot.botName} ({bot.signalsCount} signals)
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="edition-summary">
        <div className="stat">
          <strong>{String(stats.total).padStart(2, '0')}</strong>
          <span>signals</span>
        </div>
        {stats.immediate > 0 && (
          <div className="stat">
            <strong style={{ color: 'var(--danger)' }}>{String(stats.immediate).padStart(2, '0')}</strong>
            <span>immediate</span>
          </div>
        )}
        {stats.attention > 0 && (
          <div className="stat">
            <strong style={{ color: 'var(--amber)' }}>{String(stats.attention).padStart(2, '0')}</strong>
            <span>attention</span>
          </div>
        )}
        {stats.opportunities > 0 && (
          <div className="stat">
            <strong style={{ color: 'var(--brand)' }}>{String(stats.opportunities).padStart(2, '0')}</strong>
            <span>opportunities</span>
          </div>
        )}
      </div>
    </section>
  );
}
