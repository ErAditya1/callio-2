"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  RefreshCwIcon,
  TriangleAlertIcon,
  XIcon,
} from "@hugeicons/core-free-icons";
import { usePathname } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAppConfig } from "@/context/AppConfigContext";
import { LeadFormsProvider } from "@/context/LeadFormsContext";

import { AppSidebar } from "./AppSidebar";
import { WalletBalanceBadge } from "./WalletBalanceBadge";

function AppHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
          className="h-8 w-8 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 md:hidden"
        >
          <HugeiconsIcon icon={Menu01Icon} className="h-4.5 w-4.5" />
        </Button>
        {/* Brand removed per user request — sidebar CALLIO wordmark is the only brand. */}
      </div>
      <div className="flex items-center gap-2.5 sm:gap-3">
        <WalletBalanceBadge />
      </div>
    </header>
  );
}

function BackendStatusBanner() {
  const { config, loading, refresh } = useAppConfig();
  const [dismissed, setDismissed] = useState(false);

  // Reset dismissal when backend status changes so a fresh outage re-surfaces.
  useEffect(() => {
    setDismissed(false);
  }, [config?.backendStatus]);

  if (!config || config.backendStatus === "reachable" || dismissed) {
    return null;
  }

  const backendUrl = config.backendUrl && config.backendUrl !== "unknown"
    ? config.backendUrl
    : "the configured backend";
  const message = config.backendMessage || `Backend is not reachable at ${backendUrl}.`;

  return (
    <div
      role="alert"
      className="relative border-b border-amber-300 bg-amber-50 px-4 py-2.5 text-amber-950"
    >
      <div className="flex items-center justify-center gap-3 pr-10">
        <HugeiconsIcon icon={TriangleAlertIcon} className="h-4 w-4 shrink-0" />
        <p className="truncate text-center text-[13px]">
          <span className="font-semibold">Backend connection failed — </span>
          <span>{message}</span>
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refresh()}
          disabled={loading}
          className="h-7 shrink-0 border-amber-400 bg-transparent px-2.5 text-xs text-amber-950 hover:bg-amber-100"
        >
          <HugeiconsIcon icon={RefreshCwIcon} className="h-3.5 w-3.5" />
          Retry
        </Button>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss backend notification"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-amber-900/70 hover:bg-amber-100 hover:text-amber-950"
      >
        <HugeiconsIcon icon={XIcon} className="h-4 w-4" />
      </button>
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
      <div className="site-light min-h-screen flex flex-col bg-background text-foreground selection:bg-neutral-900 selection:text-white">
        <MarketingNavbar />
        <main className="flex-1 bg-white pt-16 sm:pt-[72px]">
          {children}
        </main>
        <MarketingFooter />
      </div>
    );
  }


  // Superadmin routes use their own dedicated layout and sidebar
  if (pathname.startsWith("/superadmin")) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground">
        {children}
      </div>
    );
  }

  // Standalone pages render with zero console chrome — just the page itself.
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/handler") ||
    pathname.startsWith("/create-agent") ||
    pathname.startsWith("/payment") ||
    pathname.startsWith("/activation")
  ) {
    return <>{children}</>;
  }

  // Check if current route should have sidebar
  // Hide sidebar for /handler routes (Stack Auth routes) and /auth routes
  const shouldShowSidebar = !pathname.startsWith("/handler") && !pathname.startsWith("/auth");

  // Only match the exact editor page /workflow/<id>, not sub-routes like /workflow/<id>/runs
  const isWorkflowEditor = /^\/workflow\/\d+$/.test(pathname);

  // Always render SidebarProvider to keep the component tree shape consistent
  // across route changes (avoids React hooks ordering violations during navigation).
  // TooltipProvider must wrap any sidebar menu item that passes a `tooltip` prop.
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        {shouldShowSidebar ? (
          <LeadFormsProvider>
            <div className="flex min-h-screen w-full bg-sidebar">
              <AppSidebar />
              <SidebarInset className="flex-1 overflow-clip rounded-l-[16px] bg-background">
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
    </TooltipProvider>
  );
};

export default AppLayout;
