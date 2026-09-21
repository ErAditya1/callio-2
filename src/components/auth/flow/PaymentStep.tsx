"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CreditCardIcon,
  LockIcon,
  SmartphoneIcon,
} from "@hugeicons/core-free-icons";;
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// PLACEHOLDER — confirm the real launch price. Shown in INR (en-IN formatting).
const PRICE_INR = 4999;
const GST_RATE = 0.18;

const gst = Math.round(PRICE_INR * GST_RATE);
const total = PRICE_INR + gst;

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function isValidUpiId(v: string) {
  return /^[\w.\-]{2,}@[a-zA-Z]{2,}/.test(v.trim());
}

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  agentName?: string;
  contactCount?: number | null;
}

export function PaymentStep({ onNext, onBack, agentName, contactCount }: PaymentStepProps) {
  const [method, setMethod] = useState<"upi" | "card">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const formatCardNumber = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  const handlePay = () => {
    if (method === "upi") {
      if (!isValidUpiId(upiId)) {
        toast.error("Enter a valid UPI ID (e.g. yourname@okhdfc).");
        return;
      }
    } else {
      if (cardNumber.replace(/\D/g, "").length !== 16) {
        toast.error("Enter the 16-digit card number.");
        return;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        toast.error("Enter the expiry as MM/YY.");
        return;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        toast.error("Enter the 3–4 digit CVV.");
        return;
      }
      if (!cardName.trim()) {
        toast.error("Enter the name on the card.");
        return;
      }
    }
    try {
      window.localStorage.setItem(
        "demo_payment",
        JSON.stringify({ method, amount: total, currency: "INR" })
      );
    } catch {
      // Non-fatal for the demo flow.
    }
    onNext();
  };

  const methodCard = (active: boolean) =>
    `flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all ${
      active
        ? "border-neutral-200 bg-neutral-50 shadow-[0_1px_2px_rgba(16,16,20,0.04)]"
        : "border-neutral-200/70 bg-white hover:border-neutral-200 hover:bg-neutral-50/60"
    }`;

  return (
    <>
      <h1 className="mt-10 text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-[#0b0b0e] sm:text-[36px]">
        Complete payment
      </h1>
      <p className="mt-3 text-[16px] leading-[1.6] text-[#5b5c64]">
        One plan, billed in INR. Your agent goes live right after.
      </p>

      {/* Single card — order summary + payment method with subtle shadow */}
      <Card className="mt-8 overflow-hidden rounded-2xl border-neutral-200/80 shadow-[0_1px_2px_rgba(16,16,20,0.04),0_4px_12px_-8px_rgba(16,16,20,0.06)]">
        <CardContent className="p-0">
          {/* Order summary */}
          <div className="space-y-4 px-6 py-5 sm:px-7 sm:py-6">
            <div>
              <h2 className="text-[13px] font-semibold tracking-[0.08em] text-neutral-500">Order Summary</h2>
              <p className="mt-1 text-[14px] font-medium text-[#0b0b0e]">AI Voice Agent · Starter Plan</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-neutral-100">
              <div className="flex items-center justify-between bg-neutral-50/70 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                <span>Item</span>
                <span>Amount</span>
              </div>
              <div className="divide-y divide-neutral-100 bg-white text-sm">
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-neutral-700">Starter Plan</span>
                  <span className="font-medium text-[#0b0b0e]">{inr(PRICE_INR)}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-neutral-700">Contacts included</span>
                  <span className="font-medium text-[#0b0b0e]">{contactCount ?? 3}</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 text-neutral-600">
                  <span>GST (18%)</span>
                  <span className="font-medium text-[#0b0b0e]">{inr(gst)}</span>
                </div>
                <div className="flex items-center justify-between bg-neutral-50/40 px-4 py-3">
                  <span className="font-semibold text-[#0b0b0e]">Total due</span>
                  <span className="font-semibold text-[#0b0b0e]">{inr(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-100" />

          {/* Payment method */}
          <div className="space-y-5 px-6 py-5 sm:px-7 sm:py-6">
            <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-[#0b0b0e]">Payment method</h2>
            <RadioGroup
              value={method}
              onValueChange={(v) => setMethod(v as "upi" | "card")}
              className="grid gap-2.5 sm:grid-cols-2"
              aria-label="Payment method"
            >
              <label className={methodCard(method === "upi")}>
                <RadioGroupItem
                  value="upi"
                  aria-label="Pay with UPI"
                  className="shrink-0 border-neutral-300 bg-white data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-900 [&_[data-slot=radio-group-indicator]>span]:bg-white data-[state=checked]:[&_[data-slot=radio-group-indicator]>span]:bg-white"
                />
                <HugeiconsIcon icon={SmartphoneIcon} className="size-5 shrink-0 text-neutral-700" />
                <span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                      Recommended
                    </span>
                    UPI
                  </span>
                  <span className="mt-0.5 block text-xs text-neutral-500">GPay · PhonePe · Paytm · BHIM</span>
                </span>
              </label>
              <label className={methodCard(method === "card")}>
                <RadioGroupItem value="card" aria-label="Pay with card" />
                <HugeiconsIcon icon={CreditCardIcon} className="size-5 shrink-0 text-neutral-700" />
                <span>
                  <span className="block text-sm font-semibold text-neutral-900">Card</span>
                  <span className="mt-0.5 block text-xs text-neutral-500">Credit / debit</span>
                </span>
              </label>
            </RadioGroup>

            {method === "upi" ? (
              <div className="space-y-2">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input
                  id="upi-id"
                  placeholder="yourname@okhdfc"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  inputMode="email"
                  autoComplete="off"
                  className="h-11 rounded-xl"
                />
                <p className="text-xs text-neutral-400">You&apos;ll get a collect request in your UPI app.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      className="h-11 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      inputMode="numeric"
                      type="password"
                      autoComplete="cc-csc"
                      className="h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">Name on card</Label>
                  <Input
                    id="card-name"
                    placeholder="Full name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    autoComplete="cc-name"
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={handlePay}
              className="h-12 w-full rounded-full bg-neutral-950 text-[15px] font-medium text-white hover:bg-neutral-800"
            >
              <HugeiconsIcon icon={LockIcon} className="size-4" />
              Pay {inr(total)}
            </Button>
            <p className="text-center text-xs text-neutral-400">256-bit encrypted · Demo checkout, no real charge is made.</p>
          </div>
        </CardContent>
      </Card>

      <button
        type="button"
        onClick={onBack}
        className="mt-5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
      >
        Back
      </button>
    </>
  );
}
