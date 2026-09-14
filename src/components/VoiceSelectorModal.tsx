"use client";

import { Check, ChevronDown, Loader2, Pencil, Play, Square } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getVoicesApiV1UserConfigurationsVoicesProviderGet } from "@/client/sdk.gen";
import { VoiceInfo } from "@/client/types.gen";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACCENT_DISPLAY_NAMES } from "@/constants/accents";
import { LANGUAGE_DISPLAY_NAMES } from "@/constants/languages";
import { cn } from "@/lib/utils";

const ALL_FILTER_VALUE = "__all__";

// Defaults: open with all voices displayed so user immediately sees options
const DEFAULT_GENDER = ALL_FILTER_VALUE;
const DEFAULT_ACCENT = ALL_FILTER_VALUE;
const DEFAULT_LANGUAGE = ALL_FILTER_VALUE;

const SEARCH_DEBOUNCE_MS = 300;

interface Facets {
    genders: string[];
    accents: string[];
    languages: string[];
}

const EMPTY_FACETS: Facets = { genders: [], accents: [], languages: [] };

const FALLBACK_PRESETS: Record<string, VoiceInfo[]> = {
    cartesia: [
        { voice_id: "f786b574-daa5-4673-aa0c-cbe3e8534c02", name: "Jasper - Service Specialist", accent: "gb", gender: "male", language: "en", description: "British · Male · English" },
        { voice_id: "3faa81ae-d3d8-4ab1-9e44-e50e46d33c30", name: "Cartesia Default Voice", accent: "us", gender: "female", language: "en", description: "American · Female · English" },
        { voice_id: "a0e99841-438c-4a64-b679-ae501e7d6091", name: "Barbershop Man", accent: "us", gender: "male", language: "en", description: "American · Male · English" },
        { voice_id: "79a125e8-cd45-4c13-8a67-188112f4dd22", name: "British Lady", accent: "gb", gender: "female", language: "en", description: "British · Female · English" },
        { voice_id: "69267136-1bdc-4103-a11a-7a0676499302", name: "Commercial Lady", accent: "us", gender: "female", language: "en", description: "American · Female · English" },
    ],
    elevenlabs: [
        { voice_id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", accent: "us", gender: "female", language: "en", description: "Calm & Friendly" },
        { voice_id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", accent: "us", gender: "female", language: "en", description: "Strong & Engaged" },
        { voice_id: "EXAVITQu4vr4xnSDxMaL", name: "Bella", accent: "us", gender: "female", language: "en", description: "Soft & Expressive" },
        { voice_id: "ErXwobaYiN019PkySvjV", name: "Antoni", accent: "us", gender: "male", language: "en", description: "Well-rounded" },
        { voice_id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", accent: "us", gender: "female", language: "en", description: "Young Emotional" },
        { voice_id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", accent: "us", gender: "male", language: "en", description: "Deep Authoritative" },
    ],
    deepgram: [
        { voice_id: "aura-asteria-en", name: "Asteria", accent: "us", gender: "female", language: "en", description: "Confident & Clear" },
        { voice_id: "aura-luna-en", name: "Luna", accent: "us", gender: "female", language: "en", description: "Pleasant & Calm" },
        { voice_id: "aura-stella-en", name: "Stella", accent: "us", gender: "female", language: "en", description: "Warm & Expressive" },
        { voice_id: "aura-athena-en", name: "Athena", accent: "gb", gender: "female", language: "en", description: "Sophisticated British" },
        { voice_id: "aura-orion-en", name: "Orion", accent: "us", gender: "male", language: "en", description: "Authoritative & Deep" },
        { voice_id: "aura-helios-en", name: "Helios", accent: "gb", gender: "male", language: "en", description: "Clear British Male" },
        { voice_id: "aura-angus-en", name: "Angus", accent: "ie", gender: "male", language: "en", description: "Irish Male" },
        { voice_id: "aura-zeus-en", name: "Zeus", accent: "us", gender: "male", language: "en", description: "Deep Resonant Male" },
    ],
    sarvam: [
        { voice_id: "anushka", name: "Anushka", accent: "in", gender: "female", language: "hi", description: "Natural Indian Female" },
        { voice_id: "manisha", name: "Manisha", accent: "in", gender: "female", language: "hi", description: "Clear Indian Female" },
        { voice_id: "vidya", name: "Vidya", accent: "in", gender: "female", language: "hi", description: "Warm Indian Female" },
        { voice_id: "arya", name: "Arya", accent: "in", gender: "female", language: "hi", description: "Engaging Indian Female" },
        { voice_id: "abhilash", name: "Abhilash", accent: "in", gender: "male", language: "hi", description: "Professional Indian Male" },
        { voice_id: "karun", name: "Karun", accent: "in", gender: "male", language: "hi", description: "Casual Indian Male" },
        { voice_id: "hitesh", name: "Hitesh", accent: "in", gender: "male", language: "hi", description: "Conversational Indian Male" },
    ],
    openai: [
        { voice_id: "alloy", name: "Alloy", accent: "us", gender: "neutral", language: "en", description: "Balanced & Neutral" },
        { voice_id: "echo", name: "Echo", accent: "us", gender: "male", language: "en", description: "Warm Male" },
        { voice_id: "fable", name: "Fable", accent: "gb", gender: "male", language: "en", description: "British Expressive" },
        { voice_id: "onyx", name: "Onyx", accent: "us", gender: "male", language: "en", description: "Deep Male" },
        { voice_id: "nova", name: "Nova", accent: "us", gender: "female", language: "en", description: "Energetic Female" },
        { voice_id: "shimmer", name: "Shimmer", accent: "us", gender: "female", language: "en", description: "Clear Female" },
    ],
    google: [
        { voice_id: "en-US-Chirp3-HD-Charon", name: "Charon", accent: "us", gender: "male", language: "en", description: "US English HD Male" },
        { voice_id: "en-US-Chirp3-HD-Aoede", name: "Aoede", accent: "us", gender: "female", language: "en", description: "US English HD Female" },
        { voice_id: "en-US-Chirp3-HD-Fenrir", name: "Fenrir", accent: "us", gender: "male", language: "en", description: "US English HD Male" },
        { voice_id: "en-US-Chirp3-HD-Kore", name: "Kore", accent: "us", gender: "female", language: "en", description: "US English HD Female" },
    ],
    smallest: [
        { voice_id: "sophia", name: "Sophia", accent: "us", gender: "female", language: "en", description: "American Female" },
        { voice_id: "emily", name: "Emily", accent: "gb", gender: "female", language: "en", description: "British Female" },
        { voice_id: "aravind", name: "Aravind", accent: "in", gender: "male", language: "en", description: "Indian English Male" },
        { voice_id: "diya", name: "Diya", accent: "in", gender: "female", language: "hi", description: "Hindi Indian Female" },
    ],
    azure: [
        { voice_id: "en-US-AriaNeural", name: "Aria", accent: "us", gender: "female", language: "en", description: "US English Neural Female" },
        { voice_id: "en-US-GuyNeural", name: "Guy", accent: "us", gender: "male", language: "en", description: "US English Neural Male" },
        { voice_id: "en-US-JennyNeural", name: "Jenny", accent: "us", gender: "female", language: "en", description: "US English Neural Female" },
        { voice_id: "en-IN-NeerjaNeural", name: "Neerja", accent: "in", gender: "female", language: "en", description: "Indian English Female" },
        { voice_id: "en-IN-PrabhatNeural", name: "Prabhat", accent: "in", gender: "male", language: "en", description: "Indian English Male" },
    ],
    rime: [
        { voice_id: "celeste", name: "Celeste", accent: "us", gender: "female", language: "en", description: "Natural Female" },
        { voice_id: "allison", name: "Allison", accent: "us", gender: "female", language: "en", description: "Expressive Female" },
        { voice_id: "marsh", name: "Marsh", accent: "us", gender: "male", language: "en", description: "Smooth Male" },
        { voice_id: "spire", name: "Spire", accent: "us", gender: "male", language: "en", description: "Dynamic Male" },
    ],
    inworld: [
        { voice_id: "Ashley", name: "Ashley", accent: "us", gender: "female", language: "en", description: "Inworld Character Voice" },
    ],
};

interface VoiceSelectorModalProps {
    provider: string;
    value: string;
    onChange: (voiceId: string) => void;
    /** Optional model passed through to the voice catalog query. */
    model?: string;
    /** Allow typing a raw voice ID for voices outside the catalog. */
    allowManualInput?: boolean;
    className?: string;
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const accentLabel = (code?: string | null) =>
    code ? ACCENT_DISPLAY_NAMES[code.toLowerCase()] || capitalize(code) : "";
const languageLabel = (code?: string | null) =>
    code ? LANGUAGE_DISPLAY_NAMES[code] || code.toUpperCase() : "";
const genderLabel = (gender?: string | null) => (gender ? capitalize(gender) : "");

/** Build the "Accent · Gender · Language" trait line shown under a voice name. */
function voiceTraits(voice: VoiceInfo): string {
    return [accentLabel(voice.accent), genderLabel(voice.gender), languageLabel(voice.language)]
        .filter(Boolean)
        .join(" · ");
}

/** Ensure the active filter value is always an option so the Select can render it. */
function withSelected(options: string[], selected: string): string[] {
    if (selected === ALL_FILTER_VALUE || options.includes(selected)) return options;
    return [selected, ...options];
}

export const VoiceSelectorModal: React.FC<VoiceSelectorModalProps> = ({
    provider,
    value,
    onChange,
    model,
    allowManualInput = false,
    className,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [voices, setVoices] = useState<VoiceInfo[]>([]);
    const [facets, setFacets] = useState<Facets>(EMPTY_FACETS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters drive a server-side query (default to all to view entire catalog).
    const [gender, setGender] = useState(DEFAULT_GENDER);
    const [accent, setAccent] = useState(DEFAULT_ACCENT);
    const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Pending (in-modal) selection; only committed via "Use this voice".
    const [pendingVoiceId, setPendingVoiceId] = useState(value);
    const [selectedVoiceInfo, setSelectedVoiceInfo] = useState<VoiceInfo | null>(null);
    const [manualMode, setManualMode] = useState(false);
    const [manualVoiceId, setManualVoiceId] = useState("");

    // Preview playback.
    const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const requestId = useRef(0);

    const stopPreview = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setPlayingVoiceId(null);
    }, []);

    // Debounce the search box so typing doesn't fire a request per keystroke.
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchInput), SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Resolve the currently-selected voice (for the trigger label)
    useEffect(() => {
        if (!value) {
            setSelectedVoiceInfo(null);
            return;
        }
        let active = true;
        (async () => {
            const provKey = (provider || '').toLowerCase();
            const local = FALLBACK_PRESETS[provKey]?.find((v) => v.voice_id === value);
            if (local && active) setSelectedVoiceInfo(local);

            try {
                const response = await getVoicesApiV1UserConfigurationsVoicesProviderGet({
                    path: { provider: provider as never },
                    query: { q: value },
                });
                if (!active) return;
                const found = response.data?.voices?.find((voice) => voice.voice_id === value) ?? null;
                if (found) {
                    setSelectedVoiceInfo(found);
                } else if (!local) {
                    setSelectedVoiceInfo({ voice_id: value, name: value });
                }
            } catch {
                if (active && !local) {
                    setSelectedVoiceInfo({ voice_id: value, name: value });
                }
            }
        })();
        return () => {
            active = false;
        };
    }, [value, provider]);

    // Fetch the voice list whenever the modal is open or a filter changes.
    useEffect(() => {
        if (!isOpen || manualMode) return;
        const id = ++requestId.current;
        setIsLoading(true);
        setError(null);
        (async () => {
            const query: Record<string, string> = {};
            if (model) query.model = model;
            if (gender !== ALL_FILTER_VALUE) query.gender = gender;
            if (accent !== ALL_FILTER_VALUE) query.accent = accent;
            if (language !== ALL_FILTER_VALUE) query.language = language;
            const search = debouncedSearch.trim();
            if (search) query.q = search;

            let fetchedVoices: VoiceInfo[] = [];
            let fetchedFacets: Facets | null = null;

            try {
                const response = await getVoicesApiV1UserConfigurationsVoicesProviderGet({
                    path: { provider: provider as never },
                    query,
                });
                if (response.data?.voices && response.data.voices.length > 0) {
                    fetchedVoices = response.data.voices;
                    if (response.data.facets) {
                        fetchedFacets = {
                            genders: response.data.facets.genders ?? [],
                            accents: response.data.facets.accents ?? [],
                            languages: response.data.facets.languages ?? [],
                        };
                    }
                }
            } catch {
                // Ignore network failure; fallback handles it
            }

            if (id !== requestId.current) return;

            if (fetchedVoices.length === 0) {
                // Fallback to presets
                const provKey = (provider || '').toLowerCase();
                const presets = FALLBACK_PRESETS[provKey] || [];
                let filtered = presets;
                const s = debouncedSearch.trim().toLowerCase();
                if (s) {
                    filtered = filtered.filter(v =>
                        v.name.toLowerCase().includes(s) ||
                        v.voice_id.toLowerCase().includes(s) ||
                        (v.description && v.description.toLowerCase().includes(s))
                    );
                }
                if (gender !== ALL_FILTER_VALUE) filtered = filtered.filter(v => v.gender?.toLowerCase() === gender.toLowerCase());
                if (accent !== ALL_FILTER_VALUE) filtered = filtered.filter(v => v.accent?.toLowerCase() === accent.toLowerCase());
                if (language !== ALL_FILTER_VALUE) filtered = filtered.filter(v => v.language?.toLowerCase() === language.toLowerCase());

                setVoices(filtered);
                setFacets({
                    genders: Array.from(new Set(presets.map(v => v.gender).filter(Boolean) as string[])),
                    accents: Array.from(new Set(presets.map(v => v.accent).filter(Boolean) as string[])),
                    languages: Array.from(new Set(presets.map(v => v.language).filter(Boolean) as string[])),
                });
                setError(null);
            } else {
                setVoices(fetchedVoices);
                if (fetchedFacets) {
                    setFacets(fetchedFacets);
                }
            }
            setIsLoading(false);
        })();
    }, [isOpen, manualMode, provider, model, gender, accent, language, debouncedSearch]);

    // Stop any preview when the modal closes / unmounts.
    useEffect(() => {
        if (!isOpen) stopPreview();
        return () => stopPreview();
    }, [isOpen, stopPreview]);

    // Facets arrive sorted by raw code; present them sorted by display label so
    // the dropdowns read alphabetically (e.g. "American" near the top, not "us").
    const toSortedOptions = (codes: string[], selected: string, label: (code: string) => string) =>
        withSelected(codes, selected)
            .map((code) => ({ value: code, label: label(code) }))
            .sort((a, b) => a.label.localeCompare(b.label));

    const genderOptions = useMemo(
        () => toSortedOptions(facets.genders, gender, genderLabel),
        [facets.genders, gender],
    );
    const accentOptions = useMemo(
        () => toSortedOptions(facets.accents, accent, accentLabel),
        [facets.accents, accent],
    );
    const languageOptions = useMemo(
        () => toSortedOptions(facets.languages, language, languageLabel),
        [facets.languages, language],
    );

    const openModal = () => {
        setGender(ALL_FILTER_VALUE);
        setAccent(ALL_FILTER_VALUE);
        setLanguage(ALL_FILTER_VALUE);
        setSearchInput("");
        setDebouncedSearch("");
        setManualMode(false);
        setManualVoiceId(value);
        setPendingVoiceId(value);
        setIsOpen(true);
    };

    const playPreview = (voice: VoiceInfo) => {
        if (playingVoiceId === voice.voice_id) {
            stopPreview();
            return;
        }
        stopPreview();
        if (!voice.preview_url) return;
        const audio = new Audio(voice.preview_url);
        audioRef.current = audio;
        setPlayingVoiceId(voice.voice_id);
        const clear = () => {
            if (audioRef.current === audio) audioRef.current = null;
            setPlayingVoiceId((current) => (current === voice.voice_id ? null : current));
        };
        audio.onended = clear;
        audio.onerror = clear;
        audio.play().catch(clear);
    };

    const commitSelection = () => {
        if (manualMode) {
            const next = manualVoiceId.trim();
            if (next) onChange(next);
        } else if (pendingVoiceId) {
            onChange(pendingVoiceId);
            const chosen = voices.find((voice) => voice.voice_id === pendingVoiceId);
            if (chosen) setSelectedVoiceInfo(chosen);
        }
        setIsOpen(false);
    };

    const triggerLabel = selectedVoiceInfo?.name || value || "Select a voice";
    const triggerTraits = selectedVoiceInfo ? voiceTraits(selectedVoiceInfo) : "";

    return (
        <div className={cn("space-y-2", className)}>
            <Button
                type="button"
                variant="outline"
                className={cn("w-full justify-between", !value && "text-muted-foreground")}
                onClick={openModal}
            >
                <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-medium">{triggerLabel}</span>
                    {triggerTraits && (
                        <span className="truncate text-xs text-muted-foreground">{triggerTraits}</span>
                    )}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
                    <DialogHeader className="border-b px-6 py-4">
                        <DialogTitle>Select Voice</DialogTitle>
                    </DialogHeader>

                    {/* Filter row: Gender · Accent · Language · Search */}
                    <div className="flex flex-wrap items-center gap-2 border-b px-6 py-3">
                        <Select value={gender} onValueChange={setGender} disabled={manualMode}>
                            <SelectTrigger className="h-9 w-[130px]">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_FILTER_VALUE}>All genders</SelectItem>
                                {genderOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={accent} onValueChange={setAccent} disabled={manualMode}>
                            <SelectTrigger className="h-9 w-[140px]">
                                <SelectValue placeholder="Accent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_FILTER_VALUE}>All accents</SelectItem>
                                {accentOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={language} onValueChange={setLanguage} disabled={manualMode}>
                            <SelectTrigger className="h-9 w-[150px]">
                                <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_FILTER_VALUE}>All languages</SelectItem>
                                {languageOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Search voices..."
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            className="h-9 min-w-[160px] flex-1"
                            disabled={manualMode}
                        />
                    </div>

                    {/* Body */}
                    <div className="min-h-[260px] flex-1 overflow-auto px-6 py-4">
                        {manualMode ? (
                            <div className="space-y-2">
                                <Label htmlFor="manual-voice-id">Custom voice ID</Label>
                                <Input
                                    id="manual-voice-id"
                                    placeholder="Enter voice ID"
                                    value={manualVoiceId}
                                    onChange={(event) => setManualVoiceId(event.target.value)}
                                    autoFocus
                                />
                                <p className="text-xs text-muted-foreground">
                                    Use a voice ID that isn&apos;t in the catalog above.
                                </p>
                            </div>
                        ) : error ? (
                            <p className="py-10 text-center text-sm text-destructive">{error}</p>
                        ) : isLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : voices.length === 0 ? (
                            <p className="py-10 text-center text-sm text-muted-foreground">
                                No voices match these filters
                            </p>
                        ) : (
                            <div className="grid gap-2 sm:grid-cols-2">
                                {voices.map((voice) => {
                                    const isSelected = pendingVoiceId === voice.voice_id;
                                    const isPlaying = playingVoiceId === voice.voice_id;
                                    return (
                                        <button
                                            type="button"
                                            key={voice.voice_id}
                                            onClick={() => setPendingVoiceId(voice.voice_id)}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent",
                                                isSelected ? "border-primary ring-1 ring-primary" : "border-border",
                                            )}
                                        >
                                            <span
                                                role="button"
                                                tabIndex={voice.preview_url ? 0 : -1}
                                                aria-label={isPlaying ? "Stop preview" : "Play preview"}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    playPreview(voice);
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter" || event.key === " ") {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        playPreview(voice);
                                                    }
                                                }}
                                                className={cn(
                                                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                                                    voice.preview_url
                                                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                                                        : "bg-muted text-muted-foreground",
                                                )}
                                            >
                                                {isPlaying ? (
                                                    <Square className="h-4 w-4 fill-current" />
                                                ) : (
                                                    <Play className="h-4 w-4 fill-current" />
                                                )}
                                            </span>
                                            <span className="flex min-w-0 flex-1 flex-col">
                                                <span className="flex items-center gap-2">
                                                    <span className="truncate text-sm font-medium">{voice.name}</span>
                                                    {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                                                </span>
                                                {voiceTraits(voice) && (
                                                    <span className="truncate text-xs text-muted-foreground">
                                                        {voiceTraits(voice)}
                                                    </span>
                                                )}
                                                <span className="truncate text-[11px] text-muted-foreground/70">
                                                    ID: {voice.voice_id}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3 border-t px-6 py-3">
                        {allowManualInput ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground"
                                onClick={() => setManualMode((prev) => !prev)}
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                {manualMode ? "Browse catalog" : "Custom voice ID"}
                            </Button>
                        ) : (
                            <span className="text-xs text-muted-foreground">
                                {!manualMode && !isLoading && !error ? `${voices.length} voices` : ""}
                            </span>
                        )}
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={commitSelection}
                                disabled={manualMode ? !manualVoiceId.trim() : !pendingVoiceId}
                            >
                                Use this voice
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};
