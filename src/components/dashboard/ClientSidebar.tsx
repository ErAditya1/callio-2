'use client';

import {
  BarChart3,
  BookOpen,
  Bot,
  CreditCard,
  FileText,
  Headphones,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  PhoneCall,
  Radio,
  Search,
  Settings,
  Sparkles,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BrandLogo } from '@/components/BrandLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ClientSidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Agents', href: '/dashboard/agents', icon: Bot, badge: 'Live' },
    { name: 'Calls & Logs', href: '/dashboard/calls', icon: PhoneCall },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
    { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: BookOpen },
    { name: 'Voices', href: '/voices', icon: Headphones },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Integrations', href: '/integrations', icon: Layers },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-border/70 bg-card/70 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Logo lockup */}
        <div className="h-16 flex items-center px-6 border-b border-border/60">
          <Link href="/dashboard/overview" className="flex items-center gap-2">
            <BrandLogo />
          </Link>
        </div>

        {/* Quick Agent CTA */}
        <div className="p-4">
          <Button
            asChild
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl shadow-md shadow-indigo-600/20 text-xs font-semibold h-10"
          >
            <Link href="/dashboard/agents/create">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
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
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && !isActive && (
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile / Organization footer */}
      <div className="p-4 border-t border-border/60 space-y-3">
        {/* Switch to Advanced Visual Flow Canvas */}
        <Link
          href="/workflow"
          className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span>Advanced Flow Editor</span>
          <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs">
              AC
            </div>
            <div>
              <div className="text-xs font-bold text-foreground truncate max-w-[110px]">Acme Health</div>
              <div className="text-[10px] text-muted-foreground">Business Plan</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Link href="/auth/login" title="Sign Out">
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
