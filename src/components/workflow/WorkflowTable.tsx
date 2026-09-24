'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Archive01Icon,
  CheckIcon,
  Folder01Icon,
  FolderInputIcon,
  FolderPlusIcon,
  InboxIcon,
  PencilIcon,
  RotateCcwIcon,
} from "@hugeicons/core-free-icons";;
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
    createFolderApiV1FolderPost,
    moveWorkflowToFolderApiV1WorkflowWorkflowIdFolderPut,
    updateWorkflowStatusApiV1WorkflowWorkflowIdStatusPut,
} from '@/client/sdk.gen';
import type { FolderResponse } from '@/client/types.gen';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FolderFormDialog } from './folders/FolderFormDialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useOrganizationTimezone } from '@/hooks/useOrganizationTimezone';
import { formatDate } from '@/lib/dateTime';

interface Workflow {
    id: number;
    name: string;
    status: string;
    created_at: string;
    total_runs?: number | null;
    folder_id?: number | null;
}

interface WorkflowTableProps {
    workflows: Workflow[];
    showArchived: boolean;
    /**
     * When provided, each row gets a "Move to folder" action listing these
     * folders. Omit it (e.g. for the archived list) to hide the control.
     */
    folders?: FolderResponse[];
    /** The folder this table is rendered under; null means "Uncategorized". */
    currentFolderId?: number | null;
}

