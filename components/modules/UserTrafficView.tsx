'use client';

import React from 'react';
import { Icons, formatNum } from '@/components/icons/Icons';
import { mockTrafficStats } from '@/data/mockAdminData';

export function UserTrafficView() {
  const maxHourlyReaders = Math.max(...mockTrafficStats.hourlyActivity.map(h => h.readers), 1);

  return (
    <div className="module-container traffic-view-container">
      {/* HEADER */}
      <div className="module-header">
        <div>
          <div className="module-kicker">
            <span className="viewer-status-dot" aria-hidden="true" />
            ENTERPRISE ENGAGEMENT & TELEMETRY
          </div>
          <h1 className="module-title">User Traffic & Executive Engagement</h1>
          <p className="module-subtitle">
            Monitor real-time readership, briefing session duration, executive audience adoption, and hardware device distribution.
          </p>
        </div>

        <div className="traffic-live-badge">
          <span className="live-ping-dot" />
          <span>Real-time Telemetry Active</span>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="traffic-kpi-grid">
        <div className="traffic-kpi-card">
          <div className="traffic-kpi-icon-row">
            <span className="traffic-kpi-label">Active Executives Today</span>
            <span className="traffic-icon">{Icons.users}</span>
          </div>
          <div className="traffic-kpi-val">
            {mockTrafficStats.activeExecutivesToday}
            <span className="traffic-trend-pos">+{mockTrafficStats.weeklyGrowthPercent}% WoW</span>
          </div>
          <span className="traffic-kpi-sub">Verified C-Level & VP stakeholders</span>
        </div>

        <div className="traffic-kpi-card">
          <div className="traffic-kpi-icon-row">
            <span className="traffic-kpi-label">Avg. Reading Duration</span>
            <span className="traffic-icon">{Icons.clock}</span>
          </div>
          <div className="traffic-kpi-val">
            {mockTrafficStats.avgReadingDuration}
          </div>
          <span className="traffic-kpi-sub">High engagement threshold (&gt;3 min target)</span>
        </div>

        <div className="traffic-kpi-card">
          <div className="traffic-kpi-icon-row">
            <span className="traffic-kpi-label">Monthly Briefing Reads</span>
            <span className="traffic-icon">{Icons.fileText}</span>
          </div>
          <div className="traffic-kpi-val">
            {formatNum(mockTrafficStats.totalBriefingViewsMonth)}
          </div>
          <span className="traffic-kpi-sub">Across all regional executive branches</span>
        </div>

        <div className="traffic-kpi-card">
          <div className="traffic-kpi-icon-row">
            <span className="traffic-kpi-label">Top Read Edition</span>
            <span className="traffic-icon">{Icons.sparkles}</span>
          </div>
          <div className="traffic-kpi-val" style={{ fontSize: '18px', color: 'var(--brand)' }}>
            2026-10-02
          </div>
          <span className="traffic-kpi-sub">Sales & Market Intelligence (142 reads)</span>
        </div>
      </div>

      {/* TWO COLUMN GRID: HOURLY ACTIVITY CHART & DEVICE DISTRIBUTION */}
      <div className="traffic-charts-grid">
        {/* HOURLY READERSHIP CHART */}
        <section className="traffic-panel-card">
          <div className="panel-head-row">
            <div>
              <h2 className="panel-heading">Peak Reading Hours (Today)</h2>
              <p className="panel-desc">Hourly distribution of executives reading briefings.</p>
            </div>
            <span className="badge-soft">Peak at 09:00 AM</span>
          </div>

          <div className="hourly-bars-container">
            {mockTrafficStats.hourlyActivity.map((item, idx) => {
              const heightPercent = Math.round((item.readers / maxHourlyReaders) * 100);
              return (
                <div key={idx} className="hourly-bar-col">
                  <div className="hourly-bar-val">{item.readers}</div>
                  <div className="hourly-bar-track">
                    <div
                      className="hourly-bar-fill"
                      style={{ height: `${heightPercent}%` }}
                      title={`${item.hour}: ${item.readers} executives`}
                    />
                  </div>
                  <span className="hourly-bar-label">{item.hour}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* DEVICE DISTRIBUTION */}
        <section className="traffic-panel-card">
          <h2 className="panel-heading">Hardware & Device Breakdown</h2>
          <p className="panel-desc">Form factor preferred by executives during consumption.</p>

          <div className="device-list" style={{ marginTop: '16px' }}>
            {mockTrafficStats.deviceDistribution.map((dev, idx) => (
              <div key={idx} className="device-item">
                <div className="device-info-row">
                  <strong>{dev.device}</strong>
                  <span>{dev.percent}%</span>
                </div>
                <div className="device-bar-track">
                  <div
                    className="device-bar-fill"
                    style={{
                      width: `${dev.percent}%`,
                      background: idx === 0 ? 'var(--brand)' : idx === 1 ? 'var(--blue)' : 'var(--amber)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="device-note-box">
            <span>💡 <strong>Executive Insight:</strong> 90% of reading sessions occur on high-resolution Desktop and iPad displays, confirming optimal layout fidelity.</span>
          </div>
        </section>
      </div>

      {/* RECENT READING SESSIONS TABLE */}
      <section className="traffic-panel-card" style={{ marginTop: '24px' }}>
        <h2 className="panel-heading">Recent Executive Reading Sessions</h2>
        <p className="panel-desc">Audit trail of authorized management accesses to intelligence editions.</p>

        <div className="sessions-table-wrapper">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>Executive</th>
                <th>Division</th>
                <th>Edition Read</th>
                <th>Duration</th>
                <th>Device</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {mockTrafficStats.recentSessions.map(sess => (
                <tr key={sess.id}>
                  <td>
                    <div className="sess-user-cell">
                      <span className="sess-user-avatar">{sess.userName.slice(0, 2).toUpperCase()}</span>
                      <div>
                        <strong>{sess.userName}</strong>
                        <span className="sess-user-title">{sess.title}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="sess-division-pill">{sess.division}</span>
                  </td>
                  <td>
                    <code>{sess.editionDate}</code>
                  </td>
                  <td>
                    <span className="sess-duration">{sess.duration}</span>
                  </td>
                  <td>
                    <span className="sess-device">{sess.device}</span>
                  </td>
                  <td>
                    <span className="sess-time">{sess.timestamp}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
