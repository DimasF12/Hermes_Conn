'use client';

import React, { useRef } from 'react';
import { Icons } from '@/components/icons/Icons';

interface DateStepperProps {
  /** Available ISO dates (YYYY-MM-DD), newest first. */
  dates: string[];
  value: string;
  onChange: (date: string) => void;
  id: string;
}

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** `‹ (date) ›` navigator. Arrows step through available dates; clicking the date opens the native picker. */
export function DateStepper({ dates, value, onChange, id }: DateStepperProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const idx = dates.indexOf(value);
  const older = idx >= 0 && idx < dates.length - 1 ? dates[idx + 1] : null;
  const newer = idx > 0 ? dates[idx - 1] : null;

  const openPicker = () => {
    try {
      inputRef.current?.showPicker();
    } catch {
      inputRef.current?.focus(); // Older browsers without showPicker()
    }
  };

  return (
    <div className="date-stepper" role="group" aria-label="Select date">
      <button
        id={`${id}Prev`}
        className="date-stepper-arrow"
        onClick={() => older && onChange(older)}
        disabled={!older}
        aria-label="Previous date"
        title="Previous date"
      >
        {Icons.chevronLeft}
      </button>

      <div className="date-stepper-center">
        <button
          id={`${id}Pick`}
          className="date-stepper-label"
          onClick={openPicker}
          disabled={dates.length === 0}
          aria-label={value ? `Selected date ${formatDate(value)}. Choose another date` : 'No dates available'}
        >
          {Icons.calendar}
          <span>{value ? formatDate(value) : 'No dates'}</span>
          {idx === 0 && <span className="date-stepper-badge">Latest</span>}
        </button>
        <input
          ref={inputRef}
          type="date"
          className="date-stepper-input"
          tabIndex={-1}
          aria-hidden="true"
          value={value}
          min={dates[dates.length - 1]}
          max={dates[0]}
          // Snap to the closest available date on or before the pick (ISO strings sort lexicographically)
          onChange={e => e.target.value && onChange(dates.find(d => d <= e.target.value) ?? dates[dates.length - 1])}
        />
      </div>

      <button
        id={`${id}Next`}
        className="date-stepper-arrow"
        onClick={() => newer && onChange(newer)}
        disabled={!newer}
        aria-label="Next date"
        title="Next date"
      >
        {Icons.chevronRight}
      </button>
    </div>
  );
}
