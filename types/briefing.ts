export type SignalTone = 'emerald' | 'blue' | 'amber' | 'neutral';
export type SignalStatus = 'Immediate' | 'Attention' | 'Opportunity' | 'Watch' | 'Information';
export type VisualType = 'distribution' | 'comparison' | 'facts';

export interface VisualDistributionItem {
  label: string;
  value: number;
}

export interface VisualComparisonItem {
  label: string;
  before: number;
  after: number;
}

export interface VisualFactItem {
  value: string;
  label: string;
}

export interface VisualDistribution {
  type: 'distribution';
  title?: string;
  unit?: string;
  note?: string;
  total?: number | null;
  items: VisualDistributionItem[];
}

export interface VisualComparison {
  type: 'comparison';
  title?: string;
  unit?: string;
  note?: string;
  beforeLabel?: string;
  afterLabel?: string;
  items: VisualComparisonItem[];
}

export interface VisualFacts {
  type: 'facts';
  title?: string;
  unit?: string;
  note?: string;
  items: VisualFactItem[];
}

export type BriefVisual = VisualDistribution | VisualComparison | VisualFacts;

export interface SignalSource {
  label: string;
  url?: string;
  date?: string;
}

export interface SignalAction {
  text: string;
  owner?: string;
  checkpoint?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

export interface SignalMetric {
  value: string;
  unit?: string;
  label: string;
}

export interface BotMetadata {
  id: string;               // e.g. "hermes-news-agent"
  name: string;             // e.g. "Hermes News Intelligence"
  version?: string;          // e.g. "2.1.0"
  model?: string;            // e.g. "gpt-4o"
  confidenceScore?: number;  // e.g. 0.95
  sourceCategory?: string;   // e.g. "EXTERNAL_NEWS", "TRANSACTION", "TENDER"
}

export interface BriefSignal {
  id: string;
  category: string;
  tone: SignalTone;
  status: SignalStatus;
  source: string;
  title: string;
  summary: string;
  metric?: SignalMetric | null;
  evidence: string[];
  managementContext?: string;
  uncertainty?: string;
  action: SignalAction;
  dataAsOf?: string;
  sources: SignalSource[];
  visual?: BriefVisual | null;
  bot?: BotMetadata;         // Multi-bot identifier
  tags?: string[];
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  metadata?: Record<string, any>;
  extensions?: Record<string, any>;
}

// 3-Container Architecture Types (Agent Ingestion Payload)
export interface BriefSignalMain {
  id: string;
  bot_name?: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  summary: string;
  metric?: SignalMetric | null;
  evidence: string[];
  action: {
    task: string;
    owner?: string;
    deadline?: string;
  };
  sources?: {
    name: string;
    url?: string;
    date?: string;
  }[];
}

export interface BriefSignalPresentation {
  visual?: BriefVisual | null;
}

export interface NestedSignalPayload {
  main: BriefSignalMain;
  presentation?: BriefSignalPresentation | null;
  extensions?: Record<string, any>;
}

export interface ContributingBot {
  botId: string;
  botName: string;
  signalsCount: number;
}

export interface BriefMeta {
  title: string;
  subtitle: string;
  eyebrow?: string;
  editionDate: string;
  dataAsOf: string;
  state?: string;
  sourceLabel?: string;
  sourceNote?: string;
  contributingBots?: ContributingBot[];
}

export interface BriefEdition {
  id: string;               // e.g. "edition-2026-09-30"
  schemaVersion: 1;
  status: 'draft' | 'approved' | 'archived';
  meta: BriefMeta;
  featuredId: string;
  signals: BriefSignal[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EditionSummary {
  id: string;
  title: string;
  editionDate: string;
  dataAsOf: string;
  signalsCount: number;
  status: string;
}
