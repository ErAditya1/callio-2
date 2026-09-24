"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AudioWaveformIcon,
  BotIcon,
  ChartColumnIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  Database01Icon,
  FileTextIcon,
  Home01Icon,
  KeyRoundIcon,
  Logout01Icon,
  Megaphone01Icon,
  PhoneCallIcon,
  Settings01Icon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TriangleAlertIcon,
  UserRoundIcon,
  WorkflowIcon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { SidebarTeamSwitcher } from "@/components/layout/SidebarTeamSwitcher";
// PARKED (2026-09-20): dark-mode toggle removed — app is light-only.
// import ThemeToggle from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarSeparator,
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
  icon: IconSvgElement;
  badge?: string;
  showsTelephonyWarning?: boolean;
  requiresSuperuser?: boolean;
};

type SidebarNavSection = {
  id: string;
  label: string;
  items: SidebarNavItem[];
};

const TELEPHONY_WARNING_COPY = "Configuration required";

const TOP_NAV_ITEMS: SidebarNavItem[] = [
  {
    title: "Home",
    url: "/dashboard/overview",
    icon: Home01Icon,
  },
  {
    title: "Voice Agents",
    url: "/workflow",
    icon: BotIcon,
  },
  {
    title: "Campaigns",
    url: "/campaigns",
    icon: Megaphone01Icon,
  },
];

