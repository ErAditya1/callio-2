"use client";

import { AlertTriangle, Menu, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import React, { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { PostHogEvent } from "@/constants/posthog-events";
import { useAppConfig } from "@/context/AppConfigContext";
import { LeadFormsProvider } from "@/context/LeadFormsContext";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";

import { BrandLogo } from "@/components/BrandLogo";
import { AppSidebar } from "./AppSidebar";

function AppHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Open menu" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/overview" className="flex items-center gap-2.5">
          <BrandLogo mark className="h-6" />
          <span className="font-semibold text-sm tracking-tight hidden sm:inline text-foreground">Callio AI</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Console</span>
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground border border-border/50 rounded-full px-3 py-1 bg-muted/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Callio Voice Core: Online</span>
        </div>
        <Button size="sm" asChild className="h-8 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">
          <Link href="/workflow">
            + Agent Studio
          </Link>
        </Button>
      </div>
    </header>
  );
}

function BackendStatusBanner() {
  const { config, loading, refresh } = useAppConfig();

  if (!config || config.backendStatus === "reachable") {
    return null;
  }

  const backendUrl = config.backendUrl && config.backendUrl !== "unknown"
    ? config.backendUrl
    : "the configured backend";
  const message = config.backendMessage || `Backend is not reachable at ${backendUrl}.`;

  return (
    <div
      role="alert"
      className="border-b border-amber-300 bg-amber-50 px-4 py-3 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">Backend connection failed</p>
            <p className="break-words text-sm">{message}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refresh()}
          disabled={loading}
          className="h-8 shrink-0 border-amber-400 bg-transparent text-amber-950 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-100 dark:hover:bg-amber-900/40"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    </div>
  );
}

interface AppLayoutProps {
  children: ReactNode;
  headerActions?: ReactNode;
  stickyTabs?: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  headerActions,
  stickyTabs,
}) => {
  const pathname = usePathname();

  // Detect public marketing and demo pages
  const isMarketingPage =
    pathname === "/" ||
    pathname.startsWith("/ai-") ||
    pathname.startsWith("/inbound") ||
    pathname.startsWith("/outbound") ||
    pathname.startsWith("/voices") ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/use-cases") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/integrations") ||
    pathname.startsWith("/customer-stories") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/resources") ||
    pathname.startsWith("/blog") ||
    pathname.startsWith("/faq") ||
    pathname.startsWith("/legal") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/cookies") ||
    pathname.startsWith("/status");

  if (isMarketingPage) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-indigo-500/20 selection:text-indigo-400">
        <MarketingNavbar />
        <main className="flex-1 pt-16 sm:pt-20">
          {children}
        </main>
        <MarketingFooter />
      </div>
    );
  }


  // Check if current route should have sidebar
  // Hide sidebar for /handler routes (Stack Auth routes) and /auth routes
  const shouldShowSidebar = !pathname.startsWith("/handler") && !pathname.startsWith("/auth");

  // Only match the exact editor page /workflow/<id>, not sub-routes like /workflow/<id>/runs
  const isWorkflowEditor = /^\/workflow\/\d+$/.test(pathname);

  // Always render SidebarProvider to keep the component tree shape consistent
  // across route changes (avoids React hooks ordering violations during navigation).
  return (
    <SidebarProvider defaultOpen>
      {shouldShowSidebar ? (
        <LeadFormsProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex-1">
              <BackendStatusBanner />
              {!isWorkflowEditor && <AppHeader />}
              {/* Optional header area for specific pages */}
              {headerActions && (
                <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/55">
                  <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-center">
                      {headerActions}
                    </div>
                  </div>
                </header>
              )}

              {/* Optional sticky tabs */}
              {stickyTabs && (
                <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
                  <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center py-2">
                      {stickyTabs}
                    </div>
                  </div>
                </div>
              )}

              {/* Main content area */}
              <main className="app-surface flex-1">
                {children}
              </main>
            </SidebarInset>
          </div>
        </LeadFormsProvider>
      ) : (
        <div className="app-surface w-full flex-1">
          <BackendStatusBanner />
          {children}
        </div>
      )}
    </SidebarProvider>
  );
};

export default AppLayout;
