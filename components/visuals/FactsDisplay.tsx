import React from 'react';
import { VisualFacts } from '@/types/briefing';

interface FactsDisplayProps {
  visual: VisualFacts;
}

export function FactsDisplay({ visual }: FactsDisplayProps) {
  return (
    <div className="fact-grid">
      {visual.items.map((item, idx) => (
        <div key={idx} className="fact">
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
