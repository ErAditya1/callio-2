"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  AudioWaveformIcon,
  BotIcon,
  CheckIcon,
  ExternalLinkIcon,
  InfoIcon,
  KeyRoundIcon,
  Mic01Icon,
  SaveIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";;
import { useEffect, useMemo, useState } from "react";

import type {
    ModelConfigurationMetricPrice,
    ModelConfigurationPricingResponse,
    OrganizationAiModelConfigurationV2,
} from "@/client/types.gen";
import {
    type ProviderSchema,
    type ServiceConfigurationDefaults,
    ServiceConfigurationForm,
    type ServiceSegment,
} from "@/components/ServiceConfigurationForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoiceSelectorModal } from "@/components/VoiceSelectorModal";
import { LANGUAGE_DISPLAY_NAMES } from "@/constants/languages";
import { formatRoundingPolicy } from "@/lib/billingDisplay";

type ModelMode = "realtime" | "dograh" | "byok";

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
    openai: "OpenAI",
    groq: "Groq",
    anthropic: "Anthropic",
    google: "Google AI",
    azure: "Azure OpenAI",
    deepgram: "Deepgram",
    cartesia: "Cartesia",
    elevenlabs: "ElevenLabs",
    sarvam: "Sarvam AI",
    assemblyai: "AssemblyAI",
    speechmatics: "Speechmatics",
    gladia: "Gladia",
    rime: "Rime Labs",
    minimax: "MiniMax",
    smallest: "Smallest AI",
    camb: "Camb AI",
    aws_bedrock: "AWS Bedrock",
    openrouter: "OpenRouter",
    huggingface: "HuggingFace",
    speaches: "Speaches",
    inworld: "Inworld",
    lmnt: "LMNT",
    xai: "xAI",
    rumik: "Rumik",
    azure_speech: "Azure Speech",
};

function formatProviderName(provider: string): string {
    return PROVIDER_DISPLAY_NAMES[provider.toLowerCase()] || provider.charAt(0).toUpperCase() + provider.slice(1);
}

interface DograhDefaults {
    voices: string[];
    allow_custom_input?: boolean;
    speeds: number[];
    speed_range?: {
        min: number;
        max: number;
        step?: number;
    };
    languages: string[];
    multilingual_languages?: string[];
    defaults: {
        voice: string;
        speed: number;
        language: string;
    };
}

export interface ModelConfigurationDefaultsV2 {
    dograh: DograhDefaults;
    byok: {
        pipeline: ServiceConfigurationDefaults;
        realtime: {
            realtime: Record<string, ProviderSchema>;
            llm: Record<string, ProviderSchema>;
            embeddings: Record<string, ProviderSchema>;
            default_providers: ServiceConfigurationDefaults["default_providers"];
        };
    };
    platform_master_keys?: Record<string, Record<string, { is_default?: boolean; default_model?: string; models_pricing?: Record<string, any> }>>;
}

interface MasterKeysFormState {
    llmProvider: string;
    llmModel: string;
    ttsProvider: string;
    ttsModel: string;
    ttsVoice: string;
    ttsSpeed: number;
    ttsLanguage: string;
    sttProvider: string;
    sttModel: string;
    sttLanguage: string;
}

interface AIModelConfigurationV2EditorProps {
    defaults: ModelConfigurationDefaultsV2;
    configuration?: OrganizationAiModelConfigurationV2 | Record<string, unknown> | null;
    effectiveConfiguration?: Record<string, unknown> | null;
    pricing?: ModelConfigurationPricingResponse | null;
    onSave: (configuration: OrganizationAiModelConfigurationV2) => Promise<void>;
    submitLabel?: string;
}

