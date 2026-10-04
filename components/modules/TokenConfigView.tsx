'use client';

import React, { useState } from 'react';
import { Icons, formatNum } from '@/components/icons/Icons';
import {
  mockModelOptions,
  mockTokenStats,
  ModelOption,
} from '@/data/mockAdminData';

export function TokenConfigView() {
  const [selectedModelId, setSelectedModelId] = useState(mockTokenStats.activeModelId);
  const [temperature, setTemperature] = useState(mockTokenStats.temperature);
  const [maxTokens, setMaxTokens] = useState(mockTokenStats.maxTokens);
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const selectedModel = mockModelOptions.find(m => m.id === selectedModelId) || mockModelOptions[0];
  const quotaPercentage = Math.round(
    (mockTokenStats.consumedTokens / mockTokenStats.monthlyQuotaTokens) * 100
  );

  const handleSaveConfig = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="module-container token-view-container">
      {/* HEADER */}
      <div className="module-header">
        <div>
          <div className="module-kicker">
            <span className="viewer-status-dot" aria-hidden="true" />
            AI INFRASTRUCTURE & RESOURCE MANAGEMENT
          </div>
          <h1 className="module-title">AI Token & Model Configuration</h1>
          <p className="module-subtitle">
            Manage enterprise token allocation, switch active foundation models, configure inference temperature, and audit API consumption.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleSaveConfig}>
          {Icons.checklist} Save Changes
        </button>
      </div>

      {savedNotice && (
        <div className="save-success-banner" role="status">
          ✓ Configuration updated successfully. New inference parameters applied to upcoming intelligence cycles.
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="token-kpi-grid">
        <div className="token-kpi-card">
          <span className="token-kpi-label">Monthly Quota Consumption</span>
          <div className="token-kpi-val">
            {quotaPercentage}%
          </div>
          <div className="token-progress-track">
            <div
              className="token-progress-fill"
              style={{
                width: `${quotaPercentage}%`,
                background: quotaPercentage > 85 ? 'var(--danger)' : 'var(--brand)',
              }}
            />
          </div>
          <span className="token-kpi-sub">
            {formatNum(mockTokenStats.consumedTokens)} / {formatNum(mockTokenStats.monthlyQuotaTokens)} Tokens
          </span>
        </div>

        <div className="token-kpi-card">
          <span className="token-kpi-label">Month-to-Date Inference Cost</span>
          <div className="token-kpi-val">
            ${mockTokenStats.estimatedCostUsd.toFixed(2)}
          </div>
          <span className="token-kpi-sub">
            Allocated Budget: ${mockTokenStats.costBudgetUsd.toFixed(2)} USD (45.6% utilized)
          </span>
        </div>

        <div className="token-kpi-card">
          <span className="token-kpi-label">Active Foundation Engine</span>
          <div className="token-kpi-val" style={{ fontSize: '20px', color: 'var(--brand)' }}>
            {selectedModel.name}
          </div>
          <span className="token-kpi-sub">
            Provider: {selectedModel.provider} · Context: {selectedModel.contextWindow}
          </span>
        </div>

        <div className="token-kpi-card">
          <span className="token-kpi-label">Telemetry Status</span>
          <div className="token-kpi-val" style={{ fontSize: '20px', color: 'var(--brand)' }}>
            Online & Synced
          </div>
          <span className="token-kpi-sub">
            Last health ping: {mockTokenStats.lastSyncTime}
          </span>
        </div>
      </div>

      {/* TWO COLUMN GRID: MODEL SELECTION & INFERENCE CONTROLS */}
      <div className="token-sections-grid">
        {/* MODEL SELECTION */}
        <section className="token-card-panel">
          <h2 className="panel-heading">Primary Foundation Model</h2>
          <p className="panel-desc">
            Select the LLM engine tasked with executive brief distillation and multi-agent synthesis.
          </p>

          <div className="model-options-list">
            {mockModelOptions.map((model: ModelOption) => {
              const isSelected = model.id === selectedModelId;
              return (
                <div
                  key={model.id}
                  className={`model-select-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => setSelectedModelId(model.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="model-radio-circle">
                    {isSelected && <span className="model-radio-dot" />}
                  </div>
                  <div className="model-info">
                    <div className="model-name-row">
                      <strong className="model-name">{model.name}</strong>
                      <span className="model-badge">{model.provider}</span>
                      {model.isDefault && <span className="model-pill-recommended">Recommended</span>}
                    </div>
                    <span className="model-specs">
                      Context: {model.contextWindow} · In: ${model.costPer1kInput}/1k · Out: ${model.costPer1kOutput}/1k
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* INFERENCE PARAMETERS */}
        <section className="token-card-panel">
          <h2 className="panel-heading">Inference Hyperparameters</h2>
          <p className="panel-desc">
            Tune randomness and maximum completion length for decision-grade intelligence.
          </p>

          <div className="slider-group">
            <div className="slider-header">
              <label htmlFor="tempSlider" className="slider-label">Temperature: <strong>{temperature}</strong></label>
              <span className="slider-hint">
                {temperature <= 0.3 ? 'Deterministic & Fact-Rigid' : 'Balanced Analysis'}
              </span>
            </div>
            <input
              id="tempSlider"
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              className="range-slider"
            />
          </div>

          <div className="slider-group" style={{ marginTop: '20px' }}>
            <div className="slider-header">
              <label htmlFor="tokenSlider" className="slider-label">Max Generation Tokens: <strong>{maxTokens}</strong></label>
              <span className="slider-hint">Capacity per brief section</span>
            </div>
            <input
              id="tokenSlider"
              type="range"
              min="1024"
              max="8192"
              step="512"
              value={maxTokens}
              onChange={e => setMaxTokens(parseInt(e.target.value, 10))}
              className="range-slider"
            />
          </div>

          {/* API KEY MASKING */}
          <div className="api-key-box" style={{ marginTop: '24px' }}>
            <label className="slider-label">Enterprise API Credential</label>
            <div className="api-key-input-row">
              <input
                type="text"
                readOnly
                value={showApiKey ? 'sk-ant-api03-91kx982m84nm92xla0123456789L9qQ' : mockTokenStats.apiKeyMasked}
                className="api-key-field"
              />
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? 'Hide' : 'Reveal'}
              </button>
            </div>
            <span className="api-key-help">Stored encrypted via KMS vault. Rotation scheduled in 45 days.</span>
          </div>
        </section>
      </div>

      {/* CONSUMPTION BREAKDOWN BY AGENT */}
      <section className="token-card-panel" style={{ marginTop: '24px' }}>
        <h2 className="panel-heading">Token Consumption by Agent Sub-System</h2>
        <p className="panel-desc">
          Telemetry breakdown across specialized ingestion and classification micro-agents.
        </p>

        <div className="agent-usage-table">
          {mockTokenStats.usageByBot.map((bot, idx) => (
            <div key={idx} className="agent-usage-row">
              <div className="agent-col-name">
                <strong>{bot.botName}</strong>
                <div className="agent-bar-track">
                  <div
                    className="agent-bar-fill"
                    style={{ width: `${bot.sharePercent}%` }}
                  />
                </div>
              </div>
              <div className="agent-col-tokens">
                <strong>{formatNum(bot.tokens)}</strong>
                <span>tokens</span>
              </div>
              <div className="agent-col-share">
                <span className="share-pill">{bot.sharePercent}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
