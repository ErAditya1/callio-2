import Link from 'next/link';

import { BrandLogo } from '@/components/BrandLogo';

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              The business operating system for AI voice calling. Automate inbound customer support,
              speed-to-lead outbound calls, appointment booking, and dispatch workflows with human-grade empathy.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground/80">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational • 99.99% Voice Uptime
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ai-voice-agents" className="hover:text-foreground transition-colors">
                  AI Voice Agents
                </Link>
              </li>
              <li>
                <Link href="/ai-calling" className="hover:text-foreground transition-colors">
                  AI Calling Platform
                </Link>
              </li>
              <li>
                <Link href="/inbound-calls" className="hover:text-foreground transition-colors">
                  Inbound Receptionist
                </Link>
              </li>
              <li>
                <Link href="/outbound-calls" className="hover:text-foreground transition-colors">
                  Outbound Campaigns
                </Link>
              </li>
              <li>
                <Link href="/voices" className="hover:text-foreground transition-colors">
                  Voice Marketplace
                </Link>
              </li>
              <li>
                <Link href="/demo" className="hover:text-foreground transition-colors">
                  Live Agent Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/use-cases/healthcare" className="hover:text-foreground transition-colors">
                  Healthcare Clinics
                </Link>
              </li>
              <li>
                <Link href="/use-cases/real-estate" className="hover:text-foreground transition-colors">
                  Real Estate
                </Link>
              </li>
              <li>
                <Link href="/use-cases/sales" className="hover:text-foreground transition-colors">
                  Sales & SDR
                </Link>
              </li>
              <li>
                <Link href="/use-cases/customer-support" className="hover:text-foreground transition-colors">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/use-cases/education" className="hover:text-foreground transition-colors">
                  Education & Colleges
                </Link>
              </li>
              <li>
                <Link href="/use-cases/logistics" className="hover:text-foreground transition-colors">
                  Logistics & Fleet
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/customer-stories" className="hover:text-foreground transition-colors">
                  Customer Stories
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing & Calculator
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-foreground transition-colors">
                  CRM Integrations
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-foreground transition-colors">
                  Enterprise Security
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Trust & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/security" className="hover:text-foreground transition-colors">
                  Data Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-foreground transition-colors">
                  System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CallioAI Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/security" className="hover:text-foreground transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
