'use client';

import {
  ArrowRight,
  Check,
  Filter,
  Headphones,
  Pause,
  Play,
  Search,
  SlidersHorizontal,
  Sparkles,
  Volume2
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MOCK_VOICES } from '@/lib/services/mockData';
import { Voice } from '@/lib/services/types';

export default function VoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const filteredVoices = useMemo(() => {
    return MOCK_VOICES.filter((voice) => {
      const matchesSearch =
        voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voice.accent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voice.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voice.style.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesGender = selectedGender === 'all' || voice.gender === selectedGender;
      const matchesLang =
        selectedLanguage === 'all' || voice.language.toLowerCase().includes(selectedLanguage.toLowerCase());

      return matchesSearch && matchesGender && matchesLang;
    });
  }, [searchQuery, selectedGender, selectedLanguage]);

  const togglePlay = (id: string) => {
    setPlayingVoiceId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="outline" className="mb-3 border-purple-500/30 text-purple-400 bg-purple-500/10 px-3 py-1">
          <Headphones className="w-3.5 h-3.5 mr-1.5 inline" />
          Ultra-Realistic AI Voices
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Find the right voice for your business.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Explore studio-quality conversational voices with natural breathing, cadence, and empathy.
          Preview audio samples or launch an interactive test call.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-10 p-4 rounded-2xl bg-card border border-border/70 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, accent, style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-muted/30"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Gender */}
          <div className="flex items-center rounded-xl bg-muted/40 p-1 border border-border/50 text-xs">
            {['all', 'Female', 'Male'].map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGender(g)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  selectedGender === g
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Language filter */}
          <div className="flex items-center rounded-xl bg-muted/40 p-1 border border-border/50 text-xs">
            {[
              { label: 'All Accents', val: 'all' },
              { label: 'US English', val: 'US' },
              { label: 'UK English', val: 'UK' },
              { label: 'Bilingual / Hindi', val: 'Hindi' }
            ].map((lang) => (
              <button
                key={lang.val}
                onClick={() => setSelectedLanguage(lang.val)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedLanguage === lang.val
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVoices.map((voice) => {
          const isPlaying = playingVoiceId === voice.id;
          return (
            <div
              key={voice.id}
              className={`rounded-2xl border p-6 transition-all duration-300 relative flex flex-col justify-between ${
                isPlaying
                  ? 'border-indigo-500/60 bg-card shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'border-border/70 bg-card/60 hover:bg-card hover:border-border shadow-sm'
              }`}
            >
              <div>
                {/* Avatar & Title Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={voice.avatar}
                      alt={voice.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-lg">{voice.name}</span>
                        <Badge variant="outline" className="text-[10px] py-0">
                          {voice.gender}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-0.5">{voice.accent}</div>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    onClick={() => togglePlay(voice.id)}
                    className={`rounded-full w-11 h-11 p-0 shadow-md transition-all active:scale-95 ${
                      isPlaying
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </Button>
                </div>

                {/* Animated Waveform Display */}
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between gap-1 mb-4 h-12">
                  {[25, 60, 95, 50, 80, 100, 65, 90, 45, 75, 100, 35, 65, 90, 55].map((h, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlaying
                          ? 'bg-gradient-to-t from-indigo-600 to-violet-400 animate-pulse'
                          : 'bg-muted-foreground/30 h-1.5'
                      }`}
                      style={{
                        height: isPlaying ? `${Math.max(18, h)}%` : '4px',
                        animationDelay: `${idx * 60}ms`,
                        animationDuration: '0.9s'
                      }}
                    />
                  ))}
                </div>

                {/* Characteristics Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {voice.style.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-[11px] font-normal bg-muted/60 text-muted-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground mb-4">
                  <span className="font-medium text-foreground">Best for:</span> {voice.useCase}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                <Link
                  href={`/voices/${voice.id}`}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  Listen to Scenarios
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Button
                  size="sm"
                  asChild
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl h-8 px-3"
                >
                  <Link href={`/dashboard/agents/create?voice=${voice.id}`}>
                    Use this Voice
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
