'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Building02Icon,
  CheckmarkCircle02Icon,
  CreditCardIcon,
  Dollar01Icon,
  Loading02Icon,
  PlusIcon,
  Search01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";;
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface OrgWalletItem {
  id: number;
  provider_id: string;
  wallet_balance_usd: number;
  created_at: string | null;
}

export function SuperadminWalletManager() {
  const [orgs, setOrgs] = useState<OrgWalletItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<OrgWalletItem | null>(null);
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [amountUsd, setAmountUsd] = useState('20.00');
  const [description, setDescription] = useState('Platform trial credit grant');
  const [submitting, setSubmitting] = useState(false);

  const { getAccessToken } = useAuth();

  const fetchOrgs = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await fetch('/api/v1/superuser/organizations', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        setOrgs(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      toast.error('Failed to load organization wallets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const handleGrantCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;

    const parsedAmount = parseFloat(amountUsd);
    if (isNaN(parsedAmount) || parsedAmount === 0) {
      toast.error('Enter a valid non-zero amount');
      return;
    }

    setSubmitting(true);
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/superuser/organizations/${selectedOrg.id}/credits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount_usd: parsedAmount,
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to grant credits');
      }

      toast.success(data.message || `Granted $${parsedAmount.toFixed(2)} to Org #${selectedOrg.id}`);
      setGrantModalOpen(false);
      setSelectedOrg(null);
      await fetchOrgs();
    } catch (err: any) {
      toast.error(err.message || 'Error updating wallet');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrgs = orgs.filter((org) => {
    const q = searchQuery.toLowerCase();
    return (
      org.id.toString().includes(q) ||
      (org.provider_id && org.provider_id.toLowerCase().includes(q))
    );
  });

  const totalPlatformBalance = orgs.reduce((sum, o) => sum + (o.wallet_balance_usd || 0), 0);

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <HugeiconsIcon icon={Dollar01Icon} className="h-5 w-5" />
            </span>
            <CardTitle className="text-xl">Organization Wallets &amp; Credit Grants</CardTitle>
          </div>
          <CardDescription>
            View customer credit balances and manually grant or adjust calling credits. Calls require a positive balance to initiate.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-1.5 px-3 text-xs font-mono">
            Total Circulating: ${totalPlatformBalance.toFixed(2)} USD
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Org ID or Provider ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm h-9"
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Showing {filteredOrgs.length} of {orgs.length} organizations
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
            <HugeiconsIcon icon={Loading02Icon} className="h-5 w-5 animate-spin mr-2" /> Loading organization wallets...
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center bg-muted/20">
            <HugeiconsIcon icon={Building02Icon} className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium">No Organizations Found</p>
          </div>
        ) : (
          <div className="rounded-lg border divide-y overflow-hidden">
            {filteredOrgs.map((org) => {
              const balance = org.wallet_balance_usd || 0;
              const isPositive = balance > 0;

              return (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground font-mono text-xs font-bold">
                      #{org.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          Org {org.id}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                          {org.provider_id}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Registered: {org.created_at ? new Date(org.created_at).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`font-mono text-base font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                        ${balance.toFixed(4)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {isPositive ? 'Active Balance' : 'Insufficient Credits'}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrg(org);
                        setGrantModalOpen(true);
                      }}
                      className="text-xs h-8 gap-1.5"
                    >
                      <HugeiconsIcon icon={PlusIcon} className="h-3.5 w-3.5" /> Top-Up Credits
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Grant Credits Dialog */}
      <Dialog open={grantModalOpen} onOpenChange={setGrantModalOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedOrg && (
            <form onSubmit={handleGrantCredits} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <HugeiconsIcon icon={SparklesIcon} className="h-5 w-5 text-emerald-500" />
                  Grant Platform Credits to Org #{selectedOrg.id}
                </DialogTitle>
                <DialogDescription>
                  Current Wallet Balance: <strong className="text-foreground">${(selectedOrg.wallet_balance_usd || 0).toFixed(4)} USD</strong>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2">
                <Label htmlFor="creditAmount">Amount to Add (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">$</span>
                  <Input
                    id="creditAmount"
                    type="number"
                    step="1"
                    min="1"
                    value={amountUsd}
                    onChange={(e) => setAmountUsd(e.target.value)}
                    className="pl-7 font-mono text-base font-semibold"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  {[10, 25, 50, 100].map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 flex-1"
                      onClick={() => setAmountUsd(preset.toString())}
                    >
                      +${preset}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditDesc">Reason / Description</Label>
                <Input
                  id="creditDesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Platform trial credit grant"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setGrantModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  {submitting ? (
                    <>
                      <HugeiconsIcon icon={Loading02Icon} className="mr-2 h-4 w-4 animate-spin" /> Adding...
                    </>
                  ) : (
                    `Add $${parseFloat(amountUsd || '0').toFixed(2)} Credits`
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
