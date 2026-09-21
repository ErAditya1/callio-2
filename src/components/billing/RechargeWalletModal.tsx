"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Clock01Icon,
    CreditCardIcon,
    Loading02Icon,
    ReceiptIcon,
    ShieldCheckIcon,
    SparklesIcon,
    Wallet01Icon,
} from "@hugeicons/core-free-icons";;
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

interface RechargeWalletModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentBalanceUsd: number;
    onSuccess: () => void;
}

const PRESET_PACKAGES = [
    { usd: 10, minutes: 166, popular: false },
    { usd: 25, minutes: 416, popular: true },
    { usd: 50, minutes: 833, popular: false },
    { usd: 100, minutes: 1666, popular: false },
];

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && (window as any).Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export function RechargeWalletModal({
    open,
    onOpenChange,
    currentBalanceUsd,
    onSuccess,
}: RechargeWalletModalProps) {
    const auth = useAuth();
    const [selectedUsd, setSelectedUsd] = useState<number>(25);
    const [isCustom, setIsCustom] = useState<boolean>(false);
    const [customUsdInput, setCustomUsdInput] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [usdToInrRate, setUsdToInrRate] = useState<number>(86.0);
    const [gstPercentage, setGstPercentage] = useState<number>(18.0);

    const activeUsd = isCustom
        ? parseFloat(customUsdInput) || 0
        : selectedUsd;

    const estMinutes = Math.floor(activeUsd / 0.06);

    // Fetch live settings (USD_TO_INR_RATE and GST_PERCENTAGE) from backend config
    useEffect(() => {
        if (!open) return;
        const fetchConfig = async () => {
            try {
                const token = await auth.getAccessToken();
                const res = await fetch("/api/v1/payments/config", {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.usd_to_inr_rate) setUsdToInrRate(data.usd_to_inr_rate);
                    if (data.gst_percentage !== undefined) setGstPercentage(data.gst_percentage);
                }
            } catch (e) {
                // Fallback to defaults (86.0 rate, 18% GST)
            }
        };
        fetchConfig();
    }, [open]);

    // Financial calculations
    const subtotalInr = Math.round(activeUsd * usdToInrRate * 100) / 100;
    const gstAmountInr = Math.round(subtotalInr * (gstPercentage / 100) * 100) / 100;
    const totalPayableInr = Math.round((subtotalInr + gstAmountInr) * 100) / 100;

    const handleSelectPreset = (usd: number) => {
        setIsCustom(false);
        setSelectedUsd(usd);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // Allow only digits and optional single decimal point
        if (/^\d*\.?\d{0,2}$/.test(val)) {
            setCustomUsdInput(val);
        }
    };

    const handleProceedPayment = async () => {
        if (activeUsd < 1.0) {
            toast.error("Please enter a minimum recharge amount of $1.00 USD");
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Ensure Razorpay checkout script is loaded
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                toast.error("Failed to load Razorpay payment SDK. Please check your connection.");
                setIsProcessing(false);
                return;
            }

            // 2. Create order on backend with auth token (INR with GST)
            const token = await auth.getAccessToken();
            const orderRes = await fetch("/api/v1/payments/razorpay/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ amount_usd: activeUsd }),
            });

            if (!orderRes.ok) {
                const errData = await orderRes.json().catch(() => ({}));
                throw new Error(errData.detail || "Failed to initialize payment order");
            }

            const orderData = await orderRes.json();

            // 3. Open Razorpay Checkout modal (INR allows UPI, Cards, NetBanking, Wallets)
            const logoUrl = "https://callioai.cheetahagi.com/icon.png"
            const options = {
                key: orderData.key_id,
                amount: orderData.amount_paise,
                currency: orderData.currency || "INR",
                name: "CallioAI",
                image: logoUrl,
                description: `Calling Credits Top-up ($${orderData.amount_usd.toFixed(2)} USD)`,
                order_id: orderData.order_id,
                receipt: orderData.receipt,
                handler: async function (response: any) {
                    try {
                        const verifyToken = (await auth.getAccessToken()) || token;
                        const verifyRes = await fetch("/api/v1/payments/razorpay/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                ...(verifyToken ? { Authorization: `Bearer ${verifyToken}` } : {}),
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.success) {
                            toast.success(
                                `Payment verified! Added $${verifyData.amount_credited_usd.toFixed(2)} USD to your calling wallet.`,
                                {
                                    description: `Receipt: ${verifyData.receipt}`,
                                }
                            );
                            onOpenChange(false);
                            onSuccess();
                        } else {
                            toast.error(verifyData.detail || "Payment verification failed");
                        }
                    } catch (err: any) {
                        console.error("Verification error:", err);
                        toast.error("Error verifying payment with server");
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: (auth.user as any)?.name || "",
                    email: (auth.user as any)?.primaryEmail || (auth.user as any)?.email || "",
                },
                notes: {
                    platform: "CallioAI",
                    organization_id: String(orderData.organization_id),
                    receipt: orderData.receipt,
                    amount_usd: String(orderData.amount_usd),
                    usd_to_inr_rate: String(orderData.usd_to_inr_rate),
                    gst_amount_inr: String(orderData.gst_amount_inr),
                    total_inr: String(orderData.amount_inr),
                },
                theme: {
                    color: "#7186AD", // accent
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    },
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", function (resp: any) {
                console.error("Razorpay payment failed:", resp.error);
                toast.error(`Payment failed: ${resp.error?.description || "Unknown error"}`);
                setIsProcessing(false);
            });

            rzp.open();
        } catch (error: any) {
            console.error("Payment initiation error:", error);
            toast.error(error.message || "Failed to start payment");
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-[#E5E5E5]">
                {/* Modal Header with Gradient */}
                <div className="bg-[#F7F7F7] p-6 border-b border-[#E5E5E5]">
                    <DialogHeader className="text-left space-y-2">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F3F9] text-[#7186AD] dark:text-[#7186AD] border border-[#DCE3EF]">
                                <HugeiconsIcon icon={Wallet01Icon} className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold">
                                    Recharge Calling Wallet
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#737373] mt-0.5">
                                    Add funds to power inbound and outbound AI voice conversations
                                </DialogDescription>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-background/70 backdrop-blur-sm border border-[#E5E5E5] px-3.5 py-2 mt-2">
                            <span className="text-xs text-[#737373]">Current Balance</span>
                            <span className="text-sm font-bold font-mono text-foreground">
                                ${currentBalanceUsd.toFixed(2)} USD
                            </span>
                        </div>
                    </DialogHeader>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {/* Packages Grid */}
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#737373] block mb-2.5">
                            Select Recharge Package (USD)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {PRESET_PACKAGES.map((pkg) => {
                                const isSelected = !isCustom && selectedUsd === pkg.usd;
                                return (
                                    <button
                                        key={pkg.usd}
                                        type="button"
                                        onClick={() => handleSelectPreset(pkg.usd)}
                                        className={`relative flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all text-center ${isSelected
                                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-950 dark:text-indigo-100 shadow-sm ring-1 ring-indigo-500"
                                            : "border-border/70 hover:border-border hover:bg-muted/40"
                                            }`}
                                    >
                                        {pkg.popular && (
                                            <Badge
                                                variant="secondary"
                                                className="absolute -top-2.5 px-1.5 py-0 text-[10px] bg-neutral-950 text-white font-semibold shadow-xs"
                                            >
                                                Popular
                                            </Badge>
                                        )}
                                        <span className="text-xl font-bold font-mono">
                                            ${pkg.usd}
                                        </span>
                                        <span className="text-[11px] text-[#737373] mt-1 flex items-center gap-1">
                                            <HugeiconsIcon icon={Clock01Icon} className="h-3 w-3 inline" /> ~{pkg.minutes}m
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Custom Amount Toggle & Input */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCustom(!isCustom);
                                    if (!isCustom && !customUsdInput) {
                                        setCustomUsdInput("15");
                                    }
                                }}
                                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                                <HugeiconsIcon icon={SparklesIcon} className="h-3.5 w-3.5" />
                                {isCustom ? "Select from preset packages" : "Or enter custom amount in USD"}
                            </button>
                            {isCustom && (
                                <span className="text-[11px] text-[#737373]">
                                    Min $1.00 USD
                                </span>
                            )}
                        </div>

                        {isCustom && (
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373] font-mono font-medium">
                                        $
                                    </span>
                                    <Input
                                        type="text"
                                        placeholder="e.g. 15"
                                        value={customUsdInput}
                                        onChange={handleCustomChange}
                                        className="pl-7 font-mono text-sm"
                                        autoFocus
                                    />
                                </div>
                                <span className="text-xs font-mono text-[#737373]">USD</span>
                            </div>
                        )}
                    </div>

                    {/* Summary Card */}
                    <div className="rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] p-4 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-[#737373]">Calling Credits to Add</span>
                            <span className="font-semibold font-mono text-[#7186AD] dark:text-[#7186AD]">
                                +${activeUsd.toFixed(2)} USD
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-[#737373]">Estimated Calling Time</span>
                            <span className="font-semibold text-foreground">
                                ~{estMinutes} minutes (at ~$0.06/min)
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-[#737373]">Conversion Rate</span>
                            <span className="font-mono text-foreground">
                                $1 USD = ₹{usdToInrRate.toFixed(2)} INR
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-[#737373]">Base Amount</span>
                            <span className="font-mono text-foreground">
                                ₹{subtotalInr.toFixed(2)} INR
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-[#737373]">GST ({gstPercentage}%)</span>
                            <span className="font-mono text-foreground">
                                +₹{gstAmountInr.toFixed(2)} INR
                            </span>
                        </div>
                        <div className="border-t border-[#E5E5E5] pt-2 flex items-center justify-between">
                            <div>
                                <span className="text-sm font-semibold text-foreground block">
                                    Total Payable (INR)
                                </span>
                                <span className="text-[11px] text-[#737373]">
                                    UPI, NetBanking, Cards & Wallets
                                </span>
                            </div>
                            <span className="text-lg font-extrabold font-mono text-[#7186AD] dark:text-[#7186AD]">
                                ₹{totalPayableInr.toFixed(2)} INR
                            </span>
                        </div>
                    </div>

                    {/* Features / Assurance */}
                    <div className="flex flex-col gap-1.5 text-xs text-[#737373]">
                        <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={ShieldCheckIcon} className="h-4 w-4 text-[#7186AD] dark:text-[#7186AD] shrink-0" />
                            <span>Instant USD wallet crediting & 256-bit SSL encrypted checkout.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={ReceiptIcon} className="h-4 w-4 text-[#7186AD] shrink-0" />
                            <span>
                                Custom receipt ID automatically generated for easy Razorpay dashboard tracking.
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-[#F7F7F7] px-6 py-4 border-t border-[#E5E5E5] flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isProcessing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleProceedPayment}
                        disabled={isProcessing || activeUsd < 1.0}
                        className="bg-neutral-950 hover:bg-neutral-800 text-white font-semibold"
                    >
                        {isProcessing ? (
                            <>
                                <HugeiconsIcon icon={Loading02Icon} className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <HugeiconsIcon icon={CreditCardIcon} className="h-4 w-4 mr-2" />
                                Pay ₹{totalPayableInr.toFixed(2)} via Razorpay
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