function numberOrDefault(value: unknown, fallback: number): number {
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function asRecord(value: unknown): Record<string, unknown> | null {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value as Record<string, unknown>
        : null;
}

function isDograhEffectiveConfig(config: Record<string, unknown> | null | undefined): boolean {
    if (!config || config.is_realtime) return false;
    const llm = asRecord(config.llm);
    const tts = asRecord(config.tts);
    const stt = asRecord(config.stt);
    return llm?.provider === "dograh" && tts?.provider === "dograh" && stt?.provider === "dograh";
}

function byokDefaults(defaults: ModelConfigurationDefaultsV2): ServiceConfigurationDefaults {
    return {
        llm: defaults.byok.pipeline.llm,
        tts: defaults.byok.pipeline.tts,
        stt: defaults.byok.pipeline.stt,
        embeddings: defaults.byok.pipeline.embeddings,
        realtime: defaults.byok.realtime.realtime,
        default_providers: defaults.byok.pipeline.default_providers,
    };
}

function byokConfigToLegacyShape(config: Record<string, unknown> | null): Record<string, unknown> | null {
    if (!config || config.mode !== "byok") return null;
    const byok = asRecord(config.byok);
    if (!byok) return null;

    if (byok.mode === "realtime") {
        const realtime = asRecord(byok.realtime);
        return {
            is_realtime: true,
            realtime: realtime?.realtime,
            llm: realtime?.llm,
            embeddings: realtime?.embeddings,
        };
    }

    const pipeline = asRecord(byok.pipeline);
    return {
        is_realtime: false,
        llm: pipeline?.llm,
        tts: pipeline?.tts,
        stt: pipeline?.stt,
        embeddings: pipeline?.embeddings,
    };
}

function effectiveConfigToLegacyShape(config: Record<string, unknown> | null): Record<string, unknown> | null {
    if (!config) return null;
    return {
        is_realtime: Boolean(config.is_realtime),
        llm: config.llm,
        tts: config.tts,
        stt: config.stt,
        realtime: config.realtime,
        embeddings: config.embeddings,
    };
}

function emptyByokInitialConfig(isRealtime: boolean): Record<string, unknown> {
    return {
        is_realtime: isRealtime,
    };
}

function getByokInitialConfig(
    configuration: Record<string, unknown> | null,
    effectiveConfiguration: Record<string, unknown> | null,
    wantRealtime: boolean,
): Record<string, unknown> {
    const matchesTab = (config: Record<string, unknown> | null) =>
        config ? Boolean(config.is_realtime) === wantRealtime : false;

    const byokConfiguration = byokConfigToLegacyShape(configuration);
    if (byokConfiguration) {
        return matchesTab(byokConfiguration) ? byokConfiguration : emptyByokInitialConfig(wantRealtime);
    }

    if (configuration?.mode === "dograh" || isDograhEffectiveConfig(effectiveConfiguration)) {
        return emptyByokInitialConfig(wantRealtime);
    }

    const effective = effectiveConfigToLegacyShape(effectiveConfiguration);
    return matchesTab(effective) ? (effective as Record<string, unknown>) : emptyByokInitialConfig(wantRealtime);
}

function preferredMode(
    configuration: Record<string, unknown> | null,
    effectiveConfiguration: Record<string, unknown> | null,
    platformMasterKeys?: Record<string, Record<string, any>>,
): ModelMode {
    if (configuration?.use_platform_credentials === true || effectiveConfiguration?.use_platform_credentials === true) {
        return "dograh";
    }
    if (configuration?.use_platform_credentials === false && configuration?.mode === "byok") {
        const byok = asRecord(configuration.byok);
        if (byok?.mode === "realtime") return "realtime";
        return "byok";
    }
    if (configuration?.mode === "dograh") return "dograh";
    if (configuration?.mode === "byok") {
        const byok = asRecord(configuration.byok);
        if (byok?.mode === "realtime") return "realtime";

        const pipeline = asRecord(byok?.pipeline);
        if (pipeline) {
            const llm = asRecord(pipeline.llm);
            const tts = asRecord(pipeline.tts);
            const stt = asRecord(pipeline.stt);
            const hasPersonalKeys = Boolean(
                (typeof llm?.api_key === "string" && llm.api_key.trim()) ||
                (typeof tts?.api_key === "string" && tts.api_key.trim()) ||
                (typeof stt?.api_key === "string" && stt.api_key.trim())
            );
            if (!hasPersonalKeys) {
                return "dograh"; // This tab represents Platform Master Keys
            }
        }
        return "byok";
    }
    if (isDograhEffectiveConfig(effectiveConfiguration)) return "dograh";
    if (Boolean(effectiveConfiguration?.is_realtime)) return "realtime";

    const hasMasterKeys = Boolean(
        platformMasterKeys && (
            Object.keys(platformMasterKeys.llm || {}).length > 0 ||
            Object.keys(platformMasterKeys.tts || {}).length > 0 ||
            Object.keys(platformMasterKeys.stt || {}).length > 0
        )
    );
    return hasMasterKeys ? "dograh" : "byok";
}

function hasRequiredApiKey(
    service: ServiceSegment,
    serviceConfiguration: Record<string, unknown>,
    defaults: ServiceConfigurationDefaults,
    platformMasterKeys?: Record<string, Record<string, any>>,
): boolean {
    const provider = serviceConfiguration.provider as string | undefined;
    if (!provider) return false;

    // If provider is configured with a platform master key, personal key is not required
    if (platformMasterKeys?.[service]?.[provider.toLowerCase()]) {
        return true;
    }

    const providerSchema = service === "realtime"
        ? defaults.realtime?.[provider]
        : defaults[service as "llm" | "tts" | "stt" | "embeddings"]?.[provider];
    const requiresApiKey = providerSchema?.required?.includes("api_key") ?? false;
    if (!requiresApiKey) return true;

    const apiKey = serviceConfiguration.api_key;
    if (Array.isArray(apiKey)) {
        return apiKey.some((key) => typeof key === "string" && key.trim().length > 0);
    }
    return typeof apiKey === "string" && apiKey.trim().length > 0;
}

function requireByokService(
    config: Record<string, unknown>,
    service: ServiceSegment,
    defaults: ServiceConfigurationDefaults,
    platformMasterKeys?: Record<string, Record<string, any>>,
): Record<string, unknown> {
    const serviceConfiguration = asRecord(config[service]);
    if (
        !serviceConfiguration
        || !serviceConfiguration.provider
        || serviceConfiguration.provider === "dograh"
        || !hasRequiredApiKey(service, serviceConfiguration, defaults, platformMasterKeys)
    ) {
        throw new Error(`${service} configuration is required`);
    }
    return serviceConfiguration;
}

function optionalByokService(config: Record<string, unknown>, service: ServiceSegment): Record<string, unknown> | undefined {
    const serviceConfiguration = asRecord(config[service]);
    if (!serviceConfiguration?.provider || serviceConfiguration.provider === "dograh") return undefined;
    return serviceConfiguration;
}

function ThirdPartyProviderNotice() {
    return (
        <div className="mt-4 flex gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
            <HugeiconsIcon icon={InfoIcon} className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
                <p className="font-medium">Third-party provider data notice</p>
                <p className="mt-1 leading-6">
                    Callio AI sends data required by the selected model service. This may include prompts,
                    transcripts, audio, generated text, tool data, and request metadata depending on the
                    provider and service type. Review the provider&apos;s data and retention policies before
                    using sensitive data.
                </p>
            </div>
        </div>
    );
}

function formatPricePerMinute(price: ModelConfigurationMetricPrice): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: price.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    }).format(price.price_per_minute);
}

