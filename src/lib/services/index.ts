import { INDUSTRY_USE_CASES, MOCK_AGENTS, MOCK_CALLS, MOCK_CAMPAIGNS, MOCK_VOICES } from './mockData';
import { Agent, CallRecord, Campaign, IndustryUseCase, Voice } from './types';

export * from './types';
export * from './mockData';

// Voice Services
export async function getVoices(): Promise<Voice[]> {
  return MOCK_VOICES;
}

export async function getVoiceById(id: string): Promise<Voice | undefined> {
  return MOCK_VOICES.find((v) => v.id === id);
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
