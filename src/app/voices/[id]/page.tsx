'use client';

import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  Mic,
  Pause,
  Play,
  Radio,
  Sparkles,
  Volume2
} from 'lucide-react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_VOICES } from '@/lib/services/mockData';

export default function VoiceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const voice = MOCK_VOICES.find((v) => v.id === id) || MOCK_VOICES[0];
  const [playingScenarioIdx, setPlayingScenarioIdx] = useState<number | null>(null);

  if (!voice) {
    notFound();
  }

  const toggleScenarioPlay = (idx: number) => {
    setPlayingScenarioIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="py-12 lg:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/voices"
          className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Voice Marketplace
        </Link>
      </div>

      {/* Voice Hero Card */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-2xl shadow-black/20 relative overflow-hidden mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-border/60">
          <div className="flex items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={voice.avatar}
              alt={voice.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">{voice.name}</h1>
                <Badge variant="outline" className="text-xs py-0.5">
                  {voice.gender}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {voice.language} • {voice.accent}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {voice.style.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs bg-muted/60">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Button
              size="lg"
              asChild
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/25 font-semibold text-sm"
            >
              <Link href={`/dashboard/agents/create?voice=${voice.id}`}>
                Use this Voice
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-xl border-border/80 font-medium text-sm"
            >
              <Link href={`/demo/call?voice=${voice.id}`}>
                <Radio className="w-4 h-4 mr-1.5 text-rose-500 animate-pulse" />
                Live Conversation
              </Link>
            </Button>
          </div>
        </div>

        {/* Characteristics Details */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
            <div className="text-xs text-muted-foreground">Primary Accent</div>
            <div className="text-sm font-bold text-foreground mt-1">{voice.accent}</div>
          </div>
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
            <div className="text-xs text-muted-foreground">Best Application</div>
            <div className="text-sm font-bold text-foreground mt-1">{voice.useCase}</div>
          </div>
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
            <div className="text-xs text-muted-foreground">Tone Delivery</div>
            <div className="text-sm font-bold text-foreground mt-1">{voice.style.join(', ')}</div>
          </div>
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/40">
            <div className="text-xs text-muted-foreground">Engine Latency</div>
            <div className="text-sm font-bold text-emerald-400 mt-1">~350ms (Ultra-Low)</div>
          </div>
        </div>
      </div>

      {/* Multi-Scenario Audio Player Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Listen to {voice.name} in Real Business Scenarios
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Test how natural intonation and context switching sound across different call flows.
          </p>
        </div>

        <div className="space-y-4">
          {voice.scenarios.map((scenario, idx) => {
            const isPlaying = playingScenarioIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                  isPlaying
                    ? 'border-indigo-500/60 bg-card shadow-lg shadow-indigo-500/10'
                    : 'border-border/70 bg-card/60'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <Badge variant="outline" className="text-[11px] mb-1.5 font-semibold text-indigo-400 bg-indigo-500/10 border-indigo-500/20">
                      Scenario {idx + 1}
                    </Badge>
                    <h3 className="font-bold text-foreground text-base">{scenario.label}</h3>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => toggleScenarioPlay(idx)}
                    className={`rounded-full px-4 h-9 flex items-center gap-1.5 text-xs font-semibold ${
                      isPlaying
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        Pause Sample
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 ml-0.5" />
                        Listen to Sample
                      </>
                    )}
                  </Button>
                </div>

                {/* Spoken Script Box */}
                <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-sm text-muted-foreground leading-relaxed italic">
                  "{scenario.script}"
                </div>

                {/* Animated Waveform when playing */}
                {isPlaying && (
                  <div className="flex items-center gap-1 mt-4 h-6 px-1">
                    {[30, 65, 100, 45, 80, 95, 55, 75, 40, 85, 90, 35, 70, 95, 50, 80, 60, 40].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full bg-gradient-to-t from-indigo-600 to-violet-400 animate-pulse"
                        style={{
                          height: `${Math.max(20, h)}%`,
                          animationDelay: `${i * 50}ms`,
                          animationDuration: '0.8s'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
