import Link from 'next/link';

/**
 * Marketing site footer — 5 link columns, description + copyright bottom-left,
 * and a giant faded gradient wordmark cropped at the base. Pure white canvas,
 * no divider lines. Content (links, description, bottom bar) unchanged.
 */
export function MarketingFooter() {
  return (
    <footer className="bg-white text-neutral-500">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-8 pt-16 lg:pt-20">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-10">
          {/* Product Col */}
          <div className="space-y-4">
            <h4 className="text-[17px] font-semibold tracking-tight text-neutral-900">Product</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <Link href="/ai-voice-agents" className="hover:text-neutral-950 transition-colors">
                  AI Voice Agents
                </Link>
              </li>
              <li>
                <Link href="/ai-calling" className="hover:text-neutral-950 transition-colors">
                  AI Calling Platform
                </Link>
              </li>
              <li>
                <Link href="/inbound-calls" className="hover:text-neutral-950 transition-colors">
                  Inbound Receptionist
                </Link>
              </li>
              <li>
                <Link href="/outbound-calls" className="hover:text-neutral-950 transition-colors">
                  Outbound Campaigns
                </Link>
              </li>
              <li>
                <Link href="/voices" className="hover:text-neutral-950 transition-colors">
                  Voice Marketplace
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-neutral-950 transition-colors">
                  Pricing & Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Col */}
          <div className="space-y-4">
            <h4 className="text-[17px] font-semibold tracking-tight text-neutral-900">Solutions</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <Link href="/use-cases/healthcare" className="hover:text-neutral-950 transition-colors">
                  Healthcare Clinics
                </Link>
              </li>
              <li>
                <Link href="/use-cases/real-estate" className="hover:text-neutral-950 transition-colors">
                  Real Estate
                </Link>
              </li>
              <li>
                <Link href="/use-cases/sales" className="hover:text-neutral-950 transition-colors">
                  Sales & SDR
                </Link>
              </li>
              <li>
                <Link href="/use-cases/customer-support" className="hover:text-neutral-950 transition-colors">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="/use-cases/education" className="hover:text-neutral-950 transition-colors">
                  Education & Colleges
                </Link>
              </li>
              <li>
                <Link href="/use-cases/logistics" className="hover:text-neutral-950 transition-colors">
                  Logistics & Fleet
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Col */}
          <div className="space-y-4">
            <h4 className="text-[17px] font-semibold tracking-tight text-neutral-900">Resources</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <Link href="/customer-stories" className="hover:text-neutral-950 transition-colors">
                  Customer Stories
                </Link>
              </li>
              <li>
                <Link href="/ai-voice-agents" className="hover:text-neutral-950 transition-colors">
                  AI Voice Agents
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-neutral-950 transition-colors">
                  CRM Integrations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-950 transition-colors">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal Col */}
          <div className="space-y-4">
            <h4 className="text-[17px] font-semibold tracking-tight text-neutral-900">Trust & Legal</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <Link href="/security" className="hover:text-neutral-950 transition-colors">
                  Data Privacy
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-neutral-950 transition-colors">
                  System Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="space-y-4">
            <h4 className="text-[17px] font-semibold tracking-tight text-neutral-900">Legal</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <Link href="/privacy" className="hover:text-neutral-950 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-neutral-950 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-neutral-950 transition-colors">
                  Enterprise Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row: description left, copyright right */}
        <div className="mt-14 flex flex-col gap-4 py-8 text-[14px] sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-xl leading-relaxed">
            The business operating system for AI voice calling. Automate inbound customer support,
            speed-to-lead outbound calls, appointment booking, and dispatch workflows with human-grade empathy.
          </p>
          <p className="shrink-0 sm:text-right">© {new Date().getFullYear()} CallioAI Technologies Inc. All rights reserved.</p>
        </div>

        {/* Giant gradient wordmark, cropped at the base */}
        <div aria-hidden="true" className="pointer-events-none overflow-hidden select-none">
          <p className="-mb-[0.14em] bg-gradient-to-b from-neutral-900/[0.09] to-neutral-900/0 bg-clip-text text-center text-[24vw] leading-[0.8] font-extrabold tracking-[-0.03em] text-transparent lg:text-[280px]">
            CALLIO
          </p>
        </div>
      </div>
    </footer>
  );
}
