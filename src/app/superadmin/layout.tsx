"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Globe,
  Loader2,
  Menu,
  Radio,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { SuperadminSidebar, SUPERADMIN_NAV_ITEMS } from "@/components/superadmin/SuperadminSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsSuperuser } from "@/hooks/useIsSuperuser";

export default function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isSuperuser, isLoading: checkingSuperuser } = useIsSuperuser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active section title lookup
  const currentItem = SUPERADMIN_NAV_ITEMS.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );
  const activeTitle = currentItem?.title || "Operations Center";

  if (checkingSuperuser) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 p-8 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-xl shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Verifying superadmin permissions...
          </span>
        </div>
      </div>
    );
  }

  if (!isSuperuser) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-4 bg-background">
        <Card className="max-w-md border-border/80 shadow-2xl bg-card">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Access Restricted
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground pt-1">
              Superadmin privileges are required to view the administrative portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-xs text-muted-foreground leading-relaxed px-6 pb-6">
            Your account does not have root administrator access. Please return to
            your standard workspace overview.
          </CardContent>
          <div className="p-6 pt-0 flex flex-col gap-2">
            <Button
              asChild
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Link href="/overview">Return to Workspace Overview</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground antialiased selection:bg-indigo-500/20 selection:text-indigo-400">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:block">
        <SuperadminSidebar />
      </div>

      {/* Mobile Slide-over Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 max-w-[80vw] h-full bg-card shadow-2xl flex flex-col">
            <div className="p-3 flex justify-end border-b border-border/40">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SuperadminSidebar
              className="w-full h-full border-r-0"
              onNavigate={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Administrative Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="h-8 w-8 lg:hidden text-muted-foreground hover:text-foreground shrink-0"
            >
              <Menu className="h-4.5 w-4.5" />
            </Button>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium min-w-0">
              <Link
                href="/superadmin"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span className="hidden sm:inline">Platform</span> Operations
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              <span className="font-semibold text-foreground truncate">{activeTitle}</span>
            </div>
          </div>

          {/* Right Header Status Badges & Quick Action */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-medium text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Voice Cluster: Operational</span>
            </div>

            <Link href="/overview">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 border-border/60 hover:bg-muted/70 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Customer</span> Console
              </Button>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
