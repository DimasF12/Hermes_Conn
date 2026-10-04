import React from 'react';
import { BriefSignal } from '@/types/briefing';
import { Icons } from '@/components/icons/Icons';

interface SignalCardProps {
  signal: BriefSignal;
  isSelected: boolean;
  onSelect: () => void;
}

export function SignalCard({ signal, isSelected, onSelect }: SignalCardProps) {
  const botTag = signal.bot?.name || signal.source;

  return (
    <button
      className="signal-card"
      aria-pressed={isSelected}
      onClick={onSelect}
    >
      <span className="signal-meta">
        <span className={`category category-${signal.tone}`}>
          {signal.category}
        </span>
        <span className={`badge badge-${signal.status.toLowerCase()}`}>
          <span className="dot"></span>
          {signal.status}
        </span>
      </span>

      {/* BOT ORIGIN BADGE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--subtle)', padding: '2px 6px', borderRadius: '4px' }}>
          🤖 {botTag}
        </span>
      </div>

      {/* HEADLINE METRIC */}
      <span className="signal-metric" style={{ marginTop: '8px' }}>
        {signal.metric ? (
          <>
            <strong>{signal.metric.value}</strong>
            {signal.metric.unit && <span>{signal.metric.unit}</span>}
          </>
        ) : (
          <span>No headline metric</span>
        )}
      </span>

      <span className="signal-title">
        <span>{signal.title}</span>
        {Icons.arrowRight}
      </span>
    </button>
  );
}