export function WorkflowTable({
    workflows,
    showArchived,
    folders,
    currentFolderId = null,
}: WorkflowTableProps) {
    const router = useRouter();
    const organizationTimezone = useOrganizationTimezone();
    const [isPending, startTransition] = useTransition();
    const [loadingWorkflowId, setLoadingWorkflowId] = useState<number | null>(null);
    const [movingWorkflowId, setMovingWorkflowId] = useState<number | null>(null);
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const [targetWorkflowIdForFolder, setTargetWorkflowIdForFolder] = useState<number | null>(null);

    const handleCreateFolderAndMove = async (name: string) => {
        if (!targetWorkflowIdForFolder) return;
        const response = await createFolderApiV1FolderPost({ body: { name } });
        if (response.error) {
            const detail =
                (response.error as { detail?: string })?.detail ??
                'Failed to create folder';
            toast.error(detail);
            throw new Error(detail);
        }
        const createdFolder = response.data;
        if (createdFolder?.id) {
            await handleMove(targetWorkflowIdForFolder, createdFolder.id);
        }
        setCreateFolderOpen(false);
        setTargetWorkflowIdForFolder(null);
    };

    const handleEdit = (id: number) => {
        router.push(`/workflow/${id}`);
    };

    const handleArchiveToggle = async (id: number, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'archived' : 'active';
        const action = currentStatus === 'active' ? 'Archive' : 'Restore';

        setLoadingWorkflowId(id);

        try {
            const response = await updateWorkflowStatusApiV1WorkflowWorkflowIdStatusPut({
                path: {
                    workflow_id: id,
                },
                body: {
                    status: newStatus,
                },
            });

            if (response.data) {
                toast.success(`Workflow ${action.toLowerCase()}d successfully`);
                startTransition(() => {
                    router.refresh();
                });
            }
        } catch (error) {
            console.error(`Error ${action.toLowerCase()}ing workflow:`, error);
            toast.error(`Failed to ${action.toLowerCase()} workflow`);
        } finally {
            setLoadingWorkflowId(null);
        }
    };

    const handleMove = async (id: number, folderId: number | null) => {
        setMovingWorkflowId(id);
        try {
            const response = await moveWorkflowToFolderApiV1WorkflowWorkflowIdFolderPut({
                path: { workflow_id: id },
                body: { folder_id: folderId },
            });
            if (response.error) {
                throw new Error('Failed to move agent');
            }
            toast.success(
                folderId === null ? 'Moved to Uncategorized' : 'Agent moved',
            );
            startTransition(() => {
                router.refresh();
            });
        } catch (error) {
            console.error('Error moving workflow:', error);
            toast.error('Failed to move agent');
        } finally {
            setMovingWorkflowId(null);
        }
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold">ID</TableHead>
                            <TableHead className="font-semibold">Agent Name</TableHead>
                            <TableHead className="font-semibold">Created At</TableHead>
                            <TableHead className="font-semibold text-center">Total Runs</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workflows.map((workflow) => (
                            <TableRow
                                key={workflow.id}
                                className={`hover:bg-accent transition-colors ${showArchived ? 'opacity-60' : ''}`}
                            >
                                <TableCell className="text-[#737373]">
                                    {workflow.id}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {workflow.name}
                                </TableCell>
                                <TableCell>
                                    {formatDate(workflow.created_at, organizationTimezone)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 text-sm font-semibold bg-[#F7F7F7] rounded-full">
                                        {workflow.total_runs || 0}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(workflow.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <HugeiconsIcon icon={PencilIcon} size={16} />
                                            Edit
                                        </Button>
                                        {!showArchived && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={movingWorkflowId === workflow.id || isPending}
                                                        className="flex items-center gap-2"
                                                        title="Move agent to a folder"
                                                    >
                                                        {movingWorkflowId === workflow.id ? (
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                        ) : (
                                                            <HugeiconsIcon icon={FolderInputIcon} size={16} />
                                                        )}
                                                        Move
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuLabel>Move to folder</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        disabled={currentFolderId === null}
                                                        onClick={() => handleMove(workflow.id, null)}
                                                    >
                                                        <HugeiconsIcon icon={InboxIcon} size={14} className="mr-2" />
                                                        Uncategorized
                                                        {currentFolderId === null && (
                                                            <HugeiconsIcon icon={CheckIcon} size={14} className="ml-auto" />
                                                        )}
                                                    </DropdownMenuItem>
                                                    {folders && folders.length > 0 && folders.map((folder) => (
                                                        <DropdownMenuItem
                                                            key={folder.id}
                                                            disabled={folder.id === currentFolderId}
                                                            onClick={() => handleMove(workflow.id, folder.id)}
                                                        >
                                                            <HugeiconsIcon icon={Folder01Icon} size={14} className="mr-2" />
                                                            <span className="truncate">{folder.name}</span>
                                                            {folder.id === currentFolderId && (
                                                                <HugeiconsIcon icon={CheckIcon} size={14} className="ml-auto shrink-0" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    {(!folders || folders.length === 0) && (
                                                        <div className="px-2 py-1.5 text-xs text-muted-foreground italic">
                                                            No folders created yet
                                                        </div>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setTargetWorkflowIdForFolder(workflow.id);
                                                            setCreateFolderOpen(true);
                                                        }}
                                                        className="cursor-pointer text-indigo-600 focus:text-indigo-600 font-medium"
                                                    >
                                                        <HugeiconsIcon icon={FolderPlusIcon} size={14} className="mr-2 text-indigo-500" />
                                                        <span>Create new folder...</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                        <Button
                                            variant={showArchived ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handleArchiveToggle(workflow.id, workflow.status)}
                                            disabled={loadingWorkflowId === workflow.id || isPending}
                                            className="flex items-center gap-2"
                                        >
                                            {loadingWorkflowId === workflow.id ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    {showArchived ? 'Restoring...' : 'Archiving...'}
                                                </>
                                            ) : (
                                                <>
                                                    {showArchived ? (
                                                        <>
                                                            <HugeiconsIcon icon={RotateCcwIcon} size={16} />
                                                            Restore
                                                        </>
                                                    ) : (
                                                        <>
                                                            <HugeiconsIcon icon={Archive01Icon} size={16} />
                                                            Archive
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <FolderFormDialog
                open={createFolderOpen}
                onOpenChange={setCreateFolderOpen}
                title="Create folder & move agent"
                submitLabel="Create & Move"
                onSubmit={handleCreateFolderAndMove}
            />
        </Card>
    );
}
