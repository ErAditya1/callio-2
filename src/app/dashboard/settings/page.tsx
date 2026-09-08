'use client';

import {
  Building,
  Check,
  Code2,
  Copy,
  CreditCard,
  Key,
  Layers,
  Lock,
  Phone,
  Settings,
  ShieldCheck,
  Terminal,
  User
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsDashboardPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'telephony' | 'billing' | 'developer'>('profile');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const copyApiKey = () => {
    navigator.clipboard.writeText('callio_live_sk_94819a82019b88219481');
    setApiKeyCopied(true);
    toast.success('API Key copied to clipboard');
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your organization profile, phone numbers, billing plans, and developer integrations.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border/80 w-fit text-xs font-semibold">
        {[
          { key: 'profile', label: 'Company Profile', icon: Building },
          { key: 'telephony', label: 'Phone Numbers', icon: Phone },
          { key: 'billing', label: 'Billing & Plan', icon: CreditCard },
          { key: 'developer', label: 'Developer & API', icon: Code2 }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Company Profile */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-md">
          <h2 className="text-base font-bold text-foreground">Organization Details</h2>
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Company Name</label>
              <Input defaultValue="Acme Health Dental Group" className="rounded-xl bg-muted/30" />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Primary Support Email</label>
              <Input defaultValue="support@acmehealth.example.com" className="rounded-xl bg-muted/30" />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Timezone</label>
              <Input defaultValue="America/New_York (EST)" className="rounded-xl bg-muted/30" />
            </div>
          </div>
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs">
            Save Changes
          </Button>
        </div>
      )}

      {/* Tab: Telephony */}
      {activeTab === 'telephony' && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <div>
              <h2 className="text-base font-bold text-foreground">Active Phone Numbers</h2>
              <p className="text-xs text-muted-foreground">Numbers provisioned for inbound and outbound calling</p>
            </div>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs">
              + Buy / Port Number
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { number: '+1 (888) 492-3021', type: 'Toll-Free US', agent: 'Sarah — AI Receptionist' },
              { number: '+1 (888) 720-9110', type: 'Outbound High-Throughput', agent: 'Alex — Outbound SDR' }
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-foreground text-sm">{p.number}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.type} • Assigned to {p.agent}</div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Billing */}
      {activeTab === 'billing' && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-md">
          <h2 className="text-base font-bold text-foreground">Subscription & Usage</h2>
          <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-between">
            <div>
              <Badge className="bg-indigo-600 text-white text-xs mb-1">Growth Plan ($249/mo)</Badge>
              <div className="text-xs text-muted-foreground">Renews on October 1, 2026 • 2,500 included minutes</div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs">
              Change Plan
            </Button>
          </div>
        </div>
      )}

      {/* Tab: Developer & API (Moved to Settings) */}
      {activeTab === 'developer' && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-md">
          <div>
            <h2 className="text-base font-bold text-foreground">Developer API & Webhooks</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Programmatically initiate calls, receive webhooks, and fetch transcripts using REST endpoints.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Live Secret API Key</label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value="callio_live_sk_94819a82019b88219481"
                  type="password"
                  className="rounded-xl font-mono text-xs bg-muted/40"
                />
                <Button size="sm" variant="outline" onClick={copyApiKey} className="rounded-xl text-xs h-9">
                  {apiKeyCopied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {apiKeyCopied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Webhook Target URL</label>
              <Input
                placeholder="https://api.yourcompany.com/webhooks/callio"
                className="rounded-xl text-xs bg-muted/30"
              />
              <p className="text-[11px] text-muted-foreground">
                Delivers instant JSON payload containing call duration, outcome, transcripts, and audio URL when a call concludes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
              <div className="text-xs font-mono font-bold text-indigo-400">cURL Example: Trigger Outbound Call</div>
              <pre className="text-[11px] font-mono text-muted-foreground overflow-x-auto whitespace-pre p-2 bg-black/40 rounded-xl">
{`curl -X POST https://api.callio.ai/v1/calls \\
  -H "Authorization: Bearer callio_live_sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"agent_id": "agent-sales", "to": "+15550199"}'`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
