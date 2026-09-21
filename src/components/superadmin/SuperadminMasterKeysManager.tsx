'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CircleCheckIcon,
  CpuIcon,
  Delete02Icon,
  Dollar01Icon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  Key01Icon,
  Loading02Icon,
  Mic01Icon,
  PlusIcon,
  SparklesIcon,
  StarIcon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";;
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { VoiceSelector } from '@/components/VoiceSelector';
import { VoiceSelectorModal } from '@/components/VoiceSelectorModal';
interface MasterKey {
  id: number;
  service_type: 'llm' | 'stt' | 'tts';
  provider: string;
  api_key: string;
  is_default: boolean;
  default_model?: string;
  default_voice?: string;
  is_active: boolean;
  models_pricing: Record<string, any>;
  created_at: string;
  updated_at: string;
}

interface ProviderOption {
  value: string;
  label: string;
  models: string[];
  voices?: string[];
  default_voice?: string;
  docsUrl?: string;
  docs_url?: string;
}

// Fallback provider list containing providers with platform engine implementation
export const FALLBACK_PROVIDERS_MAP: Record<'llm' | 'stt' | 'tts', ProviderOption[]> = {
  llm: [
    {
      value: 'openai',
      label: 'OpenAI',
      models: ['gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano', 'gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-3.5-turbo'],
      docsUrl: 'https://platform.openai.com/docs',
    },
    {
      value: 'atlascloud',
      label: 'Atlas Cloud',
      models: ['qwen/qwen3.5-flash', 'deepseek-ai/deepseek-v4-pro'],
      docsUrl: 'https://atlascloud.ai',
    },
    {
      value: 'google',
      label: 'Google Gemini',
      models: ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'],
      docsUrl: 'https://ai.google.dev/docs',
    },
    {
      value: 'google_vertex',
      label: 'Google Vertex AI',
      models: ['gemini-3.5-flash', 'gemini-2.5-flash'],
      docsUrl: 'https://cloud.google.com/vertex-ai',
    },
    {
      value: 'groq',
      label: 'Groq',
      models: [
        'openai/gpt-oss-120b',
        'llama-3.1-8b-instant',
        'deepseek-r1-distill-llama-70b',
        'qwen-qwq-32b',
        'meta-llama/llama-4-scout-17b-16e-instruct',
        'meta-llama/llama-4-maverick-17b-128e-instruct',
        'gemma2-9b-it',
      ],
      docsUrl: 'https://console.groq.com/docs',
    },
    {
      value: 'openrouter',
      label: 'OpenRouter',
      models: [
        'openai/gpt-4.1',
        'openai/gpt-4.1-mini',
        'anthropic/claude-sonnet-4',
        'google/gemini-2.5-flash',
        'meta-llama/llama-3.3-70b-instruct',
        'deepseek/deepseek-chat-v3-0324',
      ],
      docsUrl: 'https://openrouter.ai/docs',
    },
    {
      value: 'azure',
      label: 'Azure OpenAI',
      models: ['gpt-4.1-mini', 'gpt-4.1'],
      docsUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/',
    },
    {
      value: 'aws_bedrock',
      label: 'AWS Bedrock',
      models: [
        'us.amazon.nova-pro-v1:0',
        'us.amazon.nova-lite-v1:0',
        'us.amazon.nova-micro-v1:0',
        'us.anthropic.claude-sonnet-4-20250514-v1:0',
        'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
        'us.anthropic.claude-haiku-4-5-20251001-v1:0',
      ],
      docsUrl: 'https://docs.aws.amazon.com/bedrock/',
    },
    {
      value: 'speaches',
      label: 'Local Models (Speaches)',
      models: ['llama3', 'mistral', 'phi3', 'qwen2', 'gemma2'],
      docsUrl: 'https://github.com/speaches-ai/speaches',
    },
    {
      value: 'huggingface',
      label: 'Hugging Face',
      models: ['openai/gpt-oss-120b:cerebras', 'deepseek-ai/DeepSeek-R1:fastest'],
      docsUrl: 'https://huggingface.co/docs/inference-providers/en/index',
    },
    {
      value: 'minimax',
      label: 'MiniMax',
      models: ['MiniMax-M2.7', 'MiniMax-M2.7-highspeed', 'MiniMax-M3'],
      docsUrl: 'https://api.minimax.io',
    },
    {
      value: 'sarvam',
      label: 'Sarvam AI',
      models: ['sarvam-105b', 'sarvam-2b'],
      docsUrl: 'https://sarvam.ai',
    },
  ],
  tts: [
    {
      value: 'cartesia',
      label: 'Cartesia',
      models: ['sonic-3.6', 'sonic-3.5', 'sonic-3'],
      docsUrl: 'https://play.cartesia.ai',
    },
    {
      value: 'elevenlabs',
      label: 'ElevenLabs',
      models: ['eleven_flash_v2_5', 'eleven_multilingual_v2'],
      docsUrl: 'https://elevenlabs.io/docs',
    },
    {
      value: 'deepgram',
      label: 'Deepgram',
      models: ['aura-2', 'aura-1'],
      docsUrl: 'https://developers.deepgram.com',
    },
    {
      value: 'google',
      label: 'Google Cloud TTS',
      models: ['chirp_3_hd'],
      docsUrl: 'https://cloud.google.com/text-to-speech',
    },
    {
      value: 'openai',
      label: 'OpenAI TTS',
      models: ['gpt-4o-mini-tts'],
      docsUrl: 'https://platform.openai.com/docs/guides/text-to-speech',
    },
    {
      value: 'inworld',
      label: 'Inworld AI',
      models: ['inworld-tts-2'],
      docsUrl: 'https://docs.inworld.ai/tts/tts',
    },
    {
      value: 'sarvam',
      label: 'Sarvam AI',
      models: ['bulbul:v2', 'bulbul:v3'],
      docsUrl: 'https://sarvam.ai',
    },
    {
      value: 'camb',
      label: 'Camb.ai',
      models: ['mars-flash', 'mars-pro', 'mars-instruct'],
      docsUrl: 'https://camb.ai',
    },
    {
      value: 'rime',
      label: 'Rime AI',
      models: ['arcana', 'mistv3', 'mistv2', 'mist'],
      docsUrl: 'https://rime.ai',
    },
    {
      value: 'speaches',
      label: 'Local Models (Speaches)',
      models: ['kokoro', 'hexgrad/Kokoro-82M'],
      docsUrl: 'https://github.com/speaches-ai/speaches',
    },
    {
      value: 'minimax',
      label: 'MiniMax',
      models: ['speech-2.8-hd', 'speech-2.8-turbo'],
      docsUrl: 'https://api.minimax.io',
    },
    {
      value: 'azure_speech',
      label: 'Azure Speech Services',
      models: ['neural'],
      docsUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/',
    },
    {
      value: 'smallest',
      label: 'Smallest AI',
      models: ['lightning_v3.1', 'lightning_v3.1_pro'],
      docsUrl: 'https://smallest.ai/docs',
    },
    {
      value: 'xai',
      label: 'xAI',
      models: ['xai-tts'],
      docsUrl: 'https://x.ai',
    },
    {
      value: 'lmnt',
      label: 'LMNT',
      models: ['aurora', 'blizzard'],
      docsUrl: 'https://lmnt.com',
    },
    {
      value: 'rumik',
      label: 'Rumik AI',
      models: ['mulberry', 'muga'],
      docsUrl: 'https://silk-api.rumik.ai',
    },
  ],
  stt: [
    {
      value: 'deepgram',
      label: 'Deepgram',
      models: ['nova-3-general', 'nova-3-medical', 'flux-general-en', 'flux-general-multi'],
      docsUrl: 'https://developers.deepgram.com',
    },
    {
      value: 'cartesia',
      label: 'Cartesia',
      models: ['ink-whisper', 'ink-2'],
      docsUrl: 'https://play.cartesia.ai',
    },
    {
      value: 'openai',
      label: 'OpenAI Whisper',
      models: ['gpt-4o-transcribe'],
      docsUrl: 'https://platform.openai.com/docs',
    },
    {
      value: 'google',
      label: 'Google Cloud STT',
      models: ['latest_long'],
      docsUrl: 'https://cloud.google.com/speech-to-text',
    },
    {
      value: 'elevenlabs',
      label: 'ElevenLabs Scribe',
      models: ['scribe_v2_realtime'],
      docsUrl: 'https://elevenlabs.io/docs',
    },
    {
      value: 'azure_speech',
      label: 'Azure Speech Services',
      models: ['latest_long', 'latest_short'],
      docsUrl: 'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/',
    },
    {
      value: 'assemblyai',
      label: 'AssemblyAI',
      models: ['u3-rt-pro'],
      docsUrl: 'https://www.assemblyai.com/docs',
    },
    {
      value: 'gladia',
      label: 'Gladia',
      models: ['solaria-1'],
      docsUrl: 'https://docs.gladia.io',
    },
    {
      value: 'speechmatics',
      label: 'Speechmatics',
      models: ['enhanced', 'standard'],
      docsUrl: 'https://docs.speechmatics.com',
    },
    {
      value: 'sarvam',
      label: 'Sarvam AI',
      models: ['saarika:v2.5', 'saaras:v3'],
      docsUrl: 'https://sarvam.ai',
    },
    {
      value: 'speaches',
      label: 'Local Models (Speaches)',
      models: ['Systran/faster-distil-whisper-small.en', 'Systran/faster-whisper-large-v3'],
      docsUrl: 'https://github.com/speaches-ai/speaches',
    },
    {
      value: 'huggingface',
      label: 'Hugging Face ASR',
      models: ['openai/whisper-large-v3-turbo', 'openai/whisper-large-v3'],
      docsUrl: 'https://huggingface.co/docs/inference-providers/en/index',
    },
    {
      value: 'smallest',
      label: 'Smallest AI (Pulse)',
      models: ['pulse'],
      docsUrl: 'https://smallest.ai/docs',
    },
  ],
};

