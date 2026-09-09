import {
  CheckCircle2,
  Database,
  FileCheck,
  Key,
  Lock,
  Server,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Enterprise Security & Compliance — CallioAI',
  description: 'Enterprise trust, audio stream encryption, privacy, and compliance built into every call.',
};

export default function SecurityPage() {
  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/30 text-xs text-muted-foreground mb-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Security & Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Security and privacy at every layer.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
          CallioAI is engineered from the ground up to safeguard sensitive voice conversations, customer PII, and enterprise infrastructure.
        </p>
      </div>

      {/* Security Pillars (Clean Minimal Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        {[
          {
            title: 'End-to-End Encryption',
            desc: 'All audio media streams are encrypted in transit via SRTP/TLS 1.3, and recordings are encrypted at rest using AES-256.',
          },
          {
            title: 'Automated PII Redaction',
            desc: 'Transcripts can automatically mask credit cards, social security numbers, and patient health details before storage.',
          },
          {
            title: 'Role-Based Access Control',
            desc: 'Granular permissions and SAML/SSO ensure only authorized staff can access call audio and customer records.',
          },
          {
            title: 'Strict Data Retention',
            desc: 'Define custom data retention lifecycles. Automatically purge audio and transcripts after 30, 60, or 90 days.',
          },
          {
            title: 'HIPAA & SOC2 Ready',
            desc: 'Compliant architecture suitable for healthcare clinics, financial services, and sensitive enterprise call centers.',
          },
          {
            title: 'Dedicated Infrastructure',
            desc: 'Enterprise customers can deploy isolated instances or route audio through private SIP trunks and VPNs.',
          },
        ].map((pillar, idx) => (
          <div key={idx} className="p-5 rounded-xl border border-border/70 bg-card/40 space-y-2">
            <h3 className="text-sm font-bold text-foreground">{pillar.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
          </div>
        ))}
      </div>

      {/* Minimal CTA */}
      <div className="rounded-xl border border-border/70 bg-card/40 p-8 text-center space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Need custom compliance or BAA?</h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Contact our security team for SOC2 reports, penetration test summaries, or custom HIPAA agreements.
        </p>
        <div className="pt-2">
          <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs h-9 px-5">
            <Link href="/contact">Contact Security Team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
