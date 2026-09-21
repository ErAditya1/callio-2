"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlertCircleIcon,
  ArrowUpRight01Icon,
  CheckIcon,
  CheckmarkCircle02Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDollarSignIcon,
  Clock01Icon,
  Copy01Icon,
  CreditCardIcon,
  ExternalLinkIcon,
  InfoIcon,
  PhoneCallIcon,
  ReceiptIcon,
  RefreshCwIcon,
  SparklesIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";;
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { RechargeWalletModal } from "@/components/billing/RechargeWalletModal";
import { SubscriptionPlanSection } from "@/components/billing/SubscriptionPlanSection";


import {
    getUsageHistoryApiV1OrganizationsUsageRunsGet,
} from "@/client/sdk.gen";
import type { UsageHistoryResponse, WorkflowRunUsageResponse } from "@/client/types.gen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAppConfig } from "@/context/AppConfigContext";
import { useOrgConfig } from "@/context/OrgConfigContext";
import { useOrganizationTimezone } from "@/hooks/useOrganizationTimezone";
import { useAuth } from "@/lib/auth";
import { formatDateTime } from "@/lib/dateTime";
import { trackMetaInitiateCheckout } from "@/lib/metaPixel";

const PAGE_SIZE = 25;

const formatDuration = (seconds?: number | null) => {
    if (seconds == null || Number.isNaN(seconds)) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
};

const getPageFromSearchParams = (
    searchParams: { get: (name: string) => string | null },
) => {
    const pageParam = searchParams.get("page");
    const page = pageParam ? Number.parseInt(pageParam, 10) : 1;
    return Number.isFinite(page) && page > 0 ? page : 1;
};