function MetricPrice({
    label,
    price,
}: {
    label: string;
    price: ModelConfigurationMetricPrice;
}) {
    return (
        <div className="space-y-0.5">
            <p className="text-muted-foreground">
                {label}: <span className="font-medium text-foreground">{formatPricePerMinute(price)}/{price.unit}</span>
            </p>
            <p className="text-xs text-muted-foreground">
                {formatRoundingPolicy(price.rounding_policy)}
            </p>
        </div>
    );
}

function PricingSummary({
    pricing,
    includeDograhModel,
    thirdPartyModels,
}: {
    pricing?: ModelConfigurationPricingResponse | null;
    includeDograhModel: boolean;
    thirdPartyModels?: boolean;
}) {
    const platformPrice = pricing?.platform_usage;
    const dograhModelPrice = includeDograhModel ? pricing?.dograh_model : null;
    if (!platformPrice && !dograhModelPrice) return null;

    return (
        <Card className="mb-4 border-primary/20 bg-primary/[0.03]">
            <CardContent className="space-y-2 pt-5 text-sm">
                <p className="font-medium">Usage pricing</p>
                {platformPrice && (
                    <MetricPrice label="Platform usage" price={platformPrice} />
                )}
                {dograhModelPrice && (
                    <MetricPrice label="Platform master model usage" price={dograhModelPrice} />
                )}
                {thirdPartyModels && (
                    <p className="text-muted-foreground">
                        Your selected model provider may charge separately for its usage.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function getProviderModels(
    service: "llm" | "tts" | "stt",
    provider: string,
    defaults: ModelConfigurationDefaultsV2,
): string[] {
    if (!provider) return [];
    const fromPricing = Object.keys(defaults.platform_master_keys?.[service]?.[provider]?.models_pricing || {});
    const defaultMod = defaults.platform_master_keys?.[service]?.[provider]?.default_model;
    const schemaProps = (defaults.byok.pipeline[service]?.[provider]?.properties?.model as any);
    const fromSchema = Array.isArray(schemaProps?.enum)
        ? schemaProps.enum
        : Array.isArray(schemaProps?.examples)
            ? schemaProps.examples
            : [];
    const set = new Set<string>();
    if (defaultMod) set.add(defaultMod);
    fromPricing.forEach((m) => set.add(m));
    fromSchema.forEach((m: string) => set.add(m));
    return Array.from(set);
}

function getProviderLanguages(
    service: "tts" | "stt",
    provider: string,
    model: string,
    defaults: ModelConfigurationDefaultsV2,
): string[] {
    let result: string[] = [];
    if (provider) {
        const providerSchema = defaults.byok?.pipeline?.[service]?.[provider];
        if (providerSchema) {
            const schema = providerSchema.properties?.language as any;
            if (schema) {
                const actualSchema = schema.$ref && providerSchema.$defs
                    ? (providerSchema.$defs[schema.$ref.split("/").pop() || ""] as any)
                    : schema;
                if (actualSchema) {
                    if (actualSchema.model_options && model && actualSchema.model_options[model]) {
                        result = actualSchema.model_options[model];
                    } else if (Array.isArray(actualSchema.enum) && actualSchema.enum.length > 0) {
                        result = actualSchema.enum;
                    } else if (Array.isArray(actualSchema.examples) && actualSchema.examples.length > 0) {
                        result = actualSchema.examples;
                    }
                }
            }
        }
    }

    if (result.length === 0) {
        if (service === "tts") {
            if (provider.toLowerCase() === "cartesia") {
                result = ["en", "hi", "es", "fr", "de", "ja", "pt", "zh", "it", "ko", "nl", "pl", "ru", "sv", "tr"];
            } else {
                result = (defaults.dograh?.languages || ["en"]).filter((l) => l !== "multi");
            }
        } else {
            result = defaults.dograh?.languages || ["multi", "en"];
        }
    }

    if (service === "tts") {
        return result.filter((l) => l !== "multi");
    }
    return result;
}

function getModelPricingDisplay(
    provider: string,
    model: string,
    defaults: ModelConfigurationDefaultsV2,
): string | null {
    const pricing = defaults.platform_master_keys?.llm?.[provider]?.models_pricing?.[model];
    if (!pricing) return null;
    if (typeof pricing === "object") {
        if (pricing.input !== undefined && pricing.output !== undefined) {
            return `$${pricing.input}/1M in · $${pricing.output}/1M out`;
        }
        if (pricing.price !== undefined) {
            return `$${pricing.price}/1M`;
        }
    }
    if (typeof pricing === "number") {
        return `$${pricing}/1M`;
    }
    return null;
}

function buildMasterFormState(
    defaults: ModelConfigurationDefaultsV2,
    rawConfiguration: Record<string, unknown> | null,
    rawEffectiveConfiguration: Record<string, unknown> | null,
): MasterKeysFormState {
    const llmMap = defaults.platform_master_keys?.llm || {};
    const ttsMap = defaults.platform_master_keys?.tts || {};
    const sttMap = defaults.platform_master_keys?.stt || {};

    const defaultLlm = Object.entries(llmMap).find(([_, d]) => d.is_default)?.[0] || Object.keys(llmMap)[0] || "";
    const defaultTts = Object.entries(ttsMap).find(([_, d]) => d.is_default)?.[0] || Object.keys(ttsMap)[0] || "";
    const defaultStt = Object.entries(sttMap).find(([_, d]) => d.is_default)?.[0] || Object.keys(sttMap)[0] || "";

    const byokPipeline = asRecord(asRecord(rawConfiguration?.byok)?.pipeline);
    const existingLlm = asRecord(byokPipeline?.llm || rawEffectiveConfiguration?.llm);
    const existingTts = asRecord(byokPipeline?.tts || rawEffectiveConfiguration?.tts);
    const existingStt = asRecord(byokPipeline?.stt || rawEffectiveConfiguration?.stt);
    const rawDograh = asRecord(rawConfiguration?.dograh);

    const existingLlmProvider = (existingLlm?.provider as string) || "";
    const llmProvider = existingLlmProvider && llmMap[existingLlmProvider]
        ? existingLlmProvider
        : defaultLlm;
    const llmModel = (existingLlm?.model as string) || llmMap[llmProvider]?.default_model || "gpt-4o-mini";

    const existingTtsProvider = (existingTts?.provider as string) || "";
    const ttsProvider = existingTtsProvider && ttsMap[existingTtsProvider]
        ? existingTtsProvider
        : defaultTts;
    const ttsModel = (existingTts?.model as string) || ttsMap[ttsProvider]?.default_model || "sonic-english";
    const ttsVoice = (existingTts?.voice as string) || (rawDograh?.voice as string) || defaults.dograh?.defaults?.voice || "default";
    const ttsSpeed = numberOrDefault(existingTts?.speed || rawDograh?.speed, 1.0);
    const initialTtsLangs = getProviderLanguages("tts", ttsProvider, ttsModel, defaults);
    let ttsLanguage = (existingTts?.language as string) || (rawDograh?.language as string) || (defaults.byok?.pipeline?.tts?.[ttsProvider]?.properties?.language as any)?.default || "en";
    if (ttsLanguage === "multi" || (initialTtsLangs.length > 0 && !initialTtsLangs.includes(ttsLanguage))) {
        ttsLanguage = initialTtsLangs[0] || "en";
    }

    const existingSttProvider = (existingStt?.provider as string) || "";
    const sttProvider = existingSttProvider && sttMap[existingSttProvider]
        ? existingSttProvider
        : defaultStt;
    const sttModel = (existingStt?.model as string) || sttMap[sttProvider]?.default_model || "nova-3";
    const initialSttLangs = getProviderLanguages("stt", sttProvider, sttModel, defaults);
    let sttLanguage = (existingStt?.language as string) || (defaults.byok?.pipeline?.stt?.[sttProvider]?.properties?.language as any)?.default || (initialSttLangs.includes("multi") ? "multi" : "en");
    if (initialSttLangs.length > 0 && !initialSttLangs.includes(sttLanguage)) {
        sttLanguage = initialSttLangs.includes("multi") ? "multi" : initialSttLangs[0];
    }

    return {
        llmProvider,
        llmModel,
        ttsProvider,
        ttsModel,
        ttsVoice,
        ttsSpeed,
        ttsLanguage,
        sttProvider,
        sttModel,
        sttLanguage,
    };
}

export function AIModelConfigurationV2Editor({
    defaults,
    configuration,
    effectiveConfiguration,
    pricing,
    onSave,
    submitLabel = "Save Configuration",
}: AIModelConfigurationV2EditorProps) {
    const defaultsForByok = useMemo(() => byokDefaults(defaults), [defaults]);
    const [mode, setMode] = useState<ModelMode>("dograh");
    const [usePlatformCredentials, setUsePlatformCredentials] = useState<boolean>(() => {
        return Boolean(
            asRecord(configuration)?.use_platform_credentials ??
            asRecord(effectiveConfiguration)?.use_platform_credentials ??
            false
        );
    });

    const [masterForm, setMasterForm] = useState<MasterKeysFormState>(() =>
        buildMasterFormState(defaults, asRecord(configuration), asRecord(effectiveConfiguration))
    );

    const [realtimeInitialConfig, setRealtimeInitialConfig] = useState<Record<string, unknown> | null>(null);
    const [pipelineInitialConfig, setPipelineInitialConfig] = useState<Record<string, unknown> | null>(null);
    const [isSavingMaster, setIsSavingMaster] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const allowCustomVoice = defaults.dograh.allow_custom_input ?? false;
    const dograhSpeedRange = defaults.dograh.speed_range ?? { min: 0.5, max: 2.0, step: 0.1 };

    const masterLlmProviders = useMemo(() => {
        return Object.keys(defaults.platform_master_keys?.llm || {});
    }, [defaults.platform_master_keys]);

    const masterTtsProviders = useMemo(() => {
        return Object.keys(defaults.platform_master_keys?.tts || {});
    }, [defaults.platform_master_keys]);

    const masterSttProviders = useMemo(() => {
        return Object.keys(defaults.platform_master_keys?.stt || {});
    }, [defaults.platform_master_keys]);

    const hasNoMasterKeys = masterLlmProviders.length === 0 && masterTtsProviders.length === 0 && masterSttProviders.length === 0;

    useEffect(() => {
        const rawConfiguration = asRecord(configuration);
        const rawEffectiveConfiguration = asRecord(effectiveConfiguration);
        const isMaster = Boolean(
            rawConfiguration?.use_platform_credentials ??
            rawEffectiveConfiguration?.use_platform_credentials ??
            false
        );
        setUsePlatformCredentials(isMaster);
        setMode(preferredMode(rawConfiguration, rawEffectiveConfiguration, defaults.platform_master_keys));
        const nextMasterForm = buildMasterFormState(defaults, rawConfiguration, rawEffectiveConfiguration);
        setMasterForm(nextMasterForm);
        setRealtimeInitialConfig(getByokInitialConfig(rawConfiguration, rawEffectiveConfiguration, true));
        setPipelineInitialConfig(getByokInitialConfig(rawConfiguration, rawEffectiveConfiguration, false));
    }, [configuration, defaults, effectiveConfiguration]);

    const llmModelOptions = useMemo(() => {
        const models = getProviderModels("llm", masterForm.llmProvider, defaults);
        if (masterForm.llmModel && !models.includes(masterForm.llmModel)) {
            models.unshift(masterForm.llmModel);
        }
        return models;
    }, [masterForm.llmProvider, masterForm.llmModel, defaults]);

    const ttsModelOptions = useMemo(() => {
        const models = getProviderModels("tts", masterForm.ttsProvider, defaults);
        if (masterForm.ttsModel && !models.includes(masterForm.ttsModel)) {
            models.unshift(masterForm.ttsModel);
        }
        return models;
    }, [masterForm.ttsProvider, masterForm.ttsModel, defaults]);

    const sttModelOptions = useMemo(() => {
        const models = getProviderModels("stt", masterForm.sttProvider, defaults);
        if (masterForm.sttModel && !models.includes(masterForm.sttModel)) {
            models.unshift(masterForm.sttModel);
        }
        return models;
    }, [masterForm.sttProvider, masterForm.sttModel, defaults]);

    const ttsLanguageOptions = useMemo(() => {
        return getProviderLanguages("tts", masterForm.ttsProvider, masterForm.ttsModel, defaults);
    }, [masterForm.ttsProvider, masterForm.ttsModel, defaults]);

    const sttLanguageOptions = useMemo(() => {
        return getProviderLanguages("stt", masterForm.sttProvider, masterForm.sttModel, defaults);
    }, [masterForm.sttProvider, masterForm.sttModel, defaults]);

    const selectedLlmPricing = useMemo(() => {
        return getModelPricingDisplay(masterForm.llmProvider, masterForm.llmModel, defaults);
    }, [masterForm.llmProvider, masterForm.llmModel, defaults]);

    const handleMasterLlmProviderChange = (provider: string) => {
        const models = getProviderModels("llm", provider, defaults);
        const defModel = defaults.platform_master_keys?.llm?.[provider]?.default_model || models[0] || "gpt-4o-mini";
        setMasterForm((p) => ({
            ...p,
            llmProvider: provider,
            llmModel: defModel,
        }));
    };

    const handleMasterTtsProviderChange = (provider: string) => {
        const models = getProviderModels("tts", provider, defaults);
        const defModel = defaults.platform_master_keys?.tts?.[provider]?.default_model || models[0] || "sonic-english";
        const langs = getProviderLanguages("tts", provider, defModel, defaults);
        const defLang = (defaults.byok.pipeline.tts?.[provider]?.properties?.language as any)?.default || langs[0] || "en";
        setMasterForm((p) => ({
            ...p,
            ttsProvider: provider,
            ttsModel: defModel,
            ttsVoice: "default",
            ttsLanguage: langs.includes(p.ttsLanguage) ? p.ttsLanguage : defLang,
        }));
    };

    const handleMasterTtsModelChange = (model: string) => {
        const langs = getProviderLanguages("tts", masterForm.ttsProvider, model, defaults);
        setMasterForm((p) => ({
            ...p,
            ttsModel: model,
            ttsLanguage: langs.includes(p.ttsLanguage) ? p.ttsLanguage : (langs[0] || p.ttsLanguage),
        }));
    };

    const handleMasterSttProviderChange = (provider: string) => {
        const models = getProviderModels("stt", provider, defaults);
        const defModel = defaults.platform_master_keys?.stt?.[provider]?.default_model || models[0] || "nova-3";
        const langs = getProviderLanguages("stt", provider, defModel, defaults);
        const defLang = (defaults.byok.pipeline.stt?.[provider]?.properties?.language as any)?.default || (langs.includes("multi") ? "multi" : langs[0]) || "en";
        setMasterForm((p) => ({
            ...p,
            sttProvider: provider,
            sttModel: defModel,
            sttLanguage: langs.includes(p.sttLanguage) ? p.sttLanguage : defLang,
        }));
    };

    const handleMasterSttModelChange = (model: string) => {
        const langs = getProviderLanguages("stt", masterForm.sttProvider, model, defaults);
        setMasterForm((p) => ({
            ...p,
            sttModel: model,
            sttLanguage: langs.includes(p.sttLanguage) ? p.sttLanguage : (langs.includes("multi") ? "multi" : langs[0] || p.sttLanguage),
        }));
    };

    const saveMasterConfiguration = async () => {
        setIsSavingMaster(true);
        setError(null);
        try {
            if (!masterForm.llmProvider) throw new Error("Please select an LLM provider.");
            if (!masterForm.ttsProvider) throw new Error("Please select a Voice (TTS) provider.");
            if (!masterForm.sttProvider) throw new Error("Please select a Transcriber (STT) provider.");

            // Preserve existing BYOK keys from configuration so user never loses personal credentials
            const rawConfig = asRecord(configuration);
            const existingPipeline = asRecord(asRecord(rawConfig?.byok)?.pipeline);
            const existingLlmKey = (asRecord(existingPipeline?.llm)?.api_key as string) || "";
            const existingTtsKey = (asRecord(existingPipeline?.tts)?.api_key as string) || "";
            const existingSttKey = (asRecord(existingPipeline?.stt)?.api_key as string) || "";

            await onSave({
                version: 2,
                mode: "byok",
                use_platform_credentials: true,
                byok: {
                    mode: "pipeline",
                    pipeline: {
                        llm: {
                            provider: masterForm.llmProvider as any,
                            model: masterForm.llmModel || defaults.platform_master_keys?.llm?.[masterForm.llmProvider]?.default_model || "gpt-4o-mini",
                            api_key: existingLlmKey,
                        },
                        tts: {
                            provider: masterForm.ttsProvider as any,
                            model: masterForm.ttsModel || defaults.platform_master_keys?.tts?.[masterForm.ttsProvider]?.default_model || "default",
                            voice: masterForm.ttsVoice || "default",
                            speed: masterForm.ttsSpeed || 1.0,
                            language: (masterForm.ttsLanguage && masterForm.ttsLanguage !== "multi") ? masterForm.ttsLanguage : "en",
                            api_key: existingTtsKey,
                        },
                        stt: {
                            provider: masterForm.sttProvider as any,
                            model: masterForm.sttModel || defaults.platform_master_keys?.stt?.[masterForm.sttProvider]?.default_model || "default",
                            language: masterForm.sttLanguage || "en",
                            api_key: existingSttKey,
                        },
                    },
                },
            });
            setUsePlatformCredentials(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save configuration");
        } finally {
            setIsSavingMaster(false);
        }
    };

    const saveByokConfiguration = async (config: Record<string, unknown>) => {
        setError(null);
        const isRealtime = Boolean(config.is_realtime);
        const llm = requireByokService(config, "llm", defaultsForByok, defaults.platform_master_keys);
        const embeddings = optionalByokService(config, "embeddings");
        const body: OrganizationAiModelConfigurationV2 = {
            version: 2,
            mode: "byok",
            use_platform_credentials: false,
            byok: isRealtime
                ? {
                    mode: "realtime",
                    realtime: {
                        realtime: requireByokService(config, "realtime", defaultsForByok, defaults.platform_master_keys) as never,
                        llm: llm as never,
                        ...(embeddings ? { embeddings: embeddings as never } : {}),
                    },
                }
                : {
                    mode: "pipeline",
                    pipeline: {
                        llm: llm as never,
                        tts: requireByokService(config, "tts", defaultsForByok, defaults.platform_master_keys) as never,
                        stt: requireByokService(config, "stt", defaultsForByok, defaults.platform_master_keys) as never,
                        ...(embeddings ? { embeddings: embeddings as never } : {}),
                    },
                },
        };

        await onSave(body);
        setUsePlatformCredentials(false);
    };

    const handleTogglePlatformCredentials = async (checked: boolean) => {
        setUsePlatformCredentials(checked);
        if (checked) {
            setMode("dograh");
        } else {
            setMode("byok");
        }
        const rawConfig = asRecord(configuration);
        if (rawConfig && rawConfig.mode === "byok" && rawConfig.byok) {
            try {
                await onSave({
                    ...(rawConfig as any),
                    version: 2,
                    mode: "byok",
                    use_platform_credentials: checked,
                });
            } catch (err) {
                console.warn("Could not persist credential toggle:", err);
            }
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* Platform Master Keys Active Banner & Quick Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card/70 shadow-xs">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4 text-emerald-500" />
                        <Label htmlFor="master-key-toggle" className="text-sm font-semibold cursor-pointer">
                            Use Platform Master Keys
                        </Label>
                        {usePlatformCredentials ? (
                            <Badge variant="outline" className="text-[11px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                                Active in Calling
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-[11px] bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30">
                                BYOK Active
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {usePlatformCredentials
                            ? "Calls are powered by Platform Master Keys. Your configured BYOK keys remain safely preserved in the database."
                            : "Calls are using your own BYOK keys. Turn this on to use platform master keys without erasing your personal keys."}
                    </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <Switch
                        id="master-key-toggle"
                        checked={usePlatformCredentials}
                        onCheckedChange={handleTogglePlatformCredentials}
                    />
                </div>
            </div>

            <Tabs value={mode} onValueChange={(value) => setMode(value as ModelMode)} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="realtime" className="flex items-center justify-center gap-1.5">
                        Speech to Speech
                    </TabsTrigger>
                    <TabsTrigger value="dograh" className="flex items-center justify-center gap-1.5">
                        <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4 text-emerald-500" /> Platform Master Keys
                        {usePlatformCredentials && (
                            <span className="ml-1 h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="byok" className="flex items-center justify-center gap-1.5">
                        <HugeiconsIcon icon={KeyRoundIcon} className="h-4 w-4" /> BYOK (Own Keys)
                        {!usePlatformCredentials && (
                            <span className="ml-1 h-2 w-2 rounded-full bg-blue-500" />
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="realtime" className="mt-0">
                    <p className="mb-4 text-sm text-muted-foreground">
                        A single speech-to-speech model handles the conversation in realtime (no separate transcriber or voice). An LLM is still required for variable extraction and QA.
                    </p>
                    <PricingSummary pricing={pricing} includeDograhModel={false} thirdPartyModels />
                    <ServiceConfigurationForm
                        key={`realtime-${JSON.stringify(realtimeInitialConfig)}`}
                        mode="global"
                        forceRealtime
                        configurationDefaults={defaultsForByok}
                        initialConfig={realtimeInitialConfig}
                        platformMasterKeys={defaults.platform_master_keys}
                        submitLabel={submitLabel}
                        onSave={saveByokConfiguration}
                    />
                    <ThirdPartyProviderNotice />
                </TabsContent>

                <TabsContent value="dograh" className="mt-0 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
                        <div className="flex items-start gap-3">
                            <HugeiconsIcon icon={SparklesIcon} className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-sm">Platform Master Credentials Active</h4>
                                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                    Calls are powered by platform-configured master API keys for LLM, Voice, and Transcriber. You do not need to provide personal API credentials.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 shrink-0">
                            <Badge variant="outline" className="text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                                {masterLlmProviders.length} LLMs
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                                {masterTtsProviders.length} Voices
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30">
                                {masterSttProviders.length} STTs
                            </Badge>
                        </div>
                    </div>

                    {hasNoMasterKeys ? (
                        <Card className="border-dashed border-amber-500/40 bg-amber-500/5">
                            <CardContent className="pt-6 pb-6 text-center space-y-3">
                                <HugeiconsIcon icon={AlertCircleIcon} className="h-8 w-8 text-amber-500 mx-auto" />
                                <h4 className="font-semibold text-foreground">No Platform Master Keys Configured Yet</h4>
                                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                    No platform master keys are currently configured in the platform. You can configure them in the Superadmin dashboard, or use the BYOK tab to configure your own credentials.
                                </p>
                                <div className="flex justify-center gap-3 pt-2">
                                    <Button variant="outline" size="sm" onClick={() => setMode("byok")}>
                                        Use BYOK (Own Keys) Instead
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <ServiceConfigurationForm
                            key={`master-${JSON.stringify(pipelineInitialConfig)}`}
                            mode="global"
                            forceRealtime={false}
                            configurationDefaults={defaultsForByok}
                            initialConfig={pipelineInitialConfig}
                            platformMasterKeys={defaults.platform_master_keys}
                            masterMode={true}
                            submitLabel="Save Platform Master Configuration"
                            onSave={saveByokConfiguration}
                        />
                    )}
                </TabsContent>

                <TabsContent value="byok" className="mt-0">
                    <p className="mb-4 text-sm text-muted-foreground">
                        Configure separate transcriber, LLM, and voice providers using your own API keys. An embeddings model can also be configured for knowledge retrieval.
                    </p>
                    <PricingSummary pricing={pricing} includeDograhModel={false} thirdPartyModels />
                    <ServiceConfigurationForm
                        key={`byok-${JSON.stringify(pipelineInitialConfig)}`}
                        mode="global"
                        forceRealtime={false}
                        configurationDefaults={defaultsForByok}
                        initialConfig={pipelineInitialConfig}
                        platformMasterKeys={defaults.platform_master_keys}
                        submitLabel={submitLabel}
                        onSave={saveByokConfiguration}
                    />
                    <ThirdPartyProviderNotice />
                </TabsContent>
            </Tabs>
        </div>
    );
}
