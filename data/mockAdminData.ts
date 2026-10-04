export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  citations?: string[];
}

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  costPer1kInput: number;
  costPer1kOutput: number;
  contextWindow: string;
  isDefault?: boolean;
}

export interface TokenUsageStats {
  monthlyQuotaTokens: number;
  consumedTokens: number;
  estimatedCostUsd: number;
  costBudgetUsd: number;
  activeModelId: string;
  temperature: number;
  maxTokens: number;
  apiKeyMasked: string;
  lastSyncTime: string;
  usageByBot: {
    botName: string;
    tokens: number;
    sharePercent: number;
  }[];
  dailyTrend: {
    date: string;
    tokens: number;
    costUsd: number;
  }[];
}

export interface TrafficSessionLog {
  id: string;
  userName: string;
  title: string;
  division: string;
  editionDate: string;
  duration: string;
  device: 'Desktop' | 'Tablet' | 'Mobile';
  timestamp: string;
}

export interface UserTrafficStats {
  activeExecutivesToday: number;
  weeklyGrowthPercent: number;
  avgReadingDuration: string;
  totalBriefingViewsMonth: number;
  topReadEdition: string;
  deviceDistribution: {
    device: string;
    percent: number;
  }[];
  recentSessions: TrafficSessionLog[];
  hourlyActivity: {
    hour: string;
    readers: number;
  }[];
}

// -------------------------------------------------------------
// 1. CHATBOT MOCK DATA
// -------------------------------------------------------------
export const mockSuggestedPrompts = [
  'Summarize the top 3 critical risks in the latest briefing',
  'What are the concrete recommended actions for Legal & Risk?',
  'Draft a 3-bullet executive briefing memo for the Board of Directors',
  'Explain the financial impact of the PLN Wheeling tariff adjustment',
];

export const mockInitialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    timestamp: '09:00 AM',
    text: 'Good morning. I am **AIKO Executive Intelligence Assistant**. I have fully indexed the latest C-Level briefings and market intelligence feeds. How can I assist your strategic decision-making today?',
  },
  {
    id: 'msg-2',
    sender: 'user',
    timestamp: '09:02 AM',
    text: 'What is the immediate impact of the revised PLN Wheeling tariff scheme on our renewable IPP pipeline?',
  },
  {
    id: 'msg-3',
    sender: 'assistant',
    timestamp: '09:02 AM',
    text: 'Based on the **October 2nd Executive Briefing (Signal #01)**:\n\n1. **Margin Contraction:** The open transmission tariff revision introduces an estimated **-8.4% margin contraction** on upcoming private IPP joint ventures.\n2. **Regulatory Timeline:** MEMR Ministerial Decree No. 14/2026 takes effect in Q1 2027, requiring PPA renegotiation clauses to be locked before November 15th.\n3. **Recommended Move:** Prioritize legal audit of clause 7.2 with PLN Enjiniring to trigger the grandfathering provisions.',
    citations: ['Briefing Edition: 2026-10-02', 'Signal #01 (Regulasi / Immediate)'],
  },
];

// -------------------------------------------------------------
// 2. TOKEN CONFIGURATION MOCK DATA
// -------------------------------------------------------------
export const mockModelOptions: ModelOption[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    contextWindow: '200k tokens',
    isDefault: true,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni Executive)',
    provider: 'OpenAI',
    costPer1kInput: 0.005,
    costPer1kOutput: 0.015,
    contextWindow: '128k tokens',
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google Cloud',
    costPer1kInput: 0.00125,
    costPer1kOutput: 0.005,
    contextWindow: '1M tokens',
  },
];

