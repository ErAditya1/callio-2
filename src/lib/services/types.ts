export type AgentCategory = 
  | 'receptionist'
  | 'appointment_setter'
  | 'sales'
  | 'lead_qualification'
  | 'customer_support'
  | 'real_estate'
  | 'healthcare'
  | 'education';

export interface Agent {
  id: string;
  name: string;
  role: string;
  category: AgentCategory;
  description: string;
  avatar: string;
  voiceId: string;
  voiceName: string;
  language: string;
  accent: string;
  gender: 'Female' | 'Male';
  status: 'live' | 'draft' | 'paused';
  channels: ('phone' | 'web' | 'campaign')[];
  phoneNumbers?: string[];
  firstMessage: string;
  systemPrompt: string;
  skills: string[];
  metrics: {
    totalCalls: number;
    callsToday: number;
    avgDurationSec: number;
    successRate: number; // percentage, e.g. 92
    sentimentScore: number; // 1-100
  };
  sampleScenarios: {
    title: string;
    description: string;
    previewTranscript: { speaker: 'ai' | 'customer'; text: string }[];
  }[];
}

export interface Voice {
  id: string;
  name: string;
  accent: string;
  language: string;
  gender: 'Female' | 'Male';
  age: 'Young' | 'Middle-Aged' | 'Mature';
  style: string[]; // e.g. ["Warm", "Confident", "Professional"]
  useCase: string; // e.g. "Customer Support & Booking"
  avatar: string;
  provider: 'CallioAI Native' | 'Cartesia' | 'ElevenLabs';
  audioSampleUrl: string;
  scenarios: {
    label: string;
    audioUrl: string;
    script: string;
  }[];
}

export interface CallRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  agentId: string;
  agentName: string;
  agentAvatar: string;
  direction: 'inbound' | 'outbound';
  startedAt: string;
  durationSec: number;
  outcome: 'Appointment Booked' | 'Lead Qualified' | 'Resolved FAQ' | 'Transferred to Human' | 'Follow-up Scheduled' | 'Voicemail';
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  summary: string;
  intent: string;
  actionItems: string[];
  extractedData: Record<string, string>;
  transcript: {
    timestamp: string;
    speaker: 'ai' | 'customer';
    text: string;
  }[];
  recordingUrl?: string;
}

export interface Campaign {
  id: string;
  name: string;
  agentId: string;
  agentName: string;
  status: 'running' | 'completed' | 'scheduled' | 'paused';
  createdAt: string;
  scheduledTime?: string;
  funnel: {
    contacts: number;
    callsPlaced: number;
    connected: number;
    qualified: number;
    appointmentsBooked: number;
  };
  conversionRate: number;
  avgDurationSec: number;
}

export interface IndustryUseCase {
  slug: string;
  title: string;
  industry: string;
  headline: string;
  subheadline: string;
  painPoints: string[];
  aiSolutions: string[];
  recommendedAgentCategory: AgentCategory;
  roiStats: { label: string; value: string; description: string }[];
  exampleScript: { speaker: 'ai' | 'customer'; text: string }[];
}
