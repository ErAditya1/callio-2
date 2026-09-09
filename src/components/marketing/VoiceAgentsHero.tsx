'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  PhoneCall,
  Sparkles,
  Zap,
  ShieldCheck,
  Calendar,
  Headphones,
  Building2,
  Volume2,
  CheckCircle2,
  Play,
  Pause,
  Layers,
  Bot,
  Activity,
  Radio,
  Copy,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CallerIdPhoneCallModal } from './CallerIdPhoneCallModal';
import { PUBLIC_AGENTS, cloneAgentToWorkspace } from '@/config/publicAgents';
import { useAuth } from '@/lib/auth';

const HERO_PREVIEWS = [
  {
    id: 'sdr-sales',
    title: 'B2B Inbound & Outbound SDR',
    agentName: 'Aria Patel',
    role: 'Lead Qualification & Discovery',
    avatarLetter: 'A',
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/30',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    icon: Zap,
    callerUtterance: 'Hey, I filled out your demo request form. How does your pricing work?',
    agentResponse: 'Thanks for reaching out! Our pricing scales with your call volume, starting with 500 free minutes. Are you looking to handle inbound reception or outbound sales calls?',
    latency: '312ms',
    actionExecuted: 'Lead Qualified & Calendly Link Dispatched via SMS',
  },
  {
    id: 'receptionist-booking',
    title: 'Clinic & Salon Receptionist',
    agentName: 'Kabir Sharma',
    role: 'Front-Desk Appointment Booking',
    avatarLetter: 'K',
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/30',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    icon: Calendar,
    callerUtterance: 'Hi, do you have any appointments available this Thursday after 3 PM?',
    agentResponse: 'Let me check real-time availability for you. Yes! We have 3:30 PM and 4:45 PM available on Thursday. Which one works best for you?',
    latency: '298ms',
    actionExecuted: 'Google Calendar Event Created & Confirmation Text Sent',
  },
  {
    id: 'tier1-support',
    title: 'Tier-1 Customer Support',
    agentName: 'Alex Reed',
    role: 'Product FAQs & Order Tracking',
    avatarLetter: 'A',
    color: 'from-blue-500 to-indigo-500',
    borderColor: 'border-blue-500/30',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: Headphones,
    callerUtterance: 'Where is my order #84920? I need it delivered by tomorrow.',
    agentResponse: 'I located order #84920. It is out for delivery today with FedEx and scheduled to arrive by 6:00 PM. Would you like me to send live GPS tracking to this phone number?',
    latency: '325ms',
    actionExecuted: 'Shopify Order Status Checked & FedEx Tracking SMS Sent',
  },
  {
    id: 'realestate-inquiry',
    title: 'Real Estate Concierge',
    agentName: 'Marcus Vance',
    role: 'Property Valuation & Buyer Intake',
    avatarLetter: 'M',
    color: 'from-purple-500 to-pink-500',
    borderColor: 'border-purple-500/30',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: Building2,
    callerUtterance: 'I am looking for a 3-bedroom condo in downtown under 800k.',
    agentResponse: 'We have 4 active properties matching that exact criteria right now. One includes a private terrace and 2 parking stalls. Can I text you the virtual tour brochure right now?',
    latency: '330ms',
    actionExecuted: 'Buyer Preferences Logged in CRM & Brochure PDF Dispatched',
  },
];

