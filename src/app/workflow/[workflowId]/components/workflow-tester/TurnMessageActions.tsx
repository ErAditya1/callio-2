"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Loading02Icon,
  PencilIcon,
  RotateCcwIcon,
} from "@hugeicons/core-free-icons";;

import { cn } from "@/lib/utils";

interface TurnMessageActionsProps {
    disabled: boolean;
    editing: boolean;
    rewinding: boolean;
    rerunningEdit: boolean;
    onRewind: () => void;
    onEdit: () => void;
}

export function TurnMessageActions({
    disabled,
    editing,
    rewinding,
    rerunningEdit,
    onRewind,
    onEdit,
}: TurnMessageActionsProps) {
    return (
        <>
            <button
                type="button"
                onClick={onRewind}
                disabled={disabled}
                aria-label="Rerun this turn"
                title="Rerun this turn"
                className="inline-flex h-6 w-6 items-center justify-center rounded text-[#737373] hover:bg-[#F7F7F7] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
                {rewinding ? (
                    <HugeiconsIcon icon={Loading02Icon} className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <HugeiconsIcon icon={RotateCcwIcon} className="h-3.5 w-3.5" />
                )}
            </button>
            <button
                type="button"
                onClick={onEdit}
                disabled={disabled}
                aria-label="Edit and rerun this turn"
                title="Edit and rerun this turn"
                className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded text-[#737373] hover:bg-[#F7F7F7] hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50",
                    editing && "bg-[#F7F7F7] text-foreground",
                )}
            >
                {rerunningEdit ? (
                    <HugeiconsIcon icon={Loading02Icon} className="h-3.5 w-3.5 animate-spin" />
                ) : (
                    <HugeiconsIcon icon={PencilIcon} className="h-3.5 w-3.5" />
                )}
            </button>
        </>
    );
}
