export type DashboardRangePreset = 'today' | '7d' | '30d' | '90d' | 'custom';

export interface KpiComparison {
  total_calls_change_pct?: number | null;
  connected_calls_change_pct?: number | null;
  talk_time_change_pct?: number | null;
  success_rate_change_pct?: number | null;
}

export interface DashboardOverviewKpi {
  total_calls: number;
  connected_calls: number;
  successful_calls: number;
  talk_time_seconds: number;
  success_rate_pct: number;
  connected_rate_pct: number;
  total_spend_usd: number;
  wallet_balance_usd: number;
  active_calls: number;
  subscription_tier: string;
  subscription_status: string;
  comparison: KpiComparison;
}

export interface CallActivityPoint {
  timestamp: string;
  label: string;
  total_calls: number;
  connected_calls: number;
  successful_calls: number;
}

export interface AgentPerformanceItem {
  id: number;
  name: string;
  status: string;
  total_calls: number;
  successful_calls: number;
  success_rate_pct: number;
  talk_time_seconds: number;
}

export interface CampaignSummaryItem {
  id: number;
  name: string;
  workflow_id: number;
  workflow_name?: string | null;
  state: string;
  total_rows: number;
  processed_rows: number;
  failed_rows: number;
  progress_pct: number;
  updated_at?: string | null;
}

export interface RecentCallItem {
  id: number;
  contact: string;
  agent_id: number;
  agent_name: string;
  duration_seconds: number;
  outcome: string;
  call_type: string;
  state: string;
  created_at: string;
}

export interface UsageSummary {
  total_duration_minutes: number;
  estimated_spend_usd: number;
  monthly_minutes_used: number;
  monthly_minutes_limit?: number | null;
  wallet_balance_usd: number;
  subscription_tier: string;
  active_concurrent_calls: number;
}

export interface AttentionItem {
  id: string;
  severity: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  cta_text: string;
  cta_href: string;
}

export interface DashboardOverviewResponse {
  range_preset: DashboardRangePreset;
  timezone: string;
  period_start: string;
  period_end: string;
  overview: DashboardOverviewKpi;
  call_activity: CallActivityPoint[];
  agent_performance: AgentPerformanceItem[];
  campaigns: CampaignSummaryItem[];
  recent_calls: RecentCallItem[];
  usage: UsageSummary;
  attention_items: AttentionItem[];
  last_updated: string;
}
