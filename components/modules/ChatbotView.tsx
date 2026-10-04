'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '@/components/icons/Icons';
import {
  ChatMessage,
  mockInitialMessages,
  mockSuggestedPrompts,
} from '@/data/mockAdminData';

export function ChatbotView() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockInitialMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Send real-time request to Next.js /api/chat (Hermes API Gateway)
    try {
      const historyPayload = messages.map(m => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'assistant',
        timestamp: data.timestamp || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        text: data.reply || 'No response returned from Hermes Agent.',
        citations: data.citations || ['Hermes Executive Agent (Port 8000)'],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        text: `⚠️ **Connection Error:** Could not contact server (${err.message || 'Network error'}).`,
        citations: ['System Diagnostic'],
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="module-container chat-view-container">
      {/* HEADER */}
      <div className="module-header">
        <div>
          <div className="module-kicker">
            <span className="viewer-status-dot" aria-hidden="true" />
            HERMES AGENT • NOUS RESEARCH
          </div>
          <h1 className="module-title">Hermes Executive Intelligence Chatbot</h1>
          <p className="module-subtitle">
            Powered by Hermes Agent (localhost:8000). Direct strategic reasoning connected to your enterprise briefings.
          </p>
        </div>

        <button
          className="btn btn-quiet"
          onClick={() => setMessages(mockInitialMessages)}
          title="Reset conversation"
        >
          {Icons.refresh} Reset Conversation
        </button>
      </div>

      {/* SUGGESTED PROMPTS */}
      <div className="chat-prompts-bar">
        <span className="chat-prompts-label">Suggested Inquiries:</span>
        <div className="chat-prompts-list">
          {mockSuggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              className="chat-prompt-pill"
              onClick={() => handleSendMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* MESSAGES THREAD */}
      <div className="chat-messages-area">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`chat-bubble-row ${isUser ? 'is-user-row' : 'is-ai-row'}`}
            >
              {!isUser && (
                <div className="chat-avatar ai-avatar">
                  {Icons.sparkles}
                </div>
              )}

              <div className={`chat-bubble ${isUser ? 'user-bubble' : 'ai-bubble'}`}>
                <div className="chat-bubble-header">
                  <span className="chat-bubble-sender">
                    {isUser ? 'You (Executive)' : 'Hermes Intelligence Agent'}
                  </span>
                  <span className="chat-bubble-time">{msg.timestamp}</span>
                </div>

                <div className="chat-bubble-content">
                  {msg.text.split('\n').map((line, lineIdx) => {
                    if (!line.trim()) return <br key={lineIdx} />;
                    return <p key={lineIdx}>{line}</p>;
                  })}
                </div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="chat-citations">
                    <span className="citations-label">Sources:</span>
                    {msg.citations.map((cite, cIdx) => (
                      <span key={cIdx} className="citation-badge">
                        📌 {cite}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="chat-avatar user-avatar">
                  EX
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="chat-bubble-row is-ai-row">
            <div className="chat-avatar ai-avatar">
              {Icons.sparkles}
            </div>
            <div className="chat-bubble ai-bubble typing-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-text">Hermes is reasoning and synthesizing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="chat-input-wrapper">
        <input
          type="text"
          className="chat-input-field"
          placeholder="Ask anything about latest briefings, risks, or financial impacts... (Press Enter)"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-primary chat-send-btn"
          onClick={() => handleSendMessage()}
          disabled={!inputQuery.trim() || isTyping}
          aria-label="Send inquiry"
        >
          {Icons.send}
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
