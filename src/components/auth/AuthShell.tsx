"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Waves,
  PhoneCall,
  Bot,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

/* ─── Live Ticker Metrics ─────────────────────────────────────── */
const TICKER_METRICS = [
  { label: "Active Calls", value: "1,429", icon: PhoneCall, color: "text-cyan-400" },
  { label: "Avg Latency", value: "~320ms", icon: Zap, color: "text-yellow-400" },
  { label: "Answer Rate", value: "98.7%", icon: TrendingUp, color: "text-emerald-400" },
  { label: "Uptime SLA", value: "99.99%", icon: Clock, color: "text-violet-400" },
  { label: "Workspaces", value: "8,200+", icon: Users, color: "text-indigo-400" },
];

const HIGHLIGHTS = [
  { label: "Sub-350ms Turn Latency", icon: Zap },
  { label: "48kHz Neural HD Audio", icon: Waves },
  { label: "Instant Interruption Handling", icon: PhoneCall },
  { label: "Enterprise Carrier SLA 99.99%", icon: ShieldCheck },
];

const TESTIMONIAL = {
  quote: "CallioAI cut our sales call back-and-forth by 70%. Leads book meetings while we sleep.",
  author: "Priya Sharma",
  role: "Head of Growth, Freshpure India",
  initials: "PS",
};

/* ─── Animated Sound-Wave SVG ─────────────────────────────────── */
function SoundWave({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 28" className={className} aria-hidden fill="none">
      {[2, 10, 18, 26, 34, 42, 50, 58, 66, 74, 82, 90, 98, 106, 114].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={0}
          width={4}
          height={28}
          rx={2}
          style={{
            fill: `hsl(${230 + i * 8} 80% 70% / 0.8)`,
            animation: `wave-bar ${0.8 + (i % 5) * 0.15}s ease-in-out ${i * 0.06}s infinite alternate`,
            transformOrigin: `${x + 2}px 14px`,
          }}
        />
      ))}
    </svg>
  );
}

/* ─── Ticker Component ─────────────────────────────────────────── */
function MetricsTicker() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((p) => (p + 1) % TICKER_METRICS.length), 2800);
    return () => clearInterval(id);
  }, []);
  const m = TICKER_METRICS[active];
  const Icon = m.icon;
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
      <Icon className={`size-3.5 shrink-0 ${m.color}`} />
      <span className="text-[11px] font-medium text-zinc-300">{m.label}:</span>
      <span className={`text-[11px] font-bold ${m.color}`}>{m.value}</span>
    </div>
  );
}

/* ─── Floating Stat Card ───────────────────────────────────────── */
function StatCard({ label, value, delta, positive }: {
  label: string; value: string; delta: string; positive: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/12 bg-zinc-950/75 px-3.5 py-2.5 shadow-xl backdrop-blur-xl min-w-[120px]">
      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-white tracking-tight">{value}</p>
      <p className={`text-[10px] font-semibold ${positive ? "text-emerald-400" : "text-red-400"}`}>
        {delta} vs last week
      </p>
    </div>
  );
}

