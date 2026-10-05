'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BotIcon,
  Building01Icon,
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
import { WorkflowTemplateSheet } from '@/components/workflow/WorkflowTemplateSheet';
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

interface IndustryPreset {
    id: string;
    title: string;
    icon: string;
    description: string;
    suggestedBusinessName: string;
    suggestedAgentName: string;
    suggestedGreeting: string;
    suggestedHoursAndLocation: string;
    suggestedServices: string;
    suggestedExtraction: string[];
}

const COMMON_EXTRACTION_OPTIONS = [
    'Full Name',
    'Phone Number',
    'Email Address',
    'Preferred Date & Time',
    'Reason for Visit / Query',
    'Doctor / Department',
    'Budget / Price Range',
    'Property / Unit Type',
    'Address / Location',
];

const INDUSTRY_PRESETS: IndustryPreset[] = [
    {
        id: 'clinic',
        title: 'Clinic & Healthcare',
        icon: '🩺',
        description: 'Doctor appointments, patient triage, timings & fees',
        suggestedBusinessName: 'Apex Health Clinic',
        suggestedAgentName: 'Sarah',
        suggestedGreeting: 'Namaste! Welcome to Apex Health Clinic. How may I assist you with your appointment today?',
        suggestedHoursAndLocation: 'Monday to Saturday: 9:00 AM - 8:00 PM. Sunday: 10:00 AM - 2:00 PM. Located at 12th Main, Indiranagar, Bangalore.',
        suggestedServices: 'General Physician Consultation: ₹500\nDental Cleaning & Scaling: ₹1,500\nRoot Canal Treatment: ₹3,500\nPediatric Checkup: ₹600',
        suggestedExtraction: ['Full Name', 'Phone Number', 'Preferred Date & Time', 'Reason for Visit', 'Doctor / Department'],
    },
    {
        id: 'real-estate',
        title: 'Real Estate & Property',
        icon: '🏢',
        description: 'Buyer & tenant inquiries, budget qualification, site visits',
        suggestedBusinessName: 'Prime Skyline Realty',
        suggestedAgentName: 'Priya',
        suggestedGreeting: 'Hello! Thank you for calling Prime Skyline Realty. Are you looking to buy, sell, or rent a property?',
        suggestedHoursAndLocation: 'Office open daily from 9:30 AM to 7:00 PM. Site visits available 7 days a week with prior booking.',
        suggestedServices: '2BHK Luxury Apartments starting at ₹85 Lakhs\n3BHK Penthouses starting at ₹1.4 Crores\nCommercial Office Spaces for Lease\nFree Property Valuation & Legal Consultation',
        suggestedExtraction: ['Full Name', 'Phone Number', 'Budget Range', 'Preferred Location / Area', 'Property Size (1/2/3 BHK)', 'Target Move-in Date'],
    },
    {
        id: 'salon',
        title: 'Salon, Spa & Beauty',
        icon: '💇',
        description: 'Service bookings, stylist availability, package rates',
        suggestedBusinessName: 'Glow & Grace Studio',
        suggestedAgentName: 'Ananya',
        suggestedGreeting: 'Hi there! Welcome to Glow & Grace Studio. Would you like to schedule a salon or spa treatment?',
        suggestedHoursAndLocation: 'Tuesday to Sunday: 10:00 AM - 8:30 PM. Closed on Mondays. Located in Bandra West, Mumbai.',
        suggestedServices: 'Haircut & Styling: ₹800\nKeratin Hair Treatment: ₹4,500\nHydra Facial: ₹2,500\nBridal Makeup Package: ₹15,000',
        suggestedExtraction: ['Full Name', 'Phone Number', 'Service Needed', 'Preferred Stylist / Specialist', 'Preferred Date & Time Slot'],
    },
    {
        id: 'restaurant',
        title: 'Restaurant & Dining',
        icon: '🍽️',
        description: 'Table reservations, party bookings, opening hours & menu',
        suggestedBusinessName: 'The Olive Bistro',
        suggestedAgentName: 'Rohan',
        suggestedGreeting: 'Hello and welcome to The Olive Bistro! Would you like to reserve a table or inquire about today\'s special menu?',
        suggestedHoursAndLocation: 'Lunch: 12:30 PM - 3:30 PM. Dinner: 7:00 PM - 11:30 PM. Valet parking available on-site.',
        suggestedServices: 'Table Reservation for Couples & Families\nPrivate Party & Birthday Hall (Up to 40 Guests)\nLive Music Weekends (Friday & Saturday 8 PM)\nCatering Services',
        suggestedExtraction: ['Guest Name', 'Contact Number', 'Number of Guests', 'Date & Time of Reservation', 'Dietary Preferences'],
    },
    {
        id: 'gym',
        title: 'Gym & Fitness Center',
        icon: '🏋️',
        description: 'Membership plans, personal trainer slots, trial passes',
        suggestedBusinessName: 'IronFit Arena',
        suggestedAgentName: 'Vikram',
        suggestedGreeting: 'Hey! Thanks for reaching out to IronFit Arena. Are you interested in a free trial workout or our membership plans?',
        suggestedHoursAndLocation: 'Open 7 days a week: 5:30 AM to 10:30 PM. Located opposite City Mall, Sector 18.',
        suggestedServices: 'Annual All-Access Membership: ₹18,000/yr\nMonthly Flexible Pass: ₹2,500/mo\n1-on-1 Personal Training Package: ₹6,000/mo\nComplimentary 1-Day Trial Workout',
        suggestedExtraction: ['Full Name', 'Phone Number', 'Fitness Goal', 'Preferred Workout Slot (Morning/Evening)', 'Trial Date'],
    },
    {
        id: 'ecommerce',
        title: 'E-Commerce & Orders',
        icon: '🛒',
        description: 'Order tracking, returns, replacement & product inquiries',
        suggestedBusinessName: 'LuxeCart Support',
        suggestedAgentName: 'Maya',
        suggestedGreeting: 'Hi! Thank you for contacting LuxeCart Customer Support. How can I help you with your order today?',
        suggestedHoursAndLocation: 'Support lines open 24/7. Standard delivery takes 2-4 business days.',
        suggestedServices: 'Order Tracking & Shipment Updates\n30-Day Free Return & Exchange Policy\nWarranty Claims & Damaged Item Replacement\nPayment & Refund Status Verification',
        suggestedExtraction: ['Customer Name', 'Order ID / Tracking Number', 'Phone Number or Email', 'Reason for Query'],
    },
    {
        id: 'services',
        title: 'Professional Services',
        icon: '💼',
        description: 'Legal, CA, tax filing, consulting appointments & queries',
        suggestedBusinessName: 'Vanguard Advisors',
        suggestedAgentName: 'Kabir',
        suggestedGreeting: 'Hello, welcome to Vanguard Advisory Services. How may we assist you with legal, tax, or compliance matters?',
        suggestedHoursAndLocation: 'Monday to Friday: 9:30 AM - 6:30 PM. Virtual Zoom meetings available upon request.',
        suggestedServices: 'ITR Filing & Tax Planning: ₹1,500+\nCompany Registration & GST Setup: ₹5,000\nLegal Contract Review: ₹3,000\n30-Minute Expert Consultation: Free First Session',
        suggestedExtraction: ['Client Name', 'Business / Personal Contact Number', 'Email Address', 'Specific Service Required', 'Consultation Mode'],
    },
    {
        id: 'other',
        title: 'Custom Local Business',
        icon: '📦',
        description: 'Repairs, home services, cleaning, tuition & agencies',
        suggestedBusinessName: 'QuickFix Services',
        suggestedAgentName: 'Simran',
        suggestedGreeting: 'Hello! Thank you for calling QuickFix Services. How can we assist you with your service booking today?',
        suggestedHoursAndLocation: 'Available daily 8:00 AM - 8:00 PM for on-demand home visits.',
        suggestedServices: 'AC Repair & Servicing: ₹499\nPlumbing & Electrical Work: Starting ₹299\nDeep Home Cleaning: ₹1,999\nSame-Day Emergency Visit Available',
        suggestedExtraction: ['Customer Name', 'Contact Phone Number', 'Service Required', 'Service Address / Area', 'Preferred Date & Time'],
    }
];

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
- Confirm appointment date and time before concluding the call.`
    },
    {
        id: 'customer-support',
        title: 'Customer Care & FAQ',
        icon: '🎧',
        badge: 'Inbound',
        callType: 'inbound',
        language: 'en',
        tone: 'Friendly & Helpful',
        useCase: 'CloudDesk 24/7 Support Desk',
        description: 'Answer customer inquiries, resolve billing/account questions, and route tickets.',
        prompt: `You are Alex, an empathetic customer care representative for CloudDesk.
