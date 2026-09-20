"use client";

import { ReactFlowInstance } from "@xyflow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  BotIcon,
  ClipboardIcon,
  Copy01Icon,
  Download01Icon,
  EyeIcon,
  HistoryIcon,
  Loading02Icon,
  Menu01Icon,
  MoreVerticalIcon,
  PencilIcon,
  PhoneIcon,
  Rocket01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";;
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import {
    duplicateWorkflowEndpointApiV1WorkflowWorkflowIdDuplicatePost,
    publishWorkflowApiV1WorkflowWorkflowIdPublishPost,
} from "@/client/sdk.gen";
import { WorkflowError } from "@/client/types.gen";
import { FlowEdge, FlowNode } from "@/components/flow/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { copyTextToClipboard } from "@/lib/clipboard";

interface WorkflowEditorHeaderProps {
    workflowName: string;
    isDirty: boolean;
    workflowValidationErrors: WorkflowError[];
    rfInstance: React.RefObject<ReactFlowInstance<FlowNode, FlowEdge> | null>;
    workflowId: number;
    workflowUuid?: string;
    saveWorkflow: (updateWorkflowDefinition?: boolean) => Promise<void>;
    user: { id: string; email?: string };
    onPhoneCallClick: () => void;
    onTestAgentClick: () => void;
    onHistoryClick: () => void;
    activeVersionLabel?: string;
    isViewingHistoricalVersion: boolean;
    onBackToDraft: () => void;
    hasDraft: boolean;
    onPublished: () => void;
    renameWorkflow: (newName: string) => Promise<void>;
    onCopilotClick?: () => void;
    isCopilotOpen?: boolean;
}

