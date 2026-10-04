'use client';

import React from 'react';
import { Icons } from '@/components/icons/Icons';

export type DashboardTab = 'overview' | 'queue' | 'evidence';

interface NavbarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  queueCount: number;
}

export function Navbar({ activeTab, onSelectTab, queueCount }: NavbarProps) {
  return (
    <div className="navbar">
      <div className="container nav-inner">
        <nav className="main-nav" role="tablist" aria-label="Briefing workspace">
          <button
            className="nav-tab"
            role="tab"
            aria-selected={activeTab === 'overview'}
            onClick={() => onSelectTab('overview')}
          >
            {Icons.layout} Overview
          </button>
          <button
            className="nav-tab"
            role="tab"
            aria-selected={activeTab === 'queue'}
            onClick={() => onSelectTab('queue')}
          >
            {Icons.checklist} Decision queue <span className="count">{queueCount}</span>
          </button>
          <button
            className="nav-tab"
            role="tab"
            aria-selected={activeTab === 'evidence'}
            onClick={() => onSelectTab('evidence')}
          >
            {Icons.layers} Evidence vault
          </button>
        </nav>
      </div>
    </div>
  );
}
