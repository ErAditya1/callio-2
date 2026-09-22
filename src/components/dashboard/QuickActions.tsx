'use client';

import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  BotIcon,
  Megaphone01Icon,
  PhoneCallIcon,
  RadioIcon,
  Settings01Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import Link from 'next/link';
import React from 'react';

import { Card } from '@/components/ui/card';

const ACTIONS = [
  {
    title: 'Create Voice Agent',
    description: 'Design conversational flow, prompt instructions, and tools',
    href: '/workflow/create',
    icon: BotIcon,
    badge: 'Builder',
  },
  {
    title: 'Launch Campaign',
    description: 'Upload contact leads and run automated outbound dialing batches',
    href: '/campaigns/new',
    icon: Megaphone01Icon,
    badge: 'Outbound',
  },
  {
    title: 'Telephony & Numbers',
    description: 'Manage Twilio, Telnyx, Plivo credentials and virtual phone numbers',
    href: '/telephony-configurations',
    icon: PhoneCallIcon,
    badge: 'Carrier',
  },
  {
    title: 'Test Live Agent',
    description: 'Simulate high-fidelity browser audio call with zero latency',
    href: '/demo/call',
    icon: RadioIcon,
    badge: 'Sandbox',
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {ACTIONS.map((act) => {
        return (
          <Link
            key={act.title}
            href={act.href}
            className="group block p-4 rounded-2xl border border-border/80 bg-card hover:bg-muted/30 hover:border-border transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <HugeiconsIcon icon={act.icon} className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/60 px-2 py-0.5 rounded-md">
                {act.badge}
              </span>
            </div>
            <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
              {act.title}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
              {act.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
