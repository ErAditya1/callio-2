'use client';

import React, { useState } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Layers01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { WorkflowTemplateGallery } from './WorkflowTemplateGallery';

interface WorkflowTemplateSheetProps {
  buttonVariant?: "default" | "outline" | "secondary" | "ghost";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function WorkflowTemplateSheet({
  buttonVariant = "outline",
  buttonSize = "default",
  className = "",
}: WorkflowTemplateSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={`flex items-center gap-2 border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/50 shadow-xs transition-all duration-200 font-medium ${className}`}
        >
          <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4 text-indigo-500 animate-pulse" />
          <span>Browse Templates</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl overflow-y-auto p-0 bg-background border-l border-border flex flex-col"
      >
        <SheetHeader className="px-6 py-5 border-b border-border/80 sticky top-0 bg-background/95 backdrop-blur-md z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shadow-xs">
                <HugeiconsIcon icon={SparklesIcon} className="w-5 h-5" />
              </div>
              <div>
                <SheetTitle className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                  Pre-Built AI Agent Templates
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                  Browse and import pre-configured voice agents directly into your workspace.
                </SheetDescription>
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="p-6 flex-1">
          <WorkflowTemplateGallery isInsideSheet={true} onClose={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
