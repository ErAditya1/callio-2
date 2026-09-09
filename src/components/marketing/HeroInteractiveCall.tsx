'use client';

import {
  AlertCircle,
  Clock,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Radio,
  RotateCcw,
  Sparkles,
  Volume2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CallStatus = 'idle' | 'connecting' | 'connected' | 'failed';

declare global {
  interface Window {
    DograhWidget?: {
      start: () => Promise<void> | void;
      end: () => Promise<void> | void;
      stop?: () => void;
      onStatusChange?: (callback: (status: CallStatus) => void) => void;
      onCallStart?: (callback: () => void) => void;
      onCallConnected?: (callback: () => void) => void;
      onCallDisconnected?: (callback: () => void) => void;
      onCallEnd?: (callback: () => void) => void;
      onError?: (callback: (err: unknown) => void) => void;
      setContext?: (ctx: Record<string, unknown>) => void;
      getState?: () => unknown;
    };
  }
}

const CONVERSATION_TOPICS = [
  '🗓️ "Book an appointment"',
  '💰 "What are your pricing tiers?"',
  '⚡ "How fast is your voice latency?"',
  '🏥 "Do you take new patients?"',
];

export function HeroInteractiveCall() {
  const [status, setStatus] = useState<CallStatus>('idle');
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Load Dograh Embed Script dynamically
  useEffect(() => {
    const SCRIPT_ID = 'dograh-widget';
    const WIDGET_URL =
      'https://calling.cheetahagi.com/embed/dograh-widget.js?token=emb_F5Us8WpPaOgt4hqKPBtInzDTbRj-okXSBvtFTyzc5-w&environment=production&apiEndpoint=https://calling.cheetahagi.com';

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = WIDGET_URL;
      script.async = true;
      script.setAttribute(
        'data-dograh-context',
        JSON.stringify({
          page_url: typeof window !== 'undefined' ? window.location.href : '',
          today: new Date().toISOString().slice(0, 10),
          source: 'hero_landing_page',
        })
      );
      document.body.appendChild(script);
    }

    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.DograhWidget) {
        setIsScriptReady(true);

        if (window.DograhWidget.onStatusChange) {
          window.DograhWidget.onStatusChange((newStatus: CallStatus) => {
            setStatus(newStatus);
            if (newStatus === 'failed') {
              setErrorMessage('Microphone access denied or connection lost.');
            } else if (newStatus === 'idle') {
              setErrorMessage(null);
            }
          });
        }

        if (window.DograhWidget.onCallStart) {
          window.DograhWidget.onCallStart(() => setStatus('connecting'));
        }

        if (window.DograhWidget.onCallConnected) {
          window.DograhWidget.onCallConnected(() => setStatus('connected'));
        }

        if (window.DograhWidget.onCallEnd) {
          window.DograhWidget.onCallEnd(() => setStatus('idle'));
        }

        if (window.DograhWidget.onError) {
          window.DograhWidget.onError(() => {
            setStatus('failed');
            setErrorMessage('Unable to connect to audio service. Please retry.');
          });
        }

        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // 2. Timer when connected
  useEffect(() => {
    if (status === 'connected') {
      setCallDuration(0);
      durationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    }
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [status]);

  const isLive = status === 'connected' || status === 'connecting';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleCall = async () => {
    setErrorMessage(null);

    if (isLive) {
      if (window.DograhWidget?.end) {
        try {
          await window.DograhWidget.end();
        } catch (e) {
          console.error('Error ending call', e);
        }
      }
      setStatus('idle');
    } else {
      setStatus('connecting');
      if (window.DograhWidget?.start) {
        try {
          await window.DograhWidget.start();
        } catch (err) {
          console.error('Error starting call', err);
          setStatus('failed');
          setErrorMessage('Could not open microphone stream.');
        }
      } else {
        setTimeout(() => {
          if (window.DograhWidget?.start) {
            window.DograhWidget.start();
          } else {
            setStatus('failed');
            setErrorMessage('Voice engine is initializing. Please try again.');
          }
        }, 1200);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Minimal Card Container */}
      <div className="relative rounded-2xl border border-border/70 bg-card/70 dark:bg-[#0d1017]/70 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden transition-all duration-300">
        {/* Subtle Ambient Radial Highlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-500/5 blur-2xl pointer-events-none" />

        {/* Minimal Card Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-xs font-semibold text-indigo-500 dark:text-indigo-400">
                A
              </div>
              <span
                className={cn(
                  'absolute bottom-0 right-0 w-2 h-2 rounded-full border border-background',
                  status === 'connected'
                    ? 'bg-emerald-500 animate-ping'
                    : status === 'connecting'
                    ? 'bg-amber-400 animate-pulse'
                    : status === 'failed'
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                )}
              />
              <span
                className={cn(
                  'absolute bottom-0 right-0 w-2 h-2 rounded-full border border-background',
                  status === 'connected'
                    ? 'bg-emerald-500'
                    : status === 'connecting'
                    ? 'bg-amber-400'
                    : status === 'failed'
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                )}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground tracking-tight">Arushi</span>
                <span className="text-[11px] text-muted-foreground font-normal">• AI Voice Agent</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status === 'connected' ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {formatTime(callDuration)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className={cn(
                    'h-7 w-7 rounded-md',
                    isMuted ? 'text-rose-400 bg-rose-500/10' : 'text-muted-foreground hover:text-foreground'
                  )}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </Button>
              </div>
            ) : (
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Demo
              </span>
            )}
          </div>
        </div>

        {/* Minimal Central Stage */}
        <div className="px-6 py-8 sm:py-10 flex flex-col items-center justify-center text-center">
          {/* Subtle Ambient Waveform Orb */}
          <div className="relative my-3 flex items-center justify-center">
            {/* Soft Ambient Rings */}
            <div
              className={cn(
                'absolute w-24 h-24 rounded-full transition-all duration-700 pointer-events-none',
                status === 'connected'
                  ? 'scale-125 bg-emerald-500/15 animate-ping'
                  : status === 'connecting'
                  ? 'scale-110 bg-indigo-500/10 animate-pulse'
                  : 'scale-90 opacity-0'
              )}
            />

            {/* Clean Center Core */}
            <div
              className={cn(
                'relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg',
                status === 'connected'
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20 text-white'
                  : status === 'connecting'
                  ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-indigo-500/20 text-white animate-pulse'
                  : status === 'failed'
                  ? 'bg-rose-600 shadow-rose-500/20 text-white'
                  : 'bg-indigo-600 dark:bg-indigo-500 shadow-indigo-500/20 text-white hover:scale-105'
              )}
            >
              {status === 'connecting' ? (
                <Radio className="w-6 h-6 animate-spin" />
              ) : status === 'connected' ? (
                <Volume2 className="w-6 h-6 animate-pulse" />
              ) : status === 'failed' ? (
                <RotateCcw className="w-6 h-6" />
              ) : (
                <Phone className="w-6 h-6" />
              )}
            </div>
          </div>

          {/* Audio Wave Spectrum (Clean Minimal Bars) */}
          <div className="flex items-center justify-center gap-1 h-8 w-44 my-4">
            {[30, 60, 90, 45, 80, 100, 70, 85, 40, 65, 80, 50].map((h, i) => (
              <div
                key={i}
                className={cn(
                  'w-1 rounded-full transition-all duration-150',
                  status === 'connected'
                    ? 'bg-emerald-500/80 animate-pulse'
                    : status === 'connecting'
                    ? 'bg-indigo-400/60 animate-pulse'
                    : 'bg-muted-foreground/20 h-1.5'
                )}
                style={{
                  height:
                    status === 'connected'
                      ? `${Math.max(15, h * (i % 2 === 0 ? 1 : 0.8))}%`
                      : status === 'connecting'
                      ? `${Math.max(12, h * 0.4)}%`
                      : '4px',
                  animationDelay: `${i * 60}ms`,
                  animationDuration: '0.8s',
                }}
              />
            ))}
          </div>

          {/* Clear, Minimal Description */}
          <div className="max-w-md">
            {status === 'idle' && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                Speak directly with Arushi in your browser. Zero setup or login needed.
              </p>
            )}

            {status === 'connecting' && (
              <p className="text-xs sm:text-sm text-indigo-400 font-medium flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Connecting voice stream...
              </p>
            )}

            {status === 'connected' && (
              <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                Arushi is listening. Speak freely (you can interrupt anytime).
              </p>
            )}

            {status === 'failed' && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5">
                {errorMessage || 'Connection failed. Check microphone permissions.'}
              </div>
            )}
          </div>

          {/* Single Focused Action Button */}
          <div className="mt-6 w-full max-w-xs">
            <Button
              size="lg"
              onClick={handleToggleCall}
              disabled={status === 'connecting' && !isScriptReady}
              className={cn(
                'w-full rounded-xl h-11 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2',
                status === 'connected'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                  : status === 'connecting'
                  ? 'bg-indigo-600/80 text-white cursor-wait'
                  : status === 'failed'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
              )}
            >
              {status === 'connected' ? (
                <>
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call ({formatTime(callDuration)})</span>
                </>
              ) : status === 'connecting' ? (
                <>
                  <Radio className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : status === 'failed' ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Talk with Arushi</span>
                </>
              )}
            </Button>
          </div>

          {/* Conversation Starter Chips (Muted, Clean) */}
          {status === 'idle' && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 max-w-lg">
              {CONVERSATION_TOPICS.map((topic, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-muted/40 border border-border/50 text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Minimal Bottom Info Row */}
        <div className="px-5 py-2.5 border-t border-border/40 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>WebRTC In-Browser Call</span>
          <span>~350ms Real-time Latency</span>
        </div>
      </div>
    </div>
  );
}
