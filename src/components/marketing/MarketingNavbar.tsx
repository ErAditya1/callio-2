'use client';

import {
  Briefcase,
  Calendar,
  ChevronDown,
  Headphones,
  Home,
  Menu,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  Radio,
  Sparkles,
  Stethoscope,
  Truck,
  X
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BrandLogo } from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

export function MarketingNavbar() {
  const { isAuthenticated, loading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm shadow-black/5 py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <BrandLogo />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {/* Product Menu */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('product')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                Product
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'product' && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50">
                  <div className="bg-popover/95 backdrop-blur-xl border border-border/70 rounded-2xl p-3 shadow-2xl shadow-black/20 space-y-1">
                    <Link
                      href="/ai-voice-agents"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">AI Voice Agents</div>
                        <div className="text-xs text-muted-foreground">Autonomous agents for customer conversations</div>
                      </div>
                    </Link>
                    <Link
                      href="/ai-calling"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">AI Calling Platform</div>
                        <div className="text-xs text-muted-foreground">Automated inbound & outbound call workflows</div>
                      </div>
                    </Link>
                    <Link
                      href="/inbound-calls"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <PhoneIncoming className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">Inbound Calls</div>
                        <div className="text-xs text-muted-foreground">24/7 receptionist, smart triage & routing</div>
                      </div>
                    </Link>
                    <Link
                      href="/outbound-calls"
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <PhoneForwarded className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">Outbound Campaigns</div>
                        <div className="text-xs text-muted-foreground">Lead follow-ups, qualification & appointment booking</div>
                      </div>
                    </Link>

                    <div className="pt-2 mt-2 border-t border-border/50 grid grid-cols-2 gap-1">
                      <Link
                        href="/voices"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Radio className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Voice Marketplace</span>
                      </Link>
                      <Link
                        href="/ai-voice-agents"
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Try Live Agents</span>
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
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                Solutions
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'solutions' && (
                <div className="absolute top-full -left-12 w-[480px] pt-2 z-50">
                  <div className="bg-popover/95 backdrop-blur-xl border border-border/70 rounded-2xl p-4 shadow-2xl shadow-black/20 grid grid-cols-2 gap-2">
                    <Link
                      href="/use-cases/healthcare"
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <Stethoscope className="w-4 h-4 text-rose-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground text-sm">Healthcare & Clinics</div>
                        <div className="text-xs text-muted-foreground">Appointment booking & patient triage</div>
                      </div>
                    </Link>
                    <Link
                      href="/use-cases/real-estate"
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <Home className="w-4 h-4 text-amber-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground text-sm">Real Estate</div>
                        <div className="text-xs text-muted-foreground">Buyer screening & showing dispatch</div>
                      </div>
                    </Link>
                    <Link
                      href="/use-cases/sales"
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <Briefcase className="w-4 h-4 text-indigo-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground text-sm">Sales & SDR</div>
                        <div className="text-xs text-muted-foreground">Instant speed-to-lead & BANT qualifying</div>
                      </div>
                    </Link>
                    <Link
                      href="/use-cases/customer-support"
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <Headphones className="w-4 h-4 text-teal-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground text-sm">Customer Support</div>
                        <div className="text-xs text-muted-foreground">Instant FAQ & order resolution</div>
                      </div>
                    </Link>
                    <Link
                      href="/use-cases/logistics"
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <Truck className="w-4 h-4 text-orange-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground text-sm">Logistics & Supply</div>
                        <div className="text-xs text-muted-foreground">Driver check-in calls & ETA updates</div>
                      </div>
                    </Link>
                    <Link
                      href="/customer-stories"
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <Calendar className="w-4 h-4 text-sky-400 mt-0.5" />
                      <div>
                        <div className="font-medium text-foreground text-sm">Case Studies</div>
                        <div className="text-xs text-muted-foreground">Enterprise ROI & success stories</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Agents */}
            <Link
              href="/ai-voice-agents"
              className="px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Voice Agents</span>
            </Link>
          </div>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {!loading && isAuthenticated ? (
              <>

                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl font-medium px-4 h-9"
                >
                  <Link href="/overview">
                    Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-sm font-medium">
                  <Link href="/auth/login">Log in</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl font-medium px-4 h-9"
                >
                  <Link href="/ai-voice-agents">
                    Try Demo
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu hamburger toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border/80 bg-background/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              href="/ai-voice-agents"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
            >
              AI Voice Agents
            </Link>
            <Link
              href="/ai-calling"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted"
            >
              AI Calling Platform
            </Link>
            <Link
              href="/ai-voice-agents"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-emerald-400 hover:bg-muted"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Voice Agents (Live Demos)</span>
            </Link>
            {!loading && isAuthenticated && (
              <Link
                href="/workflow"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-indigo-400 hover:bg-muted"
              >
                Studio (Visual Canvas)
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {!loading && isAuthenticated ? (
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                <Link href="/overview" onClick={() => setMobileMenuOpen(false)}>
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                  <Link href="/ai-voice-agents" onClick={() => setMobileMenuOpen(false)}>
                    Explore Voice Agents
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