Goal: Troubleshoot user issues, answer billing questions, and assist with account access.
Key information to collect:
1. Account ID or registered email address
2. Specific issue description and error messages
3. Urgency level
Rules:
- Acknowledge customer frustration with genuine empathy.
- Provide step-by-step guidance clearly.
- If unable to solve immediately, create an escalated support ticket with a callback time.`
    },
    {
        id: 'sales-outbound',
        title: 'B2B Sales Demo Setter',
        icon: '🚀',
        badge: 'Outbound',
        callType: 'outbound',
        language: 'en',
        tone: 'Confident & Consultative',
        useCase: 'GrowthPulse Outbound SDR',
        description: 'Reach out to warm business prospects and book 15-min product demonstrations.',
        prompt: `You are Jordan, a confident business development representative from GrowthPulse AI.
Goal: Reach out to prospect leads, understand their current calling workflow pain points, and book a 15-minute screen-share demo.
Key steps:
1. Greet the prospect politely and introduce yourself and company.
2. Ask if they currently manage high phone call volumes or inbound inquiries.
3. Share a quick value metric (e.g., reduces agent wait times by 80%).
4. Offer two specific time slots (e.g., Tuesday at 10 AM or Wednesday at 2 PM) for a demo.
Rules:
- Keep responses concise and conversational.
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

    // Mode Toggle: 'business' (default non-tech zero-code setup), 'classic' (developer studio form), 'copilot' (interactive Q&A)
    const [builderMode, setBuilderMode] = useState<'business' | 'classic' | 'copilot'>('business');

    // Business Setup State
    const [bizIndustry, setBizIndustry] = useState<string>('clinic');
    const [bizName, setBizName] = useState<string>('Apex Health Clinic');
    const [bizAgentName, setBizAgentName] = useState<string>('Sarah');
    const [bizCallType, setBizCallType] = useState<'inbound' | 'outbound'>('inbound');
    const [bizGreeting, setBizGreeting] = useState<string>('Namaste! Welcome to Apex Health Clinic. How may I assist you with your appointment today?');
    const [bizHoursAndLocation, setBizHoursAndLocation] = useState<string>('Monday to Saturday: 9:00 AM - 8:00 PM. Sunday: 10:00 AM - 2:00 PM. Located at 12th Main, Indiranagar, Bangalore.');
    const [bizServices, setBizServices] = useState<string>('General Physician Consultation: ₹500\nDental Cleaning & Scaling: ₹1,500\nRoot Canal Treatment: ₹3,500\nPediatric Checkup: ₹600');
    const [bizExtractionFields, setBizExtractionFields] = useState<string[]>([
        'Full Name',
        'Phone Number',
        'Preferred Date & Time',
        'Reason for Visit',
        'Doctor / Department',
    ]);
    const [newCustomField, setNewCustomField] = useState('');

    // Call Forwarding / Human Transfer
    const [forwardingEnabled, setForwardingEnabled] = useState<boolean>(true);
    const [forwardingPhone, setForwardingPhone] = useState<string>('+91 98765 43210');
    const [forwardingCondition, setForwardingCondition] = useState<string>('When customer asks to speak with a doctor, specialist, or human receptionist');

    // Messaging Channel & Alerts
    const [smsAlertEnabled, setSmsAlertEnabled] = useState<boolean>(true);
    const [alertMobile, setAlertMobile] = useState<string>('+91 98765 43210');
    const [emailAlertEnabled, setEmailAlertEnabled] = useState<boolean>(true);
    const [alertEmail, setAlertEmail] = useState<string>('reception@apexclinic.com');
    const [webhookEnabled, setWebhookEnabled] = useState<boolean>(false);
    const [webhookUrl, setWebhookUrl] = useState<string>('');

    // Voice & Language
    const [bizLanguage, setBizLanguage] = useState<string>('English / Hinglish Mix');
    const [bizTone, setBizTone] = useState<string>('Warm, Polite & Empathetic');
    const [bizError, setBizError] = useState<string | null>(null);

    const handleSelectIndustry = (preset: IndustryPreset) => {
        setBizIndustry(preset.id);
        setBizName(preset.suggestedBusinessName);
        setBizAgentName(preset.suggestedAgentName);
        setBizGreeting(preset.suggestedGreeting);
        setBizHoursAndLocation(preset.suggestedHoursAndLocation);
        setBizServices(preset.suggestedServices);
        setBizExtractionFields(preset.suggestedExtraction);
    };

    const handleToggleField = (field: string) => {
        if (bizExtractionFields.includes(field)) {
            setBizExtractionFields(bizExtractionFields.filter((f) => f !== field));
        } else {
            setBizExtractionFields([...bizExtractionFields, field]);
        }
    };

    const handleAddCustomField = () => {
        const trimmed = newCustomField.trim();
        if (trimmed && !bizExtractionFields.includes(trimmed)) {
            setBizExtractionFields([...bizExtractionFields, trimmed]);
            setNewCustomField('');
        }
    };

    const handleRemoveField = (field: string) => {
        setBizExtractionFields(bizExtractionFields.filter((f) => f !== field));
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

    // Classic Form State
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

    // Business Setup Submit Handler
    const handleBusinessSubmit = async () => {
        if (!bizName.trim()) {
            setBizError('Please provide your business name');
            return;
        }

        setIsLoading(true);
        setBizError(null);

        try {
            const token = await getAccessToken();
            const baseUrl = resolveBrowserBackendUrl();

            // Construct rich prompt from non-tech business parameters
            const promptParts = [
                `You are ${bizAgentName.trim() || 'an AI Assistant'}, representing ${bizName.trim()}.`,
                `Greeting / Opening Statement: "${bizGreeting.trim()}"`,
                '',
                '[Business Information & Knowledge Base]:',
                bizHoursAndLocation ? `- Hours & Address/Location:\n${bizHoursAndLocation.trim()}` : '',
                bizServices ? `- Services, Pricing & Offerings:\n${bizServices.trim()}` : '',
                '',
                '[Customer Information to Collect & Qualify]:',
                bizExtractionFields.length > 0
                    ? bizExtractionFields.map((f, i) => `${i + 1}. ${f}`).join('\n')
                    : 'Collect customer name and reason for inquiry.',
                '',
                forwardingEnabled && forwardingPhone
                    ? `[Call Forwarding / Live Human Transfer]:\n- Transfer Condition: ${forwardingCondition || 'When caller asks to speak with a human or doctor'}\n- Destination Phone Number: ${forwardingPhone}\n- Instructions: When transfer condition is triggered, inform the caller politely and execute transfer.`
                    : '',
                '',
                `[Post-Call Alerts & Messaging Channels]:`,
                smsAlertEnabled && alertMobile ? `- SMS / WhatsApp notification to: ${alertMobile}` : '',
                emailAlertEnabled && alertEmail ? `- Email summary alert to: ${alertEmail}` : '',
                webhookEnabled && webhookUrl ? `- CRM Webhook payload dispatched to: ${webhookUrl}` : '',
                '',
                `[Speaking Style & Tone]:`,
                `- Language: ${bizLanguage}`,
                `- Tone: ${bizTone}`,
                `- Conversational Rules: Be polite, warm, and concise. Never fabricate business information not provided above. Confirm key collected details with the caller before ending the call.`
            ];

            const enrichedPrompt = promptParts.filter(Boolean).join('\n');

            const res = await fetch(`${baseUrl}/api/v1/workflow/create/template`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    call_type: bizCallType,
                    use_case: `${bizName.trim()} - ${bizAgentName.trim() || 'Agent'}`,
                    activity_description: enrichedPrompt,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.detail || `Failed to create agent (HTTP ${res.status})`);
            }

            const data = await res.json();
            if (data.id) {
                router.push(`/workflow/${data.id}`);
            }
        } catch (err: any) {
            setBizError(err?.message || 'Failed to create business agent');
        } finally {
            setIsLoading(false);
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
                                AI Voice Agent Creator
                            </h1>
                            <p className="text-xs text-[#737373]">
                                {builderMode === 'business'
                                    ? 'Zero-Code Business Setup'
                                    : builderMode === 'classic'
                                    ? 'Studio Configuration Form'
                                    : 'Interactive AI Copilot Architect'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <WorkflowTemplateSheet buttonSize="sm" />

                    <div className="flex bg-[#F7F7F7] p-0.5 rounded-lg border text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => setBuilderMode('business')}
                            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                                builderMode === 'business'
                                    ? 'bg-background text-foreground shadow-sm font-semibold'
                                    : 'text-[#737373] hover:text-foreground'
                            }`}
                        >
                            <HugeiconsIcon icon={Building01Icon} className="w-3.5 h-3.5 text-primary" />
                            Business Setup
                        </button>
                        <button
                            type="button"
                            onClick={() => setBuilderMode('classic')}
                            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                                builderMode === 'classic'
                                    ? 'bg-background text-foreground shadow-sm font-semibold'
                                    : 'text-[#737373] hover:text-foreground'
                            }`}
                        >
                            <HugeiconsIcon icon={Layers01Icon} className="w-3.5 h-3.5" />
                            Studio Form
                        </button>
                        <button
                            type="button"
                            onClick={() => setBuilderMode('copilot')}
                            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                                builderMode === 'copilot'
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

            {/* Zero-Code Business Setup Mode */}
            {builderMode === 'business' ? (
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Header Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                    ● 100% Zero-Code Setup
                                </Badge>
                                <span className="text-xs text-[#737373]">No technical knowledge required</span>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                                Create Your Business Voice Agent
                            </h2>
                            <p className="text-sm text-[#737373] mt-0.5">
                                Select your business type below, configure basic details, and test your live agent in 60 seconds.
                            </p>
                        </div>
                    </div>

                    {/* Step 1: Industry Category Grid */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4 text-primary" />
                                <span>Step 1: Choose Your Business Category</span>
                            </div>
                            <span className="text-xs text-[#737373]">
                                Click to instantly auto-fill tailored settings
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                            {INDUSTRY_PRESETS.map((preset) => {
                                const isSelected = bizIndustry === preset.id;
                                return (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => handleSelectIndustry(preset)}
                                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-28 relative ${
                                            isSelected
                                                ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                                                : 'border-border bg-card hover:border-[#7186AD]/50 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="text-2xl">{preset.icon}</span>
                                            {isSelected && (
                                                <span className="w-2 h-2 rounded-full bg-primary" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-xs text-foreground line-clamp-1">
                                                {preset.title}
                                            </div>
                                            <div className="text-[10px] text-[#737373] line-clamp-1 mt-0.5">
                                                {preset.suggestedBusinessName}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form & Live Preview Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Form Column (8 cols) */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Card 1: Business Identity & Persona */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <HugeiconsIcon icon={Building01Icon} className="w-4 h-4 text-primary" />
                                        Step 2: Business & Agent Identity
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Tell us what your business is called and how your agent introduces itself.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold">Business / Clinic Name</Label>
                                            <Input
                                                value={bizName}
                                                onChange={(e) => setBizName(e.target.value)}
                                                placeholder="e.g. Apex Health Clinic"
                                                className="text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold">AI Assistant Name</Label>
                                            <Input
                                                value={bizAgentName}
                                                onChange={(e) => setBizAgentName(e.target.value)}
                                                placeholder="e.g. Sarah, Priya, Alex"
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Call Direction</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setBizCallType('inbound')}
                                                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                                    bizCallType === 'inbound'
                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30 font-medium'
                                                        : 'border-border hover:bg-neutral-50 text-[#737373]'
                                                }`}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                                    <HugeiconsIcon icon={PhoneIncomingIcon} className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-foreground">Inbound Calling</div>
                                                    <div className="text-[11px] text-[#737373]">Customer dials your number</div>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setBizCallType('outbound')}
                                                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                                    bizCallType === 'outbound'
                                                        ? 'border-primary bg-primary/5 ring-1 ring-primary/30 font-medium'
                                                        : 'border-border hover:bg-neutral-50 text-[#737373]'
                                                }`}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                                    <HugeiconsIcon icon={PhoneOutgoingIcon} className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-foreground">Outbound Calling</div>
                                                    <div className="text-[11px] text-[#737373]">AI calls customers for follow-up</div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Opening Greeting Message</Label>
                                        <Textarea
                                            value={bizGreeting}
                                            onChange={(e) => setBizGreeting(e.target.value)}
                                            rows={2}
                                            placeholder="What the AI says immediately when the call connects"
                                            className="text-xs resize-none"
                                        />
                                        <p className="text-[11px] text-[#737373]">
                                            This is the first sentence spoken when the customer answers.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 2: Business Profile & Knowledge Base */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <HugeiconsIcon icon={InfoIcon} className="w-4 h-4 text-primary" />
                                        Step 3: Business Information & Knowledge Base
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        The AI will use these exact details to answer caller queries accurately without inventing facts.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-1">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Operating Hours & Address / Location</Label>
                                        <Textarea
                                            value={bizHoursAndLocation}
                                            onChange={(e) => setBizHoursAndLocation(e.target.value)}
                                            rows={2}
                                            placeholder="e.g. Mon-Sat 9AM-8PM, Indiranagar, Bangalore. Free parking available."
                                            className="text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Services, Pricing & Frequently Asked Details</Label>
                                        <Textarea
                                            value={bizServices}
                                            onChange={(e) => setBizServices(e.target.value)}
                                            rows={4}
                                            placeholder={`e.g.\nConsultation: ₹500\nDental Cleaning: ₹1,500\nRoot Canal: ₹3,500`}
                                            className="text-xs font-mono"
                                        />
                                        <p className="text-[11px] text-[#737373]">
                                            List your packages, menu items, or fees line-by-line. The AI will explain them during the call.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 3: Lead Generation & Data Extraction */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-4 h-4 text-primary" />
                                        Step 4: Customer Information to Capture (Lead Generation)
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Select what details your agent must ask the caller and save for your records.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-1">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {COMMON_EXTRACTION_OPTIONS.map((field) => {
                                            const isChecked = bizExtractionFields.includes(field);
                                            return (
                                                <button
                                                    key={field}
                                                    type="button"
                                                    onClick={() => handleToggleField(field)}
                                                    className={`px-3 py-2 rounded-lg border text-left text-xs flex items-center justify-between transition-all ${
                                                        isChecked
                                                            ? 'border-primary bg-primary/5 text-foreground font-medium'
                                                            : 'border-border text-[#737373] hover:bg-neutral-50'
                                                    }`}
                                                >
                                                    <span className="truncate">{field}</span>
                                                    {isChecked && (
                                                        <HugeiconsIcon icon={CheckIcon} className="w-3.5 h-3.5 text-primary shrink-0 ml-1.5" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Add custom field */}
                                    <div className="flex gap-2 pt-2 border-t border-[#E5E5E5]">
                                        <Input
                                            value={newCustomField}
                                            onChange={(e) => setNewCustomField(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddCustomField();
                                                }
                                            }}
                                            placeholder="Add custom detail (e.g. Car Model, Insurance Provider)"
                                            className="text-xs h-9"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddCustomField}
                                            className="gap-1.5 shrink-0 text-xs h-9"
                                        >
                                            <HugeiconsIcon icon={PlusIcon} className="w-3.5 h-3.5" />
                                            Add Field
                                        </Button>
                                    </div>

                                    {/* Active field tags */}
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {bizExtractionFields.map((field) => (
                                            <Badge
                                                key={field}
                                                variant="secondary"
                                                className="text-[11px] gap-1 px-2.5 py-1 font-normal bg-neutral-100 text-neutral-800 border"
                                            >
                                                {field}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveField(field)}
                                                    className="hover:text-red-600 transition-colors ml-0.5"
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 4: Call Forwarding & Human Transfer */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <HugeiconsIcon icon={PhoneIcon} className="w-4 h-4 text-primary" />
                                            Step 5: Call Forwarding & Live Human Transfer
                                        </CardTitle>
                                        <Switch
                                            checked={forwardingEnabled}
                                            onCheckedChange={setForwardingEnabled}
                                        />
                                    </div>
                                    <CardDescription className="text-xs">
                                        Seamlessly transfer the caller to your human staff or doctor when needed.
                                    </CardDescription>
                                </CardHeader>
                                {forwardingEnabled && (
                                    <CardContent className="space-y-4 pt-1 border-t border-[#E5E5E5] mt-2">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold">Forwarding Phone Number</Label>
                                                <Input
                                                    value={forwardingPhone}
                                                    onChange={(e) => setForwardingPhone(e.target.value)}
                                                    placeholder="+91 98765 43210"
                                                    className="text-xs font-mono"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold">When should AI transfer the call?</Label>
                                                <Input
                                                    value={forwardingCondition}
                                                    onChange={(e) => setForwardingCondition(e.target.value)}
                                                    placeholder="e.g. When caller asks for doctor or reports emergency"
                                                    className="text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div className="p-3 bg-neutral-50 rounded-lg text-xs text-[#737373] flex items-center gap-2 border">
                                            <HugeiconsIcon icon={InfoIcon} className="w-4 h-4 text-primary shrink-0" />
                                            <span>
                                                The AI will politely say: <em>"Let me connect you with our specialist right away"</em> and initiate the transfer.
                                            </span>
                                        </div>
                                    </CardContent>
                                )}
                            </Card>

                            {/* Card 5: Messaging & Alerts */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <HugeiconsIcon icon={MessageSquareIcon} className="w-4 h-4 text-primary" />
                                        Step 6: Instant Lead Alerts & Messaging Channels
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Receive real-time notifications on your phone or CRM whenever a call completes.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-1">
                                    {/* SMS / WhatsApp */}
                                    <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                                    <HugeiconsIcon icon={MessageSquareIcon} className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold">SMS / WhatsApp Lead Alert</div>
                                                    <div className="text-[11px] text-[#737373]">Send caller details directly to your mobile</div>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={smsAlertEnabled}
                                                onCheckedChange={setSmsAlertEnabled}
                                            />
                                        </div>
                                        {smsAlertEnabled && (
                                            <div className="pt-2">
                                                <Input
                                                    value={alertMobile}
                                                    onChange={(e) => setAlertMobile(e.target.value)}
                                                    placeholder="+91 98765 43210"
                                                    className="text-xs font-mono h-8"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Email Alert */}
                                    <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                                                    <HugeiconsIcon icon={Mail01Icon} className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold">Email Summary Alert</div>
                                                    <div className="text-[11px] text-[#737373]">Receive full transcript & captured data in your inbox</div>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={emailAlertEnabled}
                                                onCheckedChange={setEmailAlertEnabled}
                                            />
                                        </div>
                                        {emailAlertEnabled && (
                                            <div className="pt-2">
                                                <Input
                                                    value={alertEmail}
                                                    onChange={(e) => setAlertEmail(e.target.value)}
                                                    placeholder="owner@yourbusiness.com"
                                                    className="text-xs h-8"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Webhook */}
                                    <div className="p-3.5 rounded-xl border border-border bg-card space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
                                                    <HugeiconsIcon icon={WorkflowIcon} className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold">CRM / Zapier Webhook (Optional)</div>
                                                    <div className="text-[11px] text-[#737373]">Auto-sync captured leads into HubSpot, Zoho, or Google Sheets</div>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={webhookEnabled}
                                                onCheckedChange={setWebhookEnabled}
                                            />
                                        </div>
                                        {webhookEnabled && (
                                            <div className="pt-2">
                                                <Input
                                                    value={webhookUrl}
                                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                                                    className="text-xs font-mono h-8"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 6: Language & Speaking Tone */}
                            <Card className="border-border shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <HugeiconsIcon icon={UserIcon} className="w-4 h-4 text-primary" />
                                        Step 7: Voice Personality & Language
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Select the spoken language and conversational manner of your voice agent.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold">Primary Language</Label>
                                            <Select value={bizLanguage} onValueChange={setBizLanguage}>
                                                <SelectTrigger className="text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="English / Hinglish Mix">English / Hinglish Mix (Recommended)</SelectItem>
                                                    <SelectItem value="English">English</SelectItem>
                                                    <SelectItem value="Hindi">Hindi</SelectItem>
                                                    <SelectItem value="Spanish">Spanish</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold">Speaking Demeanor</Label>
                                            <Select value={bizTone} onValueChange={setBizTone}>
                                                <SelectTrigger className="text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Warm, Polite & Empathetic">Warm, Polite & Empathetic</SelectItem>
                                                    <SelectItem value="Professional & Formal">Professional & Formal</SelectItem>
                                                    <SelectItem value="Energetic & Sales-Oriented">Energetic & Sales-Oriented</SelectItem>
                                                    <SelectItem value="Casual & Friendly">Casual & Friendly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sticky Preview & Launch Column (4 cols) */}
                        <div className="lg:col-span-4 sticky top-20 space-y-4">
                            <Card className="shadow-lg border-border overflow-hidden">
                                <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 p-5 text-white">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                            Ready to Launch
                                        </span>
                                        <span className="text-[11px] text-neutral-400 font-mono">
                                            Sub-500ms Voice
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center font-bold text-xl border border-white/10 shrink-0">
                                            {bizAgentName.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base leading-tight">
                                                {bizAgentName || 'AI Assistant'}
                                            </h3>
                                            <p className="text-xs text-neutral-300">
                                                {bizName || 'Your Business'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-5 space-y-4">
                                    <div className="space-y-2 text-xs">
                                        <div className="flex items-center justify-between py-1.5 border-b border-[#E5E5E5]">
                                            <span className="text-[#737373]">Call Type:</span>
                                            <span className="font-semibold capitalize text-foreground">
                                                {bizCallType === 'inbound' ? '📞 Inbound Receptionist' : '📤 Outbound Representative'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-1.5 border-b border-[#E5E5E5]">
                                            <span className="text-[#737373]">Language:</span>
                                            <span className="font-semibold text-foreground">{bizLanguage}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-1.5 border-b border-[#E5E5E5]">
                                            <span className="text-[#737373]">Live Forwarding:</span>
                                            <span className={`font-semibold ${forwardingEnabled ? 'text-emerald-700' : 'text-[#737373]'}`}>
                                                {forwardingEnabled ? forwardingPhone || 'Active' : 'Disabled'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-1.5 border-b border-[#E5E5E5]">
                                            <span className="text-[#737373]">Instant Alerts:</span>
                                            <div className="flex gap-1">
                                                {smsAlertEnabled && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">SMS</Badge>}
                                                {emailAlertEnabled && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Email</Badge>}
                                                {webhookEnabled && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Webhook</Badge>}
                                                {!smsAlertEnabled && !emailAlertEnabled && !webhookEnabled && (
                                                    <span className="text-[#737373]">None</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="py-1.5">
                                            <div className="text-[#737373] mb-1.5">Lead Data Captured ({bizExtractionFields.length}):</div>
                                            <div className="flex flex-wrap gap-1">
                                                {bizExtractionFields.slice(0, 5).map((f) => (
                                                    <span key={f} className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded">
                                                        {f}
                                                    </span>
                                                ))}
                                                {bizExtractionFields.length > 5 && (
                                                    <span className="text-[10px] text-[#737373] self-center">
                                                        +{bizExtractionFields.length - 5} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {bizError && (
                                        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                                            {bizError}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleBusinessSubmit}
                                        disabled={isLoading}
                                        className="w-full py-6 text-sm font-semibold gap-2 shadow-lg bg-neutral-950 hover:bg-neutral-800 text-white"
                                    >
                                        {isLoading ? (
                                            <>
                                                <HugeiconsIcon icon={RefreshCwIcon} className="w-4 h-4 animate-spin" />
                                                Setting up Agent & Telephony...
                                            </>
                                        ) : (
                                            <>
                                                <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4" />
                                                Launch Agent & Test Voice Call
                                                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 ml-1" />
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-[11px] text-[#737373] text-center">
                                        Once created, you can test speaking with your agent via your microphone or phone!
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Advanced Developer Callout */}
                            <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 text-xs text-[#737373] space-y-1.5">
                                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                                    <HugeiconsIcon icon={Layers01Icon} className="w-3.5 h-3.5 text-primary" />
                                    <span>Need developer tools?</span>
                                </div>
                                <p className="leading-relaxed">
                                    Switch to <strong>Studio Form</strong> or <strong>AI Copilot</strong> in the top header anytime to customize raw prompts, tool calls, and node graphs.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : builderMode === 'classic' ? (
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    {/* Header Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E5]">
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs bg-[#F0F3F9] text-[#7186AD] border-[#DCE3EF]">
                                    ● Agent Builder Studio
                                </Badge>
                                <span className="text-xs text-[#737373]">Fast Visual Configuration</span>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                                Design Your Voice AI Representative
                            </h2>
                            <p className="text-sm text-[#737373] mt-0.5">
                                Select an industry template or customize your conversational instructions below.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <WorkflowTemplateSheet buttonSize="default" className="hidden sm:flex" />
                        </div>
                    </div>

                    {/* Starter Templates Carousel/Grid */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4 text-primary" />
                                <span>Industry Starter Templates (1-Click Setup)</span>
                            </div>
                            <span className="text-xs text-[#737373]">
                                Click to instantly pre-fill all settings
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
                                        className={`group text-left p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                                            isSelected
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
                                                className={`text-[10px] uppercase font-bold py-0 ${
                                                    tmpl.callType === 'inbound'
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
                                            <Badge variant="secondary" className="text-xs gap-1 font-medium">
                                                Template Loaded
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
                                                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                                                    classicCallType === 'inbound'
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
                                                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                                                    classicCallType === 'outbound'
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
                                            placeholder="e.g. Apex Clinic Receptionist, Real Estate Qualifier"
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
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="activity-description" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                                Conversational Instructions & System Prompt
                                            </Label>
                                            <span className="text-[11px] text-[#737373]">
                                                {classicActivityDescription.length > 0 && `${classicActivityDescription.length} characters`}
                                            </span>
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

                        {/* Right Column: Live Pipeline Architecture Preview (5 cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Pipeline Visualizer Card */}
                            <Card className="shadow-md border-[#E5E5E5] bg-[#FFFFFF]">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <HugeiconsIcon icon={WorkflowIcon} className="w-4 h-4 text-primary" />
                                        Generated Architecture Pipeline
                                    </CardTitle>
                                    <CardDescription>
                                        How your inputs will be mapped to the live multi-node workflow engine.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Step 1: Telephony Ingestion */}
                                    <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-1">
                                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                    1
                                                </div>
                                                <span>Telephony & Audio Layer</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] capitalize">
                                                {classicCallType}
                                            </Badge>
                                        </div>
                                        <p className="text-[11px] text-[#737373] pl-7">
                                            LiveKit WebRTC audio session + Twilio PSTN SIP trunking with dual-channel stream.
                                        </p>
                                    </div>

                                    {/* Step 2: Conversational Agent Brain */}
                                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                                                    2
                                                </div>
                                                <span>Agent Brain Node</span>
                                            </div>
                                            <Badge variant="secondary" className="text-[10px]">
                                                {classicLanguage}
                                            </Badge>
                                        </div>
                                        <div className="text-[11px] text-foreground/80 pl-7 space-y-0.5">
                                            <div><strong>Name:</strong> {classicUseCase || 'Unnamed Agent'}</div>
                                            <div><strong>Tone:</strong> {classicTone}</div>
                                            <div><strong>Engine:</strong> Deepgram Nova-2 + Cartesia Sonic + LLaMA 3.3 / GPT-4o</div>
                                        </div>
                                    </div>

                                    {/* Step 3: Information Extraction / QA */}
                                    <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-1">
                                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-[#7186AD]/10 text-[#7186AD] flex items-center justify-center text-[10px] font-bold">
                                                    3
                                                </div>
                                                <span>Structured Data Extraction</span>
                                            </div>
                                            <span className="text-[10px] text-[#7186AD] font-medium">Automatic</span>
                                        </div>
                                        <p className="text-[11px] text-[#737373] pl-7">
                                            Extracts caller intent, appointment times, phone/email, and qualification criteria.
                                        </p>
                                    </div>

                                    {/* Step 4: Outcome & Termination */}
                                    <div className="p-3 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-1">
                                        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center text-[10px] font-bold">
                                                    4
                                                </div>
                                                <span>End of Call / Webhook Sync</span>
                                            </div>
                                            <span className="text-[10px] text-[#737373]">Live Logging</span>
                                        </div>
                                        <p className="text-[11px] text-[#737373] pl-7">
                                            Saves recording, full conversational transcript, and dispatches webhook triggers.
                                        </p>
                                    </div>

                                    {/* Platform Features Checklist */}
                                    <div className="pt-3 border-t border-[#E5E5E5] space-y-2">
                                        <div className="text-xs font-semibold text-foreground">
                                            Built-in Enterprise Capabilities:
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#737373]">
                                            <div className="flex items-center gap-1.5">
                                                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5 text-[#7186AD]" />
                                                <span>Sub-500ms Voice</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5 text-[#7186AD]" />
                                                <span>Smart Interruption</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5 text-[#7186AD]" />
                                                <span>Audio Recordings</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3.5 h-3.5 text-[#7186AD]" />
                                                <span>Full Canvas Edit</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Canvas Visual Guidance Card */}
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-purple-50/30 border border-indigo-100 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                                    <HugeiconsIcon icon={InfoIcon} className="w-4 h-4 text-indigo-600" />
                                    <span>Visual Canvas Editing</span>
                                </div>
                                <p className="text-xs text-indigo-900/80 leading-relaxed">
                                    After generating, you can drag and drop custom <strong>Webhook nodes</strong>, <strong>Call Forwarding</strong>, and <strong>Tool calls</strong> directly onto the visual canvas!
                                </p>
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
