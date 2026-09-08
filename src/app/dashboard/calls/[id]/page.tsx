'use client';

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Pause,
  Phone,
  Play,
  RotateCcw,
  Sparkles,
  User,
  Volume2
} from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_CALLS } from '@/lib/services/mockData';

export default function CallDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const call = MOCK_CALLS.find((c) => c.id === id) || MOCK_CALLS[0];

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSec, setPlaybackSec] = useState(42);

  if (!call) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/calls"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Call Logs
        </Link>
        <Badge variant="outline" className="text-xs font-mono">
          Call ID: {call.id}
        </Badge>
      </div>

      {/* Main 3-Column Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (3 cols): Call Metadata */}
        <div className="lg:col-span-3 rounded-3xl border border-border/80 bg-card p-6 shadow-md space-y-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Caller Profile
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-base">
                {call.customerName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-foreground text-sm">{call.customerName}</div>
                <div className="text-xs text-muted-foreground font-mono mt-0.5">{call.customerPhone}</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50 space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground">Handled By:</span>
              <div className="font-semibold text-foreground mt-0.5">{call.agentName}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Call Date & Time:</span>
              <div className="font-semibold text-foreground mt-0.5">{call.startedAt}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Total Duration:</span>
              <div className="font-semibold text-foreground font-mono mt-0.5">
                {Math.floor(call.durationSec / 60)}m {call.durationSec % 60}s
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Direction:</span>
              <div className="font-semibold text-foreground capitalize mt-0.5">{call.direction}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Outcome:</span>
              <div className="mt-1">
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
                  {call.outcome}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Sentiment Score:</span>
              <div className="font-bold text-emerald-400 mt-1">★ {call.sentimentScore}% Positive</div>
            </div>
          </div>
        </div>

        {/* Center Column (6 cols): Full Transcript */}
        <div className="lg:col-span-6 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Full Conversational Transcript
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              {call.transcript.length} turns recorded
            </span>
          </div>

          <div className="space-y-4">
            {call.transcript.map((turn, i) => (
              <div
                key={i}
                className={`flex flex-col ${turn.speaker === 'ai' ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                  <span className="font-semibold text-foreground">
                    {turn.speaker === 'ai' ? call.agentName : call.customerName}
                  </span>
                  <span>{turn.timestamp}</span>
                </div>
                <div
                  className={`max-w-[90%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    turn.speaker === 'ai'
                      ? 'bg-muted/70 text-foreground border border-border/50 rounded-tl-sm'
                      : 'bg-indigo-600 text-white rounded-tr-sm'
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (3 cols): AI Summary & Extracted Data */}
        <div className="lg:col-span-3 space-y-6">
          {/* Executive Summary */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              AI Call Summary
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {call.summary}
            </p>
          </div>

          {/* Extracted Parameters */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Extracted Parameters
            </h4>
            <div className="space-y-2 text-xs">
              {Object.entries(call.extractedData).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-xl bg-muted/40 border border-border/40">
                  <div className="text-[10px] text-muted-foreground uppercase">{key}</div>
                  <div className="font-bold text-foreground mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Automated Actions Taken
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {call.actionItems.map((act, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Audio Player Bar */}
      <div className="rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-20">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button
            size="icon"
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className={`rounded-full w-12 h-12 p-0 shadow-lg ${
              isPlayingAudio ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500'
            } text-white`}
          >
            {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>
          <div>
            <div className="font-bold text-foreground text-xs sm:text-sm">Call Recording Audio Track</div>
            <div className="text-[11px] text-muted-foreground font-mono">
              00:42 / {Math.floor(call.durationSec / 60)}:{(call.durationSec % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Audio Waveform visualization */}
        <div className="flex-1 flex items-center gap-1 max-w-lg h-8 px-4 w-full">
          {[30, 60, 90, 45, 80, 100, 70, 95, 50, 85, 100, 40, 75, 90, 60, 80, 50, 70, 90, 40, 60, 80, 40].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full ${
                i < 12 ? 'bg-indigo-500' : 'bg-muted-foreground/30'
              } transition-all`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl text-xs">
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Download WAV
          </Button>
        </div>
      </div>
    </div>
  );
}
