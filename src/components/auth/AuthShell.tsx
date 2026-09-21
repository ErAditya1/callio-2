import type { ReactNode } from "react";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Headphones,
  Activity,
  Waves,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

const HIGHLIGHTS = [
  { label: "Sub-350ms Turn-Taking", icon: Zap },
  { label: "48kHz Neural Audio", icon: Waves },
  { label: "Multi-LLM BYOK", icon: Sparkles },
  { label: "SOC2 Type II Certified", icon: ShieldCheck },
];

export function AuthShell({
  children,
  enterpriseSlot,
}: {
  children: ReactNode;
  enterpriseSlot?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full bg-background lg:grid-cols-[50%_50%] xl:grid-cols-[48%_52%]">
      {/* Form column (LEFT) — Clean, centered, elegant backdrop */}
      <main className="auth-imprint relative flex min-h-screen flex-col justify-between overflow-y-auto bg-gradient-to-b from-background via-background to-muted/20 p-6 sm:p-10 lg:p-12">
        {/* Subtle decorative glow at top-left */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-indigo-500/10 blur-3xl"
        />

        {/* Top bar for mobile / header */}
        <div className="relative flex items-center justify-between">
          <div className="lg:hidden">
            <BrandLogo className="h-8" />
          </div>
          <div className="hidden lg:block">
            <BrandLogo className="h-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-xs">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Cloud
          </span>
        </div>

        {/* Centered Auth Card */}
        <div className="relative my-auto flex items-center justify-center py-8">
          <div className="w-full max-w-[430px] rounded-3xl border border-border/80 bg-card/90 p-7 shadow-2xl shadow-indigo-500/5 backdrop-blur-xl transition-all sm:p-9">
            {children}
          </div>
        </div>

        {/* Trust Footer */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground/80">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>Enterprise-Grade 256-Bit SSL Encryption</span>
          </div>
          <span>&copy; {new Date().getFullYear()} CallioAI Technologies</span>
        </div>
      </main>

      {/* Brand / Value Showcase Panel (RIGHT) — High-tech Voice AI aesthetic */}
      <aside className="relative hidden flex-col justify-between overflow-hidden border-l border-white/[0.08] bg-gradient-to-br from-zinc-950 via-[#0a0f1d] to-zinc-950 p-10 text-white lg:flex xl:p-14">
        {/* Ambient mesh glow effects */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-10 size-[32rem] rounded-full bg-indigo-600/20 blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-24 size-[26rem] rounded-full bg-violet-600/15 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-1/3 top-1/2 size-72 rounded-full bg-cyan-500/10 blur-[90px]"
        />

        {/* Subtle grid pattern overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Panel Header */}
        <div className="relative flex items-center justify-between">
          <BrandLogo inverse className="h-8" />
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Autonomous Engine v2.4</span>
          </div>
        </div>

        {/* Middle Hero & Simulation Section */}
        <div className="relative my-auto space-y-8 py-8">
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Sparkles className="size-3.5 text-indigo-400" />
              Autonomous Voice Intelligence
            </div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white xl:text-4xl">
              Voice agents that converse like real humans.
            </h1>
            <p className="text-base font-normal leading-relaxed text-zinc-400">
              Deliver sub-350ms conversational latency, instant interruption handling, and continuous workflow actions across any phone carrier.
            </p>
          </div>

          {/* Feature Highlights Badges */}
          <div className="grid grid-cols-2 gap-2.5">
            {HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-zinc-300 backdrop-blur-xs transition-colors hover:border-indigo-500/40 hover:bg-white/[0.06]"
                >
                  <Icon className="size-3.5 shrink-0 text-indigo-400" />
                  <span className="truncate">{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* Interactive Voice AI Simulation Card */}
          <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/30">
                  <Headphones className="size-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-zinc-950 bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">Sophia (AI Receptionist)</span>
                    <span className="rounded-md bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300">
                      Inbound
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Connected to PSTN &bull; 01:24</p>
                </div>
              </div>

              {/* Pulsing audio status */}
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <Activity className="size-3.5 animate-pulse" />
                <span>280ms</span>
              </div>
            </div>

            {/* Audio Waveform Equalizer Simulation */}
            <div className="my-4 flex items-center justify-center gap-1.5 h-10 px-2 rounded-xl bg-black/40 border border-white/5">
              {[0.4, 0.7, 1.0, 0.6, 0.9, 0.3, 0.8, 1.0, 0.5, 0.7, 0.4, 0.9, 0.6, 0.3, 0.8, 0.5].map((scale, i) => (
                <span
                  key={i}
                  className="animate-soundwave w-1 rounded-full bg-gradient-to-t from-indigo-500 via-indigo-400 to-violet-300"
                  style={{
                    height: `${Math.round(scale * 30)}px`,
                    animationDelay: `${(i * 0.08).toFixed(2)}s`,
                  }}
                />
              ))}
            </div>

            {/* Realtime Live Transcript Preview */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-xs leading-relaxed text-zinc-300 italic">
                &ldquo;I have successfully reserved your demo slot for Thursday at 2:00 PM EST and synced it with your team&apos;s calendar.&rdquo;
              </p>
            </div>

            {/* Live Metrics Footnote */}
            <div className="mt-3.5 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-indigo-400" />
                Audio: Opus HD 48kHz
              </span>
              <span className="text-zinc-500">&bull;</span>
              <span>Turn Taking: Zero overlap</span>
              <span className="text-zinc-500">&bull;</span>
              <span className="text-emerald-400 font-medium">Sentiment: Positive (98%)</span>
            </div>
          </div>

          {/* Social Proof Numbers */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="space-y-0.5">
              <div className="text-2xl font-black tracking-tight text-white xl:text-3xl">50M+</div>
              <div className="text-xs text-zinc-400">Minutes Processed</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-black tracking-tight text-white xl:text-3xl">99.99%</div>
              <div className="text-xs text-zinc-400">Carrier Uptime SLA</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-black tracking-tight text-white xl:text-3xl">&lt;350ms</div>
              <div className="text-xs text-zinc-400">Turn Latency</div>
            </div>
          </div>
        </div>

        {/* Enterprise CTA Block */}
        <div className="relative max-w-lg space-y-3 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-white/[0.02] p-5 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-100">
              Dedicated VPC &amp; On-Premises Air-Gapped?
            </h2>
            <span className="rounded-md border border-indigo-400/30 bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
              Enterprise
            </span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            Deploy CallioAI inside your private cloud or on-prem environment with sovereign data security and custom SIP trunking.
          </p>
          {enterpriseSlot}
        </div>
      </aside>
    </div>
  );
}

