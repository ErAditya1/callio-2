import {
  CheckCircle2,
  Database,
  FileCheck,
  Key,
  Lock,
  Server,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Enterprise Security & Compliance — CallioAI',
  description: 'Enterprise trust, data encryption, privacy, and compliance built into every call.',
};

export default function SecurityPage() {
  return (
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="outline" className="mb-3 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-3 py-1">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 inline" />
          Enterprise Trust Center
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Security and privacy at every layer.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          CallioAI is engineered from the ground up to safeguard sensitive voice conversations, customer PII, and enterprise infrastructure.
        </p>
      </div>

      {/* Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {[
          {
            icon: Lock,
            title: 'End-to-End Encryption',
            desc: 'All audio media streams and signaling are encrypted in transit via SRTP/TLS 1.3, and all transcripts and recordings are encrypted at rest using AES-256.'
          },
          {
            icon: UserCheck,
            title: 'Automated PII Redaction',
            desc: 'Voice transcripts can be configured to automatically mask credit card numbers, social security numbers, and sensitive health records before storage.'
          },
          {
            icon: Key,
            title: 'Role-Based Access Control',
            desc: 'Fine-grained permissions and SAML/SSO authentication ensure only authorized team members can access call audio and customer records.'
          },
          {
            icon: FileCheck,
            title: 'Strict Data Retention',
            desc: 'Define custom data retention lifecycles. Automatically delete audio and transcripts after 30, 60, or 90 days according to your compliance rules.'
          },
          {
            icon: Server,
            title: 'Private Cloud & VPC Deployment',
            desc: 'Deploy CallioAI dedicated voice nodes directly into your AWS, GCP, or Azure private virtual cloud for zero external data transit.'
          },
          {
            icon: Database,
            title: 'Zero Training on Customer Data',
            desc: 'Your customer voice calls, private documents, and transcripts are never used to train generalized foundation AI models.'
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-8 rounded-3xl border border-border/80 bg-card space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Trust Banner */}
      <div className="rounded-3xl border border-border/80 bg-card p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Need a custom Security Questionnaire or BAA?</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Our security engineering team works directly with your CISO and legal teams.
        </p>
        <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl">
          <Link href="/contact">Request Security Review →</Link>
        </Button>
      </div>
    </div>
  );
}
