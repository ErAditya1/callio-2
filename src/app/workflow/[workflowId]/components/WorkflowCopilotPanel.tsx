"use client";

import React, { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BotIcon,
  CheckmarkCircle02Icon,
  CirclePlusIcon,
  NetworkIcon,
  PhoneCallIcon,
  RefreshCwIcon,
  SendIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  UserIcon,
  XIcon,
} from "@hugeicons/core-free-icons";;
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
    modifiedNodeIds?: string[];
}

interface WorkflowCopilotPanelProps {
    workflowId: number;
    nodes: any[];
    edges: any[];
    onApplyChanges: (newNodes: any[], newEdges: any[]) => void;
    onTriggerTestCall: () => void;
    onClose: () => void;
}

export function WorkflowCopilotPanel({
    workflowId,
    nodes,
    edges,
    onApplyChanges,
    onTriggerTestCall,
    onClose,
}: WorkflowCopilotPanelProps) {
    const { getAccessToken } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: "assistant",
            content: "Namaste! I am your Canvas AI Copilot. Tell me what changes or additions you'd like to make to your workflow nodes, greeting, or routing.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [quickReplies, setQuickReplies] = useState<string[]>([
        "Update start greeting",
        "Add a verification node",
        "Make tone more empathetic",
        "Run Test Call",
    ]);

    const chatScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatScrollRef.current) {
            chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (textToSend?: string) => {
        const query = (textToSend || input).trim();
        if (!query || isLoading) return;

        if (query.toLowerCase() === "run test call") {
            onTriggerTestCall();
            return;
        }

        const newMessages: ChatMessage[] = [
            ...messages,
            { role: "user", content: query },
        ];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const token = await getAccessToken();
            const res = await fetch(`/api/v1/workflow/${workflowId}/copilot/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    messages: newMessages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                    current_nodes: nodes,
                    current_edges: edges,
                }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || "Failed to process copilot command");
            }

            const data = await res.json();

            // 1. Append assistant response
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.assistant_message,
                    modifiedNodeIds: data.modified_node_ids,
                },
            ]);

            // 2. Apply updated graph to ReactFlow canvas
            if (data.workflow_definition?.nodes) {
                onApplyChanges(
                    data.workflow_definition.nodes,
                    data.workflow_definition.edges || []
                );
            }

            // 3. Update quick reply chips
            if (data.suggested_quick_replies?.length) {
                setQuickReplies(data.suggested_quick_replies);
            }

            // 4. Trigger test call if requested by AI
            if (data.trigger_test_call) {
                onTriggerTestCall();
            }
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `Sorry, I encountered an issue: ${err.message}`,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#FFFFFF] backdrop-blur-md border-l border-[#E5E5E5] select-text">
            {/* Panel Header */}
            <div className="px-4 py-3.5 border-b border-[#E5E5E5] flex items-center justify-between bg-[#F7F7F7]">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center shadow-sm">
                        <HugeiconsIcon icon={SparklesIcon} className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold leading-none">Canvas Copilot</h3>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-primary border-primary/30">
                                Live MCP
                            </Badge>
                        </div>
                        <p className="text-[11px] text-[#737373] mt-0.5">
                            Real-time AI node & prompt control
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 text-[#737373] hover:text-foreground"
                >
                    <HugeiconsIcon icon={XIcon} className="w-4 h-4" />
                </Button>
            </div>

            {/* Messages Chat Feed */}
            <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 text-xs"
            >
                {messages.map((m, idx) => {
                    const isUser = m.role === "user";
                    return (
                        <div
                            key={idx}
                            className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                        >
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                    isUser
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-[#F7F7F7] border border-[#E5E5E5] text-foreground"
                                }`}
                            >
                                {isUser ? <HugeiconsIcon icon={UserIcon} className="w-3.5 h-3.5" /> : <HugeiconsIcon icon={BotIcon} className="w-3.5 h-3.5 text-primary" />}
                            </div>

                            <div
                                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                                    isUser
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-[#F7F7F7] text-foreground border border-[#E5E5E5] rounded-tl-none"
                                }`}
                            >
                                <p className="whitespace-pre-wrap">{m.content}</p>

                                {/* Badges if nodes were modified */}
                                {m.modifiedNodeIds && m.modifiedNodeIds.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-[#E5E5E5] flex flex-wrap gap-1.5 items-center">
                                        <span className="text-[10px] text-[#737373] flex items-center gap-1 font-medium">
                                            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-3 h-3 text-[#7186AD]" />
                                            Canvas updated:
                                        </span>
                                        {m.modifiedNodeIds.map((nid) => (
                                            <Badge
                                                key={nid}
                                                variant="secondary"
                                                className="text-[10px] px-1.5 py-0 font-mono bg-background/80"
                                            >
                                                {nid}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {isLoading && (
                    <div className="flex gap-2.5 items-center">
                        <div className="w-7 h-7 rounded-full bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center shrink-0">
                            <HugeiconsIcon icon={BotIcon} className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl px-3.5 py-2 flex items-center gap-2 text-[#737373] text-xs">
                            <HugeiconsIcon icon={RefreshCwIcon} className="w-3.5 h-3.5 animate-spin text-primary" />
                            Executing canvas actions...
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Action Chips */}
            <div className="px-3 py-2 border-t border-[#E5E5E5] bg-[#F7F7F7]">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {quickReplies.map((chip, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSendMessage(chip)}
                            disabled={isLoading}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#E5E5E5] bg-background hover:bg-accent text-[#737373] hover:text-foreground transition-all shrink-0 flex items-center gap-1 shadow-xs"
                        >
                            {chip.includes("Test") && <HugeiconsIcon icon={PhoneCallIcon} className="w-3 h-3 text-[#7186AD]" />}
                            {chip.includes("Add") && <HugeiconsIcon icon={CirclePlusIcon} className="w-3 h-3 text-[#7186AD]" />}
                            {chip.includes("Update") && <HugeiconsIcon icon={SlidersHorizontalIcon} className="w-3 h-3 text-amber-500" />}
                            {chip}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-[#E5E5E5] bg-background">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Instruct Copilot (e.g. Update greeting, add node)..."
                        disabled={isLoading}
                        className="flex-1 text-xs bg-[#F7F7F7] border border-[#E5E5E5] rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-[#737373]"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="h-8 w-8 shrink-0 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <HugeiconsIcon icon={SendIcon} className="w-3.5 h-3.5" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
