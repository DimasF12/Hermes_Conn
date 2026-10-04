import React from 'react';
import { BriefVisual } from '@/types/briefing';
import { formatNum } from '@/components/icons/Icons';
import { DistributionChart } from './DistributionChart';
import { ComparisonChart } from './ComparisonChart';
import { FactsDisplay } from './FactsDisplay';

interface VisualRendererProps {
  visual: BriefVisual | null | undefined;
}

export function VisualRenderer({ visual }: VisualRendererProps) {
  if (!visual) return null;

  return (
    <section className="visual" aria-label={visual.title || 'Supporting values'}>
      <div className="visual-head">
        <b>{visual.title || 'Supporting values'}</b>
        {'total' in visual && visual.total != null && (
          <span>{formatNum(visual.total)} {visual.unit || ''} total</span>
        )}
      </div>

      {visual.type === 'distribution' && <DistributionChart visual={visual} />}
      {visual.type === 'comparison' && <ComparisonChart visual={visual} />}
      {visual.type === 'facts' && <FactsDisplay visual={visual} />}

      {visual.note && <p className="visual-note">{visual.note}</p>}
    </section>
  );
}
