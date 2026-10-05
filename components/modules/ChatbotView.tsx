'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Icons } from '@/components/icons/Icons';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: string[];
}

const STARTERS = [
  'Summarize the latest briefing',
  'What are the key regulatory risks?',
  'Draft a short strategic summary for the board',
];

export function ChatbotView({ seedQuery }: { seedQuery?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = async (text?: string) => {
    const query = (text ?? input).trim();
    if (!query || isTyping) return;

    const history = messages.map(m => ({ sender: m.sender, text: m.text }));
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, sender: 'user', text: query }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }),
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { id: `a-${Date.now()}`, sender: 'assistant', text: data.reply || 'No response from Hermes.', citations: data.citations },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { id: `e-${Date.now()}`, sender: 'assistant', text: `⚠️ Could not reach server (${err instanceof Error ? err.message : 'network error'}).` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // "Ask Hermes" from the News dashboard: send once on mount (ref guards React strict-mode double run)
  useEffect(() => {
    if (seedQuery && !seededRef.current) {
      seededRef.current = true;
      send(seedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedQuery]);

  return (
    <div className="module-container chat-view-container">
      <div className="chat-header">
        <div className="chat-header-title">
          <span className="viewer-status-dot" aria-hidden="true" />
          <strong>Hermes Agent</strong>
          <span className="chat-header-sub">Online · :8000</span>
        </div>
        {messages.length > 0 && (
          <button id="clearChat" className="btn btn-quiet" onClick={() => setMessages([])} disabled={isTyping}>
            {Icons.refresh} Clear chat
          </button>
        )}
      </div>

      <div className="chat-messages-area">
        {messages.length === 0 && !isTyping ? (
          <div className="chat-empty">
            <span className="chat-empty-icon">{Icons.sparkles}</span>
            <h1>How can I help you today?</h1>
            <div className="chat-starters">
              {STARTERS.map(s => (
                <button key={s} className="chat-starter" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`chat-bubble-row ${msg.sender === 'user' ? 'is-user-row' : 'is-ai-row'}`}>
              <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                <div className="chat-bubble-content">
                  {msg.text.split('\n').map((line, i) => (line.trim() ? <p key={i}>{line}</p> : <br key={i} />))}
                </div>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="chat-citations">
                    {msg.citations.map(c => (
                      <span key={c} className="citation-badge">{c}</span>
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
              <span className="typing-text">Hermes is thinking…</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

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
          placeholder="Message Hermes…"
          aria-label="Message Hermes"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
        <button type="submit" className="btn btn-primary chat-send-btn" disabled={!input.trim() || isTyping} aria-label="Send">
          {Icons.send}
        </button>
      </form>
    </div>
  );
}
