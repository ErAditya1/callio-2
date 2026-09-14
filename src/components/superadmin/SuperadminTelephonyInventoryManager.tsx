'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Phone,
  Plus,
  Trash2,
  Loader2,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  Users,
  Lock,
  Globe,
  Settings2,
  Radio,
  Copy,
  LayoutList,
  LayoutGrid,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { ConfigFormDialog } from '@/components/telephony/ConfigFormDialog';
import { listTelephonyConfigurationsApiV1OrganizationsTelephonyConfigsGet } from '@/client/sdk.gen';
import type { TelephonyConfigurationListItem } from '@/client/types.gen';

interface InventoryNumber {
  id: number;
  phone_number: string;
  carrier?: string;
  provider?: string;
  configuration_id?: number;
  configuration_name?: string;
  pool_type: 'shared_trial' | 'dedicated';
  monthly_price_cents: number;
  assigned_organization_id: number | null;
  is_active?: boolean;
  created_at?: string;
}

export function SuperadminTelephonyInventoryManager() {
  const { user, getAccessToken } = useAuth();

  const [numbers, setNumbers] = useState<InventoryNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Dialog States
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Telephony Configurations from Server
  const [configs, setConfigs] = useState<TelephonyConfigurationListItem[]>([]);
  const [loadingConfigs, setLoadingConfigs] = useState(false);

  // Stock Form State
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [poolType, setPoolType] = useState<'shared_trial' | 'dedicated'>('shared_trial');
  const [phoneNumbers, setPhoneNumbers] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('US');
  const [label, setLabel] = useState<string>('');
  const [monthlyPriceCents, setMonthlyPriceCents] = useState<number>(200);

  // Load Inventory list
  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      const res = await fetch('/api/v1/superuser/telephony/inventory', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        setNumbers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      toast.error('Failed to load platform inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getAccessToken]);

  // Load dynamic Telephony Configurations matching /telephony-configurations
  const fetchConfigs = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingConfigs(true);
      const token = await getAccessToken();
      const res = await listTelephonyConfigurationsApiV1OrganizationsTelephonyConfigsGet({
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data?.configurations ?? [];
      setConfigs(items);
      if (items.length > 0 && !selectedConfigId) {
        setSelectedConfigId(String(items[0].id));
      }
    } catch (err) {
      console.error('Failed to load telephony configurations', err);
    } finally {
      setLoadingConfigs(false);
    }
  }, [user, getAccessToken, selectedConfigId]);

  useEffect(() => {
    fetchInventory();
    fetchConfigs();
  }, [fetchInventory, fetchConfigs]);

  const activeSelectedConfig = configs.find(
    (c) => String(c.id) === String(selectedConfigId),
  );

  const handleStockNumbers = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConfigId) {
      toast.error('Please select a telephony provider configuration');
      return;
    }

    const rawNumbers = phoneNumbers
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (rawNumbers.length === 0) {
      toast.error('Please enter at least one phone number (E.164 format)');
      return;
    }

    setSubmitting(true);
    try {
      const token = await getAccessToken();
      const numberItems = rawNumbers.map((addr) => ({
        address: addr,
        country_code: countryCode.trim().toUpperCase() || 'US',
        pool_type: poolType,
        monthly_price_cents: poolType === 'shared_trial' ? 0 : Number(monthlyPriceCents),
        label: label.trim() || undefined,
      }));

      const res = await fetch('/api/v1/superuser/telephony/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          telephony_configuration_id: Number(selectedConfigId),
          numbers: numberItems,
        }),
      });

      const responseText = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { detail: responseText || `Server returned status ${res.status}` };
      }

      if (!res.ok) {
        throw new Error(data.detail || `Failed to stock inventory numbers (${res.status})`);
      }

      toast.success(
        `Successfully stocked ${numberItems.length} number${
          numberItems.length > 1 ? 's' : ''
        } into platform inventory!`,
      );
      setStockModalOpen(false);
      setPhoneNumbers('');
      setLabel('');
      await fetchInventory();
    } catch (err: any) {
      toast.error(err.message || 'Error stocking inventory number');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, phone: string) => {
    if (!confirm(`Are you sure you want to remove ${phone} from platform inventory?`)) {
      return;
    }

    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/superuser/telephony/inventory/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error('Failed to delete number');
      toast.success(`Number ${phone} removed from inventory`);
      await fetchInventory();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting inventory number');
    }
  };

  const handleCopyNumber = (phone: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(phone);
      toast.success(`Copied ${phone} to clipboard`);
    }
  };

  const sharedCount = numbers.filter((n) => n.pool_type === 'shared_trial').length;
  const dedicatedCount = numbers.filter((n) => n.pool_type === 'dedicated').length;
  const claimedCount = numbers.filter((n) => n.assigned_organization_id !== null).length;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Phone className="h-5 w-5" />
            </span>
            <CardTitle className="text-xl">Platform Telephony Inventory &amp; Testing Numbers</CardTitle>
          </div>
          <CardDescription>
            Stock carrier numbers for users. Shared trial numbers allow all users to test agents without launching live bulk campaigns. Dedicated numbers are claimable in the marketplace.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setConfigModalOpen(true)}
            className="gap-1.5"
          >
            <Settings2 className="h-4 w-4 text-blue-600" />
            Add Telephony Configuration
          </Button>

          <Button
            onClick={() => {
              fetchConfigs();
              setStockModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Stock Inventory Numbers
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metric Badges & View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              Total Stocked: <span className="font-bold">{numbers.length}</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-blue-500/30 text-blue-600 dark:text-blue-400">
              <Users className="h-3.5 w-3.5" />
              Shared Trial: <span className="font-bold">{sharedCount}</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-purple-500/30 text-purple-600 dark:text-purple-400">
              <Lock className="h-3.5 w-3.5" />
              Dedicated: <span className="font-bold">{dedicatedCount}</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Claimed: <span className="font-bold">{claimedCount}</span>
            </Badge>
          </div>

          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border ml-auto">
            <Button
              type="button"
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2.5 text-xs gap-1.5 font-medium shadow-none"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-3.5 w-3.5" />
              List
            </Button>
            <Button
              type="button"
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2.5 text-xs gap-1.5 font-medium shadow-none"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Cards
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading telephony inventory...
          </div>
        ) : numbers.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center bg-muted/20">
            <Phone className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium">No Numbers in Platform Inventory</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Stock shared trial numbers so users can instantly test agents, or add dedicated numbers for users to provision directly from their telephony settings.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfigModalOpen(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Telephony Configuration
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white"
                onClick={() => setStockModalOpen(true)}
              >
                Stock Phone Numbers
              </Button>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="rounded-xl border overflow-hidden bg-card/60 shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold text-xs py-3">Phone Number</TableHead>
                  <TableHead className="font-semibold text-xs py-3">Carrier / Configuration</TableHead>
                  <TableHead className="font-semibold text-xs py-3">Pool Type</TableHead>
                  <TableHead className="font-semibold text-xs py-3">Monthly Price</TableHead>
                  <TableHead className="font-semibold text-xs py-3">Status / Assignment</TableHead>
                  <TableHead className="font-semibold text-xs py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {numbers.map((num) => {
                  const isShared = num.pool_type === 'shared_trial';
                  const isClaimed = num.assigned_organization_id !== null;
                  const providerDisplayName = num.carrier || num.provider || 'Carrier';

                  return (
                    <TableRow key={num.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-mono font-bold text-sm py-3.5">
                        <div className="flex items-center gap-2">
                          <span>{num.phone_number}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => handleCopyNumber(num.phone_number)}
                            title="Copy number"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold capitalize text-foreground">
                            {providerDisplayName}
                          </span>
                          {num.configuration_name && (
                            num.configuration_id ? (
                              <Link
                                href={`/telephony-configurations/${num.configuration_id}`}
                                className="text-muted-foreground hover:text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
                                title={num.configuration_name}
                              >
                                <span className="truncate max-w-[180px]">{num.configuration_name}</span>
                                <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                              </Link>
                            ) : (
                              <span className="text-muted-foreground text-[11px] truncate max-w-[180px]">
                                {num.configuration_name}
                              </span>
                            )
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <Badge
                          variant={isShared ? 'default' : 'outline'}
                          className={`text-[11px] font-medium py-0.5 px-2 ${
                            isShared
                              ? 'bg-blue-600 text-white hover:bg-blue-600'
                              : 'border-purple-500/40 text-purple-600 dark:text-purple-400'
                          }`}
                        >
                          {isShared ? 'Shared Trial' : 'Dedicated'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-medium">
                        {isShared ? (
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">Free Testing</span>
                        ) : (
                          <span>${(num.monthly_price_cents / 100).toFixed(2)}/mo</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs">
                        {isShared ? (
                          <div className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded-md text-[11px]">
                            <Users className="h-3 w-3 shrink-0" />
                            <span>Public Testing (All Orgs)</span>
                          </div>
                        ) : isClaimed ? (
                          <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-md text-[11px]">
                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                            <span>Claimed (Org #{num.assigned_organization_id})</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-muted-foreground bg-muted/60 px-2 py-1 rounded-md text-[11px]">
                            <Sparkles className="h-3 w-3 shrink-0 text-amber-500" />
                            <span>Available in Marketplace</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(num.id, num.phone_number)}
                            className="text-xs h-7 text-destructive hover:bg-destructive/10 px-2"
                            title="Remove number from inventory"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {numbers.map((num) => {
              const isShared = num.pool_type === 'shared_trial';
              const isClaimed = num.assigned_organization_id !== null;
              const providerDisplayName = num.carrier || num.provider || 'Carrier';

              return (
                <div
                  key={num.id}
                  className="flex flex-col justify-between p-4 rounded-xl border bg-card/60 hover:bg-card/90 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold tracking-tight">
                          {num.phone_number}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => handleCopyNumber(num.phone_number)}
                          title="Copy number"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <Badge
                        variant={isShared ? 'default' : 'outline'}
                        className={`text-[10px] ${
                          isShared
                            ? 'bg-blue-600 text-white'
                            : 'border-purple-500/40 text-purple-600 dark:text-purple-400'
                        }`}
                      >
                        {isShared ? 'Shared Trial' : 'Dedicated'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 flex-wrap">
                      <span className="capitalize font-semibold text-foreground">
                        {providerDisplayName}
                      </span>
                      {num.configuration_name && (
                        <>
                          <span>•</span>
                          {num.configuration_id ? (
                            <Link
                              href={`/telephony-configurations/${num.configuration_id}`}
                              className="truncate max-w-[140px] hover:underline text-blue-600 dark:text-blue-400 flex items-center gap-0.5"
                              title={num.configuration_name}
                            >
                              <span>{num.configuration_name}</span>
                              <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                            </Link>
                          ) : (
                            <span className="truncate max-w-[140px]" title={num.configuration_name}>
                              {num.configuration_name}
                            </span>
                          )}
                        </>
                      )}
                      <span>•</span>
                      <span>
                        {isShared ? 'Free Testing' : `$${(num.monthly_price_cents / 100).toFixed(2)}/mo`}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {isShared ? (
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium bg-blue-500/10 p-2 rounded-lg text-[11px]">
                          <Users className="h-3.5 w-3.5 shrink-0" />
                          <span>Usable by all users for agent testing. Live bulk campaigns blocked.</span>
                        </div>
                      ) : isClaimed ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded-lg text-[11px]">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          <span>Claimed by Org #{num.assigned_organization_id}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/40 p-2 rounded-lg text-[11px]">
                          <Sparkles className="h-3.5 w-3.5 shrink-0" />
                          <span>Available in Marketplace for claiming</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end border-t pt-3 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(num.id, num.phone_number)}
                      className="text-xs h-7 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Official Dynamic Add Telephony Configuration Dialog */}
      <ConfigFormDialog
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
        existing={null}
        suggestDefaultOutbound={false}
        onSaved={async () => {
          await fetchConfigs();
          toast.success("Telephony configuration created successfully!");
        }}
      />

      {/* Stock Platform Numbers Dialog using Existing / Connected Configurations */}
      <Dialog open={stockModalOpen} onOpenChange={setStockModalOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleStockNumbers} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Stock Platform Telephony Numbers
              </DialogTitle>
              <DialogDescription>
                Assign carrier phone numbers to a telephony configuration and make them available in the platform testing pool or marketplace. Phone numbers are added after the configuration is created.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Step 1: Telephony Configuration Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="stock-cfg-select" className="text-sm font-semibold">
                    1. Telephony Provider Configuration
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-blue-600 hover:text-blue-700 p-0"
                    onClick={() => {
                      setConfigModalOpen(true);
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add New Configuration
                  </Button>
                </div>

                {loadingConfigs ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading configurations...
                  </div>
                ) : configs.length === 0 ? (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs space-y-2">
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      No telephony configurations found
                    </p>
                    <p className="text-muted-foreground">
                      Connect a telephony provider account first. Phone numbers are added after the configuration is created.
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setConfigModalOpen(true)}
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs h-7"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Telephony Configuration
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Select
                      value={selectedConfigId}
                      onValueChange={(val) => setSelectedConfigId(val)}
                    >
                      <SelectTrigger id="stock-cfg-select">
                        <SelectValue placeholder="Select telephony configuration" />
                      </SelectTrigger>
                      <SelectContent>
                        {configs.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.name} ({c.provider})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {activeSelectedConfig && (
                      <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-md border">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] capitalize font-medium">
                            {activeSelectedConfig.provider}
                          </Badge>
                          <span>{activeSelectedConfig.name}</span>
                        </div>
                        <Link
                          href={`/telephony-configurations/${activeSelectedConfig.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          View Config <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 2: Pool Allocation & Phone Numbers */}
              <div className="space-y-4 border-t pt-4">
                <Label className="text-sm font-semibold">
                  2. Inventory Number(s) &amp; Allocation Pool
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock-pool-type">Pool Type</Label>
                    <Select value={poolType} onValueChange={(val: any) => setPoolType(val)}>
                      <SelectTrigger id="stock-pool-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shared_trial">Shared Trial (Free Sandbox Testing)</SelectItem>
                        <SelectItem value="dedicated">Dedicated (Marketplace Claimable)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock-country-code">Country Code Hint</Label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input
                        id="stock-country-code"
                        placeholder="US, IN, GB..."
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                        maxLength={3}
                        className="font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stock-phone-numbers">Phone Number(s) (E.164)</Label>
                    <span className="text-[11px] text-muted-foreground">
                      Comma or newline separated for multiple
                    </span>
                  </div>
                  <Textarea
                    id="stock-phone-numbers"
                    placeholder="+12025550143&#10;+12025550198"
                    value={phoneNumbers}
                    onChange={(e) => setPhoneNumbers(e.target.value)}
                    rows={3}
                    className="font-mono text-sm resize-y"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock-label">Label (Optional)</Label>
                    <Input
                      id="stock-label"
                      placeholder="e.g. US West Direct Dial"
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
                    />
                  </div>

                  {poolType === 'dedicated' && (
                    <div className="space-y-2">
                      <Label htmlFor="stock-monthly-price">Monthly Marketplace Price (Cents)</Label>
                      <Input
                        id="stock-monthly-price"
                        type="number"
                        min="0"
                        step="50"
                        value={monthlyPriceCents}
                        onChange={(e) => setMonthlyPriceCents(Number(e.target.value))}
                        placeholder="200 ($2.00)"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        {monthlyPriceCents} cents = ${(monthlyPriceCents / 100).toFixed(2)}/mo billed upon claiming.
                      </p>
                    </div>
                  )}
                </div>

                {poolType === 'shared_trial' && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-600 dark:text-blue-400">
                    <strong>Shared Trial Safety Rule:</strong> Numbers in the shared pool appear on user dashboards for free instant voice agent testing. Live bulk outbound campaigns are strictly blocked to prevent carrier abuse.
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2 border-t">
              <Button type="button" variant="outline" onClick={() => setStockModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !selectedConfigId}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Stocking Numbers...
                  </>
                ) : (
                  'Stock in Platform Inventory'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
