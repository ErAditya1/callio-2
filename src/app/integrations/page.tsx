'use client';

import {
  ArrowRight,
  Blocks,
  Calendar,
  CheckCircle2,
  Code2,
  Database,
  Globe,
  Headphones,
  Link2,
  MessageSquare,
  Search,
  Sparkles,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const integrations = [
    {
      name: 'HubSpot CRM',
      category: 'crm',
      description: 'Sync customer contacts, log call recordings & AI summaries, and update deal pipeline stages automatically.',
      logo: '🟠',
      status: 'Ready'
    },
    {
      name: 'Salesforce',
      category: 'crm',
      description: 'Create leads, tasks, and log conversation intelligence directly into Salesforce Enterprise records.',
      logo: '☁️',
      status: 'Ready'
    },
    {
      name: 'Google Calendar',
      category: 'calendar',
      description: 'Check real-time slot availability, reserve appointments, and send automated Google Meet links.',
      logo: '📅',
      status: 'Ready'
    },
    {
      name: 'Cal.com',
      category: 'calendar',
      description: 'Native integration with team scheduling links, round-robin dispatch, and automated rescheduling.',
      logo: '⏰',
      status: 'Ready'
    },
    {
      name: 'Slack',
      category: 'communication',
      description: 'Receive real-time instant alerts in your team channel whenever an urgent call is received or an appointment is set.',
      logo: '💬',
      status: 'Ready'
    },
    {
      name: 'Zapier',
      category: 'automation',
      description: 'Connect CallioAI to 5,000+ business applications with zero code using instant call triggers and actions.',
      logo: '⚡',
      status: 'Ready'
    },
    {
      name: 'Make.com',
      category: 'automation',
      description: 'Build complex post-call workflows, send customer contracts, and trigger email sequences.',
      logo: '🟣',
      status: 'Ready'
    },
    {
      name: 'Webhooks & REST API',
      category: 'developer',
      description: 'Real-time JSON webhook payloads delivered immediately upon call completion with full audio and transcripts.',
      logo: '💻',
      status: 'Ready'
    }
  ];

  const filtered = useMemo(() => {
    return integrations.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchQuery =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, search]);

  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-3 py-1">
          <Blocks className="w-3.5 h-3.5 mr-1.5 inline" />
          Seamless Ecosystem
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Connect your existing business stack.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          CallioAI works seamlessly with your calendars, CRMs, and messaging tools so you never have to copy-paste call notes manually.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 p-3 rounded-2xl bg-card border border-border/70">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { key: 'all', label: 'All Integrations' },
            { key: 'crm', label: 'CRM' },
            { key: 'calendar', label: 'Calendar' },
            { key: 'communication', label: 'Messaging' },
            { key: 'automation', label: 'Automation' },
            { key: 'developer', label: 'Developer API' }
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 rounded-xl text-xs bg-muted/40"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-border/80 bg-card p-6 flex flex-col justify-between shadow-md hover:border-indigo-500/50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="text-3xl">{item.logo}</div>
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 py-0">
                  {item.status}
                </Badge>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">{item.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                {item.description}
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold">
              <Link href="/dashboard/integrations">
                Connect in 1-Click →
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