const COLLAPSIBLE_NAV_SECTIONS: SidebarNavSection[] = [
  {
    id: "ai-voice",
    label: "AI & Voice",
    items: [
      {
        title: "AI Models & Voices",
        url: "/model-configurations",
        icon: SparklesIcon,
      },
      {
        title: "Telephony & SIP",
        url: "/telephony-configurations",
        icon: PhoneCallIcon,
        showsTelephonyWarning: true,
      },
      {
        title: "Tools & Actions",
        url: "/tools",
        icon: ZapIcon,
      },
      {
        title: "Knowledge Base",
        url: "/files",
        icon: Database01Icon,
      },
      {
        title: "Recordings",
        url: "/recordings",
        icon: AudioWaveformIcon,
      },
      {
        title: "Call Analysis",
        url: "/usage",
        icon: ChartColumnIcon,
      },
    ],
  },
  {
    id: "finance-reporting",
    label: "Finance & Reporting",
    items: [
      {
        title: "Billing & Plans",
        url: "/billing",
        icon: CreditCardIcon,
      },
      {
        title: "Reports & Logs",
        url: "/reports",
        icon: FileTextIcon,
      },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    items: [
      {
        title: "Automations",
        url: "/automation",
        icon: WorkflowIcon,
      },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      {
        title: "Platform AI Callers",
        url: "/superadmin/ai-callers",
        icon: BotIcon,
        badge: "Platform",
        requiresSuperuser: true,
      },
      {
        title: "Platform Admin",
        url: "/superadmin",
        icon: ShieldCheckIcon,
        requiresSuperuser: true,
      },
      {
        title: "Workspace Settings",
        url: "/settings",
        icon: SlidersHorizontalIcon,
      },
      {
        title: "Developer Keys",
        url: "/api-keys",
        icon: KeyRoundIcon,
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

  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    "ai-voice": true,
    "finance-reporting": true,
    "automation": true,
    "administration": true,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const filteredTopNavItems = React.useMemo(() => {
    return TOP_NAV_ITEMS.filter((item) => !item.requiresSuperuser || isSuperuser);
  }, [isSuperuser]);

  const filteredCollapsibleSections = React.useMemo(() => {
    return COLLAPSIBLE_NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.requiresSuperuser || isSuperuser),
    })).filter((section) => section.items.length > 0);
  }, [isSuperuser]);

  const isActive = (path: string) => {
    if (path === "/dashboard/overview" && pathname === "/dashboard") {
      return true;
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Automatically keep a section open if an item within it is active
  React.useEffect(() => {
    filteredCollapsibleSections.forEach((section) => {
      const hasActiveChild = section.items.some((item) => isActive(item.url));
      if (hasActiveChild) {
        setOpenSections((prev) => {
          if (prev[section.id] === false) {
            return { ...prev, [section.id]: true };
          }
          return prev;
        });
      }
    });
  }, [pathname, filteredCollapsibleSections]);

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
      <HugeiconsIcon icon={TriangleAlertIcon}
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
            "bg-[#F0F3F9] text-[#171717] font-semibold",
            "border border-[#DCE3EF]",
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
              className="absolute -left-2.5 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#7186AD]"
              aria-hidden
            />
          )}

          <HugeiconsIcon icon={Icon}
            className={cn(
              "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover/btn:scale-110",
              isItemActive
                ? "text-[#7186AD]"
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
    <Sidebar collapsible="icon" variant="sidebar" className="bg-sidebar backdrop-blur-md border-0">
      {/* Sidebar Header */}
      <SidebarHeader className="px-3 pt-4 pb-6 notranslate" translate="no">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center gap-2.5", isCollapsed && "hidden")}>
            <Link
              href="/dashboard/overview"
              className="notranslate flex items-center pr-1 pl-3.5"
              translate="no"
              aria-label="Callio home"
            >
              <span className="text-[15px] font-bold tracking-[0.18em] text-[#0b0b0e]">
                CALLIO
              </span>
            </Link>
          </div>

          {/* Brand Mark & Sidebar Trigger */}
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-1.5 mx-auto my-1">
              <Link href="/dashboard/overview" aria-label="Callio home">
                <span className="text-[15px] font-bold tracking-[0.1em] text-[#0b0b0e]">
                  C
                </span>
              </Link>
              <SidebarTrigger className="hover:bg-accent rounded-lg h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="Expand Sidebar">
                <HugeiconsIcon icon={ChevronRightIcon} className="h-4 w-4" />
              </SidebarTrigger>
            </div>
          ) : (
            <SidebarTrigger className="hover:bg-accent rounded-lg h-7 w-7">
              <HugeiconsIcon icon={ChevronLeftIcon} className="h-4 w-4 text-muted-foreground" />
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
        {/* Top Direct Navigation Items */}
        <SidebarGroup className="py-0 mt-1">
          <SidebarMenu className="gap-1">
            {filteredTopNavItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarLink item={item} />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Divider */}
        <div className={cn("px-2 py-1.5", isCollapsed && "px-1")}>
          <SidebarSeparator className="bg-border/60" />
        </div>

        {/* Collapsible Sections */}
        {filteredCollapsibleSections.map((section) => {
          const isOpen = isCollapsed ? true : (openSections[section.id] ?? true);

          return (
            <Collapsible
              key={section.id}
              open={isOpen}
              onOpenChange={() => toggleSection(section.id)}
              className="group/collapsible"
            >
              <SidebarGroup className="py-0 mt-2">
                {!isCollapsed && (
                  <SidebarGroupLabel asChild className="h-7 px-1">
                    <CollapsibleTrigger
                      className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground/75 hover:text-foreground hover:bg-accent/40 transition-colors select-none group/trigger cursor-pointer"
                    >
                      <span className="truncate">{section.label}</span>
                      <HugeiconsIcon
                        icon={ChevronDownIcon}
                        className={cn(
                          "h-3.5 w-3.5 text-muted-foreground/60 group-hover/trigger:text-foreground transition-transform duration-200",
                          !isOpen && "-rotate-90"
                        )}
                      />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                )}

                <CollapsibleContent className="transition-all">
                  <SidebarMenu className="gap-1 pt-0.5">
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarLink item={item} />
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
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
                  <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-900 p-[1.5px] shadow-sm">
                    <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                      <span className="text-xs font-bold text-neutral-900">{userInitials}</span>
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
                    <HugeiconsIcon icon={Settings01Icon} className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                    Account Settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer text-xs rounded-lg">
                  <HugeiconsIcon icon={SlidersHorizontalIcon} className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                  Workspace Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-xs text-neutral-700 rounded-lg">
                  <HugeiconsIcon icon={Logout01Icon} className="mr-2 h-3.5 w-3.5" />
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
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-neutral-900 hover:bg-neutral-950/5 transition-colors"
                    onClick={() => openHireExpert("sidebar")}
                    aria-label="Expert Support"
                  >
                    <HugeiconsIcon icon={UserRoundIcon} className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expert Support & Consulting</p>
                </TooltipContent>
              </Tooltip>

              {/* PARKED (2026-09-20): Theme Toggle removed — light-only mode. Restore with ThemeSwitcher. */}
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
