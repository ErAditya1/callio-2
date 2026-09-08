'use client';

import {
  Activity,
  CheckCircle2,
  Cpu,
  Globe,
  Layers,
  Mic,
  Phone,
  Play,
  Settings,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ProductSimulator() {
  const [activeTab, setActiveTab] = useState<'build' | 'test' | 'deploy' | 'monitor'>('build');

  return (
    <section className="py-20 lg:py-28 bg-muted/20 border-y border-border/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-3 py-1">
            <Zap className="w-3.5 h-3.5 mr-1.5 inline" />
            Simple 4-Step Lifecycle
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            From idea to live AI phone agent in minutes.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            No complex coding, no telephony headaches. Experience how effortless it is to create, test, launch, and monitor your AI workforce.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-2 max-w-xl mx-auto mb-10 p-1.5 rounded-2xl bg-card border border-border/80 shadow-md">
          {[
            { key: 'build', label: '1. Build', icon: Sparkles },
            { key: 'test', label: '2. Test', icon: Mic },
            { key: 'deploy', label: '3. Deploy', icon: Globe },
            { key: 'monitor', label: '4. Monitor', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 flex-1 justify-center py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Lifecycle Canvas */}
        <div className="max-w-4xl mx-auto rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-2xl shadow-black/20">
          {activeTab === 'build' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Guided Agent Builder</h3>
                  <p className="text-xs text-muted-foreground">Describe what your agent should do in plain English</p>
                </div>
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
                  Step 1 of 4
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Agent Name & Role
                  </label>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-sm font-medium text-foreground">
                    Acme Dental Front-Desk Receptionist
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                    Conversational Instructions (Plain Text)
                  </label>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-xs sm:text-sm text-muted-foreground leading-relaxed font-mono">
                    "Greet callers politely. You are the virtual receptionist for Acme Dental. Check calendar availability, answer questions regarding insurance and parking, and book appointments. Keep answers concise."
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Selected Voice</div>
                      <div className="text-sm font-semibold text-foreground">Sarah (US Warm & Professional)</div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                      Active
                    </Badge>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Language</div>
                      <div className="text-sm font-semibold text-foreground">English (US) + Auto-detect</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      Default
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button onClick={() => setActiveTab('test')} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  Next: Test Agent Simulator →
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Instant In-Browser Test Call</h3>
                  <p className="text-xs text-muted-foreground">Talk directly with your newly built agent</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                  ● Live Microphone Ready
                </Badge>
              </div>

              <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
                  <Mic className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-foreground text-base">Sarah is listening...</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Try saying: "Do you have any openings on Friday morning?"</div>
                </div>

                <div className="flex items-center justify-center gap-1.5 h-8">
                  {[20, 50, 80, 40, 90, 60, 30, 70, 95, 40].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-indigo-500 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setActiveTab('build')}>
                  ← Back to Build
                </Button>
                <Button onClick={() => setActiveTab('deploy')} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  Next: Deploy Agent →
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Instant 1-Click Deployment</h3>
                  <p className="text-xs text-muted-foreground">Assign real phone numbers or embed a web call button</p>
                </div>
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs">
                  Step 3 of 4
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-indigo-500/40 bg-indigo-500/5 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                    <Phone className="w-4 h-4 text-indigo-400" />
                    Dedicated Phone Number
                  </div>
                  <div className="text-xl font-mono font-bold text-indigo-400">+1 (888) 492-3021</div>
                  <p className="text-xs text-muted-foreground">Incoming calls dial straight into your AI agent with instant answer.</p>
                </div>

                <div className="p-5 rounded-2xl border border-border/60 bg-muted/20 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    Website Calling Widget
                  </div>
                  <div className="text-sm font-mono text-muted-foreground truncate">
                    &lt;script src="https://callio.ai/widget.js"&gt;&lt;/script&gt;
                  </div>
                  <p className="text-xs text-muted-foreground">Add 1 line of HTML to enable web calls directly from your site.</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setActiveTab('test')}>
                  ← Back to Test
                </Button>
                <Button onClick={() => setActiveTab('monitor')} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  Next: Monitor Analytics →
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'monitor' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Operational Intelligence</h3>
                  <p className="text-xs text-muted-foreground">Understand call outcomes, sentiments, and appointments</p>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                  Step 4 of 4
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60">
                  <div className="text-xs text-muted-foreground">Total Calls</div>
                  <div className="text-xl font-extrabold text-foreground mt-1">3,412</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">↑ 14% this week</div>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60">
                  <div className="text-xs text-muted-foreground">Resolution Rate</div>
                  <div className="text-xl font-extrabold text-foreground mt-1">94.2%</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Top tier quality</div>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60">
                  <div className="text-xs text-muted-foreground">Appointments</div>
                  <div className="text-xl font-extrabold text-foreground mt-1">486</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Direct to calendar</div>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60">
                  <div className="text-xs text-muted-foreground">Hold Time</div>
                  <div className="text-xl font-extrabold text-foreground mt-1">0 sec</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Instant answer</div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setActiveTab('deploy')}>
                  ← Back to Deploy
                </Button>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white">
                  <Link href="/dashboard/agents/create">
                    Build Your Real Agent Now →
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
