'use client';

import {
  ArrowRight,
  Building,
  CheckCircle2,
  Mail,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
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
    <div className="py-12 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <Badge variant="outline" className="mb-3 border-indigo-500/30 text-indigo-400 bg-indigo-500/10 px-3 py-1">
          <Building className="w-3.5 h-3.5 mr-1.5 inline" />
          Enterprise & Custom Volume
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          Let’s build your AI calling operation.
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Speak with our voice solutions engineering team to design custom workflows, dedicated telephony routing, or HIPAA/SOC2 compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
        {/* Left Form */}
        <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-card p-6 sm:p-10 shadow-2xl">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Request Received</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Thank you! An enterprise voice specialist will contact you within 2 business hours with tailored recommendations.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Full Name *</label>
                  <Input required placeholder="Jane Doe" className="rounded-xl bg-muted/30" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Work Email *</label>
                  <Input required type="email" placeholder="jane@company.com" className="rounded-xl bg-muted/30" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Company Name *</label>
                  <Input required placeholder="Acme Inc" className="rounded-xl bg-muted/30" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Phone Number</label>
                  <Input type="tel" placeholder="+1 (555) 000-0000" className="rounded-xl bg-muted/30" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Industry</label>
                  <select className="w-full h-10 px-3 rounded-xl bg-muted/30 border border-input text-xs text-foreground focus:outline-none">
                    <option>Healthcare / Clinic</option>
                    <option>Real Estate & Property</option>
                    <option>B2B Sales / Tech</option>
                    <option>Logistics & Fleet</option>
                    <option>Financial Services</option>
                    <option>Other Service Business</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Monthly Call Volume</label>
                  <select className="w-full h-10 px-3 rounded-xl bg-muted/30 border border-input text-xs text-foreground focus:outline-none">
                    <option>1,000 - 5,000 calls</option>
                    <option>5,000 - 25,000 calls</option>
                    <option>25,000 - 100,000 calls</option>
                    <option>100,000+ calls / month</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Tell us about your use case</label>
                <Textarea
                  rows={4}
                  placeholder="What would you like your AI voice agent to automate? (e.g. 24/7 receptionist, patient booking, speed-to-lead outbound)"
                  className="rounded-xl bg-muted/30 text-xs resize-none"
                />
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 font-semibold text-sm shadow-lg shadow-indigo-600/30">
                <Send className="w-4 h-4 mr-2" />
                Talk to a Voice Expert
              </Button>
            </form>
          )}
        </div>

        {/* Right Benefits Column */}
        <div className="lg:col-span-5 space-y-6 pt-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">What to expect:</h3>
            <ul className="space-y-3.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-foreground">Custom Architecture Review:</strong> We analyze your current call volume, IVRs, and CRM integrations.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-foreground">Live Tailored Voice Demo:</strong> Hear an AI agent built specifically with your business knowledge.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                <span><strong className="text-foreground">Enterprise SLA & Security:</strong> Dedicated SIP trunking, 99.99% uptime SLA, and custom BAA agreements.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Direct Inquiries</div>
            <div className="text-sm font-semibold text-foreground">enterprise@callio.ai</div>
            <div className="text-xs text-muted-foreground">+1 (888) 550-2010 (Toll-Free US & Canada)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
