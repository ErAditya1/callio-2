'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Banknote,
  Coins,
  Percent,
  Calculator,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface PlatformSettings {
  usd_to_inr_rate: number;
  gst_percentage: number;
}

export function SuperadminSettingsManager() {
  const [settings, setSettings] = useState<PlatformSettings>({
    usd_to_inr_rate: 86.0,
    gst_percentage: 18.0,
  });
  const [rateInput, setRateInput] = useState<string>('86.00');
  const [gstInput, setGstInput] = useState<string>('18.00');
  const [previewUsd, setPreviewUsd] = useState<string>('10');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const { getAccessToken } = useAuth();

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await fetch('/api/v1/superuser/platform/settings', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data: PlatformSettings = await res.json();
        setSettings(data);
        setRateInput(String(data.usd_to_inr_rate));
        setGstInput(String(data.gst_percentage));
      } else {
        toast.error('Failed to fetch platform settings');
      }
    } catch (err) {
      console.error('Error fetching platform settings:', err);
      toast.error('Failed to load currency settings');
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const rateVal = parseFloat(rateInput);
    const gstVal = parseFloat(gstInput);

    if (isNaN(rateVal) || rateVal <= 0) {
      toast.error('Please enter a valid positive USD to INR conversion rate');
      return;
    }

    if (isNaN(gstVal) || gstVal < 0 || gstVal > 100) {
      toast.error('Please enter a valid GST percentage between 0 and 100');
      return;
    }

    try {
      setSaving(true);
      const token = await getAccessToken();
      const res = await fetch('/api/v1/superuser/platform/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          usd_to_inr_rate: rateVal,
          gst_percentage: gstVal,
        }),
      });

      if (res.ok) {
        const updated: PlatformSettings = await res.json();
        setSettings(updated);
        setRateInput(String(updated.usd_to_inr_rate));
        setGstInput(String(updated.gst_percentage));
        toast.success(
          `Exchange rate updated to ₹${updated.usd_to_inr_rate.toFixed(2)} INR per $1 USD`
        );
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.detail || 'Failed to update platform settings');
      }
    } catch (err) {
      console.error('Error updating platform settings:', err);
      toast.error('Network error updating settings');
    } finally {
      setSaving(false);
    }
  };

  // Live conversion simulator values
  const simUsd = Math.max(0, parseFloat(previewUsd) || 0);
  const simRate = Math.max(0, parseFloat(rateInput) || settings.usd_to_inr_rate || 86.0);
  const simGst = Math.max(0, parseFloat(gstInput) || settings.gst_percentage || 18.0);
  const simSubtotal = Math.round(simUsd * simRate * 100) / 100;
  const simGstAmount = Math.round(simSubtotal * (simGst / 100) * 100) / 100;
  const simTotal = Math.round((simSubtotal + simGstAmount) * 100) / 100;

  const hasUnsavedChanges =
    parseFloat(rateInput) !== settings.usd_to_inr_rate ||
    parseFloat(gstInput) !== settings.gst_percentage;

  return (
    <div className="space-y-6">
      {/* Header card with status overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 via-background to-background border-emerald-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Exchange Rate
              </span>
              <Coins className="h-4 w-4 text-emerald-500" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              ₹{settings.usd_to_inr_rate.toFixed(2)}{' '}
              <span className="text-xs font-medium text-muted-foreground">/ $1.00 USD</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Applied live to all new recharge orders
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 via-background to-background border-blue-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active GST Rate
              </span>
              <Percent className="h-4 w-4 text-blue-500" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              {settings.gst_percentage.toFixed(1)}%{' '}
              <span className="text-xs font-medium text-muted-foreground">GST</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
              Calculated on Indian rupee subtotal
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 via-background to-background border-purple-500/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Zero-Downtime Cache
              </span>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
              Instant Sync
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-purple-500" />
              Changes take effect without server restart
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Configuration & Simulator Card */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Form: Rate Configuration (3 cols) */}
        <Card className="lg:col-span-3 border-border/80 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Banknote className="h-4 w-4" />
                </span>
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Configure Conversion Rates
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Update the USD to INR rate and tax percentage applied to user wallet transactions.
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchSettings}
                disabled={loading}
                className="h-8 w-8 p-0"
                title="Refresh settings from server"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="usd_to_inr_rate" className="text-sm font-medium flex items-center gap-1.5">
                  USD to INR Conversion Rate (₹ per $1 USD)
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold text-sm">
                    ₹
                  </span>
                  <Input
                    id="usd_to_inr_rate"
                    type="number"
                    step="0.01"
                    min="1"
                    max="1000"
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                    className="pl-8 font-mono text-base"
                    placeholder="86.00"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Current database value: <span className="font-semibold text-foreground">₹{settings.usd_to_inr_rate.toFixed(2)}</span>.
                  Razorpay orders calculate INR subtotal as: <code className="bg-muted px-1 py-0.5 rounded text-[11px]">amount_usd × rate</code>.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gst_percentage" className="text-sm font-medium flex items-center gap-1.5">
                  GST Percentage (%)
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="gst_percentage"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={gstInput}
                    onChange={(e) => setGstInput(e.target.value)}
                    className="pr-8 font-mono text-base"
                    placeholder="18.0"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-muted-foreground font-semibold text-sm">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Current GST: <span className="font-semibold text-foreground">{settings.gst_percentage.toFixed(1)}%</span>.
                  Applied on top of INR subtotal during Razorpay checkout.
                </p>
              </div>

              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>You have unsaved changes. Click &quot;Save Platform Settings&quot; to apply.</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={saving || !hasUnsavedChanges}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 font-medium"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Platform Settings'}
                </Button>

                {hasUnsavedChanges && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setRateInput(String(settings.usd_to_inr_rate));
                      setGstInput(String(settings.gst_percentage));
                    }}
                    disabled={saving}
                  >
                    Reset
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Right Form: Live Calculator Simulator (2 cols) */}
        <Card className="lg:col-span-2 border-border/80 shadow-sm bg-muted/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <Calculator className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-base font-semibold">Live Recharge Simulator</CardTitle>
                <CardDescription className="text-xs">
                  Preview how customers will be billed at current form values.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="preview_usd" className="text-xs font-medium text-muted-foreground">
                Sample USD Wallet Top-up ($)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-muted-foreground font-semibold text-xs">
                  $
                </span>
                <Input
                  id="preview_usd"
                  type="number"
                  min="1"
                  step="1"
                  value={previewUsd}
                  onChange={(e) => setPreviewUsd(e.target.value)}
                  className="pl-7 h-9 font-mono text-sm"
                />
              </div>
            </div>

            <div className="rounded-lg border bg-card p-3 space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Wallet Credit (USD):</span>
                <span className="font-mono font-semibold text-foreground">${simUsd.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Exchange Multiplier:</span>
                <span className="font-mono font-semibold text-foreground">₹{simRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Subtotal (INR):</span>
                <span className="font-mono font-semibold text-foreground">₹{simSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>GST ({simGst.toFixed(1)}%):</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  +₹{simGstAmount.toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-2 mt-1 flex justify-between items-center font-bold text-sm">
                <span>Customer Pays (INR):</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-mono text-base">
                  ₹{simTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              When a user clicks &quot;Pay via Razorpay&quot;, the order is created with this exact total in paise (<code className="font-mono text-[10px] bg-muted px-1 py-0.5 rounded">{Math.round(simTotal * 100)} paise</code>).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
