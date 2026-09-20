import { HugeiconsIcon } from "@hugeicons/react";
import {
  Loading02Icon,
} from "@hugeicons/core-free-icons";;

interface SpinLoaderProps {
    label?: string;
}

export default function SpinLoader({ label }: SpinLoaderProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <HugeiconsIcon icon={Loading02Icon} className="h-8 w-8 animate-spin text-foreground" />
            {label && <span>{label}</span>}
        </div>
    );
}
