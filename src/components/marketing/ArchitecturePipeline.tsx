'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  CpuIcon,
  Database01Icon,
  Mic01Icon,
  NetworkIcon,
  RadioIcon,
} from "@hugeicons/core-free-icons";;
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';

export function ArchitecturePipeline() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const PIPELINE_STEPS = [
    {
      id: 'telephony',
      title: 'Carrier Ingestion',
      metric: '35ms',
      metricLabel: 'Packet Ingestion',
      icon: NetworkIcon,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      description: 'Carrier-grade SIP trunking via Smartflo & Twilio with WebRTC fallback. Dual-jitter buffer and acoustic echo cancellation ensure pristine audio stream.',
      techStack: 'Smartflo • Twilio SIP • WebRTC Opus • FreeSWITCH'
    },
    {
      id: 'stt',
      title: 'Streaming STT',
      metric: '85ms',
      metricLabel: 'Transcription Latency',
      icon: Mic01Icon,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Continuous dual-channel speech recognition with custom vocabulary boosting for medical codes, acronyms, and regional dialects. Instant speech detection interrupts AI without stutter.',
      techStack: 'Deepgram Nova-2 • Whisper Streaming • VAD 2.0'
    },
    {
      id: 'reasoning',
      title: 'Cognitive Reasoning',
      metric: '130ms',
      metricLabel: 'First Token Latency',
      icon: CpuIcon,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
      description: 'Ultra-low latency LLM inference with strict business guardrails. Executes parallel tool calls to check calendar availability, fetch customer records, or verify product stock.',
      techStack: 'Groq Llama 3.3 / OpenAI GPT-4o Mini • Function Calling'
    },
    {
      id: 'tts',
      title: 'Neural Speech Generation',
      metric: '95ms',
      metricLabel: 'Audio Synthesis',
      icon: RadioIcon,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Human-grade acoustic synthesis streaming back over UDP chunks. Accents, pauses, filler words, and natural pitch inflection make callers feel truly understood.',
      techStack: 'Cartesia Sonic • ElevenLabs Flash • PlayHT'
    },
    {
      id: 'action',
      title: 'Autonomous Action',
      metric: '<100ms',
      metricLabel: 'Webhook Dispatch',
      icon: Database01Icon,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'Immediately updates CRM records, triggers SMS appointment confirmations, and can trigger warm transfer with spoken context briefing to your human team.',
      techStack: 'HubSpot • Cal.com • Twilio SMS • Custom Webhooks'
    }
  ];

  return (
    <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-10 shadow-2xl relative overflow-hidden marketing-glow-card">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <Badge variant="outline" className="mb-3 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1">
          <HugeiconsIcon icon={Activity01Icon} className="w-3.5 h-3.5 mr-1.5 inline" />
          Sub-350ms Voice Engine
        </Badge>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Engineered for conversational speed.
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Humans pause for 300-400ms during natural dialogue. CallioAI executes the entire speech-to-intelligence-to-voice cycle within 345ms, eliminating awkward AI silences.
        </p>
      </div>

      {/* Latency Comparison Benchmark Bar */}
      <div className="mb-10 p-5 rounded-2xl bg-muted/20 border border-border/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">End-to-End Latency Benchmark</span>
          <span className="text-xs text-muted-foreground font-mono">Turnaround time from user stop-speaking to AI reply</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* CallioAI */}
          <div className="space-y-1">
            <div className="flex justify-between font-medium">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                CallioAI Streaming Engine
              </span>
              <span className="font-mono font-bold text-emerald-400">345ms (Imperceptible)</span>
            </div>
            <div className="w-full h-3 bg-muted/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '12%' }} />
            </div>
          </div>

          {/* Average Competitor AI */}
          <div className="space-y-1">
            <div className="flex justify-between text-muted-foreground">
              <span>Standard AI Voice Bots (Non-streaming)</span>
              <span className="font-mono">1,450ms (Noticeable delay)</span>
            </div>
            <div className="w-full h-3 bg-muted/40 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500/70 rounded-full" style={{ width: '48%' }} />
            </div>
          </div>

          {/* Traditional IVR / Hold */}
          <div className="space-y-1">
            <div className="flex justify-between text-muted-foreground">
              <span>Legacy Phone Tree / Human Wait Time</span>
              <span className="font-mono">180,000ms+ (Customer churn)</span>
            </div>
            <div className="w-full h-3 bg-muted/40 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500/50 rounded-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Step Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PIPELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isSelected = activeStep === idx;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-indigo-500/80 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 scale-[1.02]'
                  : 'border-border/60 bg-muted/15 hover:bg-muted/30 hover:border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg border ${step.color}`}>
                  <HugeiconsIcon icon={Icon} className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-mono font-bold text-foreground/80 px-2 py-0.5 rounded bg-background/60 border border-border/40">
                  {step.metric}
                </span>
              </div>
              <div className="text-xs font-bold text-foreground mb-1">{step.title}</div>
              <div className="text-[10px] text-muted-foreground">{step.metricLabel}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Step Expanded Details */}
      <div className="mt-4 p-5 rounded-2xl border border-indigo-500/30 bg-muted/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1 max-w-xl">
          <div className="font-semibold text-foreground flex items-center gap-2">
            <span>Stage 0{activeStep + 1}: {PIPELINE_STEPS[activeStep].title}</span>
            <span className="text-indigo-400 font-mono">({PIPELINE_STEPS[activeStep].metric})</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {PIPELINE_STEPS[activeStep].description}
          </p>
        </div>
        <div className="sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block mb-1">
            Technologies Used
          </span>
          <span className="font-mono text-indigo-300 font-medium text-xs bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            {PIPELINE_STEPS[activeStep].techStack}
          </span>
        </div>
      </div>
    </div>
  );
}
