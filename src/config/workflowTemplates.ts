/**
 * workflowTemplates.ts
 *
 * Static workflow templates using 100% existing Dograh node types and schemas.
 * Templates are instantiated via the existing
 * `createWorkflowApiV1WorkflowCreateDefinitionPost` API — no new backend needed.
 *
 * IMPORTANT: All node `type` values MUST match backend NodeType enum exactly.
 */

import type { FlowEdge, FlowNode } from "@/components/flow/types";

// ─────────────────────────────────────────────────────────────────────────────
// Template Definition Type
// ─────────────────────────────────────────────────────────────────────────────

export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: "receptionist" | "sales" | "support" | "booking" | "collection";
  callType: "inbound" | "outbound" | "both";
  /** Bullet-point capabilities shown in the preview card */
  capabilities: string[];
  /** Tags for search */
  tags: string[];
  /** Color class for the card accent */
  colorClass: string;
  /** The actual Dograh workflow definition */
  workflow_definition: {
    nodes: FlowNode[];
    edges: FlowEdge[];
    viewport: { x: number; y: number; zoom: number };
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper to build positions in a vertical line
// ─────────────────────────────────────────────────────────────────────────────
const pos = (index: number) => ({ x: 200, y: 60 + index * 200 });

// ─────────────────────────────────────────────────────────────────────────────
// Default Global Persona Prompt
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_GLOBAL_PROMPT =
  "You are a professional and helpful AI assistant. Speak in short, natural sentences suitable for a voice conversation. Do not use bullet points, markdown formatting, or special characters that cannot be pronounced. Keep responses concise — 1 to 3 sentences maximum per turn.";

// ─────────────────────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────────────────────

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  // ── 1. AI Receptionist ───────────────────────────────────────────────────
  {
    id: "ai_receptionist",
    name: "AI Receptionist",
    description: "Answer inbound calls, answer questions, and route callers to the right person.",
    emoji: "📞",
    category: "receptionist",
    callType: "inbound",
    capabilities: [
      "Answer common questions",
      "Route calls to the right department",
      "Take messages",
      "Handle basic inquiries 24/7",
    ],
    tags: ["receptionist", "inbound", "routing", "answering"],
    colorClass: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: DEFAULT_GLOBAL_PROMPT, is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Welcome",
            greeting_type: "text",
            greeting: "Thank you for calling. How can I help you today?",
            prompt:
              "You are a professional receptionist. Greet the caller warmly. Identify their reason for calling and route them appropriately or answer their question.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Understand Request",
            prompt:
              "Listen carefully to the caller's request. Clarify if needed. If you can answer the question, do so. If they need a specific department or person, let them know you will transfer or take a message.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract the caller's reason for calling.",
            extraction_variables: [
              { name: "reason_for_call", type: "string", prompt: "Why the caller is calling" },
              { name: "caller_name", type: "string", prompt: "Caller's name if given" },
            ],
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "End Call",
            prompt: "Thank the caller for calling. Wish them a good day and end the call professionally.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Has request", condition: "Caller states their reason for calling" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Done", condition: "Request handled or message taken" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 2. Customer Support ──────────────────────────────────────────────────
  {
    id: "customer_support",
    name: "Customer Support",
    description: "Handle support inquiries, troubleshoot issues, and escalate to humans when needed.",
    emoji: "🎧",
    category: "support",
    callType: "inbound",
    capabilities: [
      "Collect issue details",
      "Troubleshoot common problems",
      "Escalate complex cases",
      "Send results to CRM",
    ],
    tags: ["support", "helpdesk", "troubleshooting", "escalation"],
    colorClass: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: DEFAULT_GLOBAL_PROMPT, is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Welcome",
            greeting_type: "text",
            greeting: "Hi, thank you for calling support. I'm here to help. What issue are you experiencing today?",
            prompt:
              "You are a customer support agent. Greet the caller and ask them to describe their issue clearly.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Diagnose Issue",
            prompt:
              "Understand the customer's issue. Ask clarifying questions to diagnose the root cause. Walk through basic troubleshooting steps. If the issue is resolved, move to close. If not, offer to escalate.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract support ticket details.",
            extraction_variables: [
              { name: "issue_description", type: "string", prompt: "What the customer's issue is" },
              { name: "resolved", type: "boolean", prompt: "Was the issue resolved?" },
              { name: "needs_escalation", type: "boolean", prompt: "Does this need human escalation?" },
            ],
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "Close",
            prompt:
              "Thank the customer for their patience. Summarize what was done or what will happen next. End the call warmly.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
        {
          id: "webhook_1",
          type: "webhook",
          position: { x: 600, y: 460 },
          data: {
            name: "Log to CRM",
            enabled: true,
            http_method: "POST",
            endpoint_url: "",
            payload_template: {
              call_id: "{{workflow_run_id}}",
              issue: "{{gathered_context.issue_description}}",
              resolved: "{{gathered_context.resolved}}",
              escalation_needed: "{{gathered_context.needs_escalation}}",
              duration: "{{cost_info.call_duration_seconds}}",
            },
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Issue described", condition: "Customer describes their problem" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Handled", condition: "Issue resolved or escalation arranged" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 3. Lead Qualification ────────────────────────────────────────────────
  {
    id: "lead_qualification",
    name: "Lead Qualification",
    description: "Call leads and qualify them based on budget, timeline, and intent.",
    emoji: "🎯",
    category: "sales",
    callType: "outbound",
    capabilities: [
      "Qualify leads on BANT criteria",
      "Extract budget and timeline",
      "Score lead quality",
      "Log to CRM automatically",
    ],
    tags: ["sales", "leads", "qualification", "outbound", "BANT"],
    colorClass: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: DEFAULT_GLOBAL_PROMPT, is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Opening",
            greeting_type: "text",
            greeting: "Hi {{first_name}}, this is an AI assistant calling on behalf of our team. Do you have 2 minutes to chat?",
            prompt:
              "You are calling a lead. Introduce yourself warmly. Confirm you have reached the right person. Ask if they have a moment to speak.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Qualify",
            prompt:
              "Qualify the lead using BANT criteria. Ask naturally — do not fire all questions at once. Cover: what problem they are trying to solve, their budget range, when they need a solution, and whether they make the buying decision. Be conversational.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract BANT qualification data.",
            extraction_variables: [
              { name: "budget_range", type: "string", prompt: "Budget range or amount mentioned" },
              { name: "timeline", type: "string", prompt: "When they want to buy or implement" },
              { name: "is_decision_maker", type: "boolean", prompt: "Are they the decision maker?" },
              { name: "interest_level", type: "string", prompt: "Overall interest: hot, warm, or cold" },
              { name: "pain_point", type: "string", prompt: "Main problem they want to solve" },
            ],
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "Close",
            prompt:
              "Thank the person for their time. If they are a good fit, let them know a team member will be in touch shortly to discuss next steps.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
        {
          id: "webhook_1",
          type: "webhook",
          position: { x: 600, y: 460 },
          data: {
            name: "Send to CRM",
            enabled: true,
            http_method: "POST",
            endpoint_url: "",
            payload_template: {
              call_id: "{{workflow_run_id}}",
              budget: "{{gathered_context.budget_range}}",
              timeline: "{{gathered_context.timeline}}",
              decision_maker: "{{gathered_context.is_decision_maker}}",
              interest: "{{gathered_context.interest_level}}",
              pain_point: "{{gathered_context.pain_point}}",
            },
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Available", condition: "Lead confirms they can talk" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Qualified", condition: "Lead qualification complete" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 4. Appointment Booking ───────────────────────────────────────────────
  {
    id: "appointment_booking",
    name: "Appointment Booking",
    description: "Schedule appointments over the phone and collect booking details.",
    emoji: "📅",
    category: "booking",
    callType: "inbound",
    capabilities: [
      "Collect booking preferences",
      "Confirm appointment details",
      "Extract structured booking data",
      "Send data to booking system",
    ],
    tags: ["booking", "appointment", "scheduling", "calendar"],
    colorClass: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: DEFAULT_GLOBAL_PROMPT, is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Welcome",
            greeting_type: "text",
            greeting: "Hi, thank you for calling. I can help you book an appointment today.",
            prompt: "Welcome the caller and let them know you can help them schedule an appointment.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Collect Booking Details",
            prompt:
              "Collect all information needed to book the appointment: the caller's full name, phone number, preferred date and time, and the reason for the appointment. Ask one question at a time. Confirm details before finalizing.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract appointment booking details.",
            extraction_variables: [
              { name: "caller_name", type: "string", prompt: "Full name of the person booking" },
              { name: "phone_number", type: "string", prompt: "Best phone number to reach them" },
              { name: "preferred_date", type: "string", prompt: "Preferred appointment date" },
              { name: "preferred_time", type: "string", prompt: "Preferred time slot" },
              { name: "appointment_reason", type: "string", prompt: "Reason for the appointment" },
            ],
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "Confirm & Close",
            prompt:
              "Confirm the appointment details with the caller. Let them know they will receive a confirmation. Thank them and end the call.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
        {
          id: "webhook_1",
          type: "webhook",
          position: { x: 600, y: 460 },
          data: {
            name: "Send to Booking System",
            enabled: true,
            http_method: "POST",
            endpoint_url: "",
            payload_template: {
              name: "{{gathered_context.caller_name}}",
              phone: "{{gathered_context.phone_number}}",
              date: "{{gathered_context.preferred_date}}",
              time: "{{gathered_context.preferred_time}}",
              reason: "{{gathered_context.appointment_reason}}",
            },
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Ready to book", condition: "Caller wants to schedule" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Details collected", condition: "All booking details confirmed" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 5. Sales Agent ───────────────────────────────────────────────────────
  {
    id: "sales_agent",
    name: "Sales Agent",
    description: "Proactively call prospects, present your offer, and handle objections.",
    emoji: "📈",
    category: "sales",
    callType: "outbound",
    capabilities: [
      "Introduce product or service",
      "Handle objections professionally",
      "Qualify interest level",
      "Schedule follow-up with human",
    ],
    tags: ["sales", "outbound", "prospecting", "cold call"],
    colorClass: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: DEFAULT_GLOBAL_PROMPT, is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Introduction",
            greeting_type: "text",
            greeting: "Hi {{first_name}}, my name is Alex. I am calling from {{company_name}}. Do you have a moment?",
            prompt:
              "Introduce yourself and the company. Be warm and confident. Confirm you have reached the right person. Ask if they have a moment to hear a quick update.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Present Offer",
            prompt:
              "Present the product or service in a concise and compelling way. Focus on the benefit most relevant to this prospect. Pause frequently to check for questions or reactions.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "3",
          type: "agentNode",
          position: pos(2),
          data: {
            name: "Handle Objections",
            prompt:
              "Address any concerns or objections calmly and honestly. Do not pressure the prospect. If they are interested, guide them toward the next step. If not, thank them and offer to stay in touch.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract sales call outcome.",
            extraction_variables: [
              { name: "interest_level", type: "string", prompt: "hot, warm, cold, or not_interested" },
              { name: "main_objection", type: "string", prompt: "Primary objection raised" },
              { name: "next_step", type: "string", prompt: "Agreed next step if any" },
            ],
          },
        },
        {
          id: "4",
          type: "endCall",
          position: pos(3),
          data: {
            name: "Close",
            prompt: "Wrap up the call. Confirm next steps or simply thank them for their time.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Has a moment", condition: "Prospect agrees to listen" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Pitch delivered", condition: "Offer presented" } },
        { id: "e3-4", source: "3", target: "4", data: { label: "Done", condition: "Objections handled" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 6. FAQ Agent ─────────────────────────────────────────────────────────
  {
    id: "faq_agent",
    name: "FAQ Agent",
    description: "Answer frequently asked questions using your knowledge base.",
    emoji: "❓",
    category: "support",
    callType: "inbound",
    capabilities: [
      "Answer product & service questions",
      "Draw from knowledge base",
      "Handle multiple questions per call",
      "Escalate unknown queries",
    ],
    tags: ["faq", "questions", "knowledge base", "inbound"],
    colorClass: "from-cyan-500/20 to-sky-500/20 border-cyan-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: DEFAULT_GLOBAL_PROMPT, is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Welcome",
            greeting_type: "text",
            greeting: "Hello! I am here to answer your questions. What would you like to know?",
            prompt:
              "You are an FAQ assistant. Welcome the caller and ask what they would like to know.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Answer Questions",
            prompt:
              "Answer the caller's questions accurately using your knowledge base. After each answer, ask if they have another question. If you do not know the answer, say so honestly and offer to have someone follow up. Continue until the caller has no more questions.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "Close",
            prompt: "Thank the caller for reaching out. Wish them a great day and end the call.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Has question", condition: "Caller asks a question" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "No more questions", condition: "All questions answered" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 7. Feedback Collection ────────────────────────────────────────────────
  {
    id: "feedback_collection",
    name: "Feedback Collection",
    description: "Call customers after service to collect ratings and feedback.",
    emoji: "⭐",
    category: "collection",
    callType: "outbound",
    capabilities: [
      "Collect NPS or satisfaction score",
      "Gather qualitative feedback",
      "Extract structured survey data",
      "Send results to CRM",
    ],
    tags: ["feedback", "NPS", "survey", "outbound", "review"],
    colorClass: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: DEFAULT_GLOBAL_PROMPT, is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Introduction",
            greeting_type: "text",
            greeting: "Hi {{first_name}}, this is a quick call to get your feedback on your recent experience with us. Do you have 2 minutes?",
            prompt: "Introduce yourself as a feedback agent. Ask if the caller has a couple of minutes to share their experience.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Collect Feedback",
            prompt:
              "Ask for feedback on their recent experience. Start with an overall satisfaction score from 1 to 10. Then ask what they liked most and what could be improved. Be warm and receptive. Do not be defensive about negative feedback.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract customer feedback data.",
            extraction_variables: [
              { name: "satisfaction_score", type: "number", prompt: "Score from 1 to 10" },
              { name: "positive_feedback", type: "string", prompt: "What they liked" },
              { name: "improvement_feedback", type: "string", prompt: "What could be better" },
            ],
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "Thank You",
            prompt: "Thank the customer sincerely for their feedback. Let them know it will be used to improve their experience.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
        {
          id: "webhook_1",
          type: "webhook",
          position: { x: 600, y: 460 },
          data: {
            name: "Send Feedback",
            enabled: true,
            http_method: "POST",
            endpoint_url: "",
            payload_template: {
              call_id: "{{workflow_run_id}}",
              score: "{{gathered_context.satisfaction_score}}",
              positive: "{{gathered_context.positive_feedback}}",
              improvement: "{{gathered_context.improvement_feedback}}",
            },
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Has time", condition: "Customer agrees to give feedback" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Done", condition: "Feedback collected" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 8. Clinic Receptionist ────────────────────────────────────────────────
  {
    id: "clinic_receptionist",
    name: "Clinic Receptionist",
    description: "Handle patient calls for a medical clinic — answer questions and book appointments.",
    emoji: "🏥",
    category: "receptionist",
    callType: "inbound",
    capabilities: [
      "Answer clinic hours and location",
      "Book patient appointments",
      "Handle prescription queries",
      "Collect patient details",
    ],
    tags: ["clinic", "medical", "healthcare", "receptionist", "appointment"],
    colorClass: "from-green-500/20 to-emerald-500/20 border-green-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: "You are a professional and empathetic medical receptionist AI. Speak calmly and clearly. Always prioritize patient well-being. Keep responses short. Never give medical advice.", is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Welcome",
            greeting_type: "text",
            greeting: "Thank you for calling {{clinic_name}}. How can I assist you today?",
            prompt:
              "Welcome the patient warmly. Ask how you can help — whether they want to book an appointment, ask about services, or get other information.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Handle Request",
            prompt:
              "Help the patient with their request. If they want to book an appointment, collect: their full name, date of birth, phone number, preferred date and time, and reason for visit. If they have questions about the clinic, answer from the knowledge base. If it is an emergency, advise them to call emergency services immediately.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract patient request details.",
            extraction_variables: [
              { name: "request_type", type: "string", prompt: "appointment, inquiry, or other" },
              { name: "patient_name", type: "string", prompt: "Patient full name" },
              { name: "preferred_date", type: "string", prompt: "Preferred appointment date" },
              { name: "visit_reason", type: "string", prompt: "Reason for the visit" },
            ],
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "Close",
            prompt: "Thank the patient for calling. If an appointment was booked, confirm the details. Wish them well.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Has request", condition: "Patient states their need" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Handled", condition: "Request addressed" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 9. Real Estate Lead Qualification ────────────────────────────────────
  {
    id: "real_estate_leads",
    name: "Real Estate Lead Qualification",
    description: "Call real estate leads and qualify buyers and sellers quickly.",
    emoji: "🏠",
    category: "sales",
    callType: "outbound",
    capabilities: [
      "Qualify buyer vs. seller intent",
      "Extract budget and property preferences",
      "Assess timeline and motivation",
      "Log qualified leads to CRM",
    ],
    tags: ["real estate", "property", "leads", "qualification", "outbound"],
    colorClass: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: DEFAULT_GLOBAL_PROMPT, is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Opening",
            greeting_type: "text",
            greeting: "Hi {{first_name}}, I am calling regarding your recent inquiry about property. Is now a good time?",
            prompt: "Introduce yourself and confirm you have reached the right person. Ask if they have a moment to chat about their property needs.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Qualify Property Intent",
            prompt:
              "Qualify the lead. First determine if they are looking to buy, sell, or both. Then ask about: location preference, budget or property value range, timeline, and what is motivating them. Be conversational — do not rush.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract real estate qualification data.",
            extraction_variables: [
              { name: "intent", type: "string", prompt: "buy, sell, or both" },
              { name: "location", type: "string", prompt: "Preferred location or area" },
              { name: "budget", type: "string", prompt: "Budget range or property value" },
              { name: "timeline", type: "string", prompt: "How soon they want to move" },
              { name: "motivation", type: "string", prompt: "What is driving their decision" },
            ],
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "Close",
            prompt: "Thank them for their time. Let them know an agent will reach out shortly with tailored options.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
        {
          id: "webhook_1",
          type: "webhook",
          position: { x: 600, y: 460 },
          data: {
            name: "Send Lead to CRM",
            enabled: true,
            http_method: "POST",
            endpoint_url: "",
            payload_template: {
              call_id: "{{workflow_run_id}}",
              intent: "{{gathered_context.intent}}",
              location: "{{gathered_context.location}}",
              budget: "{{gathered_context.budget}}",
              timeline: "{{gathered_context.timeline}}",
            },
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Available", condition: "Lead has a moment to chat" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Qualified", condition: "All qualification questions answered" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 10. Follow-up Agent ───────────────────────────────────────────────────
  {
    id: "follow_up",
    name: "Follow-up Agent",
    description: "Follow up with contacts after meetings, purchases, or inquiries.",
    emoji: "🔔",
    category: "sales",
    callType: "outbound",
    capabilities: [
      "Check in after a previous interaction",
      "Re-engage warm leads",
      "Confirm next steps",
      "Schedule callback or meeting",
    ],
    tags: ["follow-up", "re-engagement", "outbound", "nurture"],
    colorClass: "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: DEFAULT_GLOBAL_PROMPT, is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Follow-up Opening",
            greeting_type: "text",
            greeting: "Hi {{first_name}}, I am calling to follow up on our recent conversation. Do you have a moment?",
            prompt: "Reintroduce yourself and the context of the previous interaction. Ask if they have a moment to continue the conversation.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Check In",
            prompt:
              "Check in on where they stand since your last conversation. Ask if they have had a chance to review what was discussed or sent. Address any questions they have. Try to move toward a concrete next step.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract follow-up outcome.",
            extraction_variables: [
              { name: "status", type: "string", prompt: "still_interested, not_interested, or needs_more_time" },
              { name: "next_step", type: "string", prompt: "Agreed next action" },
              { name: "callback_date", type: "string", prompt: "Date for next contact if applicable" },
            ],
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "Close",
            prompt: "Confirm the next step or simply thank them for their time. Keep it brief and professional.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Available", condition: "They have a moment to chat" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Done", condition: "Follow-up complete" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 11. Restaurant Booking ────────────────────────────────────────────────
  {
    id: "restaurant_booking",
    name: "Restaurant Booking",
    description: "Take table reservations and answer questions about your restaurant.",
    emoji: "🍽️",
    category: "booking",
    callType: "inbound",
    capabilities: [
      "Take table reservations",
      "Answer menu and dietary questions",
      "Collect party size and preferences",
      "Confirm bookings",
    ],
    tags: ["restaurant", "reservation", "booking", "food", "dining"],
    colorClass: "from-orange-500/20 to-red-500/20 border-orange-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: "You are a friendly and warm restaurant assistant. Keep responses brief and conversational. You are managing reservations and answering questions about the restaurant.", is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Welcome",
            greeting_type: "text",
            greeting: "Thank you for calling {{restaurant_name}}! How can I help you today?",
            prompt: "Welcome the caller. Ask if they want to make a reservation or if they have a question.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Handle Request",
            prompt:
              "If they want a reservation, collect: the date, time, party size, name for the booking, and any dietary requirements or special occasions. If they have questions about the menu or hours, answer them. Confirm reservation details before closing.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract reservation details.",
            extraction_variables: [
              { name: "reservation_date", type: "string", prompt: "Date of reservation" },
              { name: "reservation_time", type: "string", prompt: "Time of reservation" },
              { name: "party_size", type: "number", prompt: "Number of guests" },
              { name: "booking_name", type: "string", prompt: "Name for the booking" },
              { name: "special_request", type: "string", prompt: "Any special requirements" },
            ],
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "Confirm",
            prompt: "Confirm the reservation details or answer. Thank the caller and look forward to seeing them.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Has request", condition: "Caller states what they need" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Done", condition: "Request handled" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },

  // ── 12. E-commerce Support ────────────────────────────────────────────────
  {
    id: "ecommerce_support",
    name: "E-commerce Support",
    description: "Handle order status, returns, and product questions for online stores.",
    emoji: "🛒",
    category: "support",
    callType: "inbound",
    capabilities: [
      "Check order status",
      "Handle return requests",
      "Answer product questions",
      "Escalate complex issues",
    ],
    tags: ["ecommerce", "orders", "returns", "support", "shopping"],
    colorClass: "from-violet-500/20 to-purple-500/20 border-violet-500/30",
    workflow_definition: {
      nodes: [
        {
          id: "global_1",
          type: "globalNode",
          position: { x: 600, y: 60 },
          data: { name: "Agent Instructions", prompt: DEFAULT_GLOBAL_PROMPT, is_start: false, is_end: false },
        },
        {
          id: "1",
          type: "startCall",
          position: pos(0),
          data: {
            name: "Welcome",
            greeting_type: "text",
            greeting: "Hi, thank you for calling {{store_name}} customer support. How can I help you today?",
            prompt: "Welcome the customer to e-commerce support. Ask what they need help with.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: true,
            is_end: false,
            extraction_enabled: false,
          },
        },
        {
          id: "2",
          type: "agentNode",
          position: pos(1),
          data: {
            name: "Resolve Issue",
            prompt:
              "Help the customer with their issue. Common cases: order status (ask for order number), returns (explain the return process and collect details), or product questions (answer from knowledge base). Be helpful and patient.",
            allow_interrupt: true,
            add_global_prompt: true,
            is_start: false,
            is_end: false,
            extraction_enabled: true,
            extraction_prompt: "Extract support case details.",
            extraction_variables: [
              { name: "issue_type", type: "string", prompt: "order_status, return, product_question, or other" },
              { name: "order_number", type: "string", prompt: "Order number if provided" },
              { name: "resolved", type: "boolean", prompt: "Was the issue resolved?" },
            ],
          },
        },
        {
          id: "3",
          type: "endCall",
          position: pos(2),
          data: {
            name: "Close",
            prompt: "Summarize what was done or what next steps the customer should expect. Thank them for shopping with us.",
            is_start: false,
            is_end: true,
            extraction_enabled: false,
            add_global_prompt: false,
          },
        },
      ] as FlowNode[],
      edges: [
        { id: "e1-2", source: "1", target: "2", data: { label: "Has issue", condition: "Customer describes their problem" } },
        { id: "e2-3", source: "2", target: "3", data: { label: "Done", condition: "Issue resolved or escalated" } },
      ] as FlowEdge[],
      viewport: { x: 0, y: 0, zoom: 0.75 },
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Lookup helpers
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPLATE_MAP = new Map<string, WorkflowTemplate>(
  WORKFLOW_TEMPLATES.map((t) => [t.id, t]),
);

export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return TEMPLATE_MAP.get(id);
}

export function getTemplatesByCategory(
  category: WorkflowTemplate["category"],
): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter((t) => t.category === category);
}

import { createWorkflowApiV1WorkflowCreateDefinitionPost } from "@/client/sdk.gen";

export async function cloneTemplateToWorkspace(
  templateId: string,
  accessToken?: string,
  customName?: string,
): Promise<{ id: number; name: string }> {
  const template = getTemplateById(templateId);
  if (!template) {
    throw new Error(`Template with id '${templateId}' not found`);
  }

  // Clone workflow definition
  const workflowDefinition = JSON.parse(JSON.stringify(template.workflow_definition));

  const response = await createWorkflowApiV1WorkflowCreateDefinitionPost({
    body: {
      name: customName || `${template.name} - Agent`,
      workflow_definition: workflowDefinition as unknown as { [key: string]: unknown },
    },
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (response.error) {
    const detail = (response.error as any)?.detail || "Failed to create workflow from template";
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
  }

  if (!response.data?.id) {
    throw new Error("Failed to create workflow: no id returned");
  }

  return { id: response.data.id, name: response.data.name || template.name };
}


