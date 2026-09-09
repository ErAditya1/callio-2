'use client';

import {
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactSalesPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/30 text-xs text-muted-foreground mb-4">
          <Mail className="w-3.5 h-3.5 text-indigo-500" />
          <span>Enterprise & Custom Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Let’s build your AI voice operation.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Speak with our voice solutions engineering team to design custom workflows, dedicated telephony, or enterprise compliance.
        </p>
      </div>

      <div className="max-w-xl mx-auto rounded-xl border border-border/70 bg-card/40 p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Request Received</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Thank you. A voice specialist will contact you within 2 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">First Name</label>
                <Input required placeholder="Sarah" className="rounded-lg h-9 text-xs border-border/70 bg-background/50" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Last Name</label>
                <Input required placeholder="Connor" className="rounded-lg h-9 text-xs border-border/70 bg-background/50" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Work Email</label>
              <Input type="email" required placeholder="sarah@company.com" className="rounded-lg h-9 text-xs border-border/70 bg-background/50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Company Name</label>
                <Input required placeholder="Acme Health" className="rounded-lg h-9 text-xs border-border/70 bg-background/50" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Estimated Monthly Call Volume</label>
                <Input placeholder="e.g. 5,000 calls" className="rounded-lg h-9 text-xs border-border/70 bg-background/50" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">How can we help your team?</label>
              <Textarea
                rows={3}
                placeholder="Tell us about your phone workflows, systems, or compliance needs..."
                className="rounded-lg text-xs border-border/70 bg-background/50"
              />
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg h-10 text-xs font-semibold mt-2">
              Submit Request
            </Button>
          </form>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          NDA Protected
        </span>
        <span>•</span>
        <span>Sub-2hr Response</span>
        <span>•</span>
        <span>Dedicated Voice Architects</span>
      </div>
    </div>
  );
}