export function SuperadminMasterKeysManager() {
  const [keys, setKeys] = useState<MasterKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [visibleKeyIds, setVisibleKeyIds] = useState<Record<number, boolean>>({});

  // Dynamic Providers loaded from backend engine registry
  const [dynamicProviders, setDynamicProviders] = useState<{
    llm: ProviderOption[];
    stt: ProviderOption[];
    tts: ProviderOption[];
  } | null>(null);
  const [dynamicLoading, setDynamicLoading] = useState(false);

  // Form State
  const [serviceType, setServiceType] = useState<'llm' | 'stt' | 'tts'>('llm');
  const [provider, setProvider] = useState('');
  const [defaultModel, setDefaultModel] = useState('');
  const [defaultVoice, setDefaultVoice] = useState('');
  const [editingVoiceKey, setEditingVoiceKey] = useState<MasterKey | null>(null);
  const [newVoiceValue, setNewVoiceValue] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [pricingJson, setPricingJson] = useState('{\n  "default": 0.01\n}');
  const [activeTab, setActiveTab] = useState<'all' | 'llm' | 'stt' | 'tts'>('all');

  // Dynamic visual model rates state
  const [modelRates, setModelRates] = useState<Record<string, number>>({});
  const [defaultRate, setDefaultRate] = useState<number>(0.01);
  const [customModelName, setCustomModelName] = useState('');
  const [customModelRate, setCustomModelRate] = useState('0.01');
  const [showRawJson, setShowRawJson] = useState(false);

  const { user, getAccessToken } = useAuth();

  // Load platform master keys
  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await fetch('/api/v1/superuser/platform/master-keys', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      toast.error('Failed to load platform master keys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  // Dynamically load all platform configured providers directly from the backend engine registry
  const fetchDynamicProviders = useCallback(async () => {
    if (!user) return;
    try {
      setDynamicLoading(true);
      const token = await getAccessToken();
      const res = await fetch('/api/v1/superuser/platform/providers-registry', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (res.ok) {
        const data = await res.json();
        setDynamicProviders({
          llm: Array.isArray(data?.llm) && data.llm.length > 0 ? data.llm : FALLBACK_PROVIDERS_MAP.llm,
          stt: Array.isArray(data?.stt) && data.stt.length > 0 ? data.stt : FALLBACK_PROVIDERS_MAP.stt,
          tts: Array.isArray(data?.tts) && data.tts.length > 0 ? data.tts : FALLBACK_PROVIDERS_MAP.tts,
        });
      } else {
        // Fallback to verified platform implementations if endpoint fails
        setDynamicProviders(FALLBACK_PROVIDERS_MAP);
      }
    } catch (err) {
      console.warn('Backend provider registry not reachable, using platform implementations fallback', err);
      setDynamicProviders(FALLBACK_PROVIDERS_MAP);
    } finally {
      setDynamicLoading(false);
    }
  }, [user, getAccessToken]);

  useEffect(() => {
    fetchKeys();
    fetchDynamicProviders();
  }, [fetchKeys, fetchDynamicProviders]);

  // Active providers for current service type directly from backend or fallback
  const activeProviders = useMemo<ProviderOption[]>(() => {
    if (dynamicProviders && dynamicProviders[serviceType]?.length > 0) {
      return dynamicProviders[serviceType];
    }
    return FALLBACK_PROVIDERS_MAP[serviceType] || [];
  }, [dynamicProviders, serviceType]);

  const currentProviderOption = useMemo(() => {
    return activeProviders.find((p) => p.value === provider);
  }, [activeProviders, provider]);

  const availableModelsForDefault = useMemo(() => {
    const modelsFromOption = currentProviderOption?.models || [];
    const modelsFromRates = Object.keys(modelRates).filter((m) => m !== 'default');
    return Array.from(new Set([...modelsFromOption, ...modelsFromRates]));
  }, [currentProviderOption, modelRates]);

  const availableVoicesForDefault = useMemo(() => {
    if (serviceType !== 'tts') return [];
    return currentProviderOption?.voices || [];
  }, [serviceType, currentProviderOption]);

  // Initialize model rates inputs whenever a provider is selected
  const initPricingForProvider = useCallback((
    prov: string,
    optionsList: ProviderOption[],
    currentType: 'llm' | 'stt' | 'tts' = serviceType
  ) => {
    const found = optionsList.find((p) => p.value === prov);
    const initialRates: Record<string, number> = {};
    if (found && found.models && found.models.length > 0) {
      found.models.forEach((m) => {
        initialRates[m] = 0.01;
      });
      setDefaultModel(found.models[0] || '');
    } else {
      setDefaultModel('');
    }

    if (currentType === 'tts') {
      if (found && found.voices && found.voices.length > 0) {
        setDefaultVoice(found.default_voice || found.voices[0]);
      } else {
        setDefaultVoice(found?.default_voice || '');
      }
    } else {
      setDefaultVoice('');
    }

    const def = 0.01;
    setDefaultRate(def);
    setModelRates(initialRates);
    const fullJson = { ...initialRates, default: def };
    setPricingJson(JSON.stringify(fullJson, null, 2));
  }, [serviceType]);

  // When dynamicProviders load or serviceType changes, auto-select first available provider
  useEffect(() => {
    if (activeProviders.length > 0) {
      const exists = activeProviders.some((p) => p.value === provider);
      if (!exists || !provider) {
        const first = activeProviders[0].value;
        setProvider(first);
        initPricingForProvider(first, activeProviders, serviceType);
      }
    }
  }, [activeProviders, provider, serviceType, initPricingForProvider]);

  const handleServiceTypeChange = (type: 'llm' | 'stt' | 'tts') => {
    setServiceType(type);
    const providersList =
      dynamicProviders && dynamicProviders[type]?.length > 0
        ? dynamicProviders[type]
        : FALLBACK_PROVIDERS_MAP[type] || [];
    const firstOption = providersList[0]?.value || '';
    setProvider(firstOption);
    if (firstOption) {
      initPricingForProvider(firstOption, providersList, type);
    } else {
      setModelRates({});
      setDefaultVoice('');
      setPricingJson('{\n  "default": 0.01\n}');
    }
  };

  const handleProviderChange = (prov: string) => {
    setProvider(prov);
    initPricingForProvider(prov, activeProviders, serviceType);
    const found = activeProviders.find((p) => p.value === prov);
    if (serviceType === 'tts') {
      setDefaultVoice(found?.default_voice || (found?.voices && found.voices[0]) || '');
    }
  };

  const handleModelRateChange = (model: string, newRateStr: string) => {
    const rate = parseFloat(newRateStr);
    const updatedRates = {
      ...modelRates,
      [model]: isNaN(rate) ? 0 : rate,
    };
    setModelRates(updatedRates);
    const fullJson = { ...updatedRates, default: defaultRate };
    setPricingJson(JSON.stringify(fullJson, null, 2));
  };

  const handleDefaultRateChange = (newDefaultStr: string) => {
    const rate = parseFloat(newDefaultStr);
    const def = isNaN(rate) ? 0 : rate;
    setDefaultRate(def);
    const fullJson = { ...modelRates, default: def };
    setPricingJson(JSON.stringify(fullJson, null, 2));
  };

  const handleRemoveModelRate = (model: string) => {
    const updated = { ...modelRates };
    delete updated[model];
    setModelRates(updated);
    const fullJson = { ...updated, default: defaultRate };
    setPricingJson(JSON.stringify(fullJson, null, 2));
  };

  const handleAddCustomModel = () => {
    const trimmed = customModelName.trim();
    if (!trimmed) return;
    const rate = parseFloat(customModelRate) || defaultRate;
    const updated = {
      ...modelRates,
      [trimmed]: rate,
    };
    setModelRates(updated);
    const fullJson = { ...updated, default: defaultRate };
    setPricingJson(JSON.stringify(fullJson, null, 2));
    setCustomModelName('');
  };

  const handleRawJsonChange = (val: string) => {
    setPricingJson(val);
    try {
      const parsed = JSON.parse(val);
      if (typeof parsed === 'object' && parsed !== null) {
        if (typeof parsed['default'] === 'number') {
          setDefaultRate(parsed['default']);
        }
        const specific: Record<string, number> = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (k !== 'default' && typeof v === 'number') {
            specific[k] = v;
          }
        }
        setModelRates(specific);
      }
    } catch {}
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }

    let parsedPricing = {};
    try {
      parsedPricing = JSON.parse(pricingJson);
    } catch {
      toast.error('Models pricing must be valid JSON');
      return;
    }

    const resolvedProvider = provider.toLowerCase().trim();
    if (!resolvedProvider) {
      toast.error('Provider name is required');
      return;
    }

    setSubmitting(true);
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/v1/superuser/platform/master-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          service_type: serviceType,
          provider: resolvedProvider,
          api_key: apiKey.trim(),
          is_default: isDefault,
          default_model: defaultModel.trim() || undefined,
          default_voice: serviceType === 'tts' ? (defaultVoice.trim() || undefined) : undefined,
          is_active: true,
          models_pricing: parsedPricing,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to add master key');
      }

      toast.success(`Platform master key for ${resolvedProvider.toUpperCase()} saved!`);
      setModalOpen(false);
      setApiKey('');
      setIsDefault(false);
      setDefaultModel('');
      setDefaultVoice('');
      await fetchKeys();
    } catch (err: any) {
      toast.error(err.message || 'Error adding master key');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefaultModel = async (key: MasterKey, newModel: string) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/superuser/platform/master-keys/${key.id}/default-model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ default_model: newModel }),
      });
      if (!res.ok) throw new Error('Failed to update default model');
      toast.success(`${key.provider.toUpperCase()} default model set to ${newModel}`);
      await fetchKeys();
    } catch (err: any) {
      toast.error(err.message || 'Error updating default model');
    }
  };

  const handleSetDefaultVoice = async (key: MasterKey, voiceVal: string) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/superuser/platform/master-keys/${key.id}/default-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ default_voice: voiceVal.trim() }),
      });
      if (!res.ok) throw new Error('Failed to update default voice');
      toast.success(`${key.provider.toUpperCase()} default voice updated to ${voiceVal}`);
      setEditingVoiceKey(null);
      await fetchKeys();
    } catch (err: any) {
      toast.error(err.message || 'Error updating default voice');
    }
  };

  const handleSetDefault = async (key: MasterKey) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/superuser/platform/master-keys/${key.id}/set-default`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        throw new Error('Failed to set as default');
      }
      toast.success(`${key.provider.toUpperCase()} is now default for ${key.service_type.toUpperCase()}`);
      await fetchKeys();
    } catch (err: any) {
      toast.error(err.message || 'Error updating default provider');
    }
  };

  const handleToggleActive = async (key: MasterKey) => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/superuser/platform/master-keys/${key.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          is_active: !key.is_active,
        }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      toast.success(`${key.provider.toUpperCase()} ${!key.is_active ? 'activated' : 'deactivated'}`);
      await fetchKeys();
    } catch (err: any) {
      toast.error(err.message || 'Error updating key status');
    }
  };

  const handleDelete = async (id: number, providerName: string) => {
    if (!confirm(`Are you sure you want to delete the platform master key for ${providerName}?`)) {
      return;
    }

    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/superuser/platform/master-keys/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error('Failed to delete key');
      toast.success(`Master key deleted`);
      await fetchKeys();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting key');
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'llm':
        return <HugeiconsIcon icon={CpuIcon} className="h-4 w-4 text-purple-500" />;
      case 'stt':
        return <HugeiconsIcon icon={Mic01Icon} className="h-4 w-4 text-emerald-500" />;
      case 'tts':
        return <HugeiconsIcon icon={VolumeHighIcon} className="h-4 w-4 text-blue-500" />;
      default:
        return <HugeiconsIcon icon={Key01Icon} className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredKeys = keys.filter(
    (k) => activeTab === 'all' || k.service_type === activeTab
  );

  const maskKey = (key: string, id: number) => {
    if (visibleKeyIds[id]) return key;
    if (!key || key.length < 8) return '••••••••••••';
    return `${key.slice(0, 4)}••••••••••••${key.slice(-4)}`;
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HugeiconsIcon icon={Key01Icon} className="h-5 w-5" />
            </span>
            <CardTitle className="text-xl">Platform Master API Keys &amp; Model Pricing</CardTitle>
          </div>
          <CardDescription>
            Configure database-backed master credentials for LLM, Voice (TTS), and Transcriber (STT) services. New users can immediately run voice agents without providing BYOK credentials.
          </CardDescription>
        </div>
        <Button
          onClick={() => {
            fetchDynamicProviders();
            if (activeProviders.length > 0) {
              const currentProv = provider || activeProviders[0].value;
              setProvider(currentProv);
              initPricingForProvider(currentProv, activeProviders);
            }
            setModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
        >
          <HugeiconsIcon icon={PlusIcon} className="h-4 w-4 mr-2" /> Add Master Provider Key
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Type Tabs */}
        <div className="flex items-center justify-between border-b pb-3 text-sm">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('all')}
              className="h-8 text-xs"
            >
              All Providers ({keys.length})
            </Button>
            <Button
              variant={activeTab === 'llm' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('llm')}
              className="h-8 text-xs gap-1.5"
            >
              <HugeiconsIcon icon={CpuIcon} className="h-3.5 w-3.5 text-purple-500" /> LLM ({keys.filter((k) => k.service_type === 'llm').length})
            </Button>
            <Button
              variant={activeTab === 'stt' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('stt')}
              className="h-8 text-xs gap-1.5"
            >
              <HugeiconsIcon icon={Mic01Icon} className="h-3.5 w-3.5 text-emerald-500" /> Transcribers STT ({keys.filter((k) => k.service_type === 'stt').length})
            </Button>
            <Button
              variant={activeTab === 'tts' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('tts')}
              className="h-8 text-xs gap-1.5"
            >
              <HugeiconsIcon icon={VolumeHighIcon} className="h-3.5 w-3.5 text-blue-500" /> Voices TTS ({keys.filter((k) => k.service_type === 'tts').length})
            </Button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon icon={SparklesIcon} className="h-3.5 w-3.5 text-emerald-500" />
            Registry-synced pipeline engine
          </div>
        </div>

        {/* Master Keys Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
            <HugeiconsIcon icon={Loading02Icon} className="h-5 w-5 animate-spin mr-2" /> Loading platform master keys...
          </div>
        ) : filteredKeys.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center bg-muted/20">
            <HugeiconsIcon icon={Key01Icon} className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium">No Master Keys Configured</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Add master API keys so your users can immediately make test and production calls without adding their own BYOK credentials.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredKeys.map((k) => (
              <div
                key={k.id}
                className="flex flex-col justify-between p-4 rounded-xl border bg-card/60 hover:bg-card/90 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(k.service_type)}
                      <span className="font-semibold text-base uppercase tracking-wider">{k.provider}</span>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {k.service_type}
                      </Badge>
                      {k.is_default && (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] gap-1">
                          <HugeiconsIcon icon={StarIcon} className="h-3 w-3 fill-amber-500" /> Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {k.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <Switch
                        checked={k.is_active}
                        onCheckedChange={() => handleToggleActive(k)}
                      />
                    </div>
                  </div>

                  {/* API Key Display */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded bg-muted/40 text-xs font-mono mb-2">
                    <span className="truncate">{maskKey(k.api_key, k.id)}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleKeyIds((prev) => ({
                          ...prev,
                          [k.id]: !prev[k.id],
                        }))
                      }
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      {visibleKeyIds[k.id] ? <HugeiconsIcon icon={EyeOffIcon} className="h-3.5 w-3.5" /> : <HugeiconsIcon icon={EyeIcon} className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {/* Default Model Display & Quick Switcher */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-xs mb-3">
                    <div className="flex items-center gap-1.5 truncate">
                      <HugeiconsIcon icon={StarIcon} className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                      <span className="font-semibold text-amber-800 dark:text-amber-300">Default Model:</span>
                      <span className="font-mono font-medium truncate text-foreground">
                        {k.default_model || Object.keys(k.models_pricing || {}).filter((m) => m !== 'default')[0] || 'auto'}
                      </span>
                    </div>
                    {Object.keys(k.models_pricing || {}).filter((m) => m !== 'default').length > 1 && (
                      <Select
                        value={k.default_model || ''}
                        onValueChange={(val) => handleSetDefaultModel(k, val)}
                      >
                        <SelectTrigger className="h-6 text-[10px] w-auto border-amber-500/30 bg-background/80 px-2 shrink-0">
                          <span className="text-[10px]">Change</span>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(k.models_pricing || {})
                            .filter((m) => m !== 'default')
                            .map((m) => (
                              <SelectItem key={m} value={m} className="text-xs font-mono">
                                {m}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  {/* Default Voice Display & Dynamic Selector for TTS (identical to /models-configuration) */}
                  {k.service_type === 'tts' && (
                    <div className="space-y-1.5 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs mb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-semibold text-blue-800 dark:text-blue-300">
                          <HugeiconsIcon icon={VolumeHighIcon} className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <span>Default Voice:</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[140px]" title={k.default_voice || 'auto'}>
                          {k.default_voice || 'auto'}
                        </span>
                      </div>
                      <VoiceSelector
                        provider={k.provider}
                        value={k.default_voice || ''}
                        onChange={(voiceId) => handleSetDefaultVoice(k, voiceId)}
                        model={k.default_model}
                        showFilters={true}
                        allowManualInput={true}
                      />
                    </div>
                  )}

                  {/* Pricing Matrix */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <HugeiconsIcon icon={Dollar01Icon} className="h-3 w-3" /> Configured Rates / Min
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(k.models_pricing || {}).map(([model, rate]) => {
                        const isThisDefault = model === (k.default_model || Object.keys(k.models_pricing || {}).filter((m) => m !== 'default')[0]);
                        return (
                          <span
                            key={model}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-mono ${
                              isThisDefault
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold'
                                : 'bg-background border-border text-muted-foreground'
                            }`}
                          >
                            <span className="font-medium text-foreground">{model}:</span>
                            <span>${typeof rate === 'object' ? rate.price_per_minute_usd : rate}/m</span>
                            {isThisDefault && (
                              <HugeiconsIcon icon={StarIcon} className="h-2.5 w-2.5 fill-amber-500 text-amber-500 ml-0.5" />
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-3 mt-1">
                  {!k.is_default ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(k)}
                      className="text-xs h-7 text-amber-600 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                    >
                      <HugeiconsIcon icon={StarIcon} className="h-3 w-3 mr-1" /> Set Default
                    </Button>
                  ) : (
                    <span className="inline-flex items-center text-xs text-muted-foreground gap-1">
                      <HugeiconsIcon icon={CircleCheckIcon} className="h-3.5 w-3.5 text-emerald-500" /> Active Platform Default
                    </span>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(k.id, k.provider)}
                    className="text-xs h-7 text-destructive hover:bg-destructive/10"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Dynamic Add Master Key Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleCreate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <HugeiconsIcon icon={Key01Icon} className="h-5 w-5 text-emerald-600" />
                Add Platform Master Provider Key
              </DialogTitle>
              <DialogDescription>
                Store encrypted master credentials in the database to power platform-managed voice pipelines. Providers and models load dynamically from the platform configuration registry.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Category</Label>
                <Select
                  value={serviceType}
                  onValueChange={(val: any) => handleServiceTypeChange(val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="llm">LLM (Language Model)</SelectItem>
                    <SelectItem value="stt">STT (Transcriber)</SelectItem>
                    <SelectItem value="tts">TTS (Voice Synthesis)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Provider</Label>
                  {dynamicLoading && (
                    <span className="text-[10px] text-muted-foreground animate-pulse">
                      Syncing...
                    </span>
                  )}
                </div>
                <Select value={provider} onValueChange={handleProviderChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {activeProviders.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(currentProviderOption?.docsUrl || currentProviderOption?.docs_url) && (
                  <a
                    href={currentProviderOption.docsUrl || currentProviderOption.docs_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:underline"
                  >
                    Documentation <HugeiconsIcon icon={ExternalLinkIcon} className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="defaultModel" className="flex items-center gap-1.5 font-medium">
                  <HugeiconsIcon icon={StarIcon} className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  Default Model for this Provider
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  Auto-selected default model for calls
                </span>
              </div>
              <Select value={defaultModel} onValueChange={(val) => setDefaultModel(val)}>
                <SelectTrigger id="defaultModel">
                  <SelectValue placeholder="Select default model..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {availableModelsForDefault.map((m) => (
                    <SelectItem key={m} value={m} className="font-mono text-xs">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {serviceType === 'tts' && (
              <div className="space-y-2 p-3 rounded-lg border border-blue-500/30 bg-blue-500/5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="defaultVoice" className="flex items-center gap-1.5 font-medium text-blue-900 dark:text-blue-300">
                    <HugeiconsIcon icon={VolumeHighIcon} className="h-4 w-4 text-blue-500" />
                    Default Voice for this Provider
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Loaded dynamically for {provider || 'selected provider'}
                  </span>
                </div>

                <VoiceSelector
                  provider={provider}
                  value={defaultVoice}
                  onChange={(voiceId) => setDefaultVoice(voiceId)}
                  model={defaultModel}
                  showFilters={true}
                  allowManualInput={true}
                />

                <p className="text-[11px] text-muted-foreground">
                  This voice will be automatically used for all calls synthesized via this master key.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="masterApiKey">Master API Key / Secret</Label>
              <Input
                id="masterApiKey"
                type="password"
                placeholder="sk-... / API Secret"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                className="font-mono text-sm"
              />
            </div>

            {/* Dynamic Models Pricing Section */}
            <div className="space-y-3 pt-1 border-t border-border/70">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4 text-emerald-500" />
                    Dynamic Models &amp; Pricing Matrix
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Per-minute rates deducted from customer wallet balances.
                  </p>
                </div>
                <Badge variant="outline" className="text-[11px] font-mono">
                  {Object.keys(modelRates).length} model{Object.keys(modelRates).length === 1 ? '' : 's'} configured
                </Badge>
              </div>

              {/* Dynamic Models List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1 border rounded-lg p-2.5 bg-muted/20">
                {Object.keys(modelRates).length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    No models configured yet. Add models below or use the default rate.
                  </p>
                ) : (
                  Object.entries(modelRates).map(([mName, mRate]) => (
                    <div
                      key={mName}
                      className={`flex items-center justify-between gap-2 p-1.5 rounded-md border text-xs transition-colors ${
                        mName === defaultModel
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-background'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
                        <span className="font-mono text-[11px] truncate font-medium text-foreground" title={mName}>
                          {mName}
                        </span>
                        {mName === defaultModel && (
                          <Badge className="text-[9px] py-0 px-1.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 gap-0.5 shrink-0">
                            <HugeiconsIcon icon={StarIcon} className="h-2.5 w-2.5 fill-amber-500" /> Default
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {mName !== defaultModel && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setDefaultModel(mName)}
                            className="h-6 text-[10px] px-1.5 text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10"
                            title="Set this model as default"
                          >
                            Set Default
                          </Button>
                        )}
                        <span className="text-muted-foreground text-xs">$</span>
                        <Input
                          type="number"
                          step="0.001"
                          min="0"
                          value={mRate}
                          onChange={(e) => handleModelRateChange(mName, e.target.value)}
                          className="w-20 h-7 text-xs font-mono text-right px-1.5 py-0"
                        />
                        <span className="text-[10px] text-muted-foreground">/min</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveModelRate(mName)}
                          className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Remove custom rate (falls back to default)"
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Custom Model row */}
              <div className="flex items-center gap-2 pt-1">
                <Input
                  placeholder="Add custom model identifier (e.g. gpt-4.5)..."
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  className="text-xs h-8 font-mono flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomModel();
                    }
                  }}
                />
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs text-muted-foreground">$</span>
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="Rate"
                    value={customModelRate}
                    onChange={(e) => setCustomModelRate(e.target.value)}
                    className="w-16 h-8 text-xs font-mono text-right px-1.5"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddCustomModel}
                    className="h-8 text-xs px-2.5"
                  >
                    <HugeiconsIcon icon={PlusIcon} className="h-3.5 w-3.5 mr-1" /> Add
                  </Button>
                </div>
              </div>

              {/* Default Fallback Rate */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border bg-amber-500/5 border-amber-500/20 text-xs">
                <div>
                  <span className="font-semibold text-foreground">Default Fallback Rate:</span>
                  <p className="text-[11px] text-muted-foreground">
                    Applied to any unlisted model called under this provider.
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    type="number"
                    step="0.001"
                    min="0"
                    value={defaultRate}
                    onChange={(e) => handleDefaultRateChange(e.target.value)}
                    className="w-20 h-7 text-xs font-mono text-right px-1.5 py-0"
                  />
                  <span className="text-[10px] text-muted-foreground">/min</span>
                </div>
              </div>

              {/* Toggle Raw JSON Map */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowRawJson(!showRawJson)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    {showRawJson ? 'Hide Raw JSON Map' : 'View / Edit Raw JSON Map'}
                  </button>
                  <span className="text-[10px] text-muted-foreground">Auto-synchronized</span>
                </div>
                {showRawJson && (
                  <Textarea
                    id="modelsPricing"
                    rows={4}
                    value={pricingJson}
                    onChange={(e) => handleRawJsonChange(e.target.value)}
                    className="font-mono text-xs"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1 border rounded-lg p-3 bg-muted/20">
              <Switch
                id="isDefaultKey"
                checked={isDefault}
                onCheckedChange={setIsDefault}
              />
              <div>
                <Label htmlFor="isDefaultKey" className="text-sm font-medium">
                  Set as Default Provider for {serviceType.toUpperCase()}
                </Label>
                <p className="text-xs text-muted-foreground">
                  New users with platform credits will automatically use this provider without configuration.
                </p>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                {submitting ? (
                  <>
                    <HugeiconsIcon icon={Loading02Icon} className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  'Save Master Key'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quick Voice Switcher Dialog */}
      <Dialog open={editingVoiceKey !== null} onOpenChange={(open) => !open && setEditingVoiceKey(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HugeiconsIcon icon={VolumeHighIcon} className="h-5 w-5 text-blue-500" />
              Update Default Voice ({editingVoiceKey?.provider?.toUpperCase()})
            </DialogTitle>
            <DialogDescription>
              Select or paste a voice ID to use for platform-synthesized voice calls with this master key.
            </DialogDescription>
          </DialogHeader>

          {editingVoiceKey && (
            <div className="space-y-3 py-2">
              <Label className="text-xs font-medium">Select Voice (Live Provider Catalog)</Label>
              <VoiceSelector
                provider={editingVoiceKey.provider}
                value={newVoiceValue}
                onChange={(val) => setNewVoiceValue(val)}
                model={editingVoiceKey.default_model}
                showFilters={true}
                allowManualInput={true}
              />
              <div className="p-2 rounded bg-muted/40 text-[11px] text-muted-foreground">
                Active ID: <span className="font-mono text-foreground">{newVoiceValue || 'none'}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditingVoiceKey(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!newVoiceValue.trim()}
              onClick={() => editingVoiceKey && handleSetDefaultVoice(editingVoiceKey, newVoiceValue)}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              Save Voice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
