'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ChevronRightIcon,
  Layers01Icon,
  Loading02Icon,
  PhoneIncomingIcon,
  PhoneOutgoingIcon,
  SparklesIcon,
  Search01Icon,
  XIcon,
} from "@hugeicons/core-free-icons";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import {
  WORKFLOW_TEMPLATES,
  WorkflowTemplate,
  cloneTemplateToWorkspace,
} from '@/config/workflowTemplates';
import { toast } from 'sonner';

interface UnifiedTemplateItem {
  id: string | number;
  name: string;
  description: string;
  category: string;
  callType: 'inbound' | 'outbound' | 'both';
  badge?: string;
  isBuiltinBackend?: boolean;
  rawStaticTemplate?: WorkflowTemplate;
}

interface WorkflowTemplateGalleryProps {
  isInsideSheet?: boolean;
  onClose?: () => void;
}

export function WorkflowTemplateGallery({ isInsideSheet = false, onClose }: WorkflowTemplateGalleryProps) {
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const [cloningId, setCloningId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(isInsideSheet);
  const [builtinTemplates, setBuiltinTemplates] = useState<UnifiedTemplateItem[]>([]);
  const [loadingBuiltin, setLoadingBuiltin] = useState(false);

  // Fetch dynamic built-in callers from Superadmin API
  useEffect(() => {
    let isMounted = true;
    const fetchBuiltinAgents = async () => {
      try {
        setLoadingBuiltin(true);
        const res = await fetch('/api/v1/workflow/builtin', {
          cache: 'no-store',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && isMounted) {
            const mapped: UnifiedTemplateItem[] = data.map((b: any) => ({
              id: b.id,
              name: b.name,
              description: b.description || 'Verified platform AI caller for automated voice outreach.',
              category: (b.category || 'sales').toLowerCase(),
              callType: b.call_type === 'inbound' ? 'inbound' : 'outbound',
              badge: b.badge || 'Official Template',
              isBuiltinBackend: true,
            }));
            setBuiltinTemplates(mapped);
          }
        }
      } catch {
        // Fallback silently to static templates
      } finally {
        if (isMounted) setLoadingBuiltin(false);
      }
    };
    fetchBuiltinAgents();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { key: 'all', label: 'All Categories' },
    { key: 'receptionist', label: 'Receptionist' },
    { key: 'sales', label: 'Sales & SDR' },
    { key: 'booking', label: 'Booking' },
    { key: 'support', label: 'Support' },
    { key: 'collection', label: 'Collections' },
  ];

  // Combine static and backend templates (backend templates first)
  const allTemplates: UnifiedTemplateItem[] = useMemo(() => [
    ...builtinTemplates,
    ...WORKFLOW_TEMPLATES.map((tpl) => ({
      id: tpl.id,
      name: tpl.name,
      description: tpl.description,
      category: tpl.category,
      callType: tpl.callType,
      isBuiltinBackend: false,
      rawStaticTemplate: tpl,
    })),
  ], [builtinTemplates]);

  // Filter templates by search query and selected category
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((tpl) => {
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = tpl.name.toLowerCase().includes(query);
        const matchesDesc = tpl.description.toLowerCase().includes(query);
        const matchesCategory = tpl.category.toLowerCase().includes(query);
        const matchesType = tpl.callType.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesType) {
          return false;
        }
      }

      // Category filter match
      if (selectedCategory === 'all') return true;
      const cat = tpl.category.toLowerCase();
      if (selectedCategory === 'sales') {
        return cat.includes('sale') || cat.includes('sdr') || cat.includes('lead') || cat.includes('estate');
      }
      if (selectedCategory === 'support') {
        return cat.includes('support') || cat.includes('customer');
      }
      return cat.includes(selectedCategory);
    });
  }, [allTemplates, searchQuery, selectedCategory]);

  // Count templates for each category pill based on current search query
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    categories.forEach(c => { counts[c.key] = 0; });

    allTemplates.forEach((tpl) => {
      // Check search match first
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = tpl.name.toLowerCase().includes(query);
        const matchesDesc = tpl.description.toLowerCase().includes(query);
        const matchesCategory = tpl.category.toLowerCase().includes(query);
        const matchesType = tpl.callType.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesType) {
          return;
        }
      }

      counts['all'] += 1;
      const cat = tpl.category.toLowerCase();

      if (cat.includes('receptionist')) counts['receptionist'] = (counts['receptionist'] || 0) + 1;
      if (cat.includes('sale') || cat.includes('sdr') || cat.includes('lead') || cat.includes('estate')) {
        counts['sales'] = (counts['sales'] || 0) + 1;
      }
      if (cat.includes('booking')) counts['booking'] = (counts['booking'] || 0) + 1;
      if (cat.includes('support') || cat.includes('customer')) counts['support'] = (counts['support'] || 0) + 1;
      if (cat.includes('collection')) counts['collection'] = (counts['collection'] || 0) + 1;
    });

    return counts;
  }, [allTemplates, searchQuery]);

  const displayedTemplates = showAll ? filteredTemplates : filteredTemplates.slice(0, 4);

  const handleCloneTemplate = async (template: UnifiedTemplateItem) => {
    if (cloningId) return;
    setCloningId(template.id);

    try {
      const token = await getAccessToken();

      if (template.isBuiltinBackend) {
        // Clone from backend built-in agent
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/v1/workflow/builtin/${template.id}/import`, {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({ name: `${template.name} - Agent` }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.detail || 'Failed to import platform agent into workspace');
        }

        const data = await res.json();
        const newWorkflowId = data.workflow_id || data.id;
        toast.success(`"${template.name}" cloned into your workspace!`);
        if (onClose) onClose();
        router.push(`/workflow/${newWorkflowId}`);
      } else {
        // Clone from static template definition
        const result = await cloneTemplateToWorkspace(String(template.id), token);
        toast.success(`"${result.name}" cloned into your workspace!`);
        if (onClose) onClose();
        router.push(`/workflow/${result.id}`);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to clone template');
      setCloningId(null);
    }
  };

  return (
    <div className={`space-y-6 ${isInsideSheet ? '' : 'mb-10'}`}>
      {/* Header section if outside sheet */}
      {!isInsideSheet && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-[22px] font-bold text-foreground">
              Pre-Built Agent Templates
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Launch pre-configured voice workflows with a single click.
            </p>
          </div>
        </div>
      )}

      {/* Control Bar: Search Input & Category Pills */}
      <div className="space-y-4">
        {/* Search Bar Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
            <HugeiconsIcon icon={Search01Icon} className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by name, category, or workflow purpose..."
            className="pl-10 pr-10 h-10 w-full bg-card border-border/80 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-xl text-sm transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <HugeiconsIcon icon={XIcon} className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Chips with Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const count = categoryCounts[cat.key] ?? 0;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setShowAll(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border shrink-0 flex items-center gap-1.5 ${isSelected
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs dark:bg-white dark:text-neutral-950 font-semibold'
                  : 'bg-card hover:bg-neutral-100 dark:hover:bg-neutral-800/60 text-muted-foreground hover:text-foreground border-border/70'
                  }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected
                    ? 'bg-white/20 text-white dark:bg-black/20 dark:text-neutral-950'
                    : 'bg-muted/70 text-muted-foreground'
                    }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Templates */}
      {displayedTemplates.length > 0 ? (
        <div className={`grid gap-4 ${isInsideSheet ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
          {displayedTemplates.map((tpl) => {
            const isCloning = cloningId === tpl.id;
            return (
              <div
                key={tpl.id}
                className="group relative rounded-2xl border border-border/70 bg-card/80 p-5 flex flex-col justify-between hover:border-indigo-500/40 hover:bg-card hover:shadow-md transition-all duration-200 space-y-4"
              >
                <div>
                  {/* Top Bar: Title & Call Type Icon */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold leading-snug text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tpl.name}
                    </h3>
                    <div className="p-1.5 rounded-lg bg-muted/60 text-muted-foreground shrink-0">
                      <HugeiconsIcon
                        icon={tpl.callType === 'inbound' ? PhoneIncomingIcon : tpl.callType === 'outbound' ? PhoneOutgoingIcon : Layers01Icon}
                        className="w-4 h-4"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="text-[10px] uppercase tracking-wider font-mono border-border/80 px-2 py-0.5 bg-muted/30"
                    >
                      {tpl.callType === 'inbound'
                        ? 'Inbound'
                        : tpl.callType === 'outbound'
                          ? 'Outbound'
                          : 'Universal'}
                    </Badge>

                    {tpl.isBuiltinBackend ? (
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-medium bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-2 py-0.5"
                      >
                        {tpl.badge || 'Verified Agent'}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-medium bg-neutral-500/10 text-neutral-500 border border-neutral-500/20 px-2 py-0.5 capitalize"
                      >
                        {tpl.category}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                {/* Footer Action Button */}
                <div className="pt-2 border-t border-border/40">
                  <Button
                    onClick={() => handleCloneTemplate(tpl)}
                    disabled={isCloning}
                    className="w-full h-9 text-xs font-semibold bg-neutral-900 hover:bg-indigo-600 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-indigo-500 dark:hover:text-white rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                  >
                    {isCloning ? (
                      <>
                        <HugeiconsIcon icon={Loading02Icon} className="w-3.5 h-3.5 animate-spin" />
                        <span>Cloning Template...</span>
                      </>
                    ) : (
                      <>
                        <span>Use Template</span>
                        <HugeiconsIcon icon={ArrowRight01Icon} className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-border/80 bg-card/40 flex flex-col items-center justify-center">
          <div className="p-3 rounded-2xl bg-muted/60 text-muted-foreground mb-3">
            <HugeiconsIcon icon={Search01Icon} className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">No matching templates found</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            We couldn't find any templates matching "{searchQuery}". Try searching with another term or reset your filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 text-xs h-8 rounded-lg"
          >
            Clear Search & Filters
          </Button>
        </div>
      )}

      {/* Show All / Collapse toggle button if outside sheet */}
      {!isInsideSheet && filteredTemplates.length > 4 && (
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            {showAll ? 'Show Fewer' : `View All (${filteredTemplates.length}) Templates`}
            <HugeiconsIcon icon={ChevronRightIcon} className={`w-3.5 h-3.5 transition-transform ${showAll ? '-rotate-90' : 'rotate-90'}`} />
          </Button>
        </div>
      )}
    </div>
  );
}
