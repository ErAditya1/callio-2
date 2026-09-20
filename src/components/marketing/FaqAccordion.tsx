'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  PlusIcon,
} from "@hugeicons/core-free-icons";;
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface FaqItem {
  question: string;
  answer: string;
}

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

/**
 * FAQ section — editorial two-column layout on a pure white canvas: left rail
 * with label, heading, and contact pill; right accordion list with `+`
 * togglers and hairline dividers. Content unchanged — design only.
 */
export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section aria-labelledby="faq-heading" className="bg-white text-neutral-900">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-10 sm:py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
          {/* Left rail */}
          <div>
            <p className="text-[12.5px] font-medium text-neutral-400">FAQs</p>
            <h2
              id="faq-heading"
              className="mt-3 text-[32px] leading-[1.15] font-medium tracking-[-0.02em] text-[#0b0b0e]"
            >
              Frequently asked questions
            </h2>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-6 h-9 rounded-full border-neutral-200 bg-white px-4 text-[13px] font-medium text-neutral-700 shadow-none hover:bg-neutral-50 hover:text-neutral-950"
            >
              <Link href="/contact">
                Have other questions?
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {/* Right accordion */}
          <div>
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq.question} className="border-t border-neutral-200/80 last:border-b">
                  <button
                    onClick={() => toggleItem(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${idx}`}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-[18px] leading-[1.5] font-medium text-neutral-800">
                      {faq.question}
                    </span>
                    <HugeiconsIcon icon={PlusIcon}
                      className={`h-[18px] w-[18px] shrink-0 text-neutral-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div id={`faq-panel-${idx}`} role="region" className="pr-10 pb-6">
                      <p className="max-w-[640px] text-[14.5px] leading-[1.7] text-neutral-500">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
