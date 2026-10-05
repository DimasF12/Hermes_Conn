import React from 'react';
import {
  CheckSquare,
  Layers,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Download,
  Printer,
  FileText,
  MessageSquare,
  Cpu,
  BarChart3,
  Send,
  Sparkles,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
} from 'lucide-react';

/**
 * Format numbers with comma grouping and max 2 decimal places.
 */
export function formatNum(val: number | null | undefined): string {
  if (val == null || !Number.isFinite(val)) return '';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(val);
}

export const Icons: Record<string, React.ReactNode> = {
  checklist: <CheckSquare size={16} strokeWidth={1.8} aria-hidden="true" />,
  layers: <Layers size={16} strokeWidth={1.8} aria-hidden="true" />,
  expand: <Maximize2 size={16} strokeWidth={1.8} aria-hidden="true" />,
  collapse: <Minimize2 size={16} strokeWidth={1.8} aria-hidden="true" />,
  refresh: <RotateCw size={16} strokeWidth={1.8} aria-hidden="true" />,
  external: <ExternalLink size={16} strokeWidth={1.8} aria-hidden="true" />,
  download: <Download size={16} strokeWidth={1.8} aria-hidden="true" />,
  printer: <Printer size={16} strokeWidth={1.8} aria-hidden="true" />,
  fileText: <FileText size={16} strokeWidth={1.8} aria-hidden="true" />,
  messageSquare: <MessageSquare size={16} strokeWidth={1.8} aria-hidden="true" />,
  cpu: <Cpu size={16} strokeWidth={1.8} aria-hidden="true" />,
  barChart: <BarChart3 size={16} strokeWidth={1.8} aria-hidden="true" />,
  send: <Send size={16} strokeWidth={1.8} aria-hidden="true" />,
  sparkles: <Sparkles size={16} strokeWidth={1.8} aria-hidden="true" />,
  users: <Users size={16} strokeWidth={1.8} aria-hidden="true" />,
  clock: <Clock size={16} strokeWidth={1.8} aria-hidden="true" />,
  chevronLeft: <ChevronLeft size={16} strokeWidth={1.8} aria-hidden="true" />,
  chevronRight: <ChevronRight size={16} strokeWidth={1.8} aria-hidden="true" />,
  calendar: <Calendar size={16} strokeWidth={1.8} aria-hidden="true" />,
  chevronDown: <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />,
};

export {
  CheckSquare,
  Layers,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Download,
  Printer,
  FileText,
  MessageSquare,
  Cpu,
  BarChart3,
  Send,
  Sparkles,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
};
