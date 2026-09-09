'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Loader2,
  PhoneIncoming,
  PhoneOutgoing,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import {
  WORKFLOW_TEMPLATES,
  WorkflowTemplate,
  cloneTemplateToWorkspace,
} from '@/config/workflowTemplates';
import { toast } from 'sonner';

export function WorkflowTemplateGallery() {
  const router = useRouter();
  const { getAccessToken } = useAuth();
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(false);

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'receptionist', label: 'Receptionist' },
    { key: 'sales', label: 'Sales & SDR' },
    { key: 'booking', label: 'Booking' },
    { key: 'support', label: 'Support' },
    { key: 'collection', label: 'Collections' },
  ];

  const filteredTemplates = WORKFLOW_TEMPLATES.filter((tpl) => {
    if (selectedCategory === 'all') return true;
    return tpl.category === selectedCategory;
  });

  const displayedTemplates = showAll ? filteredTemplates : filteredTemplates.slice(0, 4);

  const handleCloneTemplate = async (template: WorkflowTemplate) => {
    if (cloningId) return;
    setCloningId(template.id);

    try {
      const token = await getAccessToken();
      const result = await cloneTemplateToWorkspace(template.id, token);
      toast.success(`"${result.name}" cloned into your workspace!`);
      router.push(`/workflow/${result.id}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to clone template');
      setCloningId(null);
    }
  };

  return (
    <div className="mb-10 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Pre-Built Agent Templates
          </h2>
          <p className="text-xs text-muted-foreground">
            Pick a ready-made agent template and clone it into your workspace with 1-click.
          </p>
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
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-foreground text-background font-semibold shadow-xs'
                    : 'bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground border border-border/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <Badge variant="outline" className="text-xs text-muted-foreground hidden lg:inline-flex">
            {WORKFLOW_TEMPLATES.length} Available
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedTemplates.map((tpl) => {
          const isCloning = cloningId === tpl.id;
          return (
            <div
              key={tpl.id}
              className="rounded-2xl border border-border/70 bg-card/50 p-5 flex flex-col justify-between hover:border-border hover:bg-card/90 transition-all duration-200 space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{tpl.emoji}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-wider font-mono flex items-center gap-1 border-border/70"
                  >
                    {tpl.callType === 'inbound' ? (
                      <>
                        <PhoneIncoming className="w-2.5 h-2.5 text-blue-400" />
                        Inbound
                      </>
                    ) : tpl.callType === 'outbound' ? (
                      <>
                        <PhoneOutgoing className="w-2.5 h-2.5 text-purple-400" />
                        Outbound
                      </>
                    ) : (
                      <>
                        <Layers className="w-2.5 h-2.5 text-emerald-400" />
                        Universal
                      </>
                    )}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground">{tpl.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  {tpl.capabilities.slice(0, 3).map((cap, i) => (
                    <div
                      key={i}
                      className="text-[11px] text-muted-foreground flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border/40">
                <Button
                  onClick={() => handleCloneTemplate(tpl)}
                  disabled={isCloning}
                  className="w-full h-8 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                >
                  {isCloning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Cloning into Workspace...
                    </>
                  ) : (
                    <>
                      <span>Use Template</span>
                      <ArrowRight className="w-3 h-3 ml-0.5" />
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
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAll ? '-rotate-90' : 'rotate-90'}`} />
          </Button>
        </div>
      )}
    </div>
  );
}

