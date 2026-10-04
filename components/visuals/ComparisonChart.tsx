import React from 'react';
import { VisualComparison } from '@/types/briefing';
import { formatNum } from '@/components/icons/Icons';

interface ComparisonChartProps {
  visual: VisualComparison;
}

export function ComparisonChart({ visual }: ComparisonChartProps) {
  return (
    <div>
      {visual.items.map((item, idx) => {
        const maxVal = Math.max(item.before, item.after, 1);
        return (
          <div key={idx} className="compare-row">
            <div className="compare-name">{item.label}</div>
            <div className="compare-track">
              <span>{visual.beforeLabel || 'Before'}</span>
              <div className="compare-bar">
                <span className="swatch-0" style={{ width: `${(item.before / maxVal) * 100}%` }} />
              </div>
              <b>{formatNum(item.before)} {visual.unit || ''}</b>
            </div>
            <div className="compare-track">
              <span>{visual.afterLabel || 'After'}</span>
              <div className="compare-bar">
                <span className="swatch-2" style={{ width: `${(item.after / maxVal) * 100}%` }} />
              </div>
              <b>{formatNum(item.after)} {visual.unit || ''}</b>
            </div>
          </div>
        );
      })}
    </div>
  );
}
