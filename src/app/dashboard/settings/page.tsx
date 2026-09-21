'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building01Icon,
  CheckIcon,
  CodeSquareIcon,
  Copy01Icon,
  CreditCardIcon,
  Key01Icon,
  Layers01Icon,
  LockIcon,
  PhoneIcon,
  Settings01Icon,
  ShieldCheckIcon,
  TerminalIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";;
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
    <div className="app-page space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] mt-1">
          Manage your organization profile, phone numbers, billing plans, and developer integrations.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#FFFFFF] border border-[#E5E5E5] w-fit text-xs font-semibold">
        {[
          { key: 'profile', label: 'Company Profile', icon: Building01Icon },
          { key: 'telephony', label: 'PhoneIcon Numbers', icon: PhoneIcon },
          { key: 'billing', label: 'Billing & Plan', icon: CreditCardIcon },
          { key: 'developer', label: 'Developer & API', icon: CodeSquareIcon }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'text-[#737373] hover:text-foreground hover:bg-[#F7F7F7]'
              }`}
            >
              <HugeiconsIcon icon={Icon} className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab: Company Profile */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-md">
          <h2 className="text-base font-bold text-foreground">Organization Details</h2>
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Company Name</label>
              <Input defaultValue="Acme Health Dental Group" className="rounded-xl bg-[#F7F7F7]" />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Primary Support Email</label>
              <Input defaultValue="support@acmehealth.example.com" className="rounded-xl bg-[#F7F7F7]" />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Timezone</label>
              <Input defaultValue="America/New_York (EST)" className="rounded-xl bg-[#F7F7F7]" />
            </div>
          </div>
          <Button size="sm" className="bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs">
            Save Changes
          </Button>
        </div>
      )}

      {/* Tab: Telephony */}
      {activeTab === 'telephony' && (
        <div className="rounded-3xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
            <div>
              <h2 className="text-base font-bold text-foreground">Active Phone Numbers</h2>
              <p className="text-xs text-[#737373]">Numbers provisioned for inbound and outbound calling</p>
            </div>
            <Button size="sm" className="bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs">
              + Buy / Port Number
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { number: '+1 (888) 492-3021', type: 'Toll-Free US', agent: 'Sarah — AI Receptionist' },
              { number: '+1 (888) 720-9110', type: 'Outbound High-Throughput', agent: 'Alex — Outbound SDR' }
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-between">
                <div>
                  <div className="font-mono font-bold text-foreground text-sm">{p.number}</div>
                  <div className="text-xs text-[#737373] mt-0.5">{p.type} • Assigned to {p.agent}</div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-[#F0F3F9] text-[#7186AD] border-[#DCE3EF]">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Billing */}
      {activeTab === 'billing' && (
        <div className="rounded-3xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-md">
          <h2 className="text-base font-bold text-foreground">Subscription & Usage</h2>
          <div className="p-5 rounded-2xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-between">
            <div>
              <Badge className="bg-neutral-950 text-white text-xs mb-1">Growth Plan ($249/mo)</Badge>
              <div className="text-xs text-[#737373]">Renews on October 1, 2026 • 2,500 included minutes</div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs">
              Change Plan
            </Button>
          </div>
        </div>
      )}

      {/* Tab: Developer & API (Moved to Settings) */}
      {activeTab === 'developer' && (
        <div className="rounded-3xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 sm:p-8 space-y-6 shadow-md">
          <div>
            <h2 className="text-base font-bold text-foreground">Developer API & Webhooks</h2>
            <p className="text-xs text-[#737373] mt-0.5">
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
                  className="rounded-xl font-mono text-xs bg-[#F7F7F7]"
                />
                <Button size="sm" variant="outline" onClick={copyApiKey} className="rounded-xl text-xs h-9">
                  {apiKeyCopied ? <HugeiconsIcon icon={CheckIcon} className="w-3.5 h-3.5 text-[#7186AD] mr-1" /> : <HugeiconsIcon icon={Copy01Icon} className="w-3.5 h-3.5 mr-1" />}
                  {apiKeyCopied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Webhook Target URL</label>
              <Input
                placeholder="https://api.yourcompany.com/webhooks/callio"
                className="rounded-xl text-xs bg-[#F7F7F7]"
              />
              <p className="text-[11px] text-[#737373]">
                Delivers instant JSON payload containing call duration, outcome, transcripts, and audio URL when a call concludes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F7F7] border border-[#E5E5E5] space-y-2">
              <div className="text-xs font-mono font-bold text-[#7186AD]">cURL Example: Trigger Outbound Call</div>
              <pre className="text-[11px] font-mono text-[#737373] overflow-x-auto whitespace-pre p-2 bg-black/40 rounded-xl">
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
