'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PhoneCall,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Copy,
  Sparkles,
  Zap,
  Calendar,
  Headphones,
  Building2,
  Volume2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  PUBLIC_AGENTS,
  PUBLIC_DIDS,
  PublicAgent,
  PublicDID,
  cloneAgentToWorkspace,
} from '@/config/publicAgents';
import { useAuth } from '@/lib/auth';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
];

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

interface CallerIdPhoneCallModalProps {
  initialAgentId?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CallerIdPhoneCallModal({
  initialAgentId,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: CallerIdPhoneCallModalProps) {
  const router = useRouter();
  const { user, isAuthenticated, getAccessToken } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const initialAgent =
    PUBLIC_AGENTS.find((a) => a.id === initialAgentId) || PUBLIC_AGENTS[0];

  const [selectedAgent, setSelectedAgent] = useState<PublicAgent>(initialAgent);
  const [selectedDID, setSelectedDID] = useState<PublicDID>(
    PUBLIC_DIDS.find((d) => d.id === initialAgent.did_id) || PUBLIC_DIDS[0]
  );
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [status, setStatus] = useState<'idle' | 'calling' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isCloning, setIsCloning] = useState(false);

  // Sync selected agent when initialAgentId changes
  useEffect(() => {
    if (!initialAgentId) return;

    const found = PUBLIC_AGENTS.find((a) => a.id === initialAgentId);
    if (found) {
      setSelectedAgent(found);
      const matchedDID = PUBLIC_DIDS.find((d) => d.id === found.did_id);
      if (matchedDID) setSelectedDID(matchedDID);
    } else {
      fetch('/api/public-agents')
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.agents)) {
            const dynamicFound = data.agents.find((a: PublicAgent) => a.id === initialAgentId);
            if (dynamicFound) {
              setSelectedAgent(dynamicFound);
              const matchedDID = PUBLIC_DIDS.find((d) => d.id === dynamicFound.did_id);
              if (matchedDID) setSelectedDID(matchedDID);
            }
          }
        })
        .catch(() => {});
    }
  }, [initialAgentId]);

  const handleTriggerCall = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = phoneDigits.replace(/\D/g, '');
    if (cleanDigits.length < 7) {
      setStatus('error');
      setStatusMessage('Please enter a valid phone number (minimum 7 digits)');
      return;
    }

    const effectiveDialCode = countryCode.startsWith('+1') ? '+1' : countryCode;
    const fullPhoneNumber = `${effectiveDialCode}${cleanDigits}`;

    setStatus('calling');
    setStatusMessage(`Calling ${fullPhoneNumber}...`);

    try {
      const res = await fetch('/api/demo-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: fullPhoneNumber,
          agent_id: selectedAgent.id,
          did_id: selectedDID.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setStatusMessage(data.error || 'Failed to dispatch call. Please retry shortly.');
        return;
      }

      setStatus('success');
      setStatusMessage(`Calling your phone now from ${selectedDID.formatted_number}!`);

      setCountdown(45);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      setStatus('error');
      setStatusMessage('Network connection error. Please try again.');
    }
  };

  const handleCloneAgent = async () => {
    if (isCloning) return;

    if (!user && !isAuthenticated) {
      toast.info('Please sign in to import this agent into your dashboard.');
      router.push('/workflow');
      return;
    }

    setIsCloning(true);
    try {
      const token = await getAccessToken();
      const result = await cloneAgentToWorkspace(
        selectedAgent,
        token,
        `${selectedAgent.name} (Custom Agent)`
      );
      toast.success(`"${selectedAgent.name}" imported to your dashboard!`);
      setIsOpen(false);
      router.push(`/workflow/${result.id}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to import agent');
    } finally {
      setIsCloning(false);
    }
  };

  const iconConfig = AGENT_ICONS[selectedAgent.id] || {
    icon: Sparkles,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
  };
  const Icon = iconConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="max-w-md w-[calc(100vw-1.5rem)] sm:w-full p-4 sm:p-6 bg-card border-border/80 rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader className="space-y-1 text-left pb-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Outbound Voice Dispatch</span>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground truncate">
            Call with {selectedAgent.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Receive a live voice call on your phone or import this agent to your dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1 w-full overflow-hidden">
          {/* Selected Agent Card (100% Responsive, no horizontal spill) */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-muted/20 space-y-3 w-full overflow-hidden">
            {/* Top Row: Avatar + Name/Role + Latency */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shrink-0 ${iconConfig.bg}`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconConfig.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-foreground text-sm truncate">
                    {selectedAgent.name}
                  </div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground truncate">
                    {selectedAgent.role}
                  </div>
                </div>
              </div>

              <Badge
                variant="outline"
                className="text-[10px] font-mono border-border/70 bg-background/60 text-emerald-500 shrink-0"
              >
                {selectedAgent.latency}
              </Badge>
            </div>

            {/* Spoken sentence preview */}
            <div className="p-2.5 rounded-lg bg-background/60 border border-border/50 text-[11px] text-muted-foreground italic leading-relaxed break-words">
              &ldquo;{selectedAgent.greeting_preview}&rdquo;
            </div>

            {/* Bottom Row: Voice Details & Import to Dashboard Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 border-t border-border/40">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate max-w-[170px]">
                <Volume2 className="w-3 h-3 text-indigo-400 shrink-0" />
                <span className="truncate">{selectedAgent.voice_accent}</span>
              </div>

              {/* 1-Click Import to Dashboard Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isCloning}
                onClick={handleCloneAgent}
                className="h-7 px-2.5 text-[11px] font-medium border-border/70 text-foreground hover:bg-muted/70 flex items-center gap-1.5 shrink-0 hover:text-indigo-400 hover:border-indigo-500/40"
                title="Import this agent into your dashboard"
              >
                {isCloning ? (
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
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleTriggerCall} className="space-y-3.5 w-full">
            {/* Caller ID (DID) Picker */}
            <div className="space-y-1.5 w-full">
              <label className="text-xs font-medium text-foreground">
                Caller ID (DID)
              </label>
              <div className="relative w-full">
                <select
                  value={selectedDID.id}
                  onChange={(e) => {
                    const did = PUBLIC_DIDS.find((d) => d.id === Number(e.target.value));
                    if (did) setSelectedDID(did);
                  }}
                  className="w-full h-10 px-3 pr-8 rounded-xl bg-muted/20 border border-border/70 text-foreground text-xs font-mono appearance-none focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all truncate"
                >
                  {PUBLIC_DIDS.map((did) => (
                    <option key={did.id} value={did.id}>
                      {did.country === 'India' ? '🇮🇳' : did.country === 'United States' ? '🇺🇸' : '🇬🇧'}{' '}
                      {did.formatted_number} — {did.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Destination Phone Input */}
            <div className="space-y-1.5 w-full">
              <label className="text-xs font-medium text-foreground">
                Your Phone Number
              </label>
              <div className="flex gap-2 w-full">
                <div className="relative shrink-0 w-[95px] sm:w-[110px]">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-full h-10 px-2.5 pr-6 rounded-xl bg-muted/20 border border-border/70 text-foreground text-xs font-medium appearance-none focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all truncate"
                  >
                    {COUNTRY_CODES.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-muted-foreground absolute right-2 top-3.5 pointer-events-none" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit number"
                  value={phoneDigits}
                  onChange={(e) => setPhoneDigits(e.target.value)}
                  disabled={status === 'calling'}
                  className="min-w-0 flex-1 h-10 px-3 rounded-xl bg-muted/20 border border-border/70 text-foreground text-xs font-mono placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all"
                />
              </div>
            </div>

            {/* Status Feedback */}
            {status !== 'idle' && (
              <div
                className={`p-2.5 sm:p-3 rounded-xl text-xs flex items-center gap-2 w-full overflow-hidden break-words ${
                  status === 'calling'
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : status === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {status === 'calling' && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
                {status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />}
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{statusMessage}</span>
                  {status === 'success' && countdown > 0 && (
                    <span className="text-[11px] opacity-80 ml-1 font-mono">
                      ({countdown}s)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Call Action Button */}
            <Button
              type="submit"
              disabled={status === 'calling'}
              className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-xs shrink-0"
            >
              {status === 'calling' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Dispatching Call...
                </>
              ) : (
                <>
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call My Phone Now
                </>
              )}
            </Button>

            {/* Privacy Guarantee */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80 pt-0.5">
              <ShieldCheck className="w-3 h-3 text-muted-foreground/60 shrink-0" />
              <span className="text-center">One-time live demo. We never spam or share your number.</span>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
