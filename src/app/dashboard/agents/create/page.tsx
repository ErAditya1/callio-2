'use client';

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  Globe,
  Headphones,
  Home,
  Layers,
  Megaphone,
  Mic,
  Pause,
  Phone,
  Play,
  Radio,
  RotateCcw,
  Sparkles,
  Stethoscope,
  Volume2,
  Wand2,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createAgent } from '@/lib/services';
import { MOCK_VOICES } from '@/lib/services/mockData';

export default function CreateAgentWizardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'receptionist';
  const initialVoice = searchParams.get('voice') || 'voice-sarah';

  // Step state (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [agentName, setAgentName] = useState('Acme Front Desk Receptionist');
  const [agentGoal, setAgentGoal] = useState(
    'Answer all inbound patient calls warmly. Provide clinic hours, location directions, accept insurance questions, and book consultation slots.'
  );
  const [firstMessage, setFirstMessage] = useState(
    'Hello! Thank you for calling Acme Health. My name is Sarah. How can I help you today?'
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState(initialVoice);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['phone', 'web']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test call state in Step 5
  const [isTestCalling, setIsTestCalling] = useState(false);
  const [testTranscript, setTestTranscript] = useState<{ speaker: 'ai' | 'user'; text: string }[]>([]);

  const categories = [
    {
      id: 'receptionist',
      title: 'Virtual Receptionist',
      desc: 'Answer incoming calls, answer FAQs, and route urgent calls to staff.',
      icon: Headphones,
      defaultName: 'Front Desk Receptionist',
      defaultFirst: 'Hi! Thank you for calling. My name is Sarah. How can I assist you today?'
    },
    {
      id: 'appointment_setter',
      title: 'Appointment Setter',
      desc: 'Check calendar availability and schedule consultations directly.',
      icon: Calendar,
      defaultName: 'Appointment Scheduler',
      defaultFirst: 'Hello! I can help you schedule your appointment in under 2 minutes. What day works best?'
    },
    {
      id: 'sales',
      title: 'Outbound Sales & SDR',
      desc: 'Call web form leads in 30 seconds, qualify budget & timeline, and book demos.',
      icon: Zap,
      defaultName: 'Speed-to-Lead Qualifier',
      defaultFirst: 'Hi there! Calling from CallioAI regarding your recent inquiry. Did you have two minutes?'
    },
    {
      id: 'customer_support',
      title: 'Customer Support Care',
      desc: 'Resolve order queries, account lookups, and returns automatically.',
      icon: Sparkles,
      defaultName: 'Customer Support Specialist',
      defaultFirst: 'Hello! Thanks for reaching out to support. What can I help resolve for you today?'
    },
    {
      id: 'real_estate',
      title: 'Real Estate Qualifier',
      desc: 'Pre-screen property buyers, verify budget, and schedule home tours.',
      icon: Home,
      defaultName: 'Property Tour Dispatcher',
      defaultFirst: 'Hello! Thank you for inquiring about our active listings. Are you looking to tour this weekend?'
    }
  ];

  const handleSelectCategory = (cat: typeof categories[0]) => {
    setSelectedCategory(cat.id);
    setAgentName(cat.defaultName);
    setFirstMessage(cat.defaultFirst);
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    try {
      const selectedVoice = MOCK_VOICES.find((v) => v.id === selectedVoiceId) || MOCK_VOICES[0];
      const newAgent = await createAgent({
        name: agentName,
        category: selectedCategory as any,
        description: agentGoal,
        firstMessage,
        systemPrompt: agentGoal,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        language: selectedVoice.language,
        channels: selectedChannels as any
      });
      toast.success('Agent launched successfully!');
      router.push(`/dashboard/agents/${newAgent.id}`);
    } catch (err) {
      toast.error('Failed to create agent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startTestCall = () => {
    setIsTestCalling(true);
    setTestTranscript([
      { speaker: 'ai', text: firstMessage },
      { speaker: 'user', text: 'Hi! Can I ask what your weekend hours are?' },
      { speaker: 'ai', text: 'We are open on Saturdays from 9:00 AM to 2:00 PM for all scheduled appointments!' }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Wizard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard/agents"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Cancel & Exit
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Create Your Voice Agent
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Step {currentStep} of 5 — No coding required
          </p>
        </div>

        {/* Link to Advanced Graph Flow */}
        <Button variant="outline" size="sm" asChild className="rounded-xl text-xs">
          <Link href="/workflow/create">
            <Layers className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            Switch to Advanced Graph
          </Link>
        </Button>
      </div>

      {/* Step Indicators Bar */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs font-semibold">
        {[
          { num: 1, label: 'Purpose' },
          { num: 2, label: 'Goal' },
          { num: 3, label: 'Voice' },
          { num: 4, label: 'Channels' },
          { num: 5, label: 'Test & Launch' }
        ].map((s) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;
          return (
            <div
              key={s.num}
              onClick={() => s.num < currentStep && setCurrentStep(s.num)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isCurrent
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                  : isDone
                  ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-400'
                  : 'border-border/60 text-muted-foreground opacity-60'
              }`}
            >
              <div className="font-mono text-[10px] mb-0.5">STEP {s.num}</div>
              <div className="truncate">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* STEP 1: Choose Purpose */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-foreground">What should your agent do?</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Select a pre-trained role to start with optimal prompt instructions and conversational flow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/40'
                      : 'border-border/70 bg-card/60 hover:bg-card hover:border-border'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex justify-end">
            <Button onClick={() => setCurrentStep(2)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6">
              Next: Define Goal & Instructions →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: Give Agent a Goal */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-foreground">Give your agent a goal</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Provide instructions in normal plain English. CallioAI automatically structures it for optimal voice latency.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Agent Name</label>
              <Input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g. Acme Receptionist"
                className="rounded-xl bg-card"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">First Spoken Greeting</label>
              <Input
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder="e.g. Hi! Thanks for calling Acme Health..."
                className="rounded-xl bg-card"
              />
              <p className="text-[11px] text-muted-foreground">The exact phrase your agent says immediately when answering the call.</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Instructions & Business Rules</label>
                <button
                  type="button"
                  onClick={() =>
                    setAgentGoal(
                      agentGoal +
                        '\n- If caller asks about pricing, state that standard cleanings start at $120.\n- If emergency, transfer to Dr. Bennett at ext 102.'
                    )
                  }
                  className="text-indigo-400 text-xs hover:underline inline-flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3" /> Insert Sample Rules
                </button>
              </div>
              <Textarea
                rows={5}
                value={agentGoal}
                onChange={(e) => setAgentGoal(e.target.value)}
                placeholder="Describe business hours, how to handle booking, cancellation rules, and what information to collect from callers."
                className="rounded-xl bg-card text-xs leading-relaxed"
              />
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentStep(1)}>
              ← Back
            </Button>
            <Button onClick={() => setCurrentStep(3)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6">
              Next: Select Studio Voice →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Choose Voice */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-foreground">Choose a voice persona</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Select the voice that best represents your brand. You can change this at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_VOICES.map((voice) => {
              const isSelected = selectedVoiceId === voice.id;
              return (
                <div
                  key={voice.id}
                  onClick={() => setSelectedVoiceId(voice.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-md ring-2 ring-indigo-500/30'
                      : 'border-border/70 bg-card/60 hover:bg-card'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={voice.avatar} alt={voice.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-foreground text-sm">{voice.name}</div>
                      <div className="text-xs text-muted-foreground">{voice.accent}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {voice.style.slice(0, 2).map((s, i) => (
                          <span key={i} className="text-[10px] bg-muted/60 px-1.5 py-0.5 rounded text-muted-foreground">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentStep(2)}>
              ← Back
            </Button>
            <Button onClick={() => setCurrentStep(4)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6">
              Next: Contact Channels →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Choose Contact Channel */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-foreground">How should customers reach this agent?</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Enable inbound phone lines, website calling widgets, or outbound campaigns.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'phone',
                icon: Phone,
                title: 'Inbound Phone Number',
                desc: 'Assign a dedicated local or toll-free US/UK number or forward your existing office lines.'
              },
              {
                id: 'web',
                icon: Globe,
                title: 'Website Calling Button',
                desc: 'Visitors can talk with your agent directly in their desktop or mobile browser with zero phone dialing.'
              },
              {
                id: 'campaign',
                icon: Megaphone,
                title: 'Outbound Calling Campaigns',
                desc: 'Allow this agent to dial contact lists for speed-to-lead follow-ups and recall surveys.'
              }
            ].map((ch) => {
              const Icon = ch.icon;
              const isChecked = selectedChannels.includes(ch.id);
              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    if (isChecked) {
                      setSelectedChannels(selectedChannels.filter((c) => c !== ch.id));
                    } else {
                      setSelectedChannels([...selectedChannels, ch.id]);
                    }
                  }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                    isChecked
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-border/70 bg-card/60 hover:bg-card'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${isChecked ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground text-sm">{ch.title}</h3>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded accent-indigo-600 h-4 w-4"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ch.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentStep(3)}>
              ← Back
            </Button>
            <Button onClick={() => setCurrentStep(5)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6">
              Next: Test Simulator & Launch →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: Test & Launch */}
      {currentStep === 5 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div>
            <h2 className="text-xl font-bold text-foreground">Review & Test your Agent</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Test your configuration in the live browser simulator before pushing to production.
            </p>
          </div>

          {/* Configuration Summary Card */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Name:</span>
              <div className="font-bold text-foreground mt-0.5">{agentName}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Voice:</span>
              <div className="font-bold text-foreground mt-0.5">
                {MOCK_VOICES.find((v) => v.id === selectedVoiceId)?.name || 'Sarah'}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Role:</span>
              <div className="font-bold text-foreground mt-0.5 capitalize">{selectedCategory.replace('_', ' ')}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Channels:</span>
              <div className="font-bold text-foreground mt-0.5">{selectedChannels.join(', ')}</div>
            </div>
          </div>

          {/* Test Call Box */}
          <div className="p-6 rounded-3xl border border-indigo-500/40 bg-card shadow-lg text-center space-y-4">
            <h3 className="font-bold text-foreground text-sm">Interactive Voice Test</h3>

            {isTestCalling ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-1.5 h-10">
                  {[20, 60, 90, 40, 80, 100, 70, 90, 50].map((h, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-indigo-500 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
                    />
                  ))}
                </div>

                <div className="space-y-2 max-w-md mx-auto text-left text-xs bg-muted/40 p-4 rounded-2xl border border-border/50">
                  {testTranscript.map((t, i) => (
                    <div key={i} className="leading-relaxed">
                      <strong className={t.speaker === 'ai' ? 'text-indigo-400' : 'text-emerald-400'}>
                        {t.speaker === 'ai' ? 'Agent: ' : 'You: '}
                      </strong>
                      <span className="text-foreground">{t.text}</span>
                    </div>
                  ))}
                </div>

                <Button size="sm" variant="destructive" onClick={() => setIsTestCalling(false)} className="rounded-xl">
                  End Test
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                  Click below to simulate a live voice call using your configured first message and goal.
                </p>
                <Button size="sm" onClick={startTestCall} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs px-5">
                  <Play className="w-3.5 h-3.5 mr-1.5" /> Start Test Call
                </Button>
              </div>
            )}
          </div>

          <div className="pt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentStep(4)}>
              ← Back
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-xl px-8 h-11 font-bold text-sm shadow-xl shadow-emerald-600/20"
            >
              {isSubmitting ? 'Launching Agent...' : '🚀 Launch Agent Live'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
