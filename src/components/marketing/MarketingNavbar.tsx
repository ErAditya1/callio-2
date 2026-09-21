'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  XIcon,
} from "@hugeicons/core-free-icons";;
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

/**
 * Marketing site header — ElevenLabs-style left-aligned nav merged with the
 * site system: brand left, text-only links grouped left, CTAs right; hover is
 * a plain neutral pill (no icons, no accent colors). Bar color, links, routes,
 * and auth states are unchanged — alignment + hover design only.
 */
export function MarketingNavbar() {
  const { isAuthenticated, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerClass = (open: boolean) =>
    `px-4 py-2 rounded-full text-[15px] font-medium transition-colors ${open
      ? 'bg-neutral-100 text-neutral-950'
      : 'text-neutral-800 hover:bg-neutral-100 hover:text-neutral-950'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${isScrolled
        ? 'border-b border-neutral-200/80 shadow-[0_1px_2px_rgba(16,16,20,0.05)]'
        : 'border-b border-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-8">
        <div className="flex items-center h-16 sm:h-[72px]">
          {/* Brand */}
          <Link href="/" className="flex items-center shrink-0" aria-label="Callio home">
            <BrandLogo />
          </Link>

          {/* Links grouped left, like the reference */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex items-center gap-1 text-[15px] font-medium ml-8 xl:ml-12"
          >
            {/* Product Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('product')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={triggerClass(activeDropdown === 'product')}>
                Product
              </button>

              {activeDropdown === 'product' && (
                <div className="absolute top-full left-0 w-[340px] pt-2 z-50">
                  <div className="bg-white border border-neutral-200 rounded-2xl p-2.5 shadow-2xl shadow-neutral-900/10 space-y-0.5">
                    <Link
                      href="/ai-voice-agents"
                      className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="font-semibold text-neutral-900 text-[15px]">AI Voice Agents</div>
                      <div className="text-[13px] text-neutral-500">Autonomous agents for customer conversations</div>
                    </Link>
                    <Link
                      href="/ai-calling"
                      className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="font-semibold text-neutral-900 text-[15px]">AI Calling Platform</div>
                      <div className="text-[13px] text-neutral-500">Automated inbound & outbound call workflows</div>
                    </Link>
                    <Link
                      href="/inbound-calls"
                      className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="font-semibold text-neutral-900 text-[15px]">Inbound Calls</div>
                      <div className="text-[13px] text-neutral-500">24/7 receptionist, smart triage & routing</div>
                    </Link>
                    <Link
                      href="/outbound-calls"
                      className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="font-semibold text-neutral-900 text-[15px]">Outbound Campaigns</div>
                      <div className="text-[13px] text-neutral-500">Lead follow-ups, qualification & appointment booking</div>
                    </Link>

                    <div className="pt-2 mt-2 border-t border-neutral-200 grid grid-cols-2 gap-1">
                      <Link
                        href="/voices"
                        className="block p-2 rounded-lg hover:bg-neutral-100 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        Voice Marketplace
                      </Link>
                      <Link
                        href="/ai-voice-agents"
                        className="block p-2 rounded-lg hover:bg-neutral-100 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        Try Live Agents
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions / Use Cases Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('solutions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={triggerClass(activeDropdown === 'solutions')}>
                Solutions
              </button>

              {activeDropdown === 'solutions' && (
                <div className="absolute top-full left-0 w-[480px] pt-2 z-50">
                  <div className="bg-white border border-neutral-200 rounded-2xl p-3.5 shadow-2xl shadow-neutral-900/10 grid grid-cols-2 gap-1">
                    <Link
                      href="/use-cases/healthcare"
                      className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="font-medium text-neutral-900 text-[15px]">Healthcare & Clinics</div>
                      <div className="text-[13px] text-neutral-500">Appointment booking & patient triage</div>
                    </Link>
                    <Link
                      href="/use-cases/real-estate"
                      className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="font-medium text-neutral-900 text-[15px]">Real Estate</div>
                      <div className="text-[13px] text-neutral-500">Buyer screening & showing dispatch</div>
                    </Link>
                    <Link
                      href="/use-cases/sales"
                      className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="font-medium text-neutral-900 text-[15px]">Sales & SDR</div>
                      <div className="text-[13px] text-neutral-500">Instant speed-to-lead & BANT qualifying</div>
                    </Link>
                    <Link
                      href="/use-cases/customer-support"
                      className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="font-medium text-neutral-900 text-[15px]">Customer Support</div>
                      <div className="text-[13px] text-neutral-500">Instant FAQ & order resolution</div>
                    </Link>
                    <Link
                      href="/use-cases/logistics"
                      className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="font-medium text-neutral-900 text-[15px]">Logistics & Supply</div>
                      <div className="text-[13px] text-neutral-500">Driver check-in calls & ETA updates</div>
                    </Link>
                    <Link
                      href="/customer-stories"
                      className="block p-2.5 rounded-xl hover:bg-neutral-100 transition-colors"
                    >
                      <div className="font-medium text-neutral-900 text-[15px]">Case Studies</div>
                      <div className="text-[13px] text-neutral-500">Enterprise ROI & success stories</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Agents */}
            <Link
              href="/ai-voice-agents"
              className="px-4 py-2 rounded-full text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
            >
              Agents
            </Link>

            {/* Pricing */}
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-full text-neutral-800 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Right CTAs */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0 ml-auto">
            {!loading && isAuthenticated ? (
              <Button
                size="sm"
                asChild
                className="bg-[#17171c] hover:bg-[#232329] text-white shadow-[0_4px_12px_-6px_rgba(0,0,0,0.35)] rounded-full font-medium px-5 h-10 text-[14px]"
              >
                <Link href="/dashboard/overview">
                  Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-10 rounded-full border-neutral-200 bg-white px-5 text-[14px] font-medium text-neutral-900 shadow-none hover:bg-neutral-50"
                >
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-[#17171c] hover:bg-[#232329] text-white shadow-[0_4px_12px_-6px_rgba(0,0,0,0.35)] rounded-full font-medium px-5 h-10 text-[14px]"
                >
                  <Link href="/workflow">
                    Start Free Trial
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              className="text-neutral-800 hover:bg-neutral-100"
            >
              {mobileMenuOpen ? <HugeiconsIcon icon={XIcon} className="w-5 h-5" /> : <HugeiconsIcon icon={Menu01Icon} className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-b border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              href="/ai-voice-agents"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-800 hover:bg-neutral-100"
            >
              AI Voice Agents
            </Link>
            <Link
              href="/ai-calling"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-800 hover:bg-neutral-100"
            >
              AI Calling Platform
            </Link>
            <Link
              href="/ai-voice-agents"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-800 hover:bg-neutral-100"
            >
              Voice Agents (Live Demos)
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-800 hover:bg-neutral-100"
            >
              Pricing & Plans
            </Link>
            {!loading && isAuthenticated && (
              <Link
                href="/workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-800 hover:bg-neutral-100"
              >
                Studio (Visual Canvas)
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-200 flex flex-col gap-2">
            {!loading && isAuthenticated ? (
              <Button asChild className="w-full bg-[#17171c] hover:bg-[#232329] text-white rounded-full">
                <Link href="/dashboard/overview" onClick={() => setMobileMenuOpen(false)}>
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full border-neutral-200 bg-white text-neutral-900 rounded-full">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button asChild className="w-full bg-[#17171c] hover:bg-[#232329] text-white rounded-full">
                  <Link href="/ai-voice-agents" onClick={() => setMobileMenuOpen(false)}>
                    Explore Voice Agents
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
