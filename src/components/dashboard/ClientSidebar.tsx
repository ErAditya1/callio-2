'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  BotIcon,
  ChartColumnIcon,
  CreditCardIcon,
  FileTextIcon,
  HeadphonesIcon,
  Home01Icon,
  Layers01Icon,
  LayoutDashboardIcon,
  Logout01Icon,
  Megaphone01Icon,
  PhoneCallIcon,
  RadioIcon,
  Search01Icon,
  Settings01Icon,
  SparklesIcon,
  UsersIcon,
} from "@hugeicons/core-free-icons";;
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BrandLogo } from '@/components/BrandLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ClientSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/dashboard/overview', icon: LayoutDashboardIcon },
    { name: 'Agents', href: '/dashboard/agents', icon: BotIcon, badge: 'Live' },
    { name: 'Calls & Logs', href: '/dashboard/calls', icon: PhoneCallIcon },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone01Icon },
    { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: BookOpen01Icon },
    { name: 'Voices', href: '/voices', icon: HeadphonesIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartColumnIcon },
    { name: 'Integrations', href: '/integrations', icon: Layers01Icon },
    { name: 'Settings01Icon', href: '/dashboard/settings', icon: Settings01Icon },
  ];

  return (
    <aside className="w-64 border-r border-[#E5E5E5] bg-[#FFFFFF]/70 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Logo lockup */}
        <div className="h-16 flex items-center px-6 border-b border-[#E5E5E5]">
          <Link href="/dashboard/overview" className="flex items-center gap-2">
            <BrandLogo />
          </Link>
        </div>

        {/* Quick Agent CTA */}
        <div className="p-4">
          <Button
            asChild
            className="w-full bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl shadow-md shadow-sm text-xs font-semibold h-10"
          >
            <Link href="/dashboard/agents/create">
              <HugeiconsIcon icon={SparklesIcon} className="w-3.5 h-3.5 mr-2" />
              + Create Agent
            </Link>
          </Button>
        </div>

        {/* Navigation list */}
        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-neutral-950 text-white shadow-sm shadow-sm'
                    : 'text-[#737373] hover:text-foreground hover:bg-[#F7F7F7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HugeiconsIcon icon={Icon} className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#737373]'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && !isActive && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-[#F0F3F9] text-[#7186AD] border-[#DCE3EF]">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile / Organization footer */}
      <div className="p-4 border-t border-[#E5E5E5] space-y-3">
        {/* Switch to Advanced Visual Flow Canvas */}
        <Link
          href="/workflow"
          className="flex items-center justify-between p-2.5 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] hover:bg-[#F7F7F7] text-[11px] font-medium text-[#737373] hover:text-foreground transition-colors group"
        >
          <span>Advanced Flow Editor</span>
          <span className="text-[#7186AD] group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center font-bold text-xs">
              AC
            </div>
            <div>
              <div className="text-xs font-bold text-foreground truncate max-w-[110px]">Acme Health</div>
              <div className="text-[10px] text-[#737373]">Business Plan</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-[#737373] hover:text-foreground">
            <Link href="/auth/login" title="Sign Out">
              <HugeiconsIcon icon={Logout01Icon} className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
