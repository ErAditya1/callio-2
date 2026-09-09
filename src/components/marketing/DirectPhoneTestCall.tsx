'use client';

import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  Volume2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PUBLIC_AGENTS,
  PUBLIC_DIDS,
  PublicAgent,
  PublicDID,
} from '@/config/publicAgents';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
];

export function DirectPhoneTestCall() {
  const [agents, setAgents] = useState<PublicAgent[]>(PUBLIC_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<PublicAgent>(PUBLIC_AGENTS[0]);
  const [selectedDID, setSelectedDID] = useState<PublicDID>(
    PUBLIC_DIDS.find((d) => d.id === PUBLIC_AGENTS[0].did_id) || PUBLIC_DIDS[0]
  );
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [status, setStatus] = useState<'idle' | 'calling' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    fetch('/api/public-agents')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.agents) && data.agents.length > 0) {
          setAgents(data.agents);
          setSelectedAgent((prev) => data.agents.find((a: PublicAgent) => a.id === prev.id) || data.agents[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleAgentSelect = (agent: PublicAgent) => {
    setSelectedAgent(agent);
    const matchedDID = PUBLIC_DIDS.find((d) => d.id === agent.did_id);
    if (matchedDID) {
      setSelectedDID(matchedDID);
    }
  };

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
    setStatusMessage(`Routing call through ${selectedDID.formatted_number}...`);

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
      setStatusMessage(
        `Calling ${fullPhoneNumber}! Answer incoming call from ${selectedDID.formatted_number}.`
      );

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

  return (
    <div className="w-full my-8 max-w-4xl mx-auto">
      {/* Clean Minimalist Container */}
      <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Instant Phone Test</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Test an AI Agent on Your Phone Right Now
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Pick an agent below, enter your number, and receive a live call in ~5 seconds.
          </p>
        </div>

        {/* 1. Agent Selection: 4 Clean Minimal Cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-0.5">
            <span>Select Agent</span>
            <span className="font-mono text-[11px] text-emerald-500">Sub-350ms Latency</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {agents.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => handleAgentSelect(agent)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all duration-150 ${
                    isSelected
                      ? 'border-foreground bg-foreground/5 shadow-xs ring-1 ring-foreground/20'
                      : 'border-border/60 bg-muted/15 hover:bg-muted/30 hover:border-border'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-10 h-10 rounded-lg object-cover border border-border/70 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {agent.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">
                      {agent.category.split('&')[0].trim()}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Dialing Controls Form */}
        <form onSubmit={handleTriggerCall} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Caller ID (DID) */}
            <div className="sm:col-span-5 space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Caller ID (DID)
              </label>
              <div className="relative">
                <select
                  value={selectedDID.id}
                  onChange={(e) => {
                    const did = PUBLIC_DIDS.find((d) => d.id === Number(e.target.value));
                    if (did) setSelectedDID(did);
                  }}
                  className="w-full h-10 px-3 pr-8 rounded-xl bg-muted/20 border border-border/70 text-foreground text-xs font-mono appearance-none focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all"
                >
                  {PUBLIC_DIDS.map((did) => (
                    <option key={did.id} value={did.id}>
                      {did.country === 'India' ? '🇮🇳' : did.country === 'United States' ? '🇺🇸' : '🇬🇧'}{' '}
                      {did.formatted_number} ({did.label})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Destination Phone Number */}
            <div className="sm:col-span-7 space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Your Phone Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="h-10 px-2.5 rounded-xl bg-muted/20 border border-border/70 text-foreground text-xs font-medium appearance-none focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all"
                >
                  {COUNTRY_CODES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.flag} {item.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  placeholder="Enter phone number"
                  value={phoneDigits}
                  onChange={(e) => setPhoneDigits(e.target.value)}
                  disabled={status === 'calling'}
                  className="flex-1 h-10 px-3 rounded-xl bg-muted/20 border border-border/70 text-foreground text-xs font-mono placeholder:text-muted-foreground/60 focus:outline-hidden focus:ring-1 focus:ring-foreground transition-all"
                />
              </div>
            </div>
          </div>

          {/* Status Feedback */}
          {status !== 'idle' && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                status === 'calling'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : status === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {status === 'calling' && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
              {status === 'success' && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <span className="font-medium">{statusMessage}</span>
                {status === 'success' && countdown > 0 && (
                  <span className="text-[11px] opacity-80 ml-1.5 font-mono">
                    ({countdown}s remaining)
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80 order-2 sm:order-1">
              <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/60" />
              <span>One-time live test. Your number is never stored or shared.</span>
            </div>

            <Button
              type="submit"
              disabled={status === 'calling'}
              className="w-full sm:w-auto px-6 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-xs order-1 sm:order-2"
            >
              {status === 'calling' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Connecting Call...
                </>
              ) : (
                <>
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call My Phone Now
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
