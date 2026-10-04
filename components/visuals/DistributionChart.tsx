import React from 'react';
import { VisualDistribution } from '@/types/briefing';
import { formatNum } from '@/components/icons/Icons';

interface DistributionChartProps {
  visual: VisualDistribution;
}

export function DistributionChart({ visual }: DistributionChartProps) {
  return (
    <>
      <div className="distribution-bar" role="img" aria-label={visual.title || 'Distribution'}>
        {visual.items.map((item, idx) => (
          <span
            key={idx}
            className={`swatch-${idx % 6}`}
            style={{ flex: item.value }}
            title={`${item.label}: ${formatNum(item.value)} ${visual.unit || ''}`}
          />
        ))}
      </div>
      <div className="legend">
        {visual.items.map((item, idx) => (
          <div key={idx} className="legend-item">
            <small>
              <i className={`swatch swatch-${idx % 6}`} aria-hidden="true" />
              {item.label}
            </small>
            <strong>{formatNum(item.value)}</strong>
            <span className="legend-unit">{visual.unit || ''}</span>
          </div>
        ))}
      </div>
    </>
  );
}
