"use client";

import {
  AlertTriangle,
  AudioWaveform,
  BarChart3,
  Bot,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Database,
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  Megaphone,
  PhoneCall,
  Radio,
  Settings,
  ShieldCheck,
  Sliders,
  Sparkles,
  UserRound,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { SidebarTeamSwitcher } from "@/components/layout/SidebarTeamSwitcher";
import ThemeToggle from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppConfig } from "@/context/AppConfigContext";
import { useLeadForms } from "@/context/LeadFormsContext";
import { useTelephonyConfigWarnings } from "@/context/TelephonyConfigWarningsContext";
import { useIsSuperuser } from "@/hooks/useIsSuperuser";
import type { LocalUser } from "@/lib/auth";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type SidebarNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string;
  showsTelephonyWarning?: boolean;
  requiresSuperuser?: boolean;
};

type SidebarNavSection = {
  label?: string;
  items: SidebarNavItem[];
};

const TELEPHONY_WARNING_COPY = "Configuration required";

const NAV_SECTIONS: SidebarNavSection[] = [
  {
    items: [
      {
        title: "Overview",
        url: "/overview",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "VOICE STUDIO",
    items: [
      {
        title: "Voice Agents",
        url: "/workflow",
        icon: Bot,
      },
      {
        title: "Campaigns",
        url: "/campaigns",
        icon: Megaphone,
      },
      {
        title: "AI Models & Voices",
        url: "/model-configurations",
        icon: Sparkles,
      },
      {
        title: "Telephony & SIP",
        url: "/telephony-configurations",
        icon: PhoneCall,
        showsTelephonyWarning: true,
      },
      {
        title: "Tools & Actions",
        url: "/tools",
        icon: Zap,
      },
      {
        title: "Knowledge Files",
        url: "/files",
        icon: Database,
      },
      {
        title: "Call Recordings",
        url: "/recordings",
        icon: AudioWaveform,
      },
      {
        title: "Developer Keys",
        url: "/api-keys",
        icon: KeyRound,
      },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      {
        title: "Call Analytics",
        url: "/usage",
        icon: BarChart3,
      },
      {
        title: "Billing & Plans",
        url: "/billing",
        icon: CreditCard,
      },
      {
        title: "Reports & Logs",
        url: "/reports",
        icon: FileText,
      },
      {
        title: "Automations",
        url: "/automation",
        icon: Workflow,
      },
      {
        title: "Platform Admin",
        url: "/superadmin",
        icon: ShieldCheck,
        requiresSuperuser: true,
      },
      {
        title: "Workspace Settings",
        url: "/settings",
        icon: Sliders,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { provider, logout, user } = useAuth();
  const { isSuperuser } = useIsSuperuser();
  const { openHireExpert } = useLeadForms();
  const {
    telnyxMissingWebhookPublicKeyCount,
    vonageMissingSignatureSecretCount,
  } = useTelephonyConfigWarnings();
  const hasTelephonyWarning =
    telnyxMissingWebhookPublicKeyCount > 0 ||
    vonageMissingSignatureSecretCount > 0;
  const isCollapsed = !isMobile && state === "collapsed";

  const filteredNavSections = React.useMemo(() => {
    return NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.requiresSuperuser || isSuperuser),
    })).filter((section) => section.items.length > 0);
  }, [isSuperuser]);

  const isActive = (path: string) => pathname.startsWith(path);

  const handleMobileNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const SidebarLink = ({ item }: { item: SidebarNavItem }) => {
    const isItemActive = isActive(item.url);
    const Icon = item.icon;
    const showWarningDot = item.showsTelephonyWarning && hasTelephonyWarning;

    const tooltip = {
      children: (
        <div className="notranslate" translate="no">
          <p className="font-medium">{item.title}</p>
          {showWarningDot && (
            <p className="text-amber-500 font-normal text-xs">{TELEPHONY_WARNING_COPY}</p>
          )}
        </div>
      ),
    };

    const warningIndicator = (
      <AlertTriangle
        aria-label="Action required on a telephony configuration"
        className={cn(
          "text-amber-500 shrink-0",
          isCollapsed ? "absolute -right-0.5 -top-0.5 h-3 w-3 animate-pulse" : "ml-auto h-3.5 w-3.5"
        )}
      />
    );

    return (
      <SidebarMenuButton
        asChild
        tooltip={tooltip}
        className={cn(
          "relative group/btn rounded-lg px-3 py-2 h-9 transition-all duration-150",
          "hover:bg-accent/60 hover:text-foreground",
          isItemActive && [
            "bg-indigo-500/10 dark:bg-indigo-500/15 text-foreground font-semibold",
            "border border-indigo-500/20 dark:border-indigo-400/25",
            "dark:text-white",
          ]
        )}
      >
        <Link
          href={item.url}
          onClick={handleMobileNavClick}
          className={cn("flex items-center gap-3 w-full relative", isCollapsed && "justify-center")}
          translate="no"
        >
          {/* Active Accent Indicator */}
          {isItemActive && !isCollapsed && (
            <span
              className="absolute -left-2.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-600 shadow-[0_0_8px_rgba(99,102,241,0.7)]"
              aria-hidden
            />
          )}

          <Icon
            className={cn(
              "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover/btn:scale-110",
              isItemActive
                ? "text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                : "text-muted-foreground group-hover/btn:text-foreground"
            )}
          />

          <span
            className={cn(
              "notranslate min-w-0 flex-1 truncate text-sm font-medium leading-normal",
              isCollapsed && "sr-only"
            )}
            translate="no"
          >
            {item.title}
          </span>

          {showWarningDot && (
            isCollapsed ? (
              warningIndicator
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  {warningIndicator}
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{TELEPHONY_WARNING_COPY}</p>
                </TooltipContent>
              </Tooltip>
            )
          )}
        </Link>
      </SidebarMenuButton>
    );
  };

  // User details
  const displayIdentity =
    user?.displayName ||
    (user as { primaryEmail?: string } | undefined)?.primaryEmail ||
    (user as LocalUser | undefined)?.email ||
    "User";

  const userInitials =
    displayIdentity
      .split(/[\s@]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s: string) => s[0]?.toUpperCase())
      .join("") || "AI";

  const userEmail =
    (user as LocalUser | undefined)?.email ||
    (user as { primaryEmail?: string } | undefined)?.primaryEmail ||
    "";

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r border-border/60 bg-sidebar/95 backdrop-blur-md">
      {/* Sidebar Header */}
      <SidebarHeader className="px-3 py-3 border-b border-border/50 notranslate" translate="no">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-2.5", isCollapsed && "hidden")}>
            <Link
              href="/overview"
              className="notranslate flex items-center gap-2.5 px-1 group"
              translate="no"
            >
              <div className="relative flex items-center justify-center">
                <BrandLogo mark className="h-7 w-7 rounded-xl shadow-md shadow-indigo-500/25 ring-1 ring-indigo-500/30 transition-transform duration-200 group-hover:scale-105" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-tight text-foreground">
                    Callio<span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">AI</span>
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/15 to-violet-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/25">
                    Pro
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-normal tracking-tight mt-0.5">
                  Voice Calling SaaS
                </span>
              </div>
            </Link>
          </div>

          {/* Brand Mark & Sidebar Trigger */}
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-1.5 mx-auto my-1">
              <Link href="/overview">
                <BrandLogo mark className="h-7 w-7 rounded-xl shadow-md shadow-indigo-500/25 ring-1 ring-indigo-500/30" />
              </Link>
              <SidebarTrigger className="hover:bg-accent rounded-lg h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="Expand Sidebar">
                <ChevronRight className="h-4 w-4" />
              </SidebarTrigger>
            </div>
          ) : (
            <SidebarTrigger className="hover:bg-accent rounded-lg h-7 w-7">
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </SidebarTrigger>
          )}
        </div>

        {provider === "stack" && (
          <div className={cn("mt-3 notranslate", isCollapsed && "hidden")} translate="no">
            <SidebarTeamSwitcher />
          </div>
        )}
      </SidebarHeader>

      {/* Navigation Groups */}
      <SidebarContent className={cn("notranslate px-1.5 space-y-1", isCollapsed && "px-0")} translate="no">
        {filteredNavSections.map((section, index) => (
          <SidebarGroup
            key={section.label ?? "overview"}
            className={index === 0 ? "mt-1" : "mt-4"}
          >
            {section.label && (
              <SidebarGroupLabel
                className={cn(
                  "notranslate text-xs font-semibold uppercase tracking-wider text-muted-foreground/75 px-3 py-1.5",
                  isCollapsed && "hidden"
                )}
                translate="no"
              >
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu className="gap-1">
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarLink item={item} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter
        className={cn("p-2.5 border-t border-border/50 notranslate space-y-2", isCollapsed && "p-1.5")}
        translate="no"
      >
        {/* User Profile & Actions Shell */}
        <div
          className={cn(
            "rounded-xl border border-border/60 bg-card/60 dark:bg-muted/15 p-1.5 shadow-2xs backdrop-blur-sm",
            isCollapsed && "flex flex-col items-center gap-1 p-1"
          )}
        >
          <div className={cn("flex items-center justify-between gap-1", isCollapsed && "flex-col")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg p-1 text-left transition-colors hover:bg-accent/60 outline-none w-full",
                    isCollapsed && "justify-center p-0.5"
                  )}
                >
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-[1.5px] shadow-sm">
                    <div className="h-full w-full rounded-full bg-background dark:bg-slate-950 flex items-center justify-center">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{userInitials}</span>
                    </div>
                  </div>
                  {!isCollapsed && (
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground leading-tight">{displayIdentity}</p>
                      {userEmail && (
                        <p className="truncate text-xs text-muted-foreground mt-0.5">{userEmail}</p>
                      )}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align={isCollapsed ? "start" : "center"} className="w-56 rounded-xl p-1.5 shadow-xl border-border/80">
                <DropdownMenuLabel className="font-normal px-2 py-1.5">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-xs font-semibold text-foreground">{displayIdentity}</p>
                    {userEmail && (
                      <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {provider === "stack" && (
                  <DropdownMenuItem onClick={() => router.push("/handler/account-settings")} className="cursor-pointer text-xs rounded-lg">
                    <Settings className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    Account Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer text-xs rounded-lg">
                  <Sliders className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  Workspace Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-xs text-rose-600 dark:text-rose-400 rounded-lg">
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Actions */}
            <div className={cn("flex items-center gap-1", isCollapsed && "flex-col")}>
              {/* Hire an Expert CTA */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-indigo-500 hover:bg-indigo-500/10 transition-colors"
                    onClick={() => openHireExpert("sidebar")}
                    aria-label="Expert Support"
                  >
                    <UserRound className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expert Support & Consulting</p>
                </TooltipContent>
              </Tooltip>

              {/* Theme Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ThemeToggle
                      showLabel={false}
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side={isCollapsed ? "right" : "top"}>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
