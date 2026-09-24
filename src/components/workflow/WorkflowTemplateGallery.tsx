'use client';

import React, { useState, useEffect } from 'react';
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
} from "@hugeicons/core-free-icons";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export function WorkflowTemplateGallery() {
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const [cloningId, setCloningId] = useState<string | number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(false);
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
    { key: 'all', label: 'All' },
    { key: 'receptionist', label: 'Receptionist' },
    { key: 'sales', label: 'Sales & SDR' },
    { key: 'booking', label: 'Booking' },
    { key: 'support', label: 'Support' },
    { key: 'collection', label: 'Collections' },
  ];

  // Combine static and backend templates (backend templates first)
  const allTemplates: UnifiedTemplateItem[] = [
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
  ];

  const filteredTemplates = allTemplates.filter((tpl) => {
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
        router.push(`/workflow/${newWorkflowId}`);
      } else {
        // Clone from static template definition
        const result = await cloneTemplateToWorkspace(String(template.id), token);
        toast.success(`"${result.name}" cloned into your workspace!`);
        router.push(`/workflow/${result.id}`);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to clone template');
      setCloningId(null);
    }
  };

  return (
    <div className="mb-10 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[22px] font-bold text-foreground">
            Pre-Built Agent Templates
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setShowAll(true);
                }}
                className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all border ${
                  selectedCategory === cat.key
                    ? 'bg-neutral-950 text-white border-neutral-950 font-semibold shadow-xs dark:bg-white dark:text-neutral-950'
                    : 'bg-white hover:bg-neutral-50 text-[#737373] hover:text-foreground border-[#E5E5E5] dark:bg-card dark:border-border/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedTemplates.map((tpl) => {
          const isCloning = cloningId === tpl.id;
          return (
            <div
              key={tpl.id}
              className="rounded-2xl border border-border/70 bg-card/60 px-5 pb-5 pt-4 flex flex-col justify-between hover:border-indigo-500/40 hover:bg-card transition-all duration-200 space-y-4 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[20px] font-bold leading-[1.2] text-foreground">{tpl.name}</h3>
                  <HugeiconsIcon
                    icon={tpl.callType === 'inbound' ? PhoneIncomingIcon : tpl.callType === 'outbound' ? PhoneOutgoingIcon : Layers01Icon}
                    className="mt-1 size-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-wider font-mono border-border/70"
                  >
                    {tpl.callType === 'inbound'
                      ? 'Inbound'
                      : tpl.callType === 'outbound'
                        ? 'Outbound'
                        : 'Universal'}
                  </Badge>
                  {tpl.isBuiltinBackend && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    >
                      {tpl.badge || 'Platform Official'}
                    </Badge>
                  )}
                </div>

                <p className="mt-3 text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="pt-1">
                <Button
                  onClick={() => handleCloneTemplate(tpl)}
                  disabled={isCloning}
                  className="w-full h-8 text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 rounded-lg shadow-xs flex items-center justify-center gap-1.5"
                >
                  {isCloning ? (
                    <>
                      <HugeiconsIcon icon={Loading02Icon} className="w-3.5 h-3.5 animate-spin" />
                      Cloning into Workspace...
                    </>
                  ) : (
                    <>
                      <span>Use Template</span>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="w-3 h-3 ml-0.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length > 4 && (
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
