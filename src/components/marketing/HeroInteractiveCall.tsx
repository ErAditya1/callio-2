'use client';

import {
  Award,
  CheckCircle2,
  Clock,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Play,
  RotateCcw,
  Sparkles,
  Volume2
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Message {
  speaker: 'ai' | 'customer';
  text: string;
  delayMs: number;
}

const CONVERSATION_FLOW: Message[] = [
  { speaker: 'ai', text: 'Hi! Thank you for calling Acme Health. My name is Sarah. How can I assist you today?', delayMs: 1200 },
  { speaker: 'customer', text: 'Hi Sarah, I would like to book an appointment with Dr. Sharma for a routine checkup.', delayMs: 3800 },
  { speaker: 'ai', text: 'I can certainly take care of that. Dr. Sharma has openings this Thursday at 2:30 PM or Friday at 10:00 AM. Which works best for you?', delayMs: 6500 },
  { speaker: 'customer', text: 'Thursday at 2:30 PM would be perfect.', delayMs: 9500 },
  { speaker: 'ai', text: 'You are all set for Thursday at 2:30 PM. I have sent an instant calendar invite and confirmation SMS to your phone.', delayMs: 12000 }
];

export function HeroInteractiveCall() {
  const [callActive, setCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(34);
  const [currentStep, setCurrentStep] = useState(3);
  const [activeSpeaker, setActiveSpeaker] = useState<'ai' | 'customer' | null>('ai');

  // Timer simulation
  useEffect(() => {
    if (!callActive) return;
    const timer = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callActive]);

  // Speaking indicator cycle
  useEffect(() => {
    if (!callActive) {
      setActiveSpeaker(null);
      return;
    }
    const interval = setInterval(() => {
      setActiveSpeaker((prev) => (prev === 'ai' ? 'customer' : 'ai'));
    }, 4500);
    return () => clearInterval(interval);
  }, [callActive]);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRestart = () => {
    setCallActive(true);
    setElapsedSec(0);
    setCurrentStep(1);
    setActiveSpeaker('ai');
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Outer subtle glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-70 group-hover:opacity-100 transition-opacity" />

      {/* Main Container */}
      <div className="relative rounded-3xl border border-border/80 bg-card/90 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-border/60 bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                alt="Sarah"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${callActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground text-sm sm:text-base">Sarah</span>
                <Badge variant="outline" className="text-xs bg-indigo-500/10 text-indigo-400 border-indigo-500/20 py-0">
                  AI Receptionist
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {callActive ? 'Live Call' : 'Call Completed'}
                </span>
                <span>•</span>
                <span className="font-mono">{formatDuration(elapsedSec)}</span>
                <span>•</span>
                <span>English (US)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs py-1">
              <Award className="w-3 h-3" />
              98% Positive Sentiment
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRestart}
              className="text-muted-foreground hover:text-foreground h-8 w-8"
              title="Replay Simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Live Call Center Stage */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Waveform & Speaking Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/20 border border-border/40 text-center">
            <div className="mb-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {callActive ? (activeSpeaker === 'ai' ? 'Sarah is speaking...' : 'Customer speaking...') : 'Call Ended'}
              </span>
            </div>

            {/* Dynamic Waveform Simulation */}
            <div className="flex items-center justify-center gap-1.5 h-16 w-full max-w-[200px] my-2">
              {[40, 75, 95, 60, 85, 100, 70, 90, 45, 65, 80, 50].map((height, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    callActive
                      ? activeSpeaker === 'ai'
                        ? 'bg-gradient-to-t from-indigo-600 to-violet-400 animate-pulse'
                        : 'bg-gradient-to-t from-emerald-500 to-teal-300 animate-pulse'
                      : 'bg-muted-foreground/30 h-2'
                  }`}
                  style={{
                    height: callActive ? `${Math.max(8, (height * (i % 2 === 0 ? 1 : 0.75)))}%` : '6px',
                    animationDelay: `${i * 90}ms`,
                    animationDuration: '1.2s'
                  }}
                />
              ))}
            </div>

            {/* Live Audio Controls */}
            <div className="flex items-center gap-3 mt-5">
              <Button
                size="sm"
                variant={isMuted ? 'destructive' : 'secondary'}
                onClick={() => setIsMuted(!isMuted)}
                className="rounded-full w-9 h-9 p-0"
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant={callActive ? 'destructive' : 'default'}
                onClick={() => setCallActive(!callActive)}
                className={`rounded-full px-4 h-9 flex items-center gap-1.5 text-xs font-semibold ${
                  callActive ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {callActive ? (
                  <>
                    <PhoneOff className="w-3.5 h-3.5" />
                    End Call
                  </>
                ) : (
                  <>
                    <Phone className="w-3.5 h-3.5" />
                    Restart Call
                  </>
                )}
              </Button>
              <Button size="sm" variant="secondary" className="rounded-full w-9 h-9 p-0">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Real-time Streaming Transcript */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Live Conversation Transcript</span>
              <span className="text-[10px] text-indigo-400 font-mono">LATENCY ~350ms</span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {CONVERSATION_FLOW.slice(0, currentStep + 1).map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.speaker === 'ai' ? 'items-start' : 'items-end'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      msg.speaker === 'ai'
                        ? 'bg-muted/80 text-foreground border border-border/50 rounded-tl-sm'
                        : 'bg-indigo-600 text-white rounded-tr-sm'
                    }`}
                  >
                    <div className="text-[10px] font-semibold opacity-70 mb-0.5">
                      {msg.speaker === 'ai' ? 'Sarah (AI)' : 'Customer'}
                    </div>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Live Detected Intent & Outcome */}
            <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="font-medium">Outcome: Appointment Confirmed (Dr. Sharma)</span>
              </div>
              <Link
                href="/demo/call"
                className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 group"
              >
                Try Fullscreen Demo
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
