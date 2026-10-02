'use client';

import { HugeiconsIcon } from "@hugeicons/react";
import { PlusIcon } from "@hugeicons/core-free-icons";
import Link from 'next/link';

import { Button } from "@/components/ui/button";

export function CreateWorkflowButton() {
    return (
        <Button asChild className="gap-1.5 shadow-sm">
            <Link href="/workflow/create">
                <HugeiconsIcon icon={PlusIcon} className="w-4 h-4" />
                <span>Create Agent</span>
            </Link>
        </Button>
    );
}
