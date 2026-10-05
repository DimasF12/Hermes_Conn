'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Icons } from '@/components/icons/Icons';

export type PersonaId = 'data_analyst' | 'data_engineer';

export interface PersonaConfig {
  id: PersonaId;
  name: string;
  engine: string;
  badge: string;
  role: string;
  description: string;
  starters: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  persona?: PersonaId;
  citations?: string[];
  timestamp?: string;
  isDiagnostic?: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  persona: PersonaId;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export const PERSONAS: Record<PersonaId, PersonaConfig> = {
  data_analyst: {
    id: 'data_analyst',
    name: 'Data Analyst',
    engine: 'gemini-3.5-flash-lite',
    badge: 'Analyst',
    role: 'Business & Sales Intelligence',
    description: 'Analisis metrik KPI, tren penjualan, anomali data, dan insight bisnis.',
    starters: [
      'Summarize the latest sales intelligence briefing',
      'What are the key quantitative trends in sales performance?',
      'Identify any anomalies or high-risk signals in the briefing data',
    ],
  },
  data_engineer: {
    id: 'data_engineer',
    name: 'Data Engineer',
    engine: 'glm-4.7-flash',
    badge: 'Engineer',
    role: 'Pipeline & Systems Architecture',
    description: 'Arsitektur pipeline data, skema tabel, optimasi query, dan proses ETL.',
    starters: [
      'How should we structure the data ingestion pipeline for daily briefings?',
      'Recommend an optimal database schema for historical sales intelligence',
      'How to optimize query latency and handle partitioned report storage?',
    ],
  },
};

const STORAGE_THREADS_KEY = 'aiko_chat_threads_v2';
const STORAGE_SIDEBAR_KEY = 'aiko_chat_sidebar_collapsed';

function createNewThread(persona: PersonaId = 'data_analyst'): ChatThread {
  return {
    id: `th-${Date.now()}`,
    title: 'Percakapan Baru',
    persona,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins}m lalu`;
  if (diffHours < 24) return `${diffHours}j lalu`;
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays}h lalu`;
  return new Date(timestamp).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
}

export function ChatbotView({ seedQuery }: { seedQuery?: string }) {
  // Initialize threads lazily from localStorage
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    if (typeof window === 'undefined') return [createNewThread()];
    try {
      const saved = localStorage.getItem(STORAGE_THREADS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback on corrupt JSON
    }
    return [createNewThread()];
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    return threads[0]?.id ?? '';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem(STORAGE_SIDEBAR_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);

  // Sync threads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_THREADS_KEY, JSON.stringify(threads));
    } catch {
      // Ignore quota errors
    }
  }, [threads]);

  // Sync sidebar collapsed state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SIDEBAR_KEY, (!isSidebarOpen).toString());
    } catch {
      // Ignore quota errors
    }
  }, [isSidebarOpen]);

  // Active thread reference
  const activeThread = threads.find(t => t.id === activeThreadId) ?? threads[0] ?? null;
  const currentPersona = activeThread ? PERSONAS[activeThread.persona] : PERSONAS.data_analyst;

  // Scroll to bottom on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages, isTyping]);

  // Switch persona for the active thread
  const handleSetPersona = (personaId: PersonaId) => {
    if (!activeThread) return;
    setThreads(prev =>
      prev.map(t => (t.id === activeThread.id ? { ...t, persona: personaId, updatedAt: Date.now() } : t))
    );
  };

  // Create new thread
  const handleNewThread = (personaId?: PersonaId) => {
    const newThread = createNewThread(personaId ?? activeThread?.persona ?? 'data_analyst');
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setInput('');
  };

  // Delete thread
  const handleDeleteThread = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    setThreads(prev => {
      const filtered = prev.filter(t => t.id !== threadId);
      if (filtered.length === 0) {
        const fresh = createNewThread();
        setActiveThreadId(fresh.id);
        return [fresh];
      }
      if (activeThreadId === threadId) {
        setActiveThreadId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Send message
  const send = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend ?? input).trim();
      if (!query || isTyping || !activeThread) return;

      const personaId = activeThread.persona;
      const history = activeThread.messages.map(m => ({ sender: m.sender, text: m.text }));

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'user',
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Auto-title thread from first user message
      const isFirstMessage = activeThread.messages.length === 0;
      const newTitle = isFirstMessage
        ? query.length > 34
          ? `${query.slice(0, 34).trim()}…`
          : query
        : activeThread.title;

      setThreads(prev =>
        prev.map(t =>
          t.id === activeThread.id
            ? {
                ...t,
                title: newTitle,
                messages: [...t.messages, userMsg],
                updatedAt: Date.now(),
              }
            : t
        )
      );

      setInput('');
      setIsTyping(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            persona: personaId,
            history,
          }),
        });

        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: data.reply || 'Tidak ada respons dari Hermes.',
          persona: personaId,
          citations: data.citations,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDiagnostic: data.isDiagnostic,
        };

        setThreads(prev =>
          prev.map(t =>
            t.id === activeThread.id
              ? {
                  ...t,
                  messages: [...t.messages, aiMsg],
                  updatedAt: Date.now(),
                }
              : t
          )
        );
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'network error';
        const failMsg: ChatMessage = {
          id: `e-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Gagal terhubung ke Hermes (${errorMsg}). Pastikan agent server aktif.`,
          persona: personaId,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDiagnostic: true,
        };

        setThreads(prev =>
          prev.map(t =>
            t.id === activeThread.id
              ? {
                  ...t,
                  messages: [...t.messages, failMsg],
                  updatedAt: Date.now(),
                }
              : t
          )
        );
      } finally {
        setIsTyping(false);
      }
    },
    [activeThread, input, isTyping]
  );

  // "Ask Hermes" seedQuery on mount
  useEffect(() => {
    if (seedQuery && !seededRef.current && activeThread) {
      seededRef.current = true;
      send(seedQuery);
    }
  }, [seedQuery, activeThread, send]);

  return (
    <div className="module-container chat-view-container">
      {/* =========================================================
          DUAL-PANEL COCKPIT: THREAD SIDEBAR + CHAT CANVAS
         ========================================================= */}
      <div className={`chat-cockpit-layout ${!isSidebarOpen ? 'is-sidebar-collapsed' : ''}`}>
        {/* PANEL KIRI: THREAD HISTORY SIDEBAR */}
        <aside className="chat-threads-panel" aria-label="Riwayat Percakapan">
          <div className="chat-threads-header">
            <div className="chat-threads-heading">
              <span className="chat-threads-icon">{Icons.messageSquare}</span>
              <strong>Percakapan</strong>
              <span className="chat-threads-count">{threads.length}</span>
            </div>
            <button
              type="button"
              className="btn btn-quiet icon-btn chat-sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(false)}
              title="Tutup riwayat thread"
              aria-label="Tutup riwayat thread"
            >
              {Icons.panelLeft}
            </button>
          </div>

          <div className="chat-new-thread-wrap">
            <button
              type="button"
              className="btn btn-primary chat-new-thread-btn"
              onClick={() => handleNewThread()}
              disabled={isTyping}
            >
              {Icons.plus}
              <span>Chat Baru</span>
            </button>
          </div>

          {/* LIST THREADS */}
          <div className="chat-threads-list" role="list">
            {threads.map(thread => {
              const isActive = thread.id === activeThread?.id;
              const p = PERSONAS[thread.persona];

              return (
                <div
                  key={thread.id}
                  role="listitem"
                  className={`chat-thread-item ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    setInput('');
                  }}
                >
                  <div className="chat-thread-meta">
                    <span className={`chat-thread-persona-badge is-${thread.persona}`}>
                      {thread.persona === 'data_analyst' ? Icons.barChart : Icons.cpu}
                      <span>{p.badge}</span>
                    </span>
                    <span className="chat-thread-time">{formatRelativeTime(thread.updatedAt)}</span>
                  </div>

                  <div className="chat-thread-title" title={thread.title}>
                    {thread.title}
                  </div>

                  <button
                    type="button"
                    className="chat-thread-delete-btn"
                    onClick={e => handleDeleteThread(e, thread.id)}
                    title="Hapus percakapan"
                    aria-label={`Hapus percakapan: ${thread.title}`}
                  >
                    {Icons.trash}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* PANEL KANAN: CHAT CANVAS AREA */}
        <section className="chat-canvas-panel" aria-label="Kanvas Chat Aktif">
          {/* TOP BAR CHAT CANVAS */}
          <header className="chat-canvas-header">
            <div className="chat-canvas-left">
              {!isSidebarOpen && (
                <button
                  type="button"
                  className="btn btn-quiet icon-btn chat-sidebar-expand-btn"
                  onClick={() => setIsSidebarOpen(true)}
                  title="Buka riwayat percakapan"
                  aria-label="Buka riwayat percakapan"
                >
                  {Icons.panelLeft}
                </button>
              )}

              {/* PERSONA SELECTOR PILL */}
              <div className="chat-persona-selector-wrap">
                <span className="chat-persona-label">Persona:</span>
                <div className="chat-persona-pills" role="radiogroup" aria-label="Pilih Persona Hermes">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={activeThread?.persona === 'data_analyst'}
                    className={`chat-persona-pill ${activeThread?.persona === 'data_analyst' ? 'is-active' : ''}`}
                    onClick={() => handleSetPersona('data_analyst')}
                  >
                    {Icons.barChart}
                    <span className="pill-name">Data Analyst</span>
                    <span className="pill-engine">gemini-3.5-flash-lite</span>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={activeThread?.persona === 'data_engineer'}
                    className={`chat-persona-pill ${activeThread?.persona === 'data_engineer' ? 'is-active' : ''}`}
                    onClick={() => handleSetPersona('data_engineer')}
                  >
                    {Icons.cpu}
                    <span className="pill-name">Data Engineer</span>
                    <span className="pill-engine">glm-4.7-flash</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="chat-canvas-status">
              <span className="viewer-status-dot" aria-hidden="true" />
              <span className="chat-status-text">Hermes Online · :8000</span>
            </div>
          </header>

          {/* CHAT MESSAGES AREA */}
          <div className="chat-messages-area">
            {(!activeThread || activeThread.messages.length === 0) && !isTyping ? (
              <div className="chat-empty">
                <div className={`chat-empty-avatar is-${currentPersona.id}`}>
                  {currentPersona.id === 'data_analyst' ? Icons.barChart : Icons.cpu}
                </div>
                <h1>{currentPersona.name}</h1>
                <p className="chat-empty-sub">
                  Engine: <strong>{currentPersona.engine}</strong> · {currentPersona.description}
                </p>

                <div className="chat-starters">
                  {currentPersona.starters.map(s => (
                    <button key={s} className="chat-starter" onClick={() => send(s)}>
                      <span className="starter-icon">{Icons.sparkles}</span>
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              activeThread?.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${msg.sender === 'user' ? 'is-user-row' : 'is-ai-row'}`}
                >
                  <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                    {msg.sender === 'assistant' && (
                      <div className="chat-bubble-author">
                        <span className={`chat-bubble-badge is-${msg.persona ?? currentPersona.id}`}>
                          {msg.persona === 'data_engineer' ? Icons.cpu : Icons.barChart}
                          <span>
                            {msg.persona === 'data_engineer' ? 'Data Engineer' : 'Data Analyst'} (
                            {msg.persona === 'data_engineer' ? 'glm-4.7-flash' : 'gemini-3.5-flash-lite'})
                          </span>
                        </span>
                        {msg.timestamp && <span className="chat-bubble-time">{msg.timestamp}</span>}
                      </div>
                    )}

                    <div className="chat-bubble-content">
                      {msg.text.split('\n').map((line, i) => (line.trim() ? <p key={i}>{line}</p> : <br key={i} />))}
                    </div>

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="chat-citations">
                        {msg.citations.map(c => (
                          <span key={c} className="citation-badge">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="chat-bubble-row is-ai-row">
                <div className="chat-bubble ai-bubble typing-bubble" role="status">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-text">{currentPersona.name} ({currentPersona.engine}) sedang memproses…</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* INPUT FORM */}
          <form
            className="chat-input-wrapper"
            onSubmit={e => {
              e.preventDefault();
              send();
            }}
          >
            <input
              id="chatInput"
              type="text"
              className="chat-input-field"
              placeholder={`Tanyakan ke ${currentPersona.name} (${currentPersona.engine})…`}
              aria-label={`Tanyakan ke ${currentPersona.name}`}
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="btn btn-primary chat-send-btn"
              disabled={!input.trim() || isTyping}
              aria-label="Kirim Pesan"
            >
              {Icons.send}
              <span className="desktop-label">Kirim</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
