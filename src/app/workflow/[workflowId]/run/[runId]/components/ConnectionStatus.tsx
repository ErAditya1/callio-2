import { HugeiconsIcon } from "@hugeicons/react";
import {
  Loading02Icon,
} from "@hugeicons/core-free-icons";;

interface ConnectionStatusProps {
    connectionStatus: 'idle' | 'connecting' | 'connected' | 'failed';
}

export const ConnectionStatus = ({ connectionStatus }: ConnectionStatusProps) => {
    if (connectionStatus === 'idle') return null;

    if (connectionStatus === 'connecting') {
        return (
            <div className="flex items-center justify-center space-x-2 text-[#7186AD]">
                <HugeiconsIcon icon={Loading02Icon} className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Establishing Connection...</span>
            </div>
        );
    }

    if (connectionStatus === 'connected') {
        return (
            <div className="flex items-center justify-center space-x-2 text-green-600">
                <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Connected</span>
            </div>
        );
    }

    if (connectionStatus === 'failed') {
        return (
            <div className="flex items-center justify-center space-x-2 text-red-600">
                <div className="h-2 w-2 bg-red-600 rounded-full" />
                <span className="text-sm font-medium">Connection Failed</span>
            </div>
        );
    }

    return null;
};
