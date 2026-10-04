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

  const handleSendMessage = (textToSend?: string) => {
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

    // Simulate AI response synthesis
    setTimeout(() => {
      let aiResponseText = `Thank you for your inquiry. Analyzing indexed C-Level intelligence for: **"${query}"**.\n\n• **Core Finding:** Cross-referencing our primary intelligence feeds confirms this observation has high operational correlation across regional sales branches.\n• **Executive Recommendation:** Proceed with phased mitigation, schedule an alignment sync with Directorate Heads, and verify the evidence baseline.\n• **Timeline Checkpoint:** Target closure prior to month-end board review.`;

      if (query.toLowerCase().includes('risk') || query.toLowerCase().includes('3')) {
        aiResponseText = `Here is the synthesized **Top 3 Risk Assessment** from our latest briefings:\n\n1. **Regulatory Wheeling Squeeze (High Risk):** Revised transmission formulas project a -8.4% margin contraction on private joint ventures.\n2. **Tender Compliance Deadlines (Medium Risk):** Central Java solar farm procurement requirements shift technical qualification windows.\n3. **Foreign Exchange Headwind (Watch):** Strengthening USD impacts import capital equipment cost curves by approximately +3.8%.`;
      } else if (query.toLowerCase().includes('memo') || query.toLowerCase().includes('board')) {
        aiResponseText = `**MEMORANDUM FOR THE BOARD OF DIRECTORS**\n**Date:** October 04, 2026\n**Subject:** Executive Intelligence Synthesis & Action Priorities\n\n• **Summary:** Commercial signals indicate stable demand (+12% YoY) alongside localized regulatory margin pressure in utility-scale partnerships.\n• **Recommended Decision:** Authorize Legal & Strategy to invoke grandfathering clauses under MEMR No. 14/2026 before November 15.\n• **Capital Allocation:** Reserve contingency buffer of USD 1.2M for tariff adjustments.`;
      }

      const assistantMessage: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        text: aiResponseText,
        citations: ['Live Briefing Intelligence Feed', 'Verified Multi-Agent Synthesis'],
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 900);
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
            AI ASSISTANT
          </div>
          <h1 className="module-title">AI Executive Intelligence Chatbot</h1>
          <p className="module-subtitle">
            Converse directly with your enterprise briefings, query financial impact metrics, and draft strategic memos.
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
                    {isUser ? 'You (Executive)' : 'AIKO Intelligence Agent'}
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
              <span className="typing-text">AIKO is synthesizing intelligence...</span>
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
