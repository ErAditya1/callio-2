import { INDUSTRY_USE_CASES, MOCK_AGENTS, MOCK_CALLS, MOCK_CAMPAIGNS, MOCK_VOICES } from './mockData';
import { Agent, ApiVoice, ApiVoicesResponse, CallRecord, Campaign, IndustryUseCase, Voice } from './types';

export * from './types';
export * from './mockData';

const BACKEND_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BACKEND_URL) ||
  'http://localhost:8000';

/** Map a dograh ApiVoice into the frontend Voice shape. */
function apiVoiceToVoice(v: ApiVoice, provider: string): Voice {
  const capitalize = (s?: string | null) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  const rawGender = (v.gender || 'female').toLowerCase();
  const gender: 'Female' | 'Male' = rawGender === 'male' ? 'Male' : 'Female';

  const accentLabel = capitalize(v.accent) || 'Neutral';
  const langLabel = v.language || 'en';

  return {
    id: v.voice_id,
    name: v.name,
    accent: `${accentLabel} (${langLabel.toUpperCase()})`,
    language: langLabel,
    gender,
    age: 'Middle-Aged',
    style: v.description
      ? v.description.split(/[,.]/).slice(0, 3).map((s) => s.trim()).filter(Boolean)
      : ['Professional'],
    useCase: v.description || 'Conversational AI voice',
    avatar: '',
    provider: provider as Voice['provider'],
    audioSampleUrl: v.preview_url || '',
    scenarios: [],
  };
}

// Voice Services
export async function getVoices(): Promise<Voice[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/user/configurations/voices/default`,
      { cache: 'no-store' },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ApiVoicesResponse = await res.json();
    if (Array.isArray(data.voices) && data.voices.length > 0) {
      return data.voices.map((v) => apiVoiceToVoice(v, data.provider));
    }
  } catch (err) {
    console.warn('[voices] API fetch failed, using mock data:', err);
  }
  return MOCK_VOICES;
}

export async function getVoiceById(id: string): Promise<Voice | undefined> {
  const all = await getVoices();
  return all.find((v) => v.id === id);
}

// Agent Services
export async function getAgents(): Promise<Agent[]> {
  return MOCK_AGENTS;
}

export async function getAgentById(id: string): Promise<Agent | undefined> {
  return MOCK_AGENTS.find((a) => a.id === id);
}

export async function createAgent(agentData: Partial<Agent>): Promise<Agent> {
  const newAgent: Agent = {
    id: `agent-${Date.now()}`,
    name: agentData.name || 'Custom CallioAI Agent',
    role: agentData.role || 'Virtual Phone Specialist',
    category: agentData.category || 'receptionist',
    description: agentData.description || 'Automated customer call agent.',
    avatar: agentData.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    voiceId: agentData.voiceId || 'voice-sarah',
    voiceName: agentData.voiceName || 'Sarah',
    language: agentData.language || 'English (US)',
    accent: agentData.accent || 'American',
    gender: agentData.gender || 'Female',
    status: 'live',
    channels: agentData.channels || ['phone', 'web'],
    phoneNumbers: agentData.phoneNumbers || ['+1 (888) 550-2010'],
    firstMessage: agentData.firstMessage || 'Hello! Thank you for calling. How can I help you today?',
    systemPrompt: agentData.systemPrompt || 'You are a polite, helpful AI representative.',
    skills: agentData.skills || ['24/7 Answering', 'Intent Recognition'],
    metrics: {
      totalCalls: 0,
      callsToday: 0,
      avgDurationSec: 0,
      successRate: 100,
      sentimentScore: 100
    },
    sampleScenarios: []
  };

  MOCK_AGENTS.unshift(newAgent);
  return newAgent;
}

// Call Services
export async function getCalls(): Promise<CallRecord[]> {
  return MOCK_CALLS;
}

export async function getCallById(id: string): Promise<CallRecord | undefined> {
  return MOCK_CALLS.find((c) => c.id === id);
}

// Campaign Services
export async function getCampaigns(): Promise<Campaign[]> {
  return MOCK_CAMPAIGNS;
}

// Use Cases Services
export async function getUseCases(): Promise<IndustryUseCase[]> {
  return INDUSTRY_USE_CASES;
}

export async function getUseCaseBySlug(slug: string): Promise<IndustryUseCase | undefined> {
  return INDUSTRY_USE_CASES.find((u) => u.slug === slug);
}
