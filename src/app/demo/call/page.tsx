'use client';

import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Radio,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
  VolumeX
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_AGENTS } from '@/lib/services/mockData';

interface TranscriptItem {
  speaker: 'ai' | 'customer';
  text: string;
  time: string;
}

export default function LiveCallDemoPage() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agent') || 'agent-receptionist';
  const agent = MOCK_AGENTS.find((a) => a.id === agentId) || MOCK_AGENTS[0];

  const [callActive, setCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(14);
  const [activeSpeaker, setActiveSpeaker] = useState<'ai' | 'customer'>('ai');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [starRating, setStarRating] = useState(5);

  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      speaker: 'ai',
      text: agent.firstMessage,
      time: '00:02'
    },
    {
      speaker: 'customer',
      text: 'Hi, I would like to schedule an appointment for later this week.',
      time: '00:08'
    },
    {
      speaker: 'ai',
      text: 'Certainly! I have openings on Thursday at 2:30 PM or Friday at 10:00 AM. Which one works better for your schedule?',
      time: '00:13'
    }
  ]);

  // Timer simulation
  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  // Speaking indicator cycle
  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => {
      setActiveSpeaker((prev) => (prev === 'ai' ? 'customer' : 'ai'));
    }, 4000);
    return () => clearInterval(interval);
  }, [callActive]);

  const handleEndCall = () => {
    setCallActive(false);
    setShowFeedbackModal(true);
  };

  const handleRestart = () => {
    setCallActive(true);
    setElapsedSec(0);
    setShowFeedbackModal(false);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-8 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/demo"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Demo Agents
        </Link>
        <Badge variant="outline" className="text-xs border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
          Simulated Web Voice Engine
        </Badge>
      </div>

      {/* Main Call Theater Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Immersive Call Stage */}
        <div className="lg:col-span-8 rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-2xl shadow-black/30 relative flex flex-col justify-between min-h-[560px]">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-border/60">
            <div className="flex items-center gap-4">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-4 ring-indigo-500/20"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                    callActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground">{agent.name}</h2>
                  <Badge variant="outline" className="text-[11px] py-0 bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                    {agent.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1 font-medium text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    {callActive ? 'Live Voice Connection' : 'Call Completed'}
                  </span>
                  <span>•</span>
                  <span className="font-mono">{formatDuration(elapsedSec)}</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleRestart}
              className="text-muted-foreground hover:text-foreground"
              title="Restart Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Center Stage: Speaking Pulse & Waveform */}
          <div className="py-8 flex flex-col items-center justify-center text-center my-auto">
            <div className="mb-4">
              <Badge variant="secondary" className="text-xs px-3 py-1 font-semibold uppercase tracking-wider">
                {callActive
                  ? activeSpeaker === 'ai'
                    ? `${agent.name.split(' ')[0]} is speaking`
                    : 'Customer is speaking'
                  : 'Call Finished'}
              </Badge>
            </div>

            {/* Dynamic Waveform Bars */}
            <div className="flex items-center justify-center gap-1.5 h-20 w-full max-w-xs my-4">
              {[30, 65, 95, 45, 80, 100, 70, 90, 50, 85, 95, 40, 75, 90, 60, 85, 50].map((h, idx) => (
                <div
                  key={idx}
                  className={`w-2 rounded-full transition-all duration-300 ${
                    callActive
                      ? activeSpeaker === 'ai'
                        ? 'bg-gradient-to-t from-indigo-600 via-indigo-400 to-violet-300 animate-pulse'
                        : 'bg-gradient-to-t from-emerald-500 to-teal-300 animate-pulse'
                      : 'bg-muted-foreground/30 h-2'
                  }`}
                  style={{
                    height: callActive ? `${Math.max(12, h)}%` : '6px',
                    animationDelay: `${idx * 70}ms`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-2 max-w-sm">
              Ultra-low latency streaming voice engine with instant turn-taking and natural interruptions.
            </p>
          </div>

          {/* Bottom Floating Controls Bar */}
          <div className="pt-6 border-t border-border/60 flex items-center justify-center gap-4">
            <Button
              size="lg"
              variant={isMuted ? 'destructive' : 'secondary'}
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-full w-12 h-12 p-0 shadow-md"
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            <Button
              size="lg"
              variant={callActive ? 'destructive' : 'default'}
              onClick={callActive ? handleEndCall : handleRestart}
              className={`rounded-full px-8 h-12 flex items-center gap-2 font-bold text-sm shadow-xl ${
                callActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {callActive ? (
                <>
                  <PhoneOff className="w-5 h-5" />
                  End Call
                </>
              ) : (
                <>
                  <Phone className="w-5 h-5" />
                  Restart Call
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant={speakerMuted ? 'destructive' : 'secondary'}
              onClick={() => setSpeakerMuted(!speakerMuted)}
              className="rounded-full w-12 h-12 p-0 shadow-md"
              title={speakerMuted ? 'Unmute Speaker' : 'Mute Speaker'}
            >
              {speakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Right 4 Cols: Live Intelligence & Transcript Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Transcript Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl shadow-black/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Live Transcript
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-medium">STREAMING</span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs sm:text-sm">
              {transcripts.map((t, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {t.speaker === 'ai' ? agent.name : 'You (Customer)'}
                    </span>
                    <span>{t.time}</span>
                  </div>
                  <div
                    className={`p-3 rounded-xl leading-relaxed ${
                      t.speaker === 'ai'
                        ? 'bg-muted/60 text-foreground border border-border/40'
                        : 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/20'
                    }`}
                  >
                    {t.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outcome & Intent Analysis */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xl shadow-black/10 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Conversation Intelligence
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="text-muted-foreground">Detected Intent</div>
                <div className="font-semibold text-foreground mt-0.5">Appointment Scheduling (Routine Consultation)</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Outcome: Slot Offered (Thursday 2:30 PM)
                </div>
              </div>
            </div>

            <Button
              asChild
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 font-semibold text-xs h-10"
            >
              <Link href="/dashboard/agents/create">
                Build this Agent for Your Business →
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Post-Call Feedback & Conversion Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-black/50 text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground">How was your call?</h3>
              <p className="text-xs text-muted-foreground mt-1">
                You just spoke with an autonomous CallioAI voice agent running with zero human intervention.
              </p>
            </div>

            {/* 5-Star Rating Buttons */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setStarRating(star)}
                  className={`p-1 transition-transform hover:scale-110 ${
                    star <= starRating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                  }`}
                >
                  <Star className={`w-7 h-7 ${star <= starRating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>

            <div className="pt-2 space-y-2.5">
              <Button
                asChild
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 font-semibold text-sm shadow-lg shadow-indigo-600/30"
              >
                <Link href="/dashboard/agents/create">
                  Build Your Own Agent Now
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowFeedbackModal(false)}
                className="w-full text-xs text-muted-foreground"
              >
                Continue exploring demos
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