export const WorkflowEditorHeader = ({
    workflowName,
    isDirty,
    workflowValidationErrors,
    rfInstance,
    saveWorkflow,
    onPhoneCallClick,
    onTestAgentClick,
    onHistoryClick,
    activeVersionLabel,
    isViewingHistoricalVersion,
    onBackToDraft,
    hasDraft,
    onPublished,
    workflowId,
    workflowUuid,
    user,
    renameWorkflow,
    onCopilotClick,
    isCopilotOpen,
}: WorkflowEditorHeaderProps) => {
    const router = useRouter();
    const { toggleSidebar } = useSidebar();
    const [savingWorkflow, setSavingWorkflow] = useState(false);
    const [duplicating, setDuplicating] = useState(false);
    const [publishing, setPublishing] = useState(false);
    // One discriminated-union state instead of (isEditingName, nameDraft,
    // nameError, isRenaming): they're not independent — error and saving are
    // mutually exclusive, and both are meaningless in the display state. The
    // union makes the bad combinations unrepresentable and structurally
    // prevents the Enter→disable-input→blur→re-fire race.
    type RenameState =
        | { kind: "display" }
        | { kind: "editing"; draft: string; error: string | null }
        | { kind: "saving"; draft: string };
    const [rename, setRename] = useState<RenameState>({ kind: "display" });
    const nameInputRef = useRef<HTMLInputElement>(null);
    const renameButtonRef = useRef<HTMLButtonElement>(null);

    const hasValidationErrors = workflowValidationErrors.length > 0;
    const isCallDisabled = isDirty || hasValidationErrors;

    const handleSave = async () => {
        setSavingWorkflow(true);
        await saveWorkflow();
        setSavingWorkflow(false);
    };

    const handlePublish = async () => {
        if (publishing) return;
        setPublishing(true);
        const promise = publishWorkflowApiV1WorkflowWorkflowIdPublishPost({
            path: { workflow_id: workflowId },
        });
        toast.promise(promise, {
            loading: "Publishing...",
            success: "Workflow published successfully",
            error: "Failed to publish workflow",
        });
        try {
            await promise;
            onPublished();
        } finally {
            setPublishing(false);
        }
    };

    const handleBack = () => {
        router.push("/workflow");
    };

    const handleDuplicate = async () => {
        if (duplicating) return;
        setDuplicating(true);
        const promise = duplicateWorkflowEndpointApiV1WorkflowWorkflowIdDuplicatePost({
            path: { workflow_id: workflowId },
        });
        toast.promise(promise, {
            loading: "Duplicating workflow...",
            success: "Workflow duplicated successfully",
            error: "Failed to duplicate workflow",
        });
        try {
            const { data } = await promise;
            if (data?.id) {
                router.push(`/workflow/${data.id}`);
            }
        } finally {
            setDuplicating(false);
        }
    };

    const handleCopyAgentUuid = async () => {
        if (!workflowUuid) {
            toast.error("Agent UUID not available");
            return;
        }
        try {
            await copyTextToClipboard(workflowUuid);
            toast.success("Agent UUID copied");
        } catch {
            toast.error("Failed to copy Agent UUID");
        }
    };

    const handleDownloadWorkflow = () => {
        if (!rfInstance.current) return;

        const workflowDefinition = rfInstance.current.toObject();
        const exportData = {
            name: workflowName,
            workflow_definition: workflowDefinition,
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${workflowName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const enterEditMode = () => {
        setRename({ kind: "editing", draft: workflowName, error: null });
    };

    const exitEditMode = () => {
        setRename({ kind: "display" });
        // Return focus to the pencil button so keyboard users aren't stranded.
        // Defer to next tick so React commits the input unmount first.
        setTimeout(() => renameButtonRef.current?.focus(), 0);
    };

    const attemptSave = async () => {
        // Only "editing" can initiate a save. This also guards against the
        // blur fired when disabling the input transitions us to "saving".
        if (rename.kind !== "editing") return;
        const trimmed = rename.draft.trim();
        if (trimmed.length === 0) {
            setRename({ ...rename, error: "Name cannot be empty" });
            return;
        }
        if (trimmed === workflowName) {
            // No-op: exit cleanly with no API call.
            exitEditMode();
            return;
        }
        setRename({ kind: "saving", draft: rename.draft });
        try {
            await renameWorkflow(trimmed);
            // Success: store update already propagated workflowName. Exit edit mode.
            exitEditMode();
        } catch {
            // Roll back: keep user's typed value, reopen the input, focus it,
            // surface a sonner toast (matches existing duplicate/publish failure pattern).
            toast.error("Failed to rename workflow");
            setRename({ kind: "editing", draft: trimmed, error: null });
            setTimeout(() => nameInputRef.current?.focus(), 0);
        }
    };

    const handleRenameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            void attemptSave();
        } else if (event.key === "Escape") {
            event.preventDefault();
            exitEditMode();
        }
    };

    const handleRenameBlur = () => {
        // Ignore the blur fired when the input is disabled during save.
        if (rename.kind !== "editing") return;
        // On blur with empty/whitespace, revert silently to display mode so the user is never trapped.
        if (rename.draft.trim().length === 0) {
            exitEditMode();
            return;
        }
        void attemptSave();
    };

    return (
        <div className="flex items-center justify-between w-full h-14 px-4 bg-background border-b border-[#E5E5E5] text-foreground">
            {/* Left section: Mobile menu + Back button + Workflow name */}
            <div className="flex items-center gap-3 mr-4">
                <button
                    onClick={toggleSidebar}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F7F7F7] text-[#737373] hover:text-foreground transition-colors md:hidden"
                    aria-label="Toggle sidebar"
                    title="Toggle sidebar"
                >
                    <HugeiconsIcon icon={Menu01Icon} className="w-5 h-5" />
                </button>
                <button
                    onClick={handleBack}
                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F7F7F7] text-[#737373] hover:text-foreground transition-colors"
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                    {rename.kind !== "display" ? (
                        <div className="flex flex-col gap-1">
                            <Input
                                ref={nameInputRef}
                                value={rename.draft}
                                onChange={(e) => {
                                    // onChange can't fire while disabled (kind === "saving"),
                                    // but the type guard is needed for the discriminated union.
                                    if (rename.kind === "editing") {
                                        setRename({ ...rename, draft: e.target.value, error: null });
                                    }
                                }}
                                onKeyDown={handleRenameKeyDown}
                                onBlur={handleRenameBlur}
                                disabled={rename.kind === "saving"}
                                autoFocus
                                onFocus={(e) => e.currentTarget.select()}
                                aria-label="Workflow name"
                                aria-invalid={rename.kind === "editing" && rename.error !== null}
                                className="h-8 max-w-xs bg-background border-input text-foreground text-base font-medium"
                            />
                            {rename.kind === "editing" && rename.error && (
                                <span className="text-xs text-red-500" role="alert">{rename.error}</span>
                            )}
                        </div>
                    ) : (
                        <>
                            <h1 className="text-base font-semibold text-foreground whitespace-nowrap truncate max-w-[14rem] md:max-w-md">
                                <span className="md:hidden">
                                    {workflowName.length > 8 ? `${workflowName.slice(0, 8)}…` : workflowName}
                                </span>
                                <span className="hidden md:inline">{workflowName}</span>
                            </h1>
                            {!isViewingHistoricalVersion && (
                                <button
                                    ref={renameButtonRef}
                                    type="button"
                                    onClick={enterEditMode}
                                    aria-label="Rename workflow"
                                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#F7F7F7] text-[#737373] hover:text-foreground transition-colors"
                                >
                                    <HugeiconsIcon icon={PencilIcon} className="w-4 h-4" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Right section: Version + status + tester/call actions + save */}
            <div className="flex items-center gap-3">
                {/* Read-only banner when viewing a historical version */}
                {isViewingHistoricalVersion && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#DCE3EF] bg-[#F0F3F9]">
                        <HugeiconsIcon icon={EyeIcon} className="w-4 h-4 text-[#7186AD]" />
                        <span className="text-sm text-[#7186AD] font-medium">
                            Viewing {activeVersionLabel} - Read only
                        </span>
                    </div>
                )}

                {/* Back to Draft button when viewing history */}
                {isViewingHistoricalVersion && (
                    <Button
                        onClick={onBackToDraft}
                        className="bg-neutral-950 hover:bg-neutral-800 text-white px-4"
                    >
                        Back to Draft
                    </Button>
                )}

                {/* Version history button */}
                <button
                    onClick={onHistoryClick}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#E5E5E5] hover:bg-[#F7F7F7] text-[#737373] hover:text-foreground transition-colors cursor-pointer text-sm"
                >
                    <HugeiconsIcon icon={HistoryIcon} className="w-4 h-4" />
                    {activeVersionLabel && !isViewingHistoricalVersion && (
                        <span className="text-sm text-foreground">{activeVersionLabel}</span>
                    )}
                </button>

                {/* Unsaved changes indicator (hidden when viewing history) */}
                {isDirty && !isViewingHistoricalVersion && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-amber-500/30 bg-[#E5E5E5]/10">
                        <div className="w-2 h-2 rounded-full bg-[#E5E5E5]" />
                        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">Unsaved changes</span>
                    </div>
                )}

                {/* Validation errors indicator */}
                {hasValidationErrors && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-500 font-medium">
                                    {workflowValidationErrors.length} {workflowValidationErrors.length === 1 ? "error" : "errors"}
                                </span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            className="w-80 bg-popover border-[#E5E5E5] text-popover-foreground p-0 shadow-xl"
                        >
                            <div className="px-4 py-3 border-b border-[#E5E5E5]">
                                <h3 className="text-sm font-medium text-foreground">Validation Errors</h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {workflowValidationErrors.map((error, index) => (
                                    <div
                                        key={index}
                                        className="px-4 py-3 border-b border-[#E5E5E5] last:border-b-0"
                                    >
                                        <div className="flex items-start gap-2">
                                            <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                {(error.kind === "node" || error.kind === "edge") && error.id && (
                                                    <p className="text-xs text-[#737373] mb-1">
                                                        {error.kind === "node" ? "Node" : "Edge"}: {error.id}
                                                        {error.field && <span> • {error.field}</span>}
                                                    </p>
                                                )}
                                                <p className="text-sm text-foreground break-words">
                                                    {error.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                )}

                {/* Publish button (only when on draft with no unsaved changes) */}
                {!isViewingHistoricalVersion && hasDraft && (
                    <Button
                        onClick={handlePublish}
                        disabled={isDirty || publishing || hasValidationErrors}
                        variant="outline"
                        className="border-[#E5E5E5] hover:bg-[#F7F7F7] text-foreground px-4"
                    >
                        {publishing ? (
                            <>
                                <HugeiconsIcon icon={Loading02Icon} className="w-4 h-4 mr-2 animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon icon={Rocket01Icon} className="w-4 h-4 mr-2" />
                                Publish
                            </>
                        )}
                    </Button>
                )}

                {!isViewingHistoricalVersion && (
                    <Button
                        variant="outline"
                        className="flex items-center gap-2 border-[#E5E5E5] hover:bg-[#F7F7F7] text-foreground"
                        disabled={isCallDisabled}
                        onClick={onPhoneCallClick}
                    >
                        <HugeiconsIcon icon={PhoneIcon} className="w-4 h-4" />
                        Phone Call
                    </Button>
                )}

                {onCopilotClick && (
                    <Button
                        variant="outline"
                        className={`flex items-center gap-2 border-[#E5E5E5] hover:bg-[#F7F7F7] ${
                            isCopilotOpen
                                ? "bg-primary/10 border-primary text-primary font-medium"
                                : "text-foreground"
                        }`}
                        onClick={onCopilotClick}
                    >
                        <HugeiconsIcon icon={SparklesIcon} className={`w-4 h-4 ${isCopilotOpen ? "text-primary" : "text-[#7186AD]"}`} />
                        AI Copilot
                    </Button>
                )}

                <Button
                    variant="outline"
                    className="flex items-center gap-2 border-[#E5E5E5] hover:bg-[#F7F7F7] text-foreground"
                    onClick={onTestAgentClick}
                >
                    <HugeiconsIcon icon={BotIcon} className="w-4 h-4" />
                    Test Agent
                </Button>

                {/* Save button (only shown when editing the draft) */}
                {!isViewingHistoricalVersion && (
                    <Button
                        onClick={handleSave}
                        disabled={!isDirty || savingWorkflow}
                        className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 shadow-sm"
                    >
                        {savingWorkflow ? (
                            <>
                                <HugeiconsIcon icon={Loading02Icon} className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save"
                        )}
                    </Button>
                )}

                {/* More options dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#737373] hover:text-foreground hover:bg-[#F7F7F7]"
                        >
                            <HugeiconsIcon icon={MoreVerticalIcon} className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover border-[#E5E5E5] text-popover-foreground shadow-xl">
                        <DropdownMenuItem
                            onClick={() => router.push(`/workflow/${workflowId}/runs`)}
                            className="cursor-pointer hover:bg-[#F7F7F7]"
                        >
                            <HugeiconsIcon icon={HistoryIcon} className="w-4 h-4 mr-2" />
                            View Runs
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleDuplicate}
                            disabled={duplicating}
                            className="cursor-pointer hover:bg-[#F7F7F7]"
                        >
                            {duplicating ? (
                                <HugeiconsIcon icon={Loading02Icon} className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <HugeiconsIcon icon={Copy01Icon} className="w-4 h-4 mr-2" />
                            )}
                            {duplicating ? "Duplicating..." : "Duplicate Workflow"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleDownloadWorkflow}
                            className="cursor-pointer hover:bg-[#F7F7F7]"
                        >
                            <HugeiconsIcon icon={Download01Icon} className="w-4 h-4 mr-2" />
                            Download Workflow
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleCopyAgentUuid}
                            disabled={!workflowUuid}
                            className="cursor-pointer hover:bg-[#F7F7F7]"
                        >
                            <HugeiconsIcon icon={ClipboardIcon} className="w-4 h-4 mr-2" />
                            Copy Agent UUID
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Callio Studio Status indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-[#F7F7F7] text-xs font-medium text-foreground">
                    <span className="w-2 h-2 rounded-full bg-[#171717] animate-pulse" />
                    <span>Callio Studio</span>
                </div>
            </div>
        </div>
    );
};
