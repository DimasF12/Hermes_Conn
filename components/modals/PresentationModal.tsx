'use client';

import React, { useState, useEffect } from 'react';
import { BriefSignal } from '@/types/briefing';
import { Icons } from '@/components/icons/Icons';

interface PresentationModalProps {
  isOpen: boolean;
  signals: BriefSignal[];
  onClose: () => void;
}

export function PresentationModal({ isOpen, signals, onClose }: PresentationModalProps) {
  const [slideIndex, setSlideIndex] = useState<number>(0);

  // Reset to first slide when opened
  useEffect(() => {
    if (isOpen) {
      setSlideIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA' || activeEl?.tagName === 'SELECT';
      if (isInput) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSlideIndex(prev => Math.min(prev + 1, signals.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSlideIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, signals.length, onClose]);

  if (!isOpen || signals.length === 0) return null;

  const currentSlide = signals[slideIndex];
  if (!currentSlide) return null;

  const progressPercent = ((slideIndex + 1) / signals.length) * 100;

  return (
    <div
      className="presentation-backdrop"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Executive Briefing Presentation"
    >
      <div className="presentation-modal">
        {/* PRESENTATION HEADER (PINNED AT TOP) */}
        <div className="presentation-header">
          <span style={{ fontSize: '11px', letterSpacing: '0.14em', fontWeight: 700, color: 'var(--accent)' }}>
            AIKO / EXECUTIVE BRIEFING SLIDES
          </span>
          <button
            className="btn btn-dark icon-btn"
            onClick={onClose}
            aria-label="Close presentation"
            style={{ width: '36px', height: '36px', minHeight: '36px' }}
          >
            {Icons.x}
          </button>
        </div>

        {/* SLIDE BODY (SCROLLABLE IF OVERFLOWS, NEVER COVERS FOOTER) */}
        <div className="presentation-body">
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px' }}>
            {String(slideIndex + 1).padStart(2, '0')} / {String(signals.length).padStart(2, '0')} &nbsp;·&nbsp; {currentSlide.category} &nbsp;·&nbsp; {currentSlide.status}
            <span style={{ marginLeft: '12px', color: 'var(--forest-muted)' }}>
              🤖 {currentSlide.bot?.name || currentSlide.source}
            </span>
          </div>

          <h2 className="presentation-title">
            {currentSlide.title}
          </h2>

          {currentSlide.metric && (
            <div className="presentation-metric">
              {currentSlide.metric.value} {currentSlide.metric.unit || ''}
              <span style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'var(--forest-muted)', marginTop: '2px' }}>
                {currentSlide.metric.label}
              </span>
            </div>
          )}

          <p className="presentation-summary">
            {currentSlide.summary}
          </p>

          <div className="presentation-action">
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent)' }}>RECOMMENDED MOVE</span>
            <p style={{ fontSize: '14px', lineHeight: 1.45, margin: '4px 0 0', color: 'var(--forest-ink)' }}>
              {currentSlide.action?.text || 'Review evidence before committing.'}
            </p>
            {currentSlide.action?.owner && (
              <p style={{ fontSize: '11px', color: 'var(--forest-muted)', marginTop: '4px' }}>
                PIC: {currentSlide.action.owner} · {currentSlide.action.checkpoint}
              </p>
            )}
          </div>
        </div>

        {/* SLIDE FOOTER & NAVIGATION (PINNED AT BOTTOM) */}
        <div className="presentation-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <button
              className="btn btn-dark"
              disabled={slideIndex === 0}
              onClick={() => setSlideIndex(prev => Math.max(prev - 1, 0))}
              style={{ minHeight: '38px', padding: '6px 14px', fontSize: '12px' }}
            >
              {Icons.arrowLeft} Previous
            </button>

            <span style={{ fontSize: '12px', color: 'var(--forest-muted)', fontWeight: 500 }}>
              {slideIndex + 1} / {signals.length} signals
            </span>

            <button
              className="btn btn-dark"
              disabled={slideIndex >= signals.length - 1}
              onClick={() => setSlideIndex(prev => Math.min(prev + 1, signals.length - 1))}
              style={{ minHeight: '38px', padding: '6px 14px', fontSize: '12px' }}
            >
              Next {Icons.arrowRight}
            </button>
          </div>

          {/* PROGRESS BAR */}
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: 'var(--accent)',
                width: `${progressPercent}%`,
                transition: 'width 0.25s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
