'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    BotIcon,
    Calendar01Icon,
    CheckIcon,
    CheckmarkCircle02Icon,
    Copy01Icon,
    InfoIcon,
    Layers01Icon,
    Mail01Icon,
    MessageSquareIcon,
    PhoneIcon,
    PhoneIncomingIcon,
    PhoneOutgoingIcon,
    PlayIcon,
    PlusIcon,
    RefreshCwIcon,
    SendIcon,
    SparklesIcon,
    TrashIcon,
    UserIcon,
    WorkflowIcon,
} from "@hugeicons/core-free-icons";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { WorkflowTemplateSheet } from '@/components/workflow/WorkflowTemplateSheet';
import { useAuth } from '@/lib/auth';
import { resolveBrowserBackendUrl } from '@/lib/apiClient';
import logger from '@/lib/logger';
import { Upload, FileJson, CheckCircle2, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

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

interface StarterTemplate {
    id: string;
    title: string;
    icon: string;
    badge: string;
    callType: 'inbound' | 'outbound';
    language: string;
    tone: string;
    useCase: string;
    description: string;
    prompt: string;
}

const STARTER_TEMPLATES: StarterTemplate[] = [
    {
        id: 'real-estate',
        title: 'Real Estate Lead Qualifier',
        icon: '🏢',
        badge: 'Inbound',
        callType: 'inbound',
        language: 'en',
        tone: 'Professional & Warm',
        useCase: 'Prime Realty Lead Qualifier',
        description: 'Qualify property buyers & renters, collect budget and schedule site visits.',
        prompt: `You are Priya, a professional and welcoming leasing & sales advisor for Prime Realty.
Goal: Greet incoming callers looking for properties, qualify their requirements, and schedule a consultation or site visit with a real estate advisor.
Key information to collect:
1. Preferred location or neighborhood
2. Budget range (monthly rent or purchase price)
3. Property type (1BHK, 2BHK, 3BHK, Villa, Commercial)
4. Target move-in date
5. Contact name, phone number, and email
Rules:
- Be warm, courteous, and efficient.
- Answer questions about property listings concisely.
- Propose tours or consultations within the next 3-5 business days.
- Never invent prices or availability that are unverified.`
    },
    {
        id: 'clinic-booking',
        title: 'Clinic Receptionist',
        icon: '🩺',
        badge: 'Inbound',
        callType: 'inbound',
        language: 'en',
        tone: 'Empathetic & Courteous',
        useCase: 'Apex Care Clinic Receptionist',
        description: 'Schedule doctor appointments, triage patient concerns, and share clinic hours.',
        prompt: `You are Sarah, a compassionate medical receptionist at Apex Health Clinic.
Goal: Assist patients who call to schedule, reschedule, or check doctor appointments.
Key information to collect:
1. Patient's full name and contact number
2. Chief reason for visit (Routine Checkup, Dental, Pediatrics, Consultation)
3. Preferred doctor or department
4. Preferred day and time window (Morning vs Afternoon)
5. Insurance or self-pay status
Rules:
- Maintain patient confidentiality and professional empathy.
- For medical emergencies (severe pain, breathing difficulty), advise them immediately to dial emergency services (911/112).
- When a patient asks to book, always use the check_available_slots and book_appointment tools.
- When a patient asks about an existing appointment status or gives their phone number, always check using the lookup_appointment tool.
- NEVER claim an appointment is booked or confirmed until the booking tool explicitly confirms it, and never promise WhatsApp/SMS if not sent.`
    },
    {
        id: 'customer-support',
        title: 'Customer Care & FAQ',
        icon: '🎧',
        badge: 'Inbound',
        callType: 'inbound',
        language: 'en',
        tone: 'Friendly & Solution-Oriented',
        useCase: 'OmniDesk Customer Support',
        description: 'Handle general product inquiries, troubleshoot common issues, and route complex cases.',
        prompt: `You are Alex, an expert customer support specialist for OmniDesk.
Goal: Provide rapid, helpful answers to user inquiries about subscriptions, billing, and troubleshooting.
Key information to collect:
1. Account email address or registered mobile number
2. Exact product feature or error encountered
3. Device or browser version if applicable
Rules:
- Keep responses concise (under 3 sentences) to maintain a natural voice rhythm.
- If a technical bug is detected, log a ticket and assure the customer of a response within 4 hours.
- Escalate to human Tier-2 support whenever the customer asks to speak with a manager.`
    },
    {
        id: 'sales-outbound',
        title: 'Outbound Sales Follow-Up',
        icon: '🚀',
        badge: 'Outbound',
        callType: 'outbound',
        language: 'en',
        tone: 'Confident & Persuasive',
        useCase: 'SaaS Growth Outbound Outreach',
        description: 'Follow up with webinar attendees or trial signups to secure demo bookings.',
        prompt: `You are Jordan, a Business Development Executive at CloudScale Solutions.
Goal: Reach out to prospects who recently downloaded our industry whitepaper or started a trial, and schedule a 15-minute executive demo.
Key information to collect:
1. Current team size and tech stack
2. Primary operational bottleneck (e.g., latency, cloud cost, manual workflows)
3. Best date and time for a Zoom meeting with our Solution Architect
Rules:
- State the reason for your call within the first 10 seconds.
- Respect objections: if the contact is busy, ask for a convenient time to callback.
- If they are not interested, thank them respectfully and conclude the call gracefully.`
    },
    {
        id: 'ecommerce-tracker',
        title: 'E-Commerce Order Desk',
        icon: '📦',
        badge: 'Inbound',
        callType: 'inbound',
        language: 'en',
        tone: 'Upbeat & Efficient',
        useCase: 'LuxeStore Order & Returns Desk',
        description: 'Verify shipment tracking numbers, initiate return labels, and check stock.',
        prompt: `You are Maya, a cheerful customer assistant for LuxeStore Online.
Goal: Assist customers with order tracking, return requests, and exchange inquiries.
Key information to collect:
1. 8-digit Order Confirmation Number
2. Customer last name or billing zip code
3. Specific inquiry (Tracking status, Return request, Item exchange)
Rules:
- Clearly communicate tracking updates and estimated delivery dates.
- For returns, confirm that items are unused and within the 30-day window.
- Email return shipping label upon confirmation.`
    }
];

export default function CreateWorkflowPage() {
    const router = useRouter();
    const { user, getAccessToken } = useAuth();

    // Mode Toggle: 'studio' (visual studio form), 'copilot' (interactive Q&A)
    const [builderMode, setBuilderMode] = useState<'studio' | 'copilot'>('studio');

    // Workflow Import State
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importName, setImportName] = useState('');
    const [importJsonData, setImportJsonData] = useState<{
        name?: string;
        workflow_definition: any;
    } | null>(null);
    const [importStats, setImportStats] = useState<{
        nodesCount: number;
        edgesCount: number;
        fileName: string;
        fileSizeKb: number;
    } | null>(null);

    // Workflow JSON Import Handlers
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await processImportFile(file);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const processImportFile = async (file: File) => {
        try {
            const text = await file.text();
            let parsed: any;
            try {
                parsed = JSON.parse(text);
            } catch {
                toast.error('Invalid JSON file. Please select a valid workflow JSON file.');
                return;
            }

            let wfDef: any = null;
            let detectedName = file.name.replace(/\.[^/.]+$/, '');

            if (parsed.workflow_definition && (parsed.workflow_definition.nodes || Array.isArray(parsed.workflow_definition))) {
                wfDef = parsed.workflow_definition;
                if (parsed.name) detectedName = parsed.name;
            } else if (parsed.nodes) {
                wfDef = {
                    nodes: parsed.nodes,
                    edges: parsed.edges || [],
                    viewport: parsed.viewport || { x: 0, y: 0, zoom: 1 },
                };
                if (parsed.name) detectedName = parsed.name;
            } else {
                toast.error('Could not find valid workflow nodes/edges in this JSON file.');
                return;
            }

            const nodesCount = Array.isArray(wfDef.nodes) ? wfDef.nodes.length : 0;
            const edgesCount = Array.isArray(wfDef.edges) ? wfDef.edges.length : 0;

            if (nodesCount === 0) {
                toast.error('Workflow definition contains no nodes.');
                return;
            }

            setImportJsonData({
                name: detectedName,
                workflow_definition: wfDef,
            });
            setImportStats({
                nodesCount,
                edgesCount,
                fileName: file.name,
                fileSizeKb: Math.max(1, Math.round(file.size / 1024)),
            });
            setImportName(detectedName);
            setImportModalOpen(true);
        } catch (err: any) {
            toast.error('Failed to read file: ' + (err?.message || 'Unknown error'));
        }
    };

    const handleConfirmImport = async () => {
        if (!importJsonData || !importName.trim()) {
            toast.error('Workflow name is required');
            return;
        }

        try {
            setIsImporting(true);
            const token = await getAccessToken();
            const baseUrl = resolveBrowserBackendUrl();

            const res = await fetch(`${baseUrl}/api/v1/workflow/create/definition`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    name: importName.trim(),
                    workflow_definition: importJsonData.workflow_definition,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                const msg = Array.isArray(err?.detail)
                    ? err.detail.map((e: any) => e.msg || e.message).join(', ')
                    : (typeof err?.detail === 'string' ? err.detail : (err?.message || 'Failed to import workflow'));
                throw new Error(msg);
            }

            const data = await res.json();
            toast.success('Workflow imported successfully!');
            setImportModalOpen(false);
            if (data.id) {
                router.push(`/workflow/${data.id}`);
            }
        } catch (err: any) {
            toast.error(err?.message || 'Error importing workflow');
        } finally {
            setIsImporting(false);
        }
    };

    const handleInsertPromptChip = (snippet: string) => {
        setClassicActivityDescription((prev) => {
            const trimmed = prev.trim();
            if (!trimmed) return snippet;
            return `${trimmed}\n\n${snippet}`;
        });
    };

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

    // Studio Form State
    const [classicCallType, setClassicCallType] = useState<'inbound' | 'outbound'>('inbound');
    const [classicUseCase, setClassicUseCase] = useState('');
    const [classicActivityDescription, setClassicActivityDescription] = useState('');
    const [classicTone, setClassicTone] = useState('Professional & Courteous');
    const [classicLanguage, setClassicLanguage] = useState('English');
    const [selectedStarterId, setSelectedStarterId] = useState<string | null>(null);
    const [classicError, setClassicError] = useState<string | null>(null);

    const handleSelectStarter = (template: StarterTemplate) => {
        setSelectedStarterId(template.id);
        setClassicCallType(template.callType);
        setClassicUseCase(template.useCase);
        setClassicActivityDescription(template.prompt);
        setClassicTone(template.tone);
        setClassicLanguage(template.language === 'hi' ? 'Hindi' : 'English');
        setClassicError(null);
    };

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
                    current_draft: workflowDraft,
                    workflow_id: workflowId,
                }),
            });

            if (!res.ok) {
                throw new Error(`Copilot service error: ${res.statusText}`);
            }

            const data = await res.json();

            // Update assistant response
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.reply,
                    quickReplies: data.quick_replies || [],
                },
            ]);

            // If draft updated, refresh blueprint
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
            logger.error(`Error in copilot chat: ${err}`);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content:
                        "Kshama karein, ek technical issue aa gaya. Kripya dobara try karein ya seedhe Studio form use karein.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickReply = (pill: string) => {
        handleSendMessage(pill);
    };

    // Open workflow in studio canvas
    const handleOpenInStudio = async () => {
        if (!workflowDraft) return;

        setIsSaving(true);
        try {
            const token = await getAccessToken();
            const baseUrl = resolveBrowserBackendUrl();

            if (workflowId) {
                router.push(`/workflow/${workflowId}?copilot=open`);
                return;
            }

            const res = await fetch(`${baseUrl}/api/v1/workflow/copilot/finalize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    workflow_draft: workflowDraft,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to finalize workflow');
            }

            const data = await res.json();
            if (data.workflow_id) {
                router.push(`/workflow/${data.workflow_id}?copilot=open`);
            }
        } catch (err) {
            logger.error(`Error finalizing workflow: ${err}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Studio Form Submit Handler
    const handleClassicSubmit = async () => {
        if (!classicUseCase || !classicActivityDescription) {
            setClassicError('Please fill in both the Agent Name and Conversational Instructions');
            return;
        }

        setIsLoading(true);
        setClassicError(null);

        try {
            const token = await getAccessToken();
            const baseUrl = resolveBrowserBackendUrl();

            const enrichedPrompt = [
                classicActivityDescription,
                `\n[Speaking Tone & Language Requirements]:`,
                `- Tone: ${classicTone}`,
                `- Primary Language: ${classicLanguage}`,
            ].join('\n');

            const res = await fetch(`${baseUrl}/api/v1/workflow/create/template`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    call_type: classicCallType,
                    use_case: classicUseCase,
                    activity_description: enrichedPrompt,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.detail || `Failed to create workflow (HTTP ${res.status})`);
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
            className={`bg-background text-foreground flex flex-col ${builderMode === 'copilot'
                ? 'h-screen overflow-hidden'
                : 'min-h-screen overflow-y-auto'
                }`}
        >
            {/* Hidden JSON file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json,application/json"
                className="hidden"
            />

            {/* Top Navigation Bar */}
            <header className="border-b bg-[#FFFFFF] backdrop-blur-md sticky top-0 z-20 px-4 lg:px-8 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link
                        href="/workflow"
                        className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-foreground font-medium transition-colors"
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
                                AI Voice Agent Creator
                            </h1>
                            <p className="text-xs text-[#737373]">
                                {builderMode === 'studio'
                                    ? 'Studio Configuration Form'
                                    : 'Interactive AI Copilot Architect'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-1.5 text-xs font-medium border-border hover:bg-accent"
                    >
                        <Upload className="w-3.5 h-3.5 text-primary" />
                        <span className="hidden sm:inline">Import Workflow</span>
                        <span className="sm:hidden">Import</span>
                    </Button>

                    <WorkflowTemplateSheet buttonSize="sm" />

                    <div className="flex bg-[#F7F7F7] p-0.5 rounded-lg border text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => setBuilderMode('studio')}
                            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${builderMode === 'studio'
                                ? 'bg-background text-foreground shadow-sm font-semibold'
                                : 'text-[#737373] hover:text-foreground'
                                }`}
                        >
                            <HugeiconsIcon icon={Layers01Icon} className="w-3.5 h-3.5 text-primary" />
                            Studio Form
                        </button>
                        <button
                            type="button"
                            onClick={() => setBuilderMode('copilot')}
                            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${builderMode === 'copilot'
                                ? 'bg-background text-foreground shadow-sm font-semibold'
                                : 'text-[#737373] hover:text-foreground'
                                }`}
                        >
                            <HugeiconsIcon icon={BotIcon} className="w-3.5 h-3.5 text-primary" />
                            AI Copilot
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

            {/* Visual Studio Form Mode */}
            {builderMode === 'studio' ? (
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Header Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs bg-[#F0F3F9] text-[#7186AD] border-[#DCE3EF] font-medium">
                                    ● Visual Studio Architect
                                </Badge>
                                <span className="text-xs text-[#737373]">Fast Visual Agent Configuration</span>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                                Design Your Voice AI Agent
                            </h2>
                            <p className="text-sm text-[#737373] mt-0.5">
                                Select a pre-tuned starter template, customize persona & instructions below, or import an existing workflow JSON.
                            </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="gap-2 text-xs font-medium border-border hover:bg-accent"
                            >
                                <Upload className="w-3.5 h-3.5 text-primary" />
                                Import Workflow JSON
                            </Button>
                            <WorkflowTemplateSheet buttonSize="sm" />
                        </div>
                    </div>

                    {/* Starter Templates Carousel/Grid */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4 text-primary" />
                                <span>Starter Templates (1-Click Setup)</span>
                            </div>
                            <span className="text-xs text-[#737373]">
                                Click any card to auto-fill persona, voice tone, and system prompt
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                            {STARTER_TEMPLATES.map((tmpl) => {
                                const isSelected = selectedStarterId === tmpl.id;
                                return (
                                    <button
                                        key={tmpl.id}
                                        type="button"
                                        onClick={() => handleSelectStarter(tmpl)}
                                        className={`group text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${isSelected
                                            ? 'bg-primary/5 border-primary ring-2 ring-primary/20 shadow-sm'
                                            : 'bg-[#FFFFFF] border-[#E5E5E5] hover:border-[#DCE3EF] hover:bg-[#F7F7F7]/60 shadow-xs'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-2xl p-1.5 rounded-xl bg-[#F7F7F7] group-hover:scale-105 transition-transform">
                                                {tmpl.icon}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] uppercase font-bold py-0 ${tmpl.callType === 'inbound'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}
                                            >
                                                {tmpl.badge}
                                            </Badge>
                                        </div>

                                        <div>
                                            <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                                {tmpl.title}
                                            </h4>
                                            <p className="text-[11px] text-[#737373] mt-1 line-clamp-2 leading-relaxed">
                                                {tmpl.description}
                                            </p>
                                        </div>

                                        <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-[11px] font-medium text-primary">
                                            <span>{isSelected ? '✓ Selected' : 'Use Template'}</span>
                                            <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Two-Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Form Settings (7 cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            <Card className="shadow-md border-[#E5E5E5] bg-[#FFFFFF]">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <HugeiconsIcon icon={BotIcon} className="w-5 h-5 text-primary" />
                                            Agent Persona & Parameters
                                        </CardTitle>
                                        {selectedStarterId && (
                                            <Badge variant="secondary" className="text-xs gap-1 font-medium bg-primary/10 text-primary border-primary/20">
                                                ✓ Template Loaded
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription>
                                        Configure how your voice AI representative identifies itself, speaks, and behaves on live calls.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-5">
                                    {/* Call Direction Selector */}
                                    <div className="space-y-2">
                                        <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                            Call Direction
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setClassicCallType('inbound')}
                                                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${classicCallType === 'inbound'
                                                    ? 'bg-blue-50/50 border-blue-500/50 ring-2 ring-blue-500/20 text-foreground'
                                                    : 'bg-[#F7F7F7]/50 border-[#E5E5E5] text-[#737373] hover:text-foreground'
                                                    }`}
                                            >
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 mt-0.5">
                                                    <HugeiconsIcon icon={PhoneIncomingIcon} className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-foreground">Inbound Calling</div>
                                                    <div className="text-[11px] text-[#737373] mt-0.5">Customers call your number; agent answers 24/7</div>
                                                </div>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setClassicCallType('outbound')}
                                                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${classicCallType === 'outbound'
                                                    ? 'bg-amber-50/50 border-amber-500/50 ring-2 ring-amber-500/20 text-foreground'
                                                    : 'bg-[#F7F7F7]/50 border-[#E5E5E5] text-[#737373] hover:text-foreground'
                                                    }`}
                                            >
                                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 mt-0.5">
                                                    <HugeiconsIcon icon={PhoneOutgoingIcon} className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-foreground">Outbound Calling</div>
                                                    <div className="text-[11px] text-[#737373] mt-0.5">AI dials prospect lists for outreach & updates</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Use Case Name */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="use-case" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                            Agent Name / Use Case
                                        </Label>
                                        <Input
                                            id="use-case"
                                            placeholder="e.g. Apex Health Clinic Receptionist, Real Estate Qualifier"
                                            value={classicUseCase}
                                            onChange={(e) => setClassicUseCase(e.target.value)}
                                            className="text-sm font-medium"
                                        />
                                    </div>

                                    {/* Tone & Language Quick Pickers */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                                Speaking Tone
                                            </Label>
                                            <Select value={classicTone} onValueChange={setClassicTone}>
                                                <SelectTrigger className="text-xs">
                                                    <SelectValue placeholder="Select tone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Professional & Courteous">👔 Professional & Courteous</SelectItem>
                                                    <SelectItem value="Warm & Friendly">😊 Warm & Friendly</SelectItem>
                                                    <SelectItem value="Empathetic & Consultative">🩺 Empathetic & Consultative</SelectItem>
                                                    <SelectItem value="Confident & Sales-Driven">🚀 Confident & Sales-Driven</SelectItem>
                                                    <SelectItem value="Concise & Fast">⚡ Concise & Fast</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                                Primary Language
                                            </Label>
                                            <Select value={classicLanguage} onValueChange={setClassicLanguage}>
                                                <SelectTrigger className="text-xs">
                                                    <SelectValue placeholder="Select language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="English">🌐 English (US / Global)</SelectItem>
                                                    <SelectItem value="Hindi">🇮🇳 Hindi (हिन्दी)</SelectItem>
                                                    <SelectItem value="Hinglish (Hindi + English)">🇮🇳 Hinglish (Natural Mix)</SelectItem>
                                                    <SelectItem value="Spanish">🇪🇸 Spanish (Español)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Activity Description / System Prompt */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="activity-description" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                                Conversational Instructions & System Prompt
                                            </Label>
                                            <span className="text-[11px] text-[#737373]">
                                                {classicActivityDescription.length > 0 && `${classicActivityDescription.length} characters`}
                                            </span>
                                        </div>

                                        {/* Quick Prompt Insertion Chips */}
                                        <div className="flex flex-wrap items-center gap-1.5 pb-1">
                                            <span className="text-[11px] text-muted-foreground mr-1 font-medium">Quick Insert:</span>
                                            <button
                                                type="button"
                                                onClick={() => handleInsertPromptChip('[Required Information to Collect]:\n1. Full Name\n2. Phone Number & Email\n3. Preferred callback / meeting time')}
                                                className="text-[11px] px-2 py-0.5 rounded-md border border-border bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all font-medium text-foreground/80"
                                            >
                                                + Contact Info
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleInsertPromptChip('[Appointment Booking Rules]:\n- Always check availability via booking tools before proposing time slots.\n- Confirm the customer details.\n- Never claim appointment is confirmed until the tool succeeds.')}
                                                className="text-[11px] px-2 py-0.5 rounded-md border border-border bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all font-medium text-foreground/80"
                                            >
                                                + Appointment Tools
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleInsertPromptChip('[Objection Handling]:\n- If busy, ask for a convenient 2-minute callback window.\n- If price is questioned, highlight value proposition concisely.\n- Remain polite and never argue.')}
                                                className="text-[11px] px-2 py-0.5 rounded-md border border-border bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all font-medium text-foreground/80"
                                            >
                                                + Objections
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleInsertPromptChip('[Human Escalation]:\n- If the caller asks to speak to a human representative or specialist, politely state: "Let me connect you right away. Please hold on." and trigger the transfer tool.')}
                                                className="text-[11px] px-2 py-0.5 rounded-md border border-border bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all font-medium text-foreground/80"
                                            >
                                                + Human Transfer
                                            </button>
                                        </div>

                                        <Textarea
                                            id="activity-description"
                                            placeholder="Describe what the agent should say, rules, questions to ask the caller, and how to handle objections..."
                                            value={classicActivityDescription}
                                            onChange={(e) => setClassicActivityDescription(e.target.value)}
                                            rows={9}
                                            className="font-mono text-xs leading-relaxed resize-y bg-[#F7F7F7]/50"
                                        />
                                        <p className="text-[11px] text-[#737373]">
                                            Tip: Mention what details the agent must collect (e.g. caller name, email, budget, preferred appointment time).
                                        </p>
                                    </div>

                                    {classicError && (
                                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-medium">
                                            {classicError}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        onClick={handleClassicSubmit}
                                        disabled={isLoading}
                                        className="w-full gap-2 py-6 text-sm font-semibold shadow-md bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl"
                                    >
                                        {isLoading ? (
                                            <>
                                                <HugeiconsIcon icon={RefreshCwIcon} className="w-4 h-4 animate-spin" />
                                                Compiling Architecture & Generating Nodes...
                                            </>
                                        ) : (
                                            <>
                                                <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4" />
                                                Generate Voice Agent & Open Studio Canvas
                                                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Import Dropzone + Live Blueprint + Pro Tips (5 cols) */}
                        <div className="lg:col-span-5 space-y-5">
                            {/* Card 1: Import Workflow JSON Dropzone */}
                            <Card className="border-2 border-dashed border-[#E5E5E5] hover:border-primary/40 transition-colors bg-gradient-to-b from-card to-muted/20 shadow-sm">
                                <CardContent className="p-6 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
                                        <Upload className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-foreground">
                                            Import Existing Workflow JSON
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
                                            Have an existing agent backup or exported JSON? Upload it to restore the full visual canvas graph in 1 click.
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="gap-2 text-xs font-semibold shadow-xs"
                                    >
                                        <FileJson className="w-4 h-4 text-primary" />
                                        Choose Workflow JSON
                                    </Button>
                                    <div className="text-[10px] text-muted-foreground pt-1">
                                        Supports Studio canvas exports & Dograh Agent definitions
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 2: Live Blueprint Card */}
                            <Card className="border-[#E5E5E5] bg-card shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            Live Architecture Blueprint
                                        </CardTitle>
                                        <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                            ● Draft Active
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3.5 text-xs">
                                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground font-medium">Agent Name:</span>
                                            <span className="font-semibold text-foreground text-right truncate max-w-[180px]">
                                                {classicUseCase || 'Unnamed Voice Agent'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground font-medium">Direction:</span>
                                            <Badge
                                                variant="outline"
                                                className={`text-[10px] uppercase font-bold py-0 ${classicCallType === 'inbound'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}
                                            >
                                                {classicCallType === 'inbound' ? 'Inbound Calling' : 'Outbound Dialing'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground font-medium">Voice Persona:</span>
                                            <span className="font-medium text-foreground">{classicTone}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground font-medium">Language:</span>
                                            <span className="font-medium text-foreground">{classicLanguage}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground font-medium">System Prompt:</span>
                                            <span className={classicActivityDescription ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>
                                                {classicActivityDescription ? `✓ ${classicActivityDescription.length} chars ready` : 'Pending input'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Visual Canvas Node Path */}
                                    <div className="space-y-1.5 pt-1">
                                        <span className="text-[11px] font-semibold text-foreground">Canvas Pipeline Preview:</span>
                                        <div className="p-2.5 rounded-xl border bg-background space-y-2">
                                            <div className="flex items-center gap-2 text-[11px]">
                                                <div className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-[10px]">1</div>
                                                <span className="font-medium">Call Trigger Node</span>
                                                <span className="text-[10px] text-muted-foreground ml-auto">{classicCallType === 'inbound' ? 'Inbound Webhook/DID' : 'Outbound Batch Dial'}</span>
                                            </div>
                                            <div className="w-0.5 h-2 bg-border ml-2.5" />
                                            <div className="flex items-center gap-2 text-[11px]">
                                                <div className="w-5 h-5 rounded-md bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-[10px]">2</div>
                                                <span className="font-medium">Voice AI Speech Node</span>
                                                <span className="text-[10px] text-muted-foreground ml-auto">LLM + TTS + STT</span>
                                            </div>
                                            <div className="w-0.5 h-2 bg-border ml-2.5" />
                                            <div className="flex items-center gap-2 text-[11px]">
                                                <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-[10px]">3</div>
                                                <span className="font-medium">Tool Calls & Actions</span>
                                                <span className="text-[10px] text-muted-foreground ml-auto">Appointments / Transfer</span>
                                            </div>
                                            <div className="w-0.5 h-2 bg-border ml-2.5" />
                                            <div className="flex items-center gap-2 text-[11px]">
                                                <div className="w-5 h-5 rounded-md bg-neutral-500/10 text-neutral-600 flex items-center justify-center font-bold text-[10px]">4</div>
                                                <span className="font-medium">Call Disposition & End</span>
                                                <span className="text-[10px] text-muted-foreground ml-auto">Summary & Post-call</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 3: Voice Best Practices Tips */}
                            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs text-[#737373] space-y-2">
                                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                                    <HugeiconsIcon icon={SparklesIcon} className="w-3.5 h-3.5 text-primary" />
                                    <span>Voice Agent Best Practices</span>
                                </div>
                                <ul className="space-y-1.5 text-[11px] leading-relaxed list-disc list-inside">
                                    <li><strong>Keep turns short:</strong> 1–2 sentences per turn maintain a natural, rapid conversational rhythm.</li>
                                    <li><strong>Confirm key items:</strong> Always repeat collected numbers, dates, or emails before saving.</li>
                                    <li><strong>Provide an exit:</strong> Include instructions to gracefully transfer to a human if asked.</li>
                                </ul>
                            </div>
                        </div>
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
                                    className={`flex gap-3.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                            <HugeiconsIcon icon={BotIcon} className="w-4 h-4" />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[85%] space-y-3 ${msg.role === 'user'
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
                        </div>
                    </div>

                    {/* Right Pane: Live Agent Blueprint & Instant Test Call */}
                    <div className="lg:col-span-6 xl:col-span-5 flex flex-col h-full bg-[#FFFFFF] overflow-y-auto p-4 lg:p-6 space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
                                    <HugeiconsIcon icon={WorkflowIcon} className="w-4 h-4 text-primary" />
                                    Live Blueprint Preview
                                </h3>
                                <Badge
                                    variant="outline"
                                    className={`text-[10px] uppercase font-bold py-0.5 ${workflowDraft
                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                        : 'bg-[#F7F7F7] text-[#737373]'
                                        }`}
                                >
                                    {workflowDraft ? 'Architect Sync Active' : 'Waiting for details'}
                                </Badge>
                            </div>
                            <p className="text-xs text-[#737373]">
                                As you chat with Copilot on the left, your voice workflow blueprint automatically evolves in real time.
                            </p>
                        </div>

                        {workflowDraft ? (
                            <div className="space-y-5">
                                {/* Agent Identity Summary Card */}
                                <Card className="border-[#E5E5E5] shadow-xs">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-base font-bold">
                                                    {workflowDraft.name || 'AI Voice Agent'}
                                                </CardTitle>
                                                <CardDescription className="text-xs mt-0.5">
                                                    Direction:{' '}
                                                    <span className="capitalize font-semibold text-foreground">
                                                        {workflowDraft.call_type} Call
                                                    </span>{' '}
                                                    • Language: {workflowDraft.language || 'English / Hindi'}
                                                </CardDescription>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="text-xs font-semibold capitalize"
                                            >
                                                {workflowDraft.call_type}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-xs">
                                        {/* Opening Line */}
                                        <div className="space-y-1">
                                            <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                                                First Spoken Sentence (Greeting)
                                            </span>
                                            <div className="p-3 bg-[#F7F7F7] rounded-xl border text-foreground/90 font-medium italic">
                                                "{workflowDraft.first_message}"
                                            </div>
                                        </div>

                                        {/* Questions to Qualify */}
                                        {workflowDraft.questions_to_ask &&
                                            workflowDraft.questions_to_ask.length > 0 && (
                                                <div className="space-y-1.5">
                                                    <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                                                        Key Qualification Criteria
                                                    </span>
                                                    <ul className="space-y-1">
                                                        {workflowDraft.questions_to_ask.map((q, qIdx) => (
                                                            <li
                                                                key={qIdx}
                                                                className="flex items-start gap-2 p-2 rounded-lg bg-[#F7F7F7]/60 border text-[11px]"
                                                            >
                                                                <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-[9px] mt-0.5">
                                                                    {qIdx + 1}
                                                                </span>
                                                                <span>{q}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        {/* System Prompt View */}
                                        {workflowDraft.system_prompt && (
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-foreground uppercase tracking-wider text-[10px]">
                                                        Compiled System Instructions
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 text-[10px] px-1.5 text-[#737373]"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(
                                                                workflowDraft.system_prompt
                                                            );
                                                            setCopiedPrompt(true);
                                                            setTimeout(() => setCopiedPrompt(false), 2000);
                                                        }}
                                                    >
                                                        <HugeiconsIcon
                                                            icon={copiedPrompt ? CheckIcon : Copy01Icon}
                                                            className="w-3 h-3 mr-1 text-primary"
                                                        />
                                                        {copiedPrompt ? 'Copied' : 'Copy Prompt'}
                                                    </Button>
                                                </div>
                                                <div className="relative">
                                                    <div
                                                        className={`font-mono text-[11px] p-3 bg-[#F7F7F7] rounded-xl border text-[#737373] whitespace-pre-wrap leading-relaxed ${!showFullPrompt ? 'max-h-36 overflow-hidden' : ''
                                                            }`}
                                                    >
                                                        {workflowDraft.system_prompt}
                                                    </div>
                                                    {!showFullPrompt && (
                                                        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F7F7F7] to-transparent flex items-end justify-center pb-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowFullPrompt(true)}
                                                                className="text-[10px] text-primary font-semibold hover:underline bg-[#FFFFFF]/90 px-2.5 py-0.5 rounded-full shadow-xs border"
                                                            >
                                                                Show full prompt
                                                            </button>
                                                        </div>
                                                    )}
                                                    {showFullPrompt && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowFullPrompt(false)}
                                                            className="text-[10px] text-primary font-semibold hover:underline mt-1 block"
                                                        >
                                                            Collapse prompt
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Action Button */}
                                <div>
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

            {/* Import Workflow JSON Confirmation Dialog Modal */}
            <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5 text-primary" />
                            Import Workflow JSON
                        </DialogTitle>
                        <DialogDescription>
                            Review the detected workflow structure below and confirm to import it into your workspace.
                        </DialogDescription>
                    </DialogHeader>

                    {importStats && (
                        <div className="space-y-4 py-2">
                            {/* File Summary Card */}
                            <div className="p-3.5 rounded-xl border bg-muted/30 space-y-2">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <FileJson className="w-4 h-4 text-primary" />
                                        {importStats.fileName}
                                    </span>
                                    <span className="text-muted-foreground">{importStats.fileSizeKb} KB</span>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                        {importStats.nodesCount} Canvas Nodes
                                    </Badge>
                                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                        {importStats.edgesCount} Connections
                                    </Badge>
                                </div>
                            </div>

                            {/* Workflow Name Field */}
                            <div className="space-y-1.5">
                                <Label htmlFor="import-wf-name" className="text-xs font-semibold">
                                    Agent / Workflow Name *
                                </Label>
                                <Input
                                    id="import-wf-name"
                                    value={importName}
                                    onChange={(e) => setImportName(e.target.value)}
                                    placeholder="e.g. Lead Qualification Agent"
                                    className="text-sm font-medium"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setImportModalOpen(false)}
                            disabled={isImporting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmImport}
                            disabled={isImporting || !importName.trim()}
                            className="gap-2 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold"
                        >
                            {isImporting ? (
                                <>
                                    <RotateCw className="w-4 h-4 animate-spin" />
                                    Importing Workflow...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Confirm Import & Open Studio
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
