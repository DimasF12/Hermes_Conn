'use client';

import React from 'react';
import { Icons } from '@/components/icons/Icons';

export type NavigationMenuId = 'reports' | 'chat' | 'tokens' | 'traffic';

interface SidebarProps {
  activeMenu: NavigationMenuId;
  onSelectMenu: (menu: NavigationMenuId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  reportsCount: number;
}

interface NavItem {
  id: NavigationMenuId;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export function Sidebar({
  activeMenu,
  onSelectMenu,
  isCollapsed,
  onToggleCollapse,
  reportsCount,
}: SidebarProps) {
  const navItems: NavItem[] = [
    {
      id: 'reports',
      label: 'Intelligence Reports',
      icon: Icons.fileText,
      badge: reportsCount > 0 ? `${reportsCount}` : undefined,
    },
    {
      id: 'chat',
      label: 'Hermes Chatbot',
      icon: Icons.messageSquare,
      badge: 'Live',
      badgeColor: 'var(--brand)',
    },
    {
      id: 'tokens',
      label: 'AI Token Settings',
      icon: Icons.cpu,
    },
    {
      id: 'traffic',
      label: 'User Traffic & Analytics',
      icon: Icons.barChart,
    },
  ];

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'is-collapsed' : ''}`} aria-label="Main Navigation">
      {/* SIDEBAR HEADER / BRAND */}
      <div className="sidebar-header">
        <div className="sidebar-brand-wrapper">
          <span className="sidebar-logo">AIKO</span>
          {!isCollapsed && (
            <div className="sidebar-brand-meta">
              <span className="sidebar-brand-title">Executive Suite</span>
              <span className="sidebar-brand-sub">Decision Platform</span>
            </div>
          )}
        </div>

        <button
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? Icons.chevronRight : Icons.chevronLeft}
        </button>
      </div>

      {/* NAVIGATION LIST */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu-list">
          {navItems.map(item => {
            const isActive = activeMenu === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`sidebar-nav-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => onSelectMenu(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <>
                      <span className="sidebar-nav-label">{item.label}</span>
                      {item.badge && (
                        <span
                          className="sidebar-nav-badge"
                          style={item.badgeColor ? { background: item.badgeColor, color: '#fff' } : undefined}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* SIDEBAR FOOTER */}
      <div className="sidebar-footer">
        {!isCollapsed ? (
          <div className="sidebar-user-pill">
            <span className="sidebar-user-avatar">EX</span>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">Executive Viewer</span>
              <span className="sidebar-user-role">C-Level Read Access</span>
            </div>
          </div>
        ) : (
          <div className="sidebar-user-avatar" title="Executive Viewer">EX</div>
        )}
      </div>
    </aside>
  );
}
