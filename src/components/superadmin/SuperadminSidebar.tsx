"use client";

import {
  Activity,
  ArrowLeft,
  Banknote,
  DollarSign,
  Key,
  Layers,
  List,
  LogOut,
  Phone,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export interface SuperadminNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  exact?: boolean;
}

export const SUPERADMIN_NAV_ITEMS: SuperadminNavItem[] = [
  {
    title: "Overview & Fleet",
    href: "/superadmin",
    icon: Activity,
    exact: true,
    description: "System health & active calls",
  },
  {
    title: "Master API Keys",
    href: "/superadmin/keys",
    icon: Key,
    description: "LLM, STT, TTS master credentials",
  },
  {
    title: "Telephony Inventory",
    href: "/superadmin/telephony",
    icon: Phone,
    description: "Inbound numbers pool & carriers",
  },
  {
    title: "Wallets & Credits",
    href: "/superadmin/wallets",
    icon: DollarSign,
    description: "Customer balances & credit grants",
  },
  {
    title: "Plans & Enterprise Tiers",
    href: "/superadmin/plans",
    icon: Layers,
    description: "SaaS tiers & custom concurrency limits",
  },
  {
    title: "Currency & Taxes",
    href: "/superadmin/rates",
    icon: Banknote,
    description: "USD to INR exchange rate & GST",
  },
  {
    title: "Showcase Agents",
    href: "/superadmin/showcase",
    icon: Sparkles,
    description: "Public directory voice agents",
  },
  {
    title: "Global Run Logs",
    href: "/superadmin/runs",
    icon: List,
    badge: "Live",
    description: "All tenant call executions",
  },
  {
    title: "Account Impersonation",
    href: "/superadmin/impersonation",
    icon: UserCheck,
    description: "Test as any tenant organization",
  },
];

interface SuperadminSidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function SuperadminSidebar({ className = "", onNavigate }: SuperadminSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isLinkActive = (item: SuperadminNavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <aside
      className={`w-64 flex-shrink-0 flex flex-col bg-card/70 dark:bg-card/40 border-r border-border/70 backdrop-blur-xl h-screen sticky top-0 z-30 select-none ${className}`}
    >
      {/* Top Brand & Superadmin Title */}
      <div className="p-4 border-b border-border/60 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Link
            href="/superadmin"
            className="flex items-center gap-2.5 group"
            onClick={onNavigate}
          >
            <BrandLogo mark className="h-7 w-7" />
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
                Callio AI
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Operations Center
              </span>
            </div>
          </Link>
          <Badge
            variant="outline"
            className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[10px] font-mono px-1.5 py-0.5"
          >
            SUPERADMIN
          </Badge>
        </div>

        {/* Exit back to workspace button */}
        <Link href="/overview" className="block w-full" onClick={onNavigate}>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between h-8 text-xs bg-background/50 hover:bg-muted/80 border-border/60 text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              Customer Workspace
            </span>
            <span className="text-[10px] text-muted-foreground/80 font-mono">/overview</span>
          </Button>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        <div className="px-2.5 pb-1.5 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
          Platform Management
        </div>

        {SUPERADMIN_NAV_ITEMS.map((item) => {
          const active = isLinkActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                active
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    active
                      ? "text-indigo-400"
                      : "text-muted-foreground/70 group-hover:text-foreground"
                  }`}
                />
                <span className="truncate">{item.title}</span>
              </div>

              {item.badge && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 px-1.5 h-4 bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-border/60 bg-muted/20">
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-background/60 border border-border/50">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium truncate text-foreground">
                {(user as { email?: string; primaryEmail?: string } | undefined)?.email ||
                  (user as { email?: string; primaryEmail?: string } | undefined)?.primaryEmail ||
                  "Superadmin"}
              </span>
              <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Root Authorized
              </span>
            </div>
          </div>

          <Link href="/overview" title="Return to Customer App" onClick={onNavigate}>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
