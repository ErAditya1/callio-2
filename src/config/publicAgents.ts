import { cloneTemplateToWorkspace } from './workflowTemplates';
import defaultAgentsJson from './publicAgentsData.json';

export interface PublicDID {
  id: number;
  phone_number: string;
  formatted_number: string;
  country: string;
  country_code: string;
  carrier: string;
  label: string;
  is_active: boolean;
}

export interface PublicAgent {
  id: string;
  /** Public telephony identifier for live phone testing */
  workflow_uuid: string;
  name: string;
  tagline: string;
  role: string;
  category: 'Sales & Inbound' | 'Support & Service' | 'Appointment Booking' | 'Collections & Reminders' | 'Real Estate & Inquiries';
  avatar: string;
  voice_name: string;
  voice_accent: string;
  latency: string;
  did_id: number; // Mapped to PublicDID.id
  greeting_preview: string;
  sample_topics: string[];
  skills: string[];
  success_rate: string;
  /** Template ID in workflowTemplates library to instantiate into user dashboard */
  template_id: string;
}

// -------------------------------------------------------------
// DIDs (Caller IDs / Phone Numbers) Pool - Managed in one place
// -------------------------------------------------------------
export const PUBLIC_DIDS: PublicDID[] = [
  {
    id: 1,
    phone_number: "+911140807890",
    formatted_number: "+91 11 4080 7890",
    country: "India",
    country_code: "+91",
    carrier: "Tata / Airtel SIP Trunk",
    label: "Delhi Outbound Trunk",
    is_active: true,
  },
  {
    id: 2,
    phone_number: "+18884502255",
    formatted_number: "+1 (888) 450-CALL",
    country: "United States",
    country_code: "+1",
    carrier: "Twilio High-Throughput",
    label: "US Toll-Free Caller ID",
    is_active: true,
  },
  {
    id: 3,
    phone_number: "+442079460912",
    formatted_number: "+44 20 7946 0912",
    country: "United Kingdom",
    country_code: "+44",
    carrier: "Vonage Global SIP",
    label: "London Caller ID",
    is_active: true,
  },
];

// -------------------------------------------------------------
// COMMON AGENTS ARRAY (Single Source of Truth)
// Aap apne dashboard me naya agent create karke uska ID yahan add kar sakte hain:
// Example: workflow_id: 12
// -------------------------------------------------------------
// COMMON AGENTS ARRAY (Single Source of Truth)
// Easily add new agents by linking them to a template in WORKFLOW_TEMPLATES
// -------------------------------------------------------------
export const PUBLIC_AGENTS: PublicAgent[] =
  Array.isArray(defaultAgentsJson) && defaultAgentsJson.length > 0
    ? (defaultAgentsJson as unknown as PublicAgent[])
    : [
  {
    id: "sdr-sales",
    workflow_uuid: "wf_sales_sdr_01",
    name: "Aria Patel",
    tagline: "Enterprise Inbound SDR & Lead Qualification",
    role: "Speaks naturally, qualifies lead budget & requirements, and schedules executive product demos.",
    category: "Sales & Inbound",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
    voice_name: "Sarah (ElevenLabs)",
    voice_accent: "American • Professional & Warm",
    latency: "340ms",
    did_id: 1,
    greeting_preview: "Hi there! Thanks for requesting a call from CallioAI. How can I help supercharge your customer phone operations today?",
    sample_topics: ["Pricing & Enterprise Plans", "Custom CRM Integrations", "Sub-350ms Voice Latency"],
    skills: ["BANT Qualification", "Instant Demo Booking", "HubSpot & Salesforce Sync"],
    success_rate: "94%",
    template_id: "sales_agent",
  },
  {
    id: "receptionist-booking",
    workflow_uuid: "wf_booking_receptionist_02",
    name: "Kabir Sharma",
    tagline: "Healthcare & Clinic Calendar Specialist",
    role: "Checks real-time availability in Google Calendar / Cal.com, answers patient FAQs, and confirms bookings.",
    category: "Appointment Booking",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    voice_name: "Priya (Neets / Cartesia)",
    voice_accent: "Indian English & Hindi • Courteous",
    latency: "360ms",
    did_id: 1,
    greeting_preview: "Hello! Thank you for calling Metro Health Clinic. My name is Kabir. Are you looking to schedule a consultation or check doctor availability?",
    sample_topics: ["Doctor Consultation Booking", "Clinic Timings & Location", "Reschedule Existing Visit"],
    skills: ["Google Calendar Sync", "SMS Confirmation", "24/7 Patient Intake"],
    success_rate: "96%",
    template_id: "appointment_booking",
  },
  {
    id: "tier1-support",
    workflow_uuid: "wf_tier1_support_03",
    name: "Alex Reed",
    tagline: "Rapid Tier-1 Support & Customer Care",
    role: "Answers caller queries with verified facts, troubleshooting steps, and automatic support ticket creation.",
    category: "Support & Service",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    voice_name: "Alex (Cartesia)",
    voice_accent: "American • Standard & Crisp",
    latency: "310ms",
    did_id: 2,
    greeting_preview: "Hello! You've reached CallioAI Customer Support. How may I assist you with your account or phone service today?",
    sample_topics: ["Billing & Invoices", "API Keys & Webhook Setup", "SIP Trunk Routing"],
    skills: ["Zero Hold Time", "Ticket Auto-Generation", "Knowledge Base Search"],
    success_rate: "92%",
    template_id: "customer_support",
  },
  {
    id: "realestate-inquiry",
    workflow_uuid: "wf_realestate_04",
    name: "Marcus Vance",
    tagline: "Property Inquiries & Buyer Pre-Screening",
    role: "Handles property buyer calls, provides listing specs, checks mortgage pre-approval, and books walk-throughs.",
    category: "Real Estate & Inquiries",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    voice_name: "Marcus (PlayHT)",
    voice_accent: "British • Consultative & Refined",
    latency: "350ms",
    did_id: 3,
    greeting_preview: "Hello! Thank you for inquiring about our luxury residential listings. Which property can I provide details on today?",
    sample_topics: ["Open House Walkthrough", "Price & Floorplan Specs", "Pre-approval Verification"],
    skills: ["MLS Listing Details", "Showing Scheduling", "Buyer Prequalification"],
    success_rate: "91%",
    template_id: "lead_qualification",
  },
];

export function getPublicDIDById(didId: number): PublicDID | undefined {
  return PUBLIC_DIDS.find((did) => did.id === didId) || PUBLIC_DIDS[0];
}

export function getPublicAgentById(agentId: string): PublicAgent | undefined {
  return PUBLIC_AGENTS.find((agent) => agent.id === agentId) || PUBLIC_AGENTS[0];
}

/**
 * Universal Agent Import Function
 * Imports the agent directly into the user's workspace using the standard template library.
 * Requires ZERO custom backend changes — uses native Dograh workflow creation APIs.
 */
export async function cloneAgentToWorkspace(
  agent: PublicAgent,
  accessToken: string,
  customName?: string
): Promise<{ id: number; name: string }> {
  const nameToUse = customName || `${agent.name} (Custom Agent)`;
  const templateId = agent.template_id || 'ai_receptionist';
  return await cloneTemplateToWorkspace(templateId, accessToken, nameToUse);
}

