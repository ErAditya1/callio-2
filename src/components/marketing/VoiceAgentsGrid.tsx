'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PhoneCall,
  Zap,
  Calendar,
  Headphones,
  Building2,
  ArrowRight,
  Sparkles,
  Volume2,
  Copy,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PUBLIC_AGENTS, PublicAgent, cloneAgentToWorkspace } from '@/config/publicAgents';
import { CallerIdPhoneCallModal } from './CallerIdPhoneCallModal';
import { useAuth } from '@/lib/auth';

const AGENT_ICONS: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  'sdr-sales': {
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  'receptionist-booking': {
    icon: Calendar,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  'tier1-support': {
    icon: Headphones,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
  },
  'realestate-inquiry': {
    icon: Building2,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
  },
};

export function VoiceAgentsGrid() {
  const router = useRouter();
  const { user, isAuthenticated, getAccessToken } = useAuth();
  const [agents, setAgents] = useState<PublicAgent[]>(PUBLIC_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCloningId, setIsCloningId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/public-agents')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.agents) && data.agents.length > 0) {
          setAgents(data.agents);
        }
      })
      .catch(() => {});
  }, []);

  const handleAgentClick = (agent: PublicAgent) => {
    setSelectedAgentId(agent.id);
    setModalOpen(true);
  };

  const handleCloneAgent = async (agent: PublicAgent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isCloningId) return;

    if (!user && !isAuthenticated) {
      toast.info('Please sign in to import this agent into your dashboard.');
      router.push('/workflow');
      return;
    }

    setIsCloningId(agent.id);
    try {
      const token = await getAccessToken();
      const result = await cloneAgentToWorkspace(
        agent,
        token,
        `${agent.name} (${agent.category.split(' ')[0]})`
      );
      toast.success(`"${agent.name}" successfully imported into your dashboard!`);
      router.push(`/workflow/${result.id}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to import agent into dashboard');
    } finally {
      setIsCloningId(null);
    }
  };

  return (
    <div className="w-full my-12 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Voice Agent Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Production-Ready AI Voice Agents
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Import any pre-trained agent directly into your dashboard or test a live call on your phone.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>{agents.length} Agents Online</span>
          <span>•</span>
          <span className="font-mono text-foreground font-medium">Sub-350ms Latency</span>
        </div>
      </div>

      {/* Agents Grid (No images — clean, professional card design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {agents.map((agent) => {
          const iconConfig = AGENT_ICONS[agent.id] || {
            icon: Sparkles,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10 border-indigo-500/20',
          };
          const Icon = iconConfig.icon;
          const isCloningThis = isCloningId === agent.id;

          return (
            <div
              key={agent.id}
              onClick={() => handleAgentClick(agent)}
              className="group rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-foreground/40 p-6 flex flex-col justify-between transition-all duration-200 cursor-pointer space-y-5 shadow-xs hover:shadow-lg hover:shadow-black/5 relative overflow-hidden"
            >
              {/* Card Top: Monogram/Icon + Title + Category */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Minimalist Icon Badge (NO images) */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 ${iconConfig.bg}`}
                    >
                      <Icon className={`w-5 h-5 ${iconConfig.color}`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-foreground text-base group-hover:text-indigo-400 transition-colors">
                          {agent.name}
                        </h3>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {agent.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Resolution & Latency Badge */}
                  <Badge
                    variant="outline"
                    className="text-[11px] font-mono border-border/70 bg-muted/30 text-muted-foreground shrink-0"
                  >
                    {agent.success_rate || '95%'} Res
                  </Badge>
                </div>

                {/* Role Description */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {agent.role}
                </p>

                {/* Skills Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {agent.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground border border-border/40 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* First Spoken Greeting Preview */}
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40 text-xs text-muted-foreground italic leading-relaxed">
                  &ldquo;{agent.greeting_preview}&rdquo;
                </div>
              </div>

              {/* Card Bottom: Voice details & CTAs (Import to Dashboard + Test Call) */}
              <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[170px]">
                    {agent.voice_accent}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Import / Clone to Dashboard Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isCloningThis}
                    onClick={(e) => handleCloneAgent(agent, e)}
                    className="h-8 px-3 text-xs font-medium rounded-xl border-border/80 hover:bg-muted/80 flex items-center gap-1.5 transition-all text-foreground hover:text-indigo-400 hover:border-indigo-500/40 shrink-0"
                    title="Clone and import this agent into your workspace dashboard"
                  >
                    {isCloningThis ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                        <span>Importing...</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-indigo-400" />
                        <span>Import to Dashboard</span>
                      </>
                    )}
                  </Button>

                  {/* Test Call Modal Trigger */}
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAgentClick(agent);
                    }}
                    className="h-8 px-3 text-xs font-medium rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Test Call</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Single Controlled Call Setup Modal */}
      <CallerIdPhoneCallModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initialAgentId={selectedAgentId}
      />
    </div>
  );
}
