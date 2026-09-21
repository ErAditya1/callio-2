'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BotIcon,
  CheckIcon,
  CheckmarkCircle02Icon,
  Copy01Icon,
  MessageSquareIcon,
  PhoneIncomingIcon,
  PhoneOutgoingIcon,
  PlayIcon,
  RefreshCwIcon,
  SendIcon,
  SparklesIcon,
  UserIcon,
  WorkflowIcon,
} from "@hugeicons/core-free-icons";;

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import { resolveBrowserBackendUrl } from '@/lib/apiClient';
import logger from '@/lib/logger';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    quickReplies?: string[];
}

interface WorkflowDraft {
    name: string;
    call_type: 'inbound' | 'outbound';
    language: string;
    first_message: string;
    system_prompt: string;
    questions_to_ask: string[];
    workflow_definition?: Record<string, any>;
}

export default function CreateWorkflowPage() {
    const router = useRouter();
    const { user, getAccessToken } = useAuth();

    // Mode Toggle: 'classic' (default fast entry form) vs 'copilot' (interactive Q&A)
    const [builderMode, setBuilderMode] = useState<'copilot' | 'classic'>('classic');

    // Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content:
                "Namaste! Main aapka **Voice AI Agent Architect** hoon 🎙️✨\n\nAap kaisa voice calling agent banana chahte hain? (Jaise Real Estate Lead Qualification, Clinic Appointment Booking, ya Customer Support?)",
            quickReplies: [
                '🏢 Real Estate Lead Qualification',
                '🩺 Clinic Appointment Booking',
                '🎧 Inbound Customer Support',
                '🚀 Outbound Sales Follow-up',
            ],
        },
    ]);

    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [showFullPrompt, setShowFullPrompt] = useState(false);

    // Live Draft State
    const [workflowDraft, setWorkflowDraft] = useState<WorkflowDraft | null>(null);
    const [workflowId, setWorkflowId] = useState<number | null>(null);
    const [isReadyToTest, setIsReadyToTest] = useState(false);

    // Classic Form State
    const [classicCallType, setClassicCallType] = useState<'inbound' | 'outbound'>('inbound');
    const [classicUseCase, setClassicUseCase] = useState('');
    const [classicActivityDescription, setClassicActivityDescription] = useState('');
    const [classicError, setClassicError] = useState<string | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll only the chat message container to bottom without scrolling parent page
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isLoading]);

    // Send a message to the Copilot API
    const handleSendMessage = async (textToSend?: string) => {
        const query = (textToSend || inputMessage).trim();
        if (!query || isLoading) return;

        setInputMessage('');

        const newHistory: ChatMessage[] = [
            ...messages,
            { role: 'user', content: query },
        ];
        setMessages(newHistory);
        setIsLoading(true);

        try {
            const token = await getAccessToken();
            const baseUrl = resolveBrowserBackendUrl();

            const res = await fetch(`${baseUrl}/api/v1/workflow/copilot/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    messages: newHistory.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    current_workflow_id: workflowId,
                    current_workflow_draft: workflowDraft,
                    save_draft: true,
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Server returned ${res.status}: ${errText}`);
            }

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.reply_message,
                    quickReplies: data.suggested_quick_replies || [],
                },
            ]);

            if (data.workflow_draft) {
                setWorkflowDraft(data.workflow_draft);
            }
            if (data.workflow_id) {
                setWorkflowId(data.workflow_id);
            }
            if (data.is_ready_to_test) {
                setIsReadyToTest(true);
            }
        } catch (err: any) {
            logger.error(`Copilot error: ${err}`);
            const errorMsg = err?.message || String(err);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: `Maaf kijiye, response process karne me issue aaya (${errorMsg.slice(0, 150)}). Kripya dobara koshish karein ya seedha Studio open karein.`,
                    quickReplies: ['Dobara koshish karein', 'Open in Studio'],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Quick Reply Pill click handler
    const handleQuickReply = (reply: string) => {
        const lower = reply.toLowerCase();
        if (
            lower.includes('run test') ||
            lower.includes('start test') ||
            lower.includes('open in studio')
        ) {
            handleOpenInStudio();
            return;
        }

        if (lower.includes('export json') || lower.includes('export config')) {
            if (workflowDraft) {
                const blob = new Blob(
                    [JSON.stringify(workflowDraft, null, 2)],
                    { type: 'application/json' }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${(workflowDraft.name || 'agent').replace(/\s+/g, '_')}_workflow.json`;
                a.click();
                URL.revokeObjectURL(url);
                return;
            }
        }

        handleSendMessage(reply);
    };

    // Save and redirect to workflow studio canvas
    const handleOpenInStudio = async () => {
        if (workflowId) {
            router.push(`/workflow/${workflowId}`);
            return;
        }

        if (!workflowDraft) return;

        setIsSaving(true);
        try {
            const token = await getAccessToken();
            const baseUrl = resolveBrowserBackendUrl();

            const res = await fetch(`${baseUrl}/api/v1/workflow/copilot/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    messages: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    current_workflow_id: workflowId,
                    current_workflow_draft: workflowDraft,
                    save_draft: true,
                }),
            });

            const data = await res.json();
            if (data.workflow_id) {
                router.push(`/workflow/${data.workflow_id}`);
            }
        } catch (err) {
            logger.error(`Error finalizing workflow: ${err}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Classic Submit Handler
    const handleClassicSubmit = async () => {
        if (!classicUseCase || !classicActivityDescription) {
            setClassicError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setClassicError(null);

        try {
            const token = await getAccessToken();
            const baseUrl = resolveBrowserBackendUrl();

            const res = await fetch(`${baseUrl}/api/v1/workflow/create/template`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    call_type: classicCallType,
                    use_case: classicUseCase,
                    activity_description: classicActivityDescription,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to create workflow');
            }

            const data = await res.json();
            if (data.id) {
                router.push(`/workflow/${data.id}?copilot=open`);
            }
        } catch (err: any) {
            setClassicError(err?.message || 'Failed to create workflow');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`bg-background text-foreground flex flex-col ${
                builderMode === 'copilot'
                    ? 'h-screen overflow-hidden'
                    : 'min-h-screen overflow-y-auto'
            }`}
        >
            {/* Top Navigation Bar */}
            <header className="border-b bg-[#FFFFFF] backdrop-blur-md sticky top-0 z-20 px-4 lg:px-8 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/workflow"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#737373] hover:text-foreground transition-colors"
                    >
                        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
                        Back
                    </Link>
                    <div className="h-4 w-px bg-border mx-1" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-tight">
                                AI Agent Architect
                            </h1>
                            <p className="text-xs text-[#737373]">
                                Interactive Conversational Agent Builder
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-[#F7F7F7] p-0.5 rounded-lg border text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => setBuilderMode('copilot')}
                            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                                builderMode === 'copilot'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-[#737373] hover:text-foreground'
                            }`}
                        >
                            <HugeiconsIcon icon={BotIcon} className="w-3.5 h-3.5 text-primary" />
                            AI Copilot
                        </button>
                        <button
                            type="button"
                            onClick={() => setBuilderMode('classic')}
                            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                                builderMode === 'classic'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-[#737373] hover:text-foreground'
                            }`}
                        >
                            Classic Form
                        </button>
                    </div>

                    {workflowDraft && (
                        <Button
                            size="sm"
                            onClick={handleOpenInStudio}
                            disabled={isSaving}
                            className="gap-2 shadow-sm font-medium bg-neutral-950 hover:bg-neutral-800 text-white"
                        >
                            {isSaving ? (
                                <>
                                    <HugeiconsIcon icon={RefreshCwIcon} className="w-3.5 h-3.5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Open in Studio
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5" />
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </header>

            {/* Classic Form Fallback */}
            {builderMode === 'classic' ? (
                <div className="app-page max-w-2xl flex-1 flex flex-col justify-center">
                    <div className="w-full my-auto py-2">
                        <Card className="shadow-md border-[#E5E5E5]">
                            <CardHeader>
                                <CardTitle className="text-xl">Create Voice Agent (Classic)</CardTitle>
                                <CardDescription>
                                    Enter your agent details or paste your full system prompt to generate your voice workflow.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="call-type">Call Direction</Label>
                                    <Select
                                        value={classicCallType}
                                        onValueChange={(val) =>
                                            setClassicCallType(val as 'inbound' | 'outbound')
                                        }
                                    >
                                        <SelectTrigger id="call-type">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="inbound">
                                                Inbound (Customers call your AI)
                                            </SelectItem>
                                            <SelectItem value="outbound">
                                                Outbound (AI calls customers)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="use-case">Use Case Name</Label>
                                    <Input
                                        id="use-case"
                                        placeholder="e.g., CampusAssist, Clinic Receptionist"
                                        value={classicUseCase}
                                        onChange={(e) => setClassicUseCase(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="activity-description">
                                            Activity & Agent Description / System Prompt
                                        </Label>
                                        <span className="text-[11px] text-[#737373]">
                                            {classicActivityDescription.length > 0 && `${classicActivityDescription.length} characters`}
                                        </span>
                                    </div>
                                    <Textarea
                                        id="activity-description"
                                        placeholder="Describe what the agent should say, its rules, and departments..."
                                        value={classicActivityDescription}
                                        onChange={(e) =>
                                            setClassicActivityDescription(e.target.value)
                                        }
                                        rows={8}
                                        className="font-mono text-xs leading-relaxed resize-y"
                                    />
                                </div>

                                {classicError && (
                                    <p className="text-sm text-red-500 font-medium">
                                        {classicError}
                                    </p>
                                )}

                                <Button
                                    onClick={handleClassicSubmit}
                                    disabled={isLoading}
                                    className="w-full gap-2 py-5 font-medium shadow-sm"
                                >
                                    {isLoading ? (
                                        <>
                                            <HugeiconsIcon icon={RefreshCwIcon} className="w-4 h-4 animate-spin" />
                                            Generating Agent...
                                        </>
                                    ) : (
                                        <>
                                            <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4" />
                                            Generate & Open Canvas
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                /* Interactive Split Screen Copilot Layout */
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-[calc(100vh-61px)]">
                    {/* Left Pane: Interactive Chat Conversation */}
                    <div className="lg:col-span-6 xl:col-span-7 flex flex-col border-r h-full bg-background/50 overflow-hidden">
                        {/* Messages Feed */}
                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3.5 ${
                                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                            <HugeiconsIcon icon={BotIcon} className="w-4 h-4" />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[85%] space-y-3 ${
                                            msg.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm'
                                                : 'bg-[#FFFFFF] border text-card-foreground rounded-2xl rounded-tl-sm px-4 py-3.5 shadow-sm'
                                        }`}
                                    >
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {msg.content}
                                        </div>

                                        {/* Suggested Quick Reply Pills */}
                                        {msg.quickReplies && msg.quickReplies.length > 0 && (
                                            <div className="pt-2 flex flex-wrap gap-2 border-t border-[#E5E5E5]">
                                                {msg.quickReplies.map((pill, pIdx) => (
                                                    <button
                                                        key={pIdx}
                                                        type="button"
                                                        onClick={() => handleQuickReply(pill)}
                                                        disabled={isLoading}
                                                        className="text-xs bg-[#F7F7F7]/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40 border text-foreground/80 px-2.5 py-1.5 rounded-full transition-all text-left font-medium"
                                                    >
                                                        {pill}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-[#F7F7F7] border text-[#737373] flex items-center justify-center shrink-0 mt-0.5">
                                            <HugeiconsIcon icon={UserIcon} className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isLoading && (
                                <div className="flex gap-3.5 items-center">
                                    <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0 shadow-sm">
                                        <HugeiconsIcon icon={BotIcon} className="w-4 h-4" />
                                    </div>
                                    <div className="bg-[#FFFFFF] border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                                        <div
                                            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                                            style={{ animationDelay: '0.2s' }}
                                        />
                                        <div
                                            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                                            style={{ animationDelay: '0.4s' }}
                                        />
                                        <span className="text-xs text-[#737373] ml-2">
                                            Architect is thinking & updating blueprint...
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input Bar */}
                        <div className="p-4 border-t bg-[#FFFFFF] backdrop-blur-sm">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="relative flex items-center"
                            >
                                <Input
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="Type your answer or instructions... (e.g. 'Sneha naam rakho, Hindi-English mix bole')"
                                    disabled={isLoading}
                                    className="pr-24 py-6 text-sm bg-background/80 shadow-inner rounded-xl border-[#E5E5E5] focus-visible:ring-primary/40"
                                />
                                <div className="absolute right-2 flex items-center gap-1">
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={!inputMessage.trim() || isLoading}
                                        className="rounded-lg h-9 px-3 gap-1.5 bg-primary text-primary-foreground shadow-sm"
                                    >
                                        <HugeiconsIcon icon={SendIcon} className="w-3.5 h-3.5" />
                                        Send
                                    </Button>
                                </div>
                            </form>
                            <p className="text-[11px] text-[#737373] mt-2 px-1 text-center">
                                Tip: You can reply in Hindi, Hinglish, or English. Copilot will design the agent accordingly.
                            </p>
                        </div>
                    </div>

                    {/* Right Pane: Live Agent Blueprint (Artifacts Card) */}
                    <div className="lg:col-span-6 xl:col-span-5 flex flex-col h-full bg-[#F7F7F7] overflow-y-auto p-4 lg:p-6 space-y-5">
                        {/* Blueprint Card Header */}
                        <div className="flex items-center justify-between pb-3 border-b">
                            <div>
                                <h2 className="text-base font-semibold flex items-center gap-2">
                                    <HugeiconsIcon icon={WorkflowIcon} className="w-4 h-4 text-primary" />
                                    Live Agent Blueprint
                                </h2>
                                <p className="text-xs text-[#737373]">
                                    Updates in real-time as you chat with the Copilot
                                </p>
                            </div>

                            {workflowDraft ? (
                                <Badge
                                    variant="outline"
                                    className={`text-xs gap-1.5 py-1 px-2.5 ${
                                        isReadyToTest
                                            ? 'bg-[#F0F3F9] text-[#7186AD] border-[#DCE3EF] font-semibold'
                                            : 'bg-[#E5E5E5]/10 text-amber-600 border-amber-500/30'
                                    }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                            isReadyToTest
                                                ? 'bg-[#171717] animate-pulse'
                                                : 'bg-[#E5E5E5]'
                                        }`}
                                    />
                                    {isReadyToTest ? 'Ready to Deploy' : 'Drafting...'}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-xs">
                                    Waiting for input
                                </Badge>
                            )}
                        </div>

                        {/* Blueprint Body */}
                        {workflowDraft ? (
                            <div className="space-y-4">
                                {/* Agent Identity Box */}
                                <Card className="border-[#E5E5E5] shadow-sm bg-[#FFFFFF]">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className="text-[11px] uppercase tracking-wider text-[#737373] font-semibold">
                                                    Agent Name
                                                </span>
                                                <h3 className="text-lg font-bold text-foreground">
                                                    {workflowDraft.name}
                                                </h3>
                                            </div>
                                            <div className="flex gap-1.5">
                                                <Badge
                                                    variant="secondary"
                                                    className="gap-1 capitalize text-xs"
                                                >
                                                    {workflowDraft.call_type === 'inbound' ? (
                                                        <HugeiconsIcon icon={PhoneIncomingIcon} className="w-3 h-3 text-[#7186AD]" />
                                                    ) : (
                                                        <HugeiconsIcon icon={PhoneOutgoingIcon} className="w-3 h-3 text-amber-500" />
                                                    )}
                                                    {workflowDraft.call_type}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs uppercase">
                                                    {workflowDraft.language || 'EN'}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Opening Line / First Message */}
                                        <div className="space-y-1.5 pt-2 border-t">
                                            <span className="text-[11px] uppercase tracking-wider text-[#737373] font-semibold flex items-center gap-1">
                                                <HugeiconsIcon icon={MessageSquareIcon} className="w-3 h-3" />
                                                Opening Greeting (Spoken First)
                                            </span>
                                            <div className="p-3 bg-[#F7F7F7] rounded-lg text-sm border font-normal italic text-foreground/90 leading-relaxed">
                                                &ldquo;{workflowDraft.first_message}&rdquo;
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Questions / Extraction Checklist */}
                                {workflowDraft.questions_to_ask &&
                                    workflowDraft.questions_to_ask.length > 0 && (
                                        <Card className="border-[#E5E5E5] shadow-sm bg-[#FFFFFF]">
                                            <CardContent className="p-4 space-y-2.5">
                                                <span className="text-[11px] uppercase tracking-wider text-[#737373] font-semibold flex items-center gap-1.5">
                                                    <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5 text-[#7186AD]" />
                                                    Information to Gather
                                                </span>
                                                <div className="grid grid-cols-1 gap-1.5">
                                                    {workflowDraft.questions_to_ask.map(
                                                        (q, qIdx) => (
                                                            <div
                                                                key={qIdx}
                                                                className="flex items-center gap-2 text-xs bg-[#F7F7F7] p-2 rounded-md border text-foreground/90 font-medium"
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                                {q}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                {/* System Prompt Preview */}
                                <Card className="border-[#E5E5E5] shadow-sm bg-[#FFFFFF]">
                                    <CardContent className="p-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] uppercase tracking-wider text-[#737373] font-semibold">
                                                Persona & Rules (System Prompt)
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        workflowDraft.system_prompt
                                                    );
                                                    setCopiedPrompt(true);
                                                    setTimeout(() => setCopiedPrompt(false), 2000);
                                                }}
                                                className="text-xs text-[#737373] hover:text-foreground flex items-center gap-1 transition-colors"
                                            >
                                                {copiedPrompt ? (
                                                    <HugeiconsIcon icon={CheckIcon} className="w-3 h-3 text-[#7186AD]" />
                                                ) : (
                                                    <HugeiconsIcon icon={Copy01Icon} className="w-3 h-3" />
                                                )}
                                                {copiedPrompt ? 'Copied' : 'Copy'}
                                            </button>
                                        </div>

                                        <div
                                            className={`p-3 bg-[#F7F7F7] rounded-lg text-xs font-mono text-[#737373] whitespace-pre-wrap leading-relaxed border ${
                                                !showFullPrompt ? 'max-h-36 overflow-hidden' : ''
                                            }`}
                                        >
                                            {workflowDraft.system_prompt}
                                        </div>

                                        {workflowDraft.system_prompt.length > 200 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowFullPrompt(!showFullPrompt)}
                                                className="text-xs text-primary font-medium hover:underline pt-1"
                                            >
                                                {showFullPrompt ? 'Show Less' : 'Show Full Prompt'}
                                            </button>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Flow Graph Visual Steps */}
                                <Card className="border-[#E5E5E5] shadow-sm bg-[#FFFFFF]">
                                    <CardContent className="p-4 space-y-2.5">
                                        <span className="text-[11px] uppercase tracking-wider text-[#737373] font-semibold">
                                            Generated Canvas Flow Nodes
                                        </span>
                                        <div className="flex items-center justify-between p-3 bg-[#F7F7F7] rounded-lg border text-xs font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#F0F3F9] text-[#7186AD] flex items-center justify-center font-bold text-[10px]">
                                                    1
                                                </div>
                                                <span>Start Call</span>
                                            </div>
                                            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#737373]" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#F0F3F9] text-[#7186AD] flex items-center justify-center font-bold text-[10px]">
                                                    2
                                                </div>
                                                <span>Agent ({workflowDraft.name})</span>
                                            </div>
                                            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 text-[#737373]" />
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-[#F0F3F9] text-[#7186AD] flex items-center justify-center font-bold text-[10px]">
                                                    3
                                                </div>
                                                <span>End Call</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="pt-2">
                                    <Button
                                        onClick={handleOpenInStudio}
                                        disabled={isSaving}
                                        className="w-full py-6 text-sm font-semibold gap-2 shadow-md bg-neutral-950 hover:bg-neutral-800 text-white"
                                    >
                                        {isSaving ? (
                                            <>
                                                <HugeiconsIcon icon={RefreshCwIcon} className="w-4 h-4 animate-spin" />
                                                Finalizing & Saving Agent...
                                            </>
                                        ) : (
                                            <>
                                                <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4" />
                                                Open in Canvas Studio & Test Voice Call
                                                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-[11px] text-[#737373] text-center mt-2">
                                        You can test speaking with this agent via your microphone inside the Studio!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Empty State when no conversation yet */
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-2xl border-[#E5E5E5]">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                                    <HugeiconsIcon icon={BotIcon} className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-sm mb-1">
                                    Agent Blueprint will appear here
                                </h3>
                                <p className="text-xs text-[#737373] max-w-xs mb-4">
                                    Reply to the Copilot on the left or tap a suggestion pill to start creating your agent.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleSendMessage(
                                                'Mujhe real estate lead qualification agent banana hai'
                                            )
                                        }
                                        className="text-xs"
                                    >
                                        🏢 Try Real Estate Agent
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleSendMessage(
                                                'Clinic ke liye doctor appointment booking agent banayein'
                                            )
                                        }
                                        className="text-xs"
                                    >
                                        🩺 Try Clinic Booking
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
