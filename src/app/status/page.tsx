import { CheckCircle2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'System Status — CallioAI',
  description: 'Real-time uptime and performance status of CallioAI voice engines and telephony gateways.',
};

export default function StatusPage() {
  const systems = [
    { name: 'US Voice Streaming Engine (East & West)', status: 'Operational', uptime: '99.99%' },
    { name: 'EU Voice Streaming Engine (Frankfurt)', status: 'Operational', uptime: '99.99%' },
    { name: 'Inbound SIP & PSTN Telephony Gateway', status: 'Operational', uptime: '100.0%' },
    { name: 'Outbound Campaign Dispatch Queue', status: 'Operational', uptime: '99.98%' },
    { name: 'Real-time Speech Recognition & Synthesis', status: 'Operational', uptime: '99.99%' },
    { name: 'REST API & Webhooks Webhook Dispatcher', status: 'Operational', uptime: '100.0%' }
  ];

  return (
    <div className="py-12 lg:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-3">
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2 inline-block" />
          All Systems Operational
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">CallioAI Live Status</h1>
        <p className="text-sm text-muted-foreground">Current system metrics and uptime statistics.</p>
      </div>

      <div className="rounded-3xl border border-border/80 bg-card p-6 divide-y divide-border/50 shadow-md">
        {systems.map((sys, i) => (
          <div key={i} className="py-4 flex items-center justify-between first:pt-0 last:pb-0 text-sm">
            <span className="font-semibold text-foreground">{sys.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-mono">{sys.uptime}</span>
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {sys.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
