"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  BrainIcon,
} from "@hugeicons/core-free-icons";;

import { cn } from "@/lib/utils";

interface MessageBubbleProps {
    role: "user" | "assistant";
    text: string;
    final?: boolean;
    tone?: "default" | "muted";
    reasoningDurationMs?: number;
    containerClassName?: string;
}

export function MessageBubble({
    role,
    text,
    final = true,
    tone = "default",
    reasoningDurationMs,
    containerClassName,
}: MessageBubbleProps) {
    const isUser = role === "user";
    const isMuted = tone === "muted";

    return (
        <div className={cn("flex", isUser ? "justify-end" : "justify-start", containerClassName)}>
            <div className="flex max-w-[85%] flex-col gap-1">
                {!isUser && reasoningDurationMs !== undefined ? (
                    <div className="flex items-center gap-1.5 px-1 text-xs text-[#737373]">
                        <HugeiconsIcon icon={BrainIcon} className="h-3 w-3" />
                        <span className="font-medium">Reasoning Delay:</span>
                        <span>{Math.round(reasoningDurationMs)}ms</span>
                    </div>
                ) : null}
                <div
                    className={cn(
                        "whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                        isUser
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : isMuted
                                ? "rounded-bl-md border border-dashed border-[#E5E5E5] bg-background text-[#737373]"
                                : "rounded-bl-md border border-slate-200/80 bg-[#F7F7F7] text-foreground",
                        !final && "opacity-70",
                    )}
                >
                    <div>{text}</div>
                    {!final ? (
                        <div
                            className={cn(
                                "mt-1 text-[10px] italic",
                                isUser ? "text-primary-foreground/70" : "text-[#737373]",
                            )}
                        >
                            speaking...
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
