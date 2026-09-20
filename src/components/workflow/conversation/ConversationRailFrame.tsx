"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ConversationRailFrameProps {
    children: ReactNode;
    className?: string;
    header?: ReactNode;
    footer?: ReactNode;
}

export function ConversationRailFrame({
    children,
    className,
    header,
    footer,
}: ConversationRailFrameProps) {
    return (
        <div
            className={cn(
                "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] shadow-sm",
                className,
            )}
        >
            {header ? <div className="shrink-0 border-b border-[#E5E5E5] px-4 py-3">{header}</div> : null}
            <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
            {footer ? <div className="shrink-0 border-t border-[#E5E5E5] px-4 py-3">{footer}</div> : null}
        </div>
    );
}
