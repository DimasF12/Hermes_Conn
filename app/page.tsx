'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useReports } from '@/hooks/useReports';
import { Sidebar, NavigationMenuId } from '@/components/layout/Sidebar';
import { ReportTopbar } from '@/components/viewer/ReportTopbar';
import { ReportCanvas } from '@/components/viewer/ReportCanvas';

const ChatbotView = dynamic(
  () => import('@/components/modules/ChatbotView').then(m => m.ChatbotView),
  {
    loading: () => (
      <div className="viewer-loader is-standalone" role="status">
        <span className="viewer-loader-bar" />
        <span>Memuat AI Assistant…</span>
      </div>
    ),
  }
);

const TokenConfigView = dynamic(
  () => import('@/components/modules/TokenConfigView').then(m => m.TokenConfigView),
  {
    loading: () => (
      <div className="viewer-loader is-standalone" role="status">
        <span className="viewer-loader-bar" />
        <span>Memuat Konfigurasi Token…</span>
      </div>
    ),
  }
);

const UserTrafficView = dynamic(
  () => import('@/components/modules/UserTrafficView').then(m => m.UserTrafficView),
  {
    loading: () => (
      <div className="viewer-loader is-standalone" role="status">
        <span className="viewer-loader-bar" />
        <span>Memuat Trafik Pengguna…</span>
      </div>
    ),
  }
);

export default function CommandCenterPage() {
  const { reports, selectedReport, setSelectedFile, isLoading, error, refresh } = useReports();

  const [activeMenu, setActiveMenu] = useState<NavigationMenuId>('reports');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const shellRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Synchronize state when user exits fullscreen via Esc key
  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      await shellRef.current?.requestFullscreen();
    } catch {
      // Browser denied fullscreen without user gesture — ignore
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
  }, []);

  const printReport = useCallback(() => {
    iframeRef.current?.contentWindow?.print();
  }, []);

  return (
    <div ref={shellRef} className={`command-center-app ${isFullscreen ? 'is-fullscreen' : ''}`}>
      {/* SIDEBAR NAVIGATION (Hidden in Fullscreen) */}
      {!isFullscreen && (
        <Sidebar
          activeMenu={activeMenu}
          onSelectMenu={setActiveMenu}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          reportsCount={reports.length}
        />
      )}

      {/* MAIN VIEWPORT / WORKSPACE */}
      <main className="main-viewport">
        {/* VIEW 1: INTELLIGENCE REPORTS (CANVAS) */}
        {activeMenu === 'reports' && (
          <div className="viewer-shell">
            {!isFullscreen && (
              <ReportTopbar
                reports={reports}
                selectedReport={selectedReport}
                onSelect={setSelectedFile}
                isRefreshing={isLoading}
                onRefresh={refresh}
                onPrint={printReport}
                onFullscreen={enterFullscreen}
              />
            )}

            {error && (
              <div className="viewer-error" role="alert">
                Failed to load reports catalog ({error}).
                <button className="btn btn-quiet" onClick={refresh}>Try again</button>
              </div>
            )}

            {isLoading && reports.length === 0 ? (
              <div className="viewer-loader is-standalone" role="status">
                <span className="viewer-loader-bar" />
                <span>Scanning report directory…</span>
              </div>
            ) : (
              <ReportCanvas
                ref={iframeRef}
                report={selectedReport}
                isFullscreen={isFullscreen}
                onExitFullscreen={exitFullscreen}
              />
            )}
          </div>
        )}

        {/* VIEW 2: HERMES CHATBOT */}
        {activeMenu === 'chat' && <ChatbotView />}

        {/* VIEW 3: AI TOKEN CONFIGURATION */}
        {activeMenu === 'tokens' && <TokenConfigView />}

        {/* VIEW 4: USER TRAFFIC ANALYTICS */}
        {activeMenu === 'traffic' && <UserTrafficView />}
      </main>
    </div>
  );
}
