"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
} from "@hugeicons/core-free-icons";;
import { useState } from "react";

import { WorkflowRunResponseSchema } from "@/client/types.gen";
import { CallTypeCell } from "@/components/CallTypeCell";
import { FilterBuilder } from "@/components/filters/FilterBuilder";
import { MediaPreviewButton, MediaPreviewDialog } from "@/components/MediaPreviewDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useOrganizationTimezone } from "@/hooks/useOrganizationTimezone";
import { formatDateTime } from "@/lib/dateTime";
import { ActiveFilter, FilterAttribute } from "@/types/filters";

export interface WorkflowRunsTableProps {
    // Data
    runs: WorkflowRunResponseSchema[];
    loading: boolean;
    error: string | null;

    // Pagination
    currentPage: number;
    totalPages: number;
    totalCount: number;
    onPageChange: (page: number) => void;

    // Filters
    availableAttributes: FilterAttribute[];
    activeFilters: ActiveFilter[];
    onFiltersChange: (filters: ActiveFilter[]) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
    isExecutingFilters: boolean;
    hasAppliedFilters?: boolean;

    // Sorting
    sortBy?: string | null;
    sortOrder?: 'asc' | 'desc';
    onSort?: (field: string) => void;

    // Navigation & Actions
    workflowId: number;

    // Reload
    onReload?: () => void;

    // Optional customization
    title?: string;
    subtitle?: string;
    showFilters?: boolean;
    emptyMessage?: string;
}

export function WorkflowRunsTable({
    runs,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    onPageChange,
    availableAttributes,
    activeFilters,
    onFiltersChange,
    onApplyFilters,
    onClearFilters,
    isExecutingFilters,
    hasAppliedFilters = false,
    sortBy,
    sortOrder = 'desc',
    onSort,
    workflowId,
    onReload,
    title = "Workflow Run History",
    subtitle,
    showFilters = true,
    emptyMessage = "No workflow runs found",
}: WorkflowRunsTableProps) {
    const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
    const organizationTimezone = useOrganizationTimezone();

    // Media preview dialog
    const mediaPreview = MediaPreviewDialog();

    const handleRowClick = (runId: number) => {
        window.open(`/workflow/${workflowId}/run/${runId}`, '_blank');
    };

    return (
        <div className="space-y-6">
            {/* Title and Filters */}
            {showFilters && (
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-4">{title}</h1>
                    <FilterBuilder
                        availableAttributes={availableAttributes}
                        activeFilters={activeFilters}
                        onFiltersChange={onFiltersChange}
                        onApplyFilters={onApplyFilters}
                        onClearFilters={onClearFilters}
                        isExecuting={isExecutingFilters}
                        hasAppliedFilters={hasAppliedFilters}
                    />
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-pulse">Loading workflow runs...</div>
                </div>
            ) : error ? (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded">
                    {error}
                </div>
            ) : runs.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">{emptyMessage}</p>
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Workflow Runs</CardTitle>
                                <CardDescription>
                                    {subtitle || `Showing ${runs.length} of ${totalCount} total runs`}
                                </CardDescription>
                            </div>
                            {onReload && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={onReload}
                                    disabled={loading}
                                    title="Reload"
                                >
                                    <HugeiconsIcon icon={RefreshCwIcon} className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">ID</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Created At</TableHead>
                                        <TableHead className="font-semibold">Call Type</TableHead>
                                        <TableHead
                                            className="font-semibold cursor-pointer hover:bg-muted/50 select-none"
                                            onClick={() => onSort?.('duration')}
                                        >
                                            <div className="flex items-center gap-1">
                                                Duration
                                                {sortBy === 'duration' ? (
                                                    sortOrder === 'asc' ? <HugeiconsIcon icon={ArrowUp01Icon} className="h-4 w-4" /> : <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4" />
                                                ) : (
                                                    <HugeiconsIcon icon={ArrowUpDownIcon} className="h-4 w-4 text-muted-foreground" />
                                                )}
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold">Cost / Usage</TableHead>
                                        <TableHead className="font-semibold">Disposition</TableHead>
                                        <TableHead className="font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {runs.map((run) => {
                                        const cost = typeof (run.cost_info as any)?.charge_usd === 'number'
                                            ? (run.cost_info as any).charge_usd
                                            : typeof (run.cost_info as any)?.total_cost_usd === 'number'
                                            ? (run.cost_info as any).total_cost_usd
                                            : run.is_completed && typeof run.cost_info?.call_duration_seconds === 'number' && run.cost_info.call_duration_seconds > 0
                                            ? (run.cost_info.call_duration_seconds / 60) * 0.06
                                            : null;

                                        return (
                                        <TableRow
                                            key={run.id}
                                            className={`cursor-pointer hover:bg-muted/50 ${selectedRowId === run.id ? "bg-primary/20 ring-1 ring-primary/50" : ""}`}
                                            onClick={() => handleRowClick(run.id)}
                                        >
                                            <TableCell className="font-mono text-sm">#{run.id}</TableCell>
                                            <TableCell>
                                                <Badge variant={run.is_completed ? "default" : "secondary"}>
                                                    {run.is_completed ? "Completed" : "In Progress"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDateTime(run.created_at, organizationTimezone)}
                                            </TableCell>
                                            <TableCell>
                                                <CallTypeCell mode={run.mode} callType={run.call_type} />
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {typeof run.cost_info?.call_duration_seconds === 'number'
                                                    ? `${run.cost_info.call_duration_seconds.toFixed(1)}s`
                                                    : "-"}
                                            </TableCell>
                                            <TableCell className="text-sm font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                                {cost !== null ? `$${cost.toFixed(4)}` : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 items-start">
                                                    {run.gathered_context?.mapped_call_disposition ? (
                                                        <Badge variant="default">
                                                            {run.gathered_context.mapped_call_disposition as string}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">-</span>
                                                    )}
                                                    {typeof run.gathered_context?.lead_score === "number" && (
                                                        <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                                            (run.gathered_context.lead_score as number) >= 70
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                                : (run.gathered_context.lead_score as number) >= 40
                                                                ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400"
                                                                : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400"
                                                        }`}>
                                                            {(run.gathered_context.lead_score as number) >= 70 ? "🔥" : (run.gathered_context.lead_score as number) >= 40 ? "⚡" : "❄️"} Score: {run.gathered_context.lead_score as number}
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                                                    <MediaPreviewButton
                                                        recordingUrl={run.recording_url}
                                                        transcriptUrl={run.transcript_url}
                                                        runId={run.id}
                                                        onOpenPreview={mediaPreview.openPreview}
                                                        onSelect={setSelectedRowId}
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => window.open(`/workflow/${workflowId}/run/${run.id}`, '_blank')}
                                                    >
                                                        <HugeiconsIcon icon={ExternalLinkIcon} className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <p className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <HugeiconsIcon icon={ChevronLeftIcon} className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                        <HugeiconsIcon icon={ChevronRightIcon} className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Media Preview Dialog */}
            {mediaPreview.dialog}
        </div>
    );
}
