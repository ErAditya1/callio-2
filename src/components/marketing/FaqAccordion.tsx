'use client';

import { ChevronDown, HelpCircle } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS: FaqItem[] = [
    {
      question: "How natural does CallioAI sound? Will callers know it's an AI?",
      answer:
        "CallioAI uses ultra-realistic neural acoustic synthesis from Cartesia and ElevenLabs, paired with human-grade prosody models. It includes natural speech cadences, thoughtful pauses, appropriate inflection, and sub-350ms response latency. Over 88% of callers in live production tests report feeling they spoke with a professional human receptionist or sales specialist."
    },
    {
      question: "Can callers interrupt the AI while it is speaking (barge-in)?",
      answer:
        "Yes, absolutely. CallioAI features real-time bidirectional voice activity detection (VAD). If a caller cuts in with 'Wait, actually...' or gives a correction, the AI immediately stops speaking in under 40ms, listens to the new instruction, and adjusts its response seamlessly without awkward restarts."
    },
    {
      question: "How does CallioAI connect to our existing phone numbers?",
      answer:
        "You can deploy in under 5 minutes using two easy methods: (1) Instantly provision a dedicated local or toll-free phone number directly in CallioAI, or (2) Forward calls from your existing Twilio, Telnyx, Vonage, or local business carrier (such as Tata Smartflo, AT&T, or Verizon) whenever lines are busy, unattended, or after hours."
    },
    {
      question: "What happens if a caller asks something not covered in our documents?",
      answer:
        "CallioAI operates with strict anti-hallucination guardrails. If a query falls outside your uploaded FAQs or knowledge documents, the agent will politely acknowledge its limitation and either (1) initiate an immediate warm transfer to your human team with a spoken context briefing, or (2) capture the caller's details and trigger an urgent notification via SMS/email."
    },
    {
      question: "Is CallioAI compliant with HIPAA, TCPA, and enterprise privacy standards?",
      answer:
        "Yes. All voice calls and transcripts are encrypted in transit via 256-bit TLS and at rest with AES-256. For healthcare providers, we execute HIPAA Business Associate Agreements (BAAs) and provide automated PII/PHI redaction. For outbound calling, our platform enforces TCPA calling hours, DNC registry checks, and STIR/SHAKEN carrier verification."
    },
    {
      question: "Which calendar and CRM systems integrate out of the box?",
      answer:
        "CallioAI provides native 1-click integrations with Google Calendar, Cal.com, Outlook 365, HubSpot, Salesforce, Zoho, Follow Up Boss, and ServiceTitan. You can also connect any internal software via standard Webhooks or Zapier."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-3 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1">
          <HelpCircle className="w-3.5 h-3.5 mr-1.5 inline" />
          Frequently Asked Questions
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Everything you need to know about CallioAI.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Clear answers about voice realism, telephony setup, compliance, and enterprise workflows.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-indigo-500/50 bg-card/90 shadow-lg shadow-indigo-500/5'
                  : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/60'
              }`}
            >
              <button
                onClick={() => toggleItem(idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-foreground cursor-pointer"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
