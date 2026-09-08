'use client';

import {
  ArrowRight,
  Headphones,
  Pause,
  Play,
  Sparkles,
  Volume2
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_VOICES } from '@/lib/services/mockData';
import { Voice } from '@/lib/services/types';

export function VoiceShowcase() {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const toggleVoicePlay = (id: string) => {
    setPlayingVoiceId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <Badge variant="outline" className="mb-3 border-purple-500/30 text-purple-400 bg-purple-500/10 px-3 py-1">
              <Headphones className="w-3.5 h-3.5 mr-1.5 inline" />
              Studio-Grade Voices
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Find the right voice for your business.
            </h2>
            <p className="mt-3 text-base text-muted-foreground max-w-xl">
              Natural intonation, ultra-low latency, and perfect accents in over 40 languages. Listen to real voice samples below.
            </p>
          </div>

          <Button asChild variant="outline" className="rounded-xl border-border/80 hover:bg-muted font-medium">
            <Link href="/voices">
              Explore All 50+ Voices
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Voice Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_VOICES.slice(0, 6).map((voice) => {
            const isPlaying = playingVoiceId === voice.id;
            return (
              <div
                key={voice.id}
                className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 relative group overflow-hidden ${
                  isPlaying
                    ? 'border-indigo-500/60 bg-card shadow-xl shadow-indigo-500/10'
                    : 'border-border/60 bg-card/60 hover:bg-card hover:border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={voice.avatar}
                      alt={voice.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-base">{voice.name}</span>
                        <span className="text-xs text-muted-foreground">• {voice.gender}</span>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">{voice.accent}</div>
                    </div>
                  </div>

                  {/* Play / Pause Toggle Button */}
                  <Button
                    size="icon"
                    onClick={() => toggleVoicePlay(voice.id)}
                    className={`rounded-full w-10 h-10 p-0 shadow-md transition-transform active:scale-95 ${
                      isPlaying
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </Button>
                </div>

                {/* Animated Audio Waveform */}
                <div className="p-3 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between gap-1 mb-4 h-11">
                  {[20, 55, 90, 45, 75, 100, 60, 85, 40, 70, 95, 30, 60, 85, 50].map((h, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlaying
                          ? 'bg-gradient-to-t from-indigo-600 to-violet-400 animate-pulse'
                          : 'bg-muted-foreground/30 h-1.5'
                      }`}
                      style={{
                        height: isPlaying ? `${Math.max(15, h)}%` : '4px',
                        animationDelay: `${idx * 60}ms`,
                        animationDuration: '0.9s'
                      }}
                    />
                  ))}
                </div>

                {/* Style Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {voice.style.map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-[11px] font-normal bg-muted/60 text-muted-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium truncate max-w-[170px]">
                    {voice.useCase}
                  </span>
                  <Link
                    href={`/voices/${voice.id}`}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1 group/link"
                  >
                    Details
                    <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
