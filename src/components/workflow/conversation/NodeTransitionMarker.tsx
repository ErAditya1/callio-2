"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  GitBranchIcon,
} from "@hugeicons/core-free-icons";;

interface NodeTransitionMarkerProps {
    nodeName: string;
}

export function NodeTransitionMarker({ nodeName }: NodeTransitionMarkerProps) {
    return (
        <div className="flex items-center gap-2 py-2">
            <div className="h-px flex-1 bg-border" />
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE3EF] bg-[#F0F3F9] px-3 py-1 text-xs">
                <HugeiconsIcon icon={GitBranchIcon} className="h-3 w-3 text-[#7186AD]" />
                <span className="font-medium text-blue-700 dark:text-[#7186AD]">{nodeName}</span>
            </div>
            <div className="h-px flex-1 bg-border" />
        </div>
    );
}
