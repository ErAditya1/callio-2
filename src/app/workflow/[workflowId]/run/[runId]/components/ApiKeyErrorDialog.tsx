import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  Key01Icon,
} from "@hugeicons/core-free-icons";;

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SERVICE_KEYS_DOCS_URL = "https://docs.dograh.com/configurations/api-keys#service-keys";

interface ApiKeyErrorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    error: string | null;
    errorCode: string | null;
    onNavigateToBilling: () => void;
    onNavigateToDevelopers: () => void;
    onNavigateToModelConfig: () => void;
}

export const ApiKeyErrorDialog = ({
    open,
    onOpenChange,
    error,
    errorCode,
    onNavigateToBilling,
    onNavigateToDevelopers,
    onNavigateToModelConfig,
}: ApiKeyErrorDialogProps) => {
    const isBillingCreditsError = errorCode === 'insufficient_credits';
    const isServiceKeyOrgMismatch = errorCode === 'service_key_org_mismatch';
    const isQuotaError = isBillingCreditsError || errorCode === 'quota_exceeded';

    const title = isQuotaError
        ? "Insufficient Credits"
        : isServiceKeyOrgMismatch
            ? "Service Token Account Mismatch"
            : "API Configuration Error";
    const icon = isQuotaError ? <HugeiconsIcon icon={CreditCardIcon} className="h-5 w-5 text-orange-500" /> : <HugeiconsIcon icon={Key01Icon} className="h-5 w-5 text-red-500" />;
    const buttonText = isBillingCreditsError
        ? "Go to Billing"
        : isServiceKeyOrgMismatch
            ? "Go to Developers"
            : "Go to Model Configurations";
    const onNavigate = isBillingCreditsError
        ? onNavigateToBilling
        : isServiceKeyOrgMismatch
            ? onNavigateToDevelopers
            : onNavigateToModelConfig;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {icon}
                        {title}
                    </DialogTitle>
                    <DialogDescription className="pt-3" asChild>
                        <div className="flex items-start gap-2">
                            <HugeiconsIcon icon={AlertCircleIcon} className="h-4 w-4 text-[#737373] mt-0.5 flex-shrink-0" />
                            <div className="text-sm space-y-1">
                                <p className="font-medium text-foreground">{error}</p>
                                {isBillingCreditsError && (
                                    <p className="text-[#737373]">
                                        Purchase credits from Billing to continue using CallioAI-managed models.
                                    </p>
                                )}
                                {isServiceKeyOrgMismatch && (
                                    <a
                                        href={SERVICE_KEYS_DOCS_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-0.5 text-[#737373] underline"
                                    >
                                        Learn more <HugeiconsIcon icon={ExternalLinkIcon} className="h-3 w-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={onNavigate}>
                        {buttonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