export const mockTokenStats: TokenUsageStats = {
  monthlyQuotaTokens: 5000000,
  consumedTokens: 3420000,
  estimatedCostUsd: 68.4,
  costBudgetUsd: 150.0,
  activeModelId: 'claude-3-5-sonnet',
  temperature: 0.25,
  maxTokens: 4096,
  apiKeyMasked: 'sk-ant-api03-91kx982m••••••••••••L9qQ',
  lastSyncTime: 'Today at 04:15 PM UTC+7',
  usageByBot: [
    { botName: 'Hermes Regulatory Watcher', tokens: 1450000, sharePercent: 42.4 },
    { botName: 'Transaction Intelligence Engine', tokens: 1120000, sharePercent: 32.7 },
    { botName: 'Tender & Procurement Radar', tokens: 850000, sharePercent: 24.9 },
  ],
  dailyTrend: [
    { date: 'Sep 28', tokens: 380000, costUsd: 7.6 },
    { date: 'Sep 29', tokens: 420000, costUsd: 8.4 },
    { date: 'Sep 30', tokens: 590000, costUsd: 11.8 },
    { date: 'Oct 01', tokens: 480000, costUsd: 9.6 },
    { date: 'Oct 02', tokens: 670000, costUsd: 13.4 },
    { date: 'Oct 03', tokens: 510000, costUsd: 10.2 },
    { date: 'Oct 04', tokens: 370000, costUsd: 7.4 },
  ],
};

// -------------------------------------------------------------
// 3. USER TRAFFIC & ANALYTICS MOCK DATA
// -------------------------------------------------------------
export const mockTrafficStats: UserTrafficStats = {
  activeExecutivesToday: 24,
  weeklyGrowthPercent: 18.5,
  avgReadingDuration: '4m 38s',
  totalBriefingViewsMonth: 486,
  topReadEdition: '2026-10-02 (Sales & Market Intelligence)',
  deviceDistribution: [
    { device: 'Desktop / Workstation', percent: 62 },
    { device: 'iPad / Executive Tablet', percent: 28 },
    { device: 'Mobile Smartphone', percent: 10 },
  ],
  recentSessions: [
    {
      id: 'sess-01',
      userName: 'Pratama Wicaksono',
      title: 'Chief Commercial Officer',
      division: 'Commercial & Sales',
      editionDate: '2026-10-02',
      duration: '6m 12s',
      device: 'Desktop',
      timestamp: '10 minutes ago',
    },
    {
      id: 'sess-02',
      userName: 'Dr. Hendra Kusuma',
      title: 'Managing Director',
      division: 'Board of Directors',
      editionDate: '2026-10-02',
      duration: '8m 45s',
      device: 'Tablet',
      timestamp: '28 minutes ago',
    },
    {
      id: 'sess-03',
      userName: 'Sylvia Anggraini',
      title: 'VP of Strategy & M&A',
      division: 'Corporate Planning',
      editionDate: '2026-10-01',
      duration: '3m 50s',
      device: 'Desktop',
      timestamp: '1 hour ago',
    },
    {
      id: 'sess-04',
      userName: 'Bambang Soediro',
      title: 'Head of Legal & Regulatory',
      division: 'Legal Directorate',
      editionDate: '2026-10-02',
      duration: '5m 18s',
      device: 'Mobile',
      timestamp: '2 hours ago',
    },
    {
      id: 'sess-05',
      userName: 'Farhan Maulana',
      title: 'Principal Investment Officer',
      division: 'Treasury & Capital Markets',
      editionDate: '2026-09-30',
      duration: '4m 02s',
      device: 'Desktop',
      timestamp: '3 hours ago',
    },
  ],
  hourlyActivity: [
    { hour: '07:00', readers: 4 },
    { hour: '08:00', readers: 18 },
    { hour: '09:00', readers: 24 },
    { hour: '10:00', readers: 19 },
    { hour: '11:00', readers: 14 },
    { hour: '12:00', readers: 8 },
    { hour: '13:00', readers: 16 },
    { hour: '14:00', readers: 22 },
    { hour: '15:00', readers: 17 },
    { hour: '16:00', readers: 12 },
  ],
};
