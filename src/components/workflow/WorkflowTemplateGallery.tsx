'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ChevronRightIcon,
  Layers01Icon,
  Loading02Icon,
  PhoneIncomingIcon,
  PhoneOutgoingIcon,
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
                    ? 'bg-neutral-950 text-white border-neutral-950 font-semibold shadow-xs'
                    : 'bg-white hover:bg-neutral-50 text-[#737373] hover:text-foreground border-[#E5E5E5]'
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
              className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF]/50 px-5 pb-5 pt-4 flex flex-col justify-between hover:border-[#E5E5E5] hover:bg-[#FFFFFF] transition-all duration-200 space-y-4 shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[22px] font-bold leading-[1.2] text-foreground">{tpl.name}</h3>
                  <HugeiconsIcon
                    icon={tpl.callType === 'inbound' ? PhoneIncomingIcon : tpl.callType === 'outbound' ? PhoneOutgoingIcon : Layers01Icon}
                    className="mt-1 size-5 shrink-0 text-neutral-700"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-wider font-mono border-[#E5E5E5]"
                  >
                    {tpl.callType === 'inbound'
                      ? 'Inbound'
                      : tpl.callType === 'outbound'
                        ? 'Outbound'
                        : 'Universal'}
                  </Badge>
                </div>

                <p className="mt-3 text-[14px] text-[#737373] line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="pt-1">
                <Button
                  onClick={() => handleCloneTemplate(tpl)}
                  disabled={isCloning}
                  className="w-full h-8 text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 text-white rounded-md shadow-xs flex items-center justify-center gap-1.5"
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
            className="text-xs text-[#737373] hover:text-foreground flex items-center gap-1"
          >
            {showAll ? 'Show Fewer' : `View All (${filteredTemplates.length}) Templates`}
            <HugeiconsIcon icon={ChevronRightIcon} className={`w-3.5 h-3.5 transition-transform ${showAll ? '-rotate-90' : 'rotate-90'}`} />
          </Button>
        </div>
      )}
    </div>
  );
}