/* ─── Main AuthShell ──────────────────────────────────────────── */
export function AuthShell({
  children,
  enterpriseSlot,
}: {
  children: ReactNode;
  enterpriseSlot?: ReactNode;
}) {
  return (
    <>
      <style>{`
        @keyframes wave-bar {
          from { transform: scaleY(0.15); }
          to   { transform: scaleY(1); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        .float-card { animation: float-slow 5s ease-in-out infinite; }
        .float-card-delay { animation: float-slow 5s ease-in-out 2.5s infinite; }
        .glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
      `}</style>

      <div className="grid h-screen max-h-screen w-full overflow-hidden bg-white lg:grid-cols-[48%_52%] xl:grid-cols-[46%_54%]">

        {/* ── LEFT: Light Form Column ────────────────────────────── */}
        <main className="relative flex h-full flex-col justify-between overflow-y-auto bg-gradient-to-b from-white via-slate-50/60 to-indigo-50/40 p-5 sm:p-7 lg:p-8">

          {/* Subtle decorative blobs */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 -top-24 size-72 rounded-full bg-indigo-100/70 blur-[60px]" />
            <div className="absolute -bottom-12 right-0 size-48 rounded-full bg-violet-100/50 blur-[50px]" />
          </div>

          {/* Top bar */}
          <div className="relative flex items-center justify-between shrink-0">
            <BrandLogo className="h-7" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500 glow-pulse" />
              Live Cloud
            </span>
          </div>

          {/* Auth card */}
          <div className="relative my-auto flex items-center justify-center py-4">
            <div className="w-full max-w-[420px]">
              <div className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
                {/* Subtle top gradient line */}
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
                {children}
              </div>
            </div>
          </div>

          {/* Trust footer */}
          <div className="relative mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>256-Bit SSL · SOC2 Type II</span>
            </div>
            <span>© {new Date().getFullYear()} CallioAI Technologies</span>
          </div>
        </main>

        {/* ── RIGHT: Dark Brand Showcase Panel ─────────────────── */}
        <aside className="relative hidden h-full flex-col justify-between overflow-hidden border-l border-slate-100 lg:flex select-none">

          {/* Full-bleed background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/auth-bg-premium.jpg"
              alt="CallioAI Platform"
              fill
              priority
              sizes="54vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-[#09090b]/65" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/50 via-transparent to-[#09090b]/30" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col p-7 xl:p-9">

            {/* Top Header */}
            <div className="flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/20 shadow-lg shadow-indigo-500/20 backdrop-blur-md">
                  <Bot className="size-5 text-indigo-300" />
                </div>
                <span className="text-lg font-extrabold tracking-tight text-white">
                  CALLIO<span className="text-indigo-400">AI</span>
                </span>
              </div>
              <MetricsTicker />
            </div>

            {/* Middle floating cards */}
            <div className="relative flex-1 flex items-center justify-center pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 opacity-30">
                <SoundWave className="w-full" />
              </div>
              <div className="absolute top-[20%] left-[8%] float-card">
                <StatCard label="Avg Handle Time" value="2m 14s" delta="-18%" positive />
              </div>
              <div className="absolute top-[30%] right-[6%] float-card-delay">
                <StatCard label="Answer Rate" value="98.7%" delta="+3.2%" positive />
              </div>
              <div className="absolute bottom-[30%] left-[5%] float-card-delay">
                <StatCard label="Calls Today" value="12,480" delta="+24%" positive />
              </div>
            </div>

            {/* Bottom USP Card */}
            <div className="shrink-0 space-y-3 mt-auto">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                    <Sparkles className="size-3" />
                    <span>Autonomous Voice Intelligence</span>
                  </div>
                  <span className="rounded-md border border-indigo-400/25 bg-indigo-500/15 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                    Human-Grade
                  </span>
                </div>

                <h2 className="mt-2 text-xl font-bold tracking-tight text-white xl:text-2xl leading-snug">
                  Voice agents that converse<br />
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    like real humans.
                  </span>
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                  Automate customer calls, qualify inbound leads in 30s, and schedule visits — with natural, human-grade voice AI.
                </p>

                <div className="mt-3.5 grid grid-cols-2 gap-2">
                  {HIGHLIGHTS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 transition-colors hover:border-indigo-400/40 hover:bg-white/10"
                      >
                        <Icon className="size-3 text-indigo-400 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Testimonial */}
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[11px] font-bold text-white shadow-md">
                    {TESTIMONIAL.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] leading-relaxed text-zinc-300 italic">
                      &ldquo;{TESTIMONIAL.quote}&rdquo;
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-500">
                      {TESTIMONIAL.author} · {TESTIMONIAL.role}
                    </p>
                  </div>
                </div>

                {enterpriseSlot && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    {enterpriseSlot}
                  </div>
                )}
              </div>

              {/* Quick metrics bar */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-[11px] text-zinc-400 backdrop-blur-md">
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-indigo-400 glow-pulse" />
                  Opus HD 48kHz
                </span>
                <span className="text-zinc-700">·</span>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 glow-pulse" />
                  99.99% SLA
                </span>
                <span className="text-zinc-700">·</span>
                <span className="text-zinc-500">SOC2 Type II</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
