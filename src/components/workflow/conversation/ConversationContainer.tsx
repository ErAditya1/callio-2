"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  MessageSquareIcon,
  Mic01Icon,
  MicOff01Icon,
} from "@hugeicons/core-free-icons";;
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import type { ConversationStatus } from "./types";

interface ConversationContainerProps {
    title: string;
    status: ConversationStatus;
    children: ReactNode;
    messageCount?: number;
}

const STATUS_CONFIG = {
    ready: {
        icon: MicOff01Icon,
        label: "Ready",
        className: "bg-[#F7F7F7] text-[#737373]",
    },
    live: {
        icon: Mic01Icon,
        label: "Live",
        className: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    ended: {
        icon: MicOff01Icon,
        label: "Ended",
        className: "bg-[#F7F7F7] text-[#737373]",
    },
} satisfies Record<ConversationStatus, { icon: typeof Mic01Icon; label: string; className: string }>;

export function ConversationContainer({
    title,
    status,
    children,
    messageCount,
}: ConversationContainerProps) {
    const statusConfig = STATUS_CONFIG[status];
    const StatusIcon = statusConfig.icon;

    return (
        <div className="flex h-full min-h-0 w-full flex-col bg-background">
            <div className="shrink-0 border-b border-[#E5E5E5] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                        <HugeiconsIcon icon={MessageSquareIcon} className="h-4 w-4 shrink-0 text-[#737373]" />
                        <span className="truncate whitespace-nowrap text-sm font-medium">{title}</span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {messageCount !== undefined && messageCount > 0 ? (
                            <span className="text-xs text-[#737373]">{messageCount} messages</span>
                        ) : null}
                        <div
                            className={cn(
                                "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs",
                                statusConfig.className,
                            )}
                        >
                            <HugeiconsIcon icon={StatusIcon} className="h-3 w-3" />
                            <span>{statusConfig.label}</span>
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
}
