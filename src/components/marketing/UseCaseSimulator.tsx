'use client';

import {
  Briefcase,
  CheckCircle2,
  Code2,
  Home,
  Sparkles,
  Stethoscope,
  User,
  Wrench,
} from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';

interface Message {
  speaker: 'caller' | 'agent';
  text: string;
  time: string;
  badge?: string;
}

interface UseCaseData {
  id: string;
  label: string;
  industry: string;
  icon: React.ElementType;
  color: string;
  dialogue: Message[];
  extractedData: {
    intent: string;
    sentiment: string;
    latency: string;
    variables: Record<string, string>;
    actionTriggered: string;
  };
}

export function UseCaseSimulator() {
  const [activeTab, setActiveTab] = useState<string>('healthcare');

  const USE_CASES: Record<string, UseCaseData> = {
    healthcare: {
      id: 'healthcare',
      label: 'Clinic Reception',
      industry: 'Dental & Medical Clinics',
      icon: Stethoscope,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      dialogue: [
        {
          speaker: 'agent',
          text: 'Thank you for calling Apex Dental Care. My name is Sarah. Are you calling to book a new appointment or follow up on care?',
          time: '00:01'
        },
        {
          speaker: 'caller',
          text: 'Hi, I chipped a molar while eating lunch and I really need someone to take a look tomorrow morning if possible.',
          time: '00:06'
        },
        {
          speaker: 'agent',
          text: "I'm so sorry to hear that! We can definitely accommodate an emergency evaluation tomorrow. I have openings at 9:30 AM or 11:15 AM with Dr. Patel. Which works better for you?",
          time: '00:11',
          badge: 'Live Cal.com Lookup (82ms)'
        },
        {
          speaker: 'caller',
          text: '9:30 AM works great. Do you take Delta Dental?',
          time: '00:17'
        },
        {
          speaker: 'agent',
          text: 'Yes, we are in-network with Delta Dental Premier. I have reserved 9:30 AM for you. You will receive an SMS reminder shortly with our intake link. Is there anything else I can assist with?',
          time: '00:23',
          badge: 'Calendar Slot Confirmed'
        }
      ],
      extractedData: {
        intent: 'Emergency Dental Booking',
        sentiment: 'Urgent / Relieved',
        latency: '310ms avg',
        variables: {
          'Patient Type': 'Emergency Intake',
          'Preferred Slot': 'Tomorrow @ 09:30 AM',
          'Assigned Doctor': 'Dr. Patel',
          'Insurance': 'Delta Dental Premier'
        },
        actionTriggered: 'POST /v1/appointments/book + SMS Confirmation Sent'
      }
    },
    realestate: {
      id: 'realestate',
      label: 'Real Estate Leads',
      industry: 'Brokers & Property Teams',
      icon: Home,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      dialogue: [
        {
          speaker: 'agent',
          text: 'Oakwood Realty showing desk, this is Alex. How can I help you today?',
          time: '00:01'
        },
        {
          speaker: 'caller',
          text: "Hi, I just drove by the 3-bedroom property on 442 Maple Street and wanted to know if it's still available for private showings.",
          time: '00:07'
        },
        {
          speaker: 'agent',
          text: 'Yes! 442 Maple is currently active at $685,000. It features 3 bedrooms, 2.5 baths, and a newly renovated kitchen. Are you pre-approved or working with an agent?',
          time: '00:12',
          badge: 'MLS Database Check'
        },
        {
          speaker: 'caller',
          text: "I'm fully pre-approved through Chase and looking to tour this Saturday afternoon.",
          time: '00:19'
        },
        {
          speaker: 'agent',
          text: 'Fantastic. I have booked you for an open showing this Saturday at 2:00 PM with our listing partner Mark. I just sent the gate code and property disclosures to your mobile phone.',
          time: '00:25',
          badge: 'Showing Dispatched'
        }
      ],
      extractedData: {
        intent: 'Private Showing Request',
        sentiment: 'High Purchase Intent',
        latency: '340ms avg',
        variables: {
          'Property': '442 Maple Street ($685k)',
          'Pre-approval': 'Verified (Chase)',
          'Tour Date': 'Saturday 2:00 PM',
          'Agent Assigned': 'Mark Stevens'
        },
        actionTriggered: 'Sync to Follow Up Boss CRM + SMS Disclosure Packet'
      }
    },
    sales: {
      id: 'sales',
      label: 'Speed-to-Lead SDR',
      industry: 'B2B SaaS & Inbound Leads',
      icon: Briefcase,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      dialogue: [
        {
          speaker: 'agent',
          text: 'Hi Jordan, this is Taylor from CallioAI. I noticed you just submitted a demo request for automated customer calling. Did I catch you at a good time?',
          time: '00:01',
          badge: 'Dialed in 24s from Web Form'
        },
        {
          speaker: 'caller',
          text: "Wow, that was fast! Yes, we currently handle about 3,000 inbound calls a month and our front desk is completely overwhelmed.",
          time: '00:08'
        },
        {
          speaker: 'agent',
          text: 'That is exactly our sweet spot. With 3,000 calls, CallioAI typically handles 85% on ring #1 with direct CRM syncing. Would you like me to connect you to our senior solutions engineer right now for a quick 5-minute walkthrough?',
          time: '00:15'
        },
        {
          speaker: 'caller',
          text: 'Sure, that would be great. Put me through.',
          time: '00:21'
        },
        {
          speaker: 'agent',
          text: 'Transferring you now to David. One moment while I bridge the line with your account details.',
          time: '00:24',
          badge: 'Warm Human Transfer Triggered'
        }
      ],
      extractedData: {
        intent: 'Qualified Inbound Demo Request',
        sentiment: 'High Intent / Impressed',
        latency: '295ms avg',
        variables: {
          'Monthly Volume': '3,000 calls/mo',
          'Pain Point': 'Front desk overwhelmed',
          'Lead Score': '98/100 (Tier 1 Buyer)',
          'Routing': 'Live Warm Transfer'
        },
        actionTriggered: 'HubSpot Deal Created ($24k ARR) + SIP Warm Transfer'
      }
    },
    dispatch: {
      id: 'dispatch',
      label: '24/7 Field Dispatch',
      industry: 'HVAC, Fleet & Logistics',
      icon: Wrench,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      dialogue: [
        {
          speaker: 'agent',
          text: 'ComfortAir 24/7 Emergency Dispatch, this is Sam. Are you experiencing a heating or cooling outage?',
          time: '00:01'
        },
        {
          speaker: 'caller',
          text: "Yes, our furnace just shut off and it's 18 degrees tonight. We have children in the house.",
          time: '00:07'
        },
        {
          speaker: 'agent',
          text: "Understood, that is treated as an emergency priority. Are there any gas odors or error codes on your digital thermostat?",
          time: '00:13',
          badge: 'Safety Screening Routine'
        },
        {
          speaker: 'caller',
          text: 'No smell, the thermostat just displays Error Code E-42.',
          time: '00:18'
        },
        {
          speaker: 'agent',
          text: 'Thank you. I have dispatched our on-call technician Ryan in truck #4. His estimated arrival time is 38 minutes. You will receive live GPS tracking on your phone now.',
          time: '00:24',
          badge: 'Technician Dispatched'
        }
      ],
      extractedData: {
        intent: 'Emergency HVAC Outage',
        sentiment: 'Urgent / Priority 1',
        latency: '320ms avg',
        variables: {
          'Issue': 'Furnace Outage (Error E-42)',
          'Safety Check': 'Negative for Gas Leak',
          'Dispatched Unit': 'Truck #4 (Ryan)',
          'ETA': '38 minutes'
        },
        actionTriggered: 'ServiceTitan Work Order #8491 + SMS GPS Link'
      }
    }
  };

  const current = USE_CASES[activeTab];

  return (
    <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-10 shadow-2xl relative overflow-hidden marketing-glow-card">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <Badge variant="outline" className="mb-3 border-violet-500/30 text-violet-400 bg-violet-500/10 px-3 py-1">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
          Production Conversational Flows
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          See CallioAI in action across industries.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Watch how the autonomous voice engine handles complex customer intent, verifies facts, and executes business actions in real time.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {Object.values(USE_CASES).map((item) => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.02]'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Dialogue & AI Intelligence Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dialogue Stream (Left - 7 cols) */}
        <div className="lg:col-span-7 bg-background/80 rounded-2xl border border-border/70 p-5 sm:p-6 space-y-4 shadow-inner">
          <div className="flex items-center justify-between border-b border-border/50 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-foreground">{current.industry}</span>
            </div>
            <span className="text-muted-foreground font-mono">Live Call Simulation</span>
          </div>

          <div className="space-y-3.5 pt-2 max-h-[380px] overflow-y-auto pr-1">
            {current.dialogue.map((msg, i) => {
              const isAgent = msg.speaker === 'agent';
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${isAgent ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                      isAgent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-muted text-foreground border border-border'
                    }`}
                  >
                    {isAgent ? <Sparkles className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`space-y-1 max-w-[82%] ${isAgent ? 'text-left' : 'text-right'}`}>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAgent
                          ? 'bg-muted/40 text-foreground border border-border/60 rounded-tl-sm'
                          : 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
                      <span>{msg.time}</span>
                      {msg.badge && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {msg.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Extracted Data & Action Panel (Right - 5 cols) */}
        <div className="lg:col-span-5 bg-muted/25 rounded-2xl border border-border/70 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Real-Time Extraction Payload
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {current.extractedData.latency}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground text-[11px] block">Detected Intent</span>
              <span className="font-semibold text-foreground text-sm">{current.extractedData.intent}</span>
            </div>

            <div>
              <span className="text-muted-foreground text-[11px] block">Caller Sentiment</span>
              <span className="font-medium text-emerald-400">{current.extractedData.sentiment}</span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border/40">
              <span className="text-muted-foreground text-[11px] font-semibold block uppercase tracking-wider">
                Extracted Parameters
              </span>
              <div className="bg-background/80 rounded-xl p-3 border border-border/60 space-y-1.5 font-mono text-[11px]">
                {Object.entries(current.extractedData.variables).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">{k}:</span>
                    <span className="text-indigo-300 font-semibold truncate">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border/40">
              <span className="text-muted-foreground text-[11px] font-semibold block uppercase tracking-wider mb-1">
                Automated System Dispatch
              </span>
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{current.extractedData.actionTriggered}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