export default function BillingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const auth = useAuth();
    const { config, loading: configLoading } = useAppConfig();
    const organizationTimezone = useOrganizationTimezone();
    const { orgContext, refreshConfig } = useOrgConfig();

    const platformWalletUsd: number = (orgContext as any)?.wallet_balance_usd ?? 0.0;
    const [usageData, setUsageData] = useState<UsageHistoryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);
    const [copiedReceipt, setCopiedReceipt] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(() => getPageFromSearchParams(searchParams));

    const fetchTransactions = useCallback(async () => {
        if (auth.loading || !auth.isAuthenticated) return;
        setLoadingTransactions(true);
        try {
            const token = await auth.getAccessToken();
            const res = await fetch("/api/v1/payments/transactions?limit=20", {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });
            if (res.ok) {
                const data = await res.json();
                setTransactions(data);
            }
        } catch (err) {
            console.error("Failed to fetch payment transactions:", err);
        } finally {
            setLoadingTransactions(false);
        }
    }, [auth.isAuthenticated, auth.loading, auth.getAccessToken]);


    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleCopyReceipt = (receipt: string) => {
        navigator.clipboard.writeText(receipt);
        setCopiedReceipt(receipt);
        toast.success("Receipt ID copied!", {
            description: "Paste in Razorpay Dashboard to filter this transaction.",
        });
        setTimeout(() => setCopiedReceipt(null), 2500);
    };

    const fetchUsageHistory = useCallback(async (
        page: number,
        { silent = false }: { silent?: boolean } = {},
    ) => {
        if (auth.loading || !auth.isAuthenticated) {
            if (!auth.loading) setLoading(false);
            return;
        }

        if (silent) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const [usageRes] = await Promise.all([
                getUsageHistoryApiV1OrganizationsUsageRunsGet({
                    query: { page, limit: PAGE_SIZE },
                }),
                refreshConfig().catch(() => {}),
            ]);

            if (usageRes.data) {
                setUsageData(usageRes.data);
            }
        } catch (error) {
            console.error("Failed to fetch usage history:", error);
            toast.error("Failed to load call usage history");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [auth.isAuthenticated, auth.loading, refreshConfig]);

    useEffect(() => {
        const nextPage = getPageFromSearchParams(searchParams);
        setCurrentPage((prev) => (prev === nextPage ? prev : nextPage));
    }, [searchParams]);

    useEffect(() => {
        fetchUsageHistory(currentPage);
    }, [currentPage, fetchUsageHistory]);

    const handleRefresh = async () => {
        await Promise.all([
            fetchUsageHistory(currentPage, { silent: true }),
            fetchTransactions(),
        ]);
        toast.success("Wallet balance & usage updated");
    };


    const updateUrlPage = useCallback((page: number) => {
        const newParams = new URLSearchParams(searchParams.toString());
        if (page > 1) {
            newParams.set("page", page.toString());
        } else {
            newParams.delete("page");
        }
        const queryString = newParams.toString();
        router.push(queryString ? `/billing?${queryString}` : "/billing");
    }, [router, searchParams]);

    const handlePageChange = (page: number) => {
        const nextPage = Math.max(1, page);
        setCurrentPage(nextPage);
        updateUrlPage(nextPage);
    };


    const totalRuns = usageData?.total_count ?? 0;
    const totalDurationSeconds = usageData?.total_duration_seconds ?? 0;
    const totalDurationMinutes = Math.round(totalDurationSeconds / 60);
    const estimatedMinutesRemaining = platformWalletUsd > 0 ? Math.floor(platformWalletUsd / 0.06) : 0;
    const runsList: WorkflowRunUsageResponse[] = usageData?.runs ?? [];
    const totalPages = usageData?.total_pages ?? 1;

    if (loading || configLoading) {
        return (
            <div className="app-page space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-40" />
                    <Skeleton className="h-5 w-96 max-w-full" />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
                <Skeleton className="h-80 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="app-page space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Billing & Calling Wallet</h1>
                    <p className="text-[#737373] mt-1">
                        Real-time wallet balance, transparent model rates, and per-conversation usage deductions.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                        <HugeiconsIcon icon={RefreshCwIcon} className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setRechargeModalOpen(true)}
                        className="bg-neutral-950 hover:bg-neutral-800 text-white font-semibold shadow-xs"
                    >
                        <HugeiconsIcon icon={CreditCardIcon} className="h-4 w-4 mr-2" />
                        Recharge Wallet
                    </Button>
                </div>

            </div>

            {/* Calling Wallet Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0F3F9] text-[#171717] dark:text-[#7186AD] border border-[#DCE3EF] shrink-0">
                            <HugeiconsIcon icon={Wallet01Icon} className="h-7 w-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h2 className="text-2xl font-bold tracking-tight">Platform Calling Wallet</h2>
                                <Badge
                                    variant="outline"
                                    className={
                                        platformWalletUsd > 1.0
                                            ? "bg-[#F0F3F9] text-[#171717] dark:text-[#7186AD] border-[#DCE3EF] text-xs px-2.5 py-0.5"
                                            : platformWalletUsd > 0
                                            ? "bg-[#E5E5E5]/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs px-2.5 py-0.5"
                                            : "bg-destructive/15 text-destructive border-destructive/30 text-xs px-2.5 py-0.5"
                                    }
                                >
                                    {platformWalletUsd > 1.0 ? "Active & Ready" : platformWalletUsd > 0 ? "Low Balance" : "Needs Recharge"}
                                </Badge>
                            </div>
                            <p className="text-sm text-[#737373] mt-1 max-w-xl">
                                Funds are deducted automatically per second for speech synthesis, AI cognition, transcription, and carrier trunking.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:items-end">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#737373]">
                            Available Balance
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-4xl font-extrabold font-mono tracking-tight text-foreground">
                                ${platformWalletUsd.toFixed(2)}
                            </span>
                            <span className="text-sm font-bold uppercase text-[#737373]">USD</span>
                        </div>
                        <span className="text-xs text-[#737373] mt-1">
                            ~{estimatedMinutesRemaining} minutes of talk time remaining
                        </span>
                    </div>
                </div>

                {/* Rate Card Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#E5E5E5]">
                    <div className="p-3 rounded-xl bg-background/70 border border-[#E5E5E5] backdrop-blur-sm">
                        <div className="text-[#737373] text-xs font-medium">STT (Deepgram Nova-2)</div>
                        <div className="font-mono font-bold text-sm mt-1">$0.005 / min</div>
                        <div className="text-[11px] text-[#737373] mt-0.5">Realtime Speech-to-Text</div>
                    </div>
                    <div className="p-3 rounded-xl bg-background/70 border border-[#E5E5E5] backdrop-blur-sm">
                        <div className="text-[#737373] text-xs font-medium">LLM (GPT-4o-mini)</div>
                        <div className="font-mono font-bold text-sm mt-1">$0.015 / min</div>
                        <div className="text-[11px] text-[#737373] mt-0.5">Intelligence & Logic</div>
                    </div>
                    <div className="p-3 rounded-xl bg-background/70 border border-[#E5E5E5] backdrop-blur-sm">
                        <div className="text-[#737373] text-xs font-medium">TTS (Cartesia Sonic)</div>
                        <div className="font-mono font-bold text-sm mt-1">$0.020 / min</div>
                        <div className="text-[11px] text-[#737373] mt-0.5">Ultra-low Latency Voice</div>
                    </div>
                    <div className="p-3 rounded-xl bg-background/70 border border-[#E5E5E5] backdrop-blur-sm">
                        <div className="text-[#737373] text-xs font-medium">Carrier Trunking</div>
                        <div className="font-mono font-bold text-sm mt-1">$0.020 / min</div>
                        <div className="text-[11px] text-[#737373] mt-0.5">Inbound & Outbound VoIP</div>
                    </div>
                </div>
            </div>

            {/* SaaS Subscription Plans & Active Quota */}
            <SubscriptionPlanSection onSubscriptionUpdated={handleRefresh} />

            {/* Quick Overview Stat Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-semibold uppercase tracking-wider">Wallet Balance</CardDescription>
                        <CardTitle className="text-2xl font-bold font-mono text-[#171717] dark:text-[#7186AD]">
                            ${platformWalletUsd.toFixed(2)} USD
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-[#737373]">
                            {platformWalletUsd > 0 ? "Ready for inbound & outbound calls" : "Please top up to start calling"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-semibold uppercase tracking-wider">Total Calls Recorded</CardDescription>
                        <CardTitle className="text-2xl font-bold">{totalRuns}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-[#737373]">
                            {totalDurationMinutes > 0 ? `${totalDurationMinutes} min total talk duration` : "No calls recorded yet"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="text-xs font-semibold uppercase tracking-wider">Effective Rate</CardDescription>
                        <CardTitle className="text-2xl font-bold font-mono">$0.06 / min</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-[#737373]">
                            All-inclusive: STT + LLM + TTS + Telephony
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Call Usage & Deductions Table */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <CardTitle className="text-xl font-bold">Recent Call Usage & Wallet Deductions</CardTitle>
                        <CardDescription className="text-xs text-[#737373] mt-0.5">
                            Real-time breakdown of per-conversation duration and amount deducted from your wallet.
                        </CardDescription>
                    </div>
                    {totalRuns > 0 && (
                        <Badge variant="outline" className="w-fit text-xs font-mono">
                            {totalRuns} Total Conversations
                        </Badge>
                    )}
                </CardHeader>
                <CardContent>
                    {runsList.length > 0 ? (
                        <div className="rounded-lg border overflow-x-auto shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#F7F7F7]">
                                        <TableHead className="font-semibold">Date & Time</TableHead>
                                        <TableHead className="font-semibold">Agent / Workflow</TableHead>
                                        <TableHead className="font-semibold">Run ID</TableHead>
                                        <TableHead className="font-semibold">Type</TableHead>
                                        <TableHead className="font-semibold">Duration</TableHead>
                                        <TableHead className="font-semibold">Cost Deducted</TableHead>
                                        <TableHead className="font-semibold">Disposition</TableHead>
                                        <TableHead className="font-semibold text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {runsList.map((run) => {
                                        const cost = typeof run.charge_usd === 'number'
                                            ? run.charge_usd
                                            : run.call_duration_seconds > 0
                                            ? (run.call_duration_seconds / 60) * 0.06
                                            : 0;

                                        return (
                                            <TableRow key={run.id} className="hover:bg-[#F7F7F7]">
                                                <TableCell className="text-sm whitespace-nowrap">
                                                    {formatDateTime(run.created_at, organizationTimezone)}
                                                </TableCell>
                                                <TableCell className="font-medium text-sm">
                                                    {run.workflow_name || run.name || `Workflow #${run.workflow_id}`}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    #{run.id}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="text-[11px] capitalize">
                                                        {run.call_type || run.mode || "call"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm whitespace-nowrap font-mono">
                                                    {formatDuration(run.call_duration_seconds)}
                                                </TableCell>
                                                <TableCell className="text-sm font-mono font-semibold text-[#171717] dark:text-[#7186AD] whitespace-nowrap">
                                                    {cost > 0 ? `$${cost.toFixed(4)}` : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {run.disposition ? (
                                                        <Badge variant="outline" className="text-[11px]">
                                                            {run.disposition}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-[#737373]">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="h-8 gap-1 text-xs"
                                                    >
                                                        <Link
                                                            href={`/workflow/${run.workflow_id}/run/${run.id}`}
                                                            target="_blank"
                                                        >
                                                            View Run
                                                            <HugeiconsIcon icon={ExternalLinkIcon} className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed p-10 text-center">
                            <HugeiconsIcon icon={PhoneCallIcon} className="mx-auto h-10 w-10 text-[#737373]/50 mb-3" />
                            <h3 className="font-semibold text-base">No Call Usage Recorded Yet</h3>
                            <p className="text-sm text-[#737373] mt-1 max-w-sm mx-auto">
                                Once you test an agent via phone call or web call, per-second usage and wallet deductions will appear here automatically.
                            </p>
                            <Button asChild className="mt-4" size="sm">
                                <Link href="/workflows">Go to Agents</Link>
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <p className="text-xs text-[#737373]">
                                Page {currentPage} of {totalPages} ({totalRuns} total calls)
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1 || loading || refreshing}
                                >
                                    <HugeiconsIcon icon={ChevronLeftIcon} className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages || loading || refreshing}
                                >
                                    Next
                                    <HugeiconsIcon icon={ChevronRightIcon} className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Wallet Recharge History & Receipts */}

            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={ReceiptIcon} className="h-5 w-5 text-[#171717] dark:text-[#7186AD]" />
                            <CardTitle className="text-xl font-bold">Wallet Recharges & Receipts</CardTitle>
                        </div>
                        <CardDescription className="text-xs text-[#737373] mt-0.5">
                            Order receipts with custom identification. Search or filter by Receipt ID in your Razorpay Dashboard.
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRechargeModalOpen(true)}
                        className="gap-1.5 border-[#DCE3EF] text-[#171717] dark:text-[#7186AD] hover:bg-[#F0F3F9]"
                    >
                        <HugeiconsIcon icon={CreditCardIcon} className="h-3.5 w-3.5" />
                        Top Up Balance
                    </Button>
                </CardHeader>
                <CardContent>
                    {loadingTransactions ? (
                        <div className="space-y-2 py-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : transactions.length > 0 ? (
                        <div className="rounded-lg border overflow-x-auto shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-[#F7F7F7]">
                                        <TableHead className="font-semibold">Date & Time</TableHead>
                                        <TableHead className="font-semibold">Receipt ID (RZP Dashboard)</TableHead>
                                        <TableHead className="font-semibold">Credits & Amount Paid</TableHead>
                                        <TableHead className="font-semibold">Payment / Order ID</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((tx) => {
                                        const isPaid = tx.status === "paid";
                                        const isFailed = tx.status === "failed";
                                        const isCopied = copiedReceipt === tx.receipt;

                                        return (
                                            <TableRow key={tx.id} className="hover:bg-[#F7F7F7]">
                                                <TableCell className="text-sm whitespace-nowrap">
                                                    {tx.created_at
                                                        ? formatDateTime(tx.created_at, organizationTimezone)
                                                        : "-"}
                                                </TableCell>
                                                <TableCell className="text-sm font-mono whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold text-foreground">
                                                            {tx.receipt}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleCopyReceipt(tx.receipt)}
                                                            className="text-[#737373] hover:text-foreground transition-colors p-1 rounded hover:bg-[#F7F7F7]"
                                                            title="Copy Receipt ID for Razorpay Dashboard"
                                                        >
                                                            {isCopied ? (
                                                                <HugeiconsIcon icon={CheckIcon} className="h-3.5 w-3.5 text-[#7186AD]" />
                                                            ) : (
                                                                <HugeiconsIcon icon={Copy01Icon} className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm font-mono whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-[#171717] dark:text-[#7186AD]">
                                                            +${Number(tx.amount_usd).toFixed(2)} USD
                                                        </span>
                                                        {tx.amount_inr > 0 && (
                                                            <span className="text-[11px] text-[#737373] font-normal">
                                                                ₹{Number(tx.amount_inr).toFixed(2)} INR (incl. GST)
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-mono text-[#737373] whitespace-nowrap">
                                                    {tx.razorpay_payment_id || tx.razorpay_order_id}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            isPaid
                                                                ? "bg-[#F0F3F9] text-[#171717] dark:text-[#7186AD] border-[#DCE3EF] text-xs px-2 py-0.5"
                                                                : isFailed
                                                                ? "bg-destructive/15 text-destructive border-destructive/30 text-xs px-2 py-0.5"
                                                                : "bg-[#E5E5E5]/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs px-2 py-0.5"
                                                        }
                                                    >
                                                        {isPaid ? "Paid & Credited" : isFailed ? "Failed" : "Pending"}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed p-8 text-center">
                            <HugeiconsIcon icon={ReceiptIcon} className="mx-auto h-9 w-9 text-[#737373]/40 mb-2.5" />
                            <h3 className="font-semibold text-sm">No Recharge Transactions Yet</h3>
                            <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
                                Once you recharge your organization wallet via Razorpay, transaction receipts and payment references will be logged here.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recharge Wallet Modal */}
            <RechargeWalletModal
                open={rechargeModalOpen}
                onOpenChange={setRechargeModalOpen}
                currentBalanceUsd={platformWalletUsd}
                onSuccess={handleRefresh}
            />
        </div>
    );
}