export function VoiceAgentsHero() {
  const router = useRouter();
  const { user, isAuthenticated, getAccessToken } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState('sdr-sales');
  const [isSimulatingWave, setIsSimulatingWave] = useState(true);
  const [isCloning, setIsCloning] = useState(false);

  const currentPreview = HERO_PREVIEWS[activeTab];
  const IconComponent = currentPreview.icon;

  const handleOpenPhoneTest = (agentId?: string) => {
    setSelectedAgentId(agentId || currentPreview.id);
    setModalOpen(true);
  };

  const handleCloneAgent = async (agentId?: string) => {
    if (isCloning) return;
    const targetAgentId = agentId || currentPreview.id;
    const agent = PUBLIC_AGENTS.find((a) => a.id === targetAgentId) || PUBLIC_AGENTS[0];

    if (!user && !isAuthenticated) {
      toast.info('Please sign in to import this agent into your dashboard.');
      router.push('/workflow');
      return;
    }

    setIsCloning(true);
    try {
      const token = await getAccessToken();
      const result = await cloneAgentToWorkspace(
        agent,
        token,
        `${agent.name} (Custom Agent)`
      );
      toast.success(`"${agent.name}" successfully imported into your dashboard!`);
      router.push(`/workflow/${result.id}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to import agent into dashboard');
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <section className="relative pt-6 pb-16 lg:pt-10 lg:pb-20 overflow-hidden">
      {/* Background Decorative Mesh & Radial Lighting */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[300px] bg-violet-500/10 blur-[100px] rounded-full" />
        
        {/* Subtle geometric dot grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_15%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Text & Value Proposition */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-md text-xs font-medium text-foreground shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-indigo-400">Enterprise Voice Engine</span>
            <span className="opacity-30">•</span>
            <span className="text-muted-foreground">Sub-350ms Latency</span>
            <span className="opacity-30">•</span>
            <span className="text-emerald-500 font-mono">Zero Hold Times</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            Autonomous voice agents that{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              sound truly human.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-normal">
            Deploy hyper-realistic AI voice agents that answer on the first ring, handle natural interruptions, qualify leads, and execute complex workflows directly in your CRM and telephony stack.
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              asChild
              size="lg"
              className="h-12 px-7 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href="/workflow">
                Build Custom Agent
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => handleOpenPhoneTest()}
              className="h-12 px-7 rounded-xl border-border/80 bg-card/60 backdrop-blur-md text-foreground hover:bg-muted/80 font-medium text-sm transition-all hover:border-foreground/30 shadow-xs flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-500" />
              <span>Test Live Call on Your Phone</span>
            </Button>
          </div>

          {/* Quick micro guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No robotic monotone
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Natural barge-in (Interruptible)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant calendar & CRM sync
            </span>
          </div>
        </div>

        {/* Interactive Live Voice Engine Showcase Console */}
        <div className="max-w-4xl mx-auto">
          {/* Glass Console Outer Frame */}
          <div className="rounded-3xl border border-border/80 bg-card/80 dark:bg-[#0c1017]/80 backdrop-blur-xl shadow-2xl shadow-indigo-950/20 overflow-hidden">
            {/* Top Navigation Tabs for Roles */}
            <div className="px-4 py-3 border-b border-border/60 bg-muted/25 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1.5">
                {HERO_PREVIEWS.map((tab, idx) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(idx)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                        isActive
                          ? 'bg-foreground text-background shadow-xs font-semibold'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'opacity-60'}`} />
                      <span>{tab.agentName}</span>
                      <span className="text-[10px] opacity-60 hidden sm:inline">({tab.role.split(' ')[0]})</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground shrink-0 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-emerald-500 font-semibold">{currentPreview.latency}</span>
              </div>
            </div>

            {/* Main Interactive Stage */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Agent Profile & Live Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/50">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentPreview.color} text-white font-bold flex items-center justify-center text-base shadow-md`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">
                        {currentPreview.agentName}
                      </h3>
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${currentPreview.badgeColor}`}>
                        {currentPreview.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {currentPreview.title} • WebRTC & SIP Telephony Ready
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 self-start sm:self-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isCloning}
                    onClick={() => handleCloneAgent(currentPreview.id)}
                    className="h-9 px-3.5 rounded-xl border-border/80 hover:bg-muted/80 text-foreground font-medium text-xs flex items-center gap-1.5 transition-all hover:text-indigo-400 hover:border-indigo-500/40"
                    title="Import this agent into your workspace dashboard"
                  >
                    {isCloning ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        <span>Importing...</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Import to Dashboard</span>
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleOpenPhoneTest(currentPreview.id)}
                    className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call on Phone</span>
                  </Button>
                </div>
              </div>

              {/* Simulated Spoken Turn-Taking Dialog */}
              <div className="space-y-4">
                {/* Caller Utterance (Human) */}
                <div className="flex items-start gap-3 max-w-xl">
                  <div className="w-7 h-7 rounded-full bg-muted border border-border/80 flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0 mt-0.5">
                    User
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tl-sm bg-muted/40 border border-border/60 text-xs sm:text-sm text-foreground leading-relaxed shadow-xs">
                    &ldquo;{currentPreview.callerUtterance}&rdquo;
                  </div>
                </div>

                {/* Agent Response (AI with simulated latency) */}
                <div className="flex items-start gap-3 max-w-2xl ml-auto flex-row-reverse">
                  <div
                    className={`w-7 h-7 rounded-full bg-gradient-to-tr ${currentPreview.color} flex items-center justify-center text-xs font-semibold text-white shrink-0 mt-0.5 shadow-xs`}
                  >
                    AI
                  </div>
                  <div className="p-4 rounded-2xl rounded-tr-sm bg-indigo-500/10 border border-indigo-500/20 text-xs sm:text-sm text-foreground leading-relaxed shadow-xs space-y-2">
                    <p>&ldquo;{currentPreview.agentResponse}&rdquo;</p>
                    <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-mono pt-1">
                      <Zap className="w-3 h-3" />
                      <span>{currentPreview.actionExecuted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Waveform Visualizer Bar */}
              <div className="pt-2">
                <div className="p-3 rounded-2xl bg-muted/20 border border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsSimulatingWave(!isSimulatingWave)}
                      className="w-8 h-8 rounded-xl bg-foreground/10 hover:bg-foreground/15 text-foreground flex items-center justify-center transition-colors shrink-0"
                      title={isSimulatingWave ? 'Pause Waveform' : 'Play Waveform'}
                    >
                      {isSimulatingWave ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                      )}
                    </button>
                    <div className="flex items-center gap-1">
                      <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="text-xs font-medium text-foreground">
                        Voice Stream Spectrum
                      </span>
                    </div>
                  </div>

                  {/* Equalizer Waveform Bars */}
                  <div className="flex items-center justify-center gap-1 h-7 w-56">
                    {[25, 60, 95, 40, 85, 100, 70, 90, 45, 75, 95, 55, 30, 80, 65, 45].map(
                      (h, i) => (
                        <div
                          key={i}
                          className={`w-1 rounded-full transition-all duration-150 ${
                            isSimulatingWave
                              ? 'bg-gradient-to-t from-indigo-500 to-purple-400 animate-pulse'
                              : 'bg-muted-foreground/30 h-1.5'
                          }`}
                          style={{
                            height: isSimulatingWave
                              ? `${Math.max(15, h * (i % 2 === 0 ? 1 : 0.75))}%`
                              : '4px',
                            animationDelay: `${i * 45}ms`,
                            animationDuration: '0.7s',
                          }}
                        />
                      )
                    )}
                  </div>

                  {/* Telephony Specs */}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-emerald-500" />
                      <span>48kHz Opus</span>
                    </span>
                    <span>•</span>
                    <span className="text-emerald-500 font-semibold">{currentPreview.latency}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Measurable Proof Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
          <div className="p-5 rounded-2xl border border-border/70 bg-card/50 backdrop-blur-xs space-y-1.5 text-center sm:text-left">
            <div className="text-3xl sm:text-4xl font-black text-foreground font-mono tracking-tight">
              &lt;350ms
            </div>
            <div className="text-xs font-bold text-foreground">Turn-Taking Latency</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              3x faster than traditional conversational IVRs for natural back-and-forth.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/70 bg-card/50 backdrop-blur-xs space-y-1.5 text-center sm:text-left">
            <div className="text-3xl sm:text-4xl font-black text-foreground font-mono tracking-tight">
              94.8%
            </div>
            <div className="text-xs font-bold text-foreground">First-Call Resolution</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Autonomous handling with zero human intervention required.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/70 bg-card/50 backdrop-blur-xs space-y-1.5 text-center sm:text-left">
            <div className="text-3xl sm:text-4xl font-black text-foreground font-mono tracking-tight">
              24/7/365
            </div>
            <div className="text-xs font-bold text-foreground">Zero Hold Queue</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Scales infinitely to handle 1 or 10,000 concurrent phone calls simultaneously.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-border/70 bg-card/50 backdrop-blur-xs space-y-1.5 text-center sm:text-left">
            <div className="text-3xl sm:text-4xl font-black text-foreground font-mono tracking-tight">
              40+
            </div>
            <div className="text-xs font-bold text-foreground">Languages & Accents</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Native localization across American, British, Indian, European, and Asian accents.
            </p>
          </div>
        </div>

        {/* Telephony & Tech Stack Strip */}
        <div className="pt-2 text-center space-y-3">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
            Seamlessly Integrated with Enterprise Telephony & CRMs
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            <span className="hover:text-foreground transition-colors">Twilio Voice</span>
            <span>•</span>
            <span className="hover:text-foreground transition-colors">Vonage SIP</span>
            <span>•</span>
            <span className="hover:text-foreground transition-colors">Telnyx</span>
            <span>•</span>
            <span className="hover:text-foreground transition-colors">WebRTC</span>
            <span>•</span>
            <span className="hover:text-foreground transition-colors">Cal.com / Google Calendar</span>
            <span>•</span>
            <span className="hover:text-foreground transition-colors">HubSpot & Salesforce</span>
          </div>
        </div>
      </div>

      {/* Controlled Caller ID & Phone Test Modal */}
      <CallerIdPhoneCallModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialAgentId={selectedAgentId}
      />
    </section>
  );
}
