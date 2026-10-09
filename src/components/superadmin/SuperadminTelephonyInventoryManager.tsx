'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Copy01Icon,
  Delete02Icon,
  ExternalLinkIcon,
  GlobeIcon,
  Layers01Icon,
  LayoutGridIcon,
  LayoutListIcon,
  Loading02Icon,
  LockIcon,
  PhoneIcon,
  PlusIcon,
  RadioIcon,
  Settings02Icon,
  SparklesIcon,
  UsersIcon,
} from "@hugeicons/core-free-icons";;
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
  pool_type: 'shared_trial' | 'dedicated' | 'shared_multi_org';
  monthly_price_cents: number;
  assigned_organization_id: number | null;
  claimed_count?: number;
  is_active?: boolean;
  created_at?: string;
  extra_metadata?: Record<string, any>;
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
  const [poolType, setPoolType] = useState<'shared_trial' | 'dedicated' | 'shared_multi_org'>('shared_trial');
  const [phoneNumbers, setPhoneNumbers] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('US');
  const [label, setLabel] = useState<string>('');
  const [monthlyPriceCents, setMonthlyPriceCents] = useState<number>(200);
  const [smartfloBatchApiKey, setSmartfloBatchApiKey] = useState<string>('');
  const [smartfloBatchJwt, setSmartfloBatchJwt] = useState<string>('');

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
      const items = (res.data?.configurations ?? []).filter(
        (c) => !c.name.startsWith("Platform - ") && !c.is_claimed
      );
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
  const isSmartflo = activeSelectedConfig?.provider === 'smartflo';

  // Automatically switch country code to IN if Smartflo is selected
  useEffect(() => {
    if (isSmartflo && countryCode === 'US') {
      setCountryCode('IN');
    }
  }, [isSmartflo, countryCode]);

  // Compute live parsed preview of phone numbers + credentials
  const parsedPreview = React.useMemo(() => {
    if (!phoneNumbers.trim()) return [];
    const lines = phoneNumbers
      .split('\n')
      .flatMap((line) => {
        const trimmed = line.trim();
        if (!trimmed) return [];
        if (!trimmed.includes('|') && trimmed.includes(',')) {
          return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
        }
        return [trimmed];
      });

    return lines.map((line) => {
      const parts = line.split('|').map((p) => p.trim());
      const address = parts[0];
      const lineApiKey = parts[1] || '';
      const lineJwt = parts[2] || '';
      const effectiveApiKey = lineApiKey || (isSmartflo ? smartfloBatchApiKey.trim() : '');
      const effectiveJwt = lineJwt || (isSmartflo ? smartfloBatchJwt.trim() : '');
      return {
        address,
        apiKey: effectiveApiKey,
        jwt: effectiveJwt,
        isPerLineKey: Boolean(lineApiKey),
      };
    });
  }, [phoneNumbers, isSmartflo, smartfloBatchApiKey, smartfloBatchJwt]);

  const handleStockNumbers = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConfigId) {
      toast.error('Please select a telephony provider configuration');
      return;
    }

    const rawLines = phoneNumbers
      .split('\n')
      .flatMap((line) => {
        const trimmed = line.trim();
        if (!trimmed) return [];
        if (!trimmed.includes('|') && trimmed.includes(',')) {
          return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
        }
        return [trimmed];
      });

    if (rawLines.length === 0) {
      toast.error('Please enter at least one phone number (E.164 format)');
      return;
    }

    const numberItems = rawLines.map((line) => {
      const parts = line.split('|').map((p) => p.trim());
      const addr = parts[0];
      const lineApiKey = parts[1] || '';
      const lineJwt = parts[2] || '';

      const extraMetadata: Record<string, any> = {};
      if (isSmartflo) {
        const effectiveApiKey = lineApiKey || smartfloBatchApiKey.trim();
        const effectiveJwt = lineJwt || smartfloBatchJwt.trim();
        if (effectiveApiKey) {
          extraMetadata.click_to_call_api_key = effectiveApiKey;
        }
        if (effectiveJwt) {
          extraMetadata.smartflo_jwt_token = effectiveJwt;
        }
      }

      return {
        address: addr,
        country_code: countryCode.trim().toUpperCase() || (isSmartflo ? 'IN' : 'US'),
        pool_type: poolType,
        monthly_price_cents: poolType === 'shared_trial' ? 0 : Number(monthlyPriceCents),
        label: label.trim() || undefined,
        extra_metadata: Object.keys(extraMetadata).length > 0 ? extraMetadata : undefined,
      };
    });

    if (isSmartflo) {
      const missingKeyItem = numberItems.find(
        (item) => !item.extra_metadata?.click_to_call_api_key
      );
      if (missingKeyItem) {
        toast.error(
          `Number ${missingKeyItem.address} is missing a Smartflo Click-to-Call API Key. Enter a batch API key or use: +91XXXXXXXXXX | API_KEY`
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const token = await getAccessToken();
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
      setSmartfloBatchApiKey('');
      setSmartfloBatchJwt('');
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
  const multiOrgCount = numbers.filter((n) => n.pool_type === 'shared_multi_org').length;
  const claimedCount = numbers.filter((n) => n.assigned_organization_id !== null || (n.claimed_count && n.claimed_count > 0)).length;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <HugeiconsIcon icon={PhoneIcon} className="h-5 w-5" />
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
            <HugeiconsIcon icon={Settings02Icon} className="h-4 w-4 text-blue-600" />
            Add Telephony Configuration
          </Button>

          <Button
            onClick={() => {
              fetchConfigs();
              setStockModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            <HugeiconsIcon icon={PlusIcon} className="h-4 w-4 mr-2" /> Stock Inventory Numbers
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metric Badges & View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5">
              <HugeiconsIcon icon={Layers01Icon} className="h-3.5 w-3.5 text-muted-foreground" />
              Total Stocked: <span className="font-bold">{numbers.length}</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-blue-500/30 text-blue-600 dark:text-blue-400">
              <HugeiconsIcon icon={UsersIcon} className="h-3.5 w-3.5" />
              Shared Trial: <span className="font-bold">{sharedCount}</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-teal-500/30 text-teal-600 dark:text-teal-400">
              <HugeiconsIcon icon={UsersIcon} className="h-3.5 w-3.5" />
              Multi-Org Shared: <span className="font-bold">{multiOrgCount}</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-purple-500/30 text-purple-600 dark:text-purple-400">
              <HugeiconsIcon icon={LockIcon} className="h-3.5 w-3.5" />
              Dedicated: <span className="font-bold">{dedicatedCount}</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-3.5 w-3.5" />
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
              <HugeiconsIcon icon={LayoutListIcon} className="h-3.5 w-3.5" />
              List
            </Button>
            <Button
              type="button"
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2.5 text-xs gap-1.5 font-medium shadow-none"
              onClick={() => setViewMode('grid')}
            >
              <HugeiconsIcon icon={LayoutGridIcon} className="h-3.5 w-3.5" />
              Cards
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
            <HugeiconsIcon icon={Loading02Icon} className="h-5 w-5 animate-spin mr-2" /> Loading telephony inventory...
          </div>
        ) : numbers.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center bg-muted/20">
            <HugeiconsIcon icon={PhoneIcon} className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
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
                <HugeiconsIcon icon={PlusIcon} className="h-3.5 w-3.5 mr-1" /> Add Telephony Configuration
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
                            <HugeiconsIcon icon={Copy01Icon} className="h-3 w-3" />
                          </Button>
                        </div>
                        {num.extra_metadata?.click_to_call_api_key && (
                          <div className="flex items-center gap-1 mt-1 font-sans">
                            <Badge
                              variant="outline"
                              className="text-[10px] border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1 font-mono font-normal py-0 h-4"
                              title={`Dedicated Key: ...${String(num.extra_metadata.click_to_call_api_key).slice(-4)}`}
                            >
                              <HugeiconsIcon icon={LockIcon} className="h-2.5 w-2.5" />
                              Dedicated Key
                            </Badge>
                          </div>
                        )}
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
                                <HugeiconsIcon icon={ExternalLinkIcon} className="h-2.5 w-2.5 shrink-0" />
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
                        {num.pool_type === 'shared_trial' && (
                          <Badge variant="default" className="text-[11px] font-medium py-0.5 px-2 bg-blue-600 text-white hover:bg-blue-600">
                            Shared Trial
                          </Badge>
                        )}
                        {num.pool_type === 'dedicated' && (
                          <Badge variant="outline" className="text-[11px] font-medium py-0.5 px-2 border-purple-500/40 text-purple-600 dark:text-purple-400">
                            Dedicated
                          </Badge>
                        )}
                        {num.pool_type === 'shared_multi_org' && (
                          <Badge variant="outline" className="text-[11px] font-medium py-0.5 px-2 border-teal-500/40 bg-teal-500/10 text-teal-600 dark:text-teal-400">
                            Multi-Org Shared
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-medium">
                        {num.pool_type === 'shared_trial' ? (
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">Free Testing</span>
                        ) : (
                          <span>${(num.monthly_price_cents / 100).toFixed(2)}/mo</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs">
                        {num.pool_type === 'shared_trial' ? (
                          <div className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded-md text-[11px]">
                            <HugeiconsIcon icon={UsersIcon} className="h-3 w-3 shrink-0" />
                            <span>Public Testing (All Orgs)</span>
                          </div>
                        ) : num.pool_type === 'shared_multi_org' ? (
                          <div className="inline-flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium bg-teal-500/10 px-2 py-1 rounded-md text-[11px]">
                            <HugeiconsIcon icon={UsersIcon} className="h-3 w-3 shrink-0" />
                            <span>
                              {num.claimed_count && num.claimed_count > 0
                                ? `Claimed by ${num.claimed_count} Org(s)`
                                : 'Available (Multi-Org)'}
                            </span>
                          </div>
                        ) : isClaimed ? (
                          <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 px-2 py-1 rounded-md text-[11px]">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-3 w-3 shrink-0" />
                            <span>Claimed (Org #{num.assigned_organization_id})</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 text-muted-foreground bg-muted/60 px-2 py-1 rounded-md text-[11px]">
                            <HugeiconsIcon icon={SparklesIcon} className="h-3 w-3 shrink-0 text-amber-500" />
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
                            <HugeiconsIcon icon={Delete02Icon} className="h-3.5 w-3.5 mr-1" />
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
                          <HugeiconsIcon icon={Copy01Icon} className="h-3 w-3" />
                        </Button>
                        {num.extra_metadata?.click_to_call_api_key && (
                          <Badge
                            variant="outline"
                            className="text-[10px] border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1 font-mono font-normal py-0 h-4"
                            title={`Dedicated Key: ...${String(num.extra_metadata.click_to_call_api_key).slice(-4)}`}
                          >
                            <HugeiconsIcon icon={LockIcon} className="h-2.5 w-2.5" />
                            Dedicated Key
                          </Badge>
                        )}
                      </div>
                      <Badge
                        variant={num.pool_type === 'shared_trial' ? 'default' : 'outline'}
                        className={`text-[10px] ${
                          num.pool_type === 'shared_trial'
                            ? 'bg-blue-600 text-white'
                            : num.pool_type === 'shared_multi_org'
                            ? 'border-teal-500/40 bg-teal-500/10 text-teal-600 dark:text-teal-400'
                            : 'border-purple-500/40 text-purple-600 dark:text-purple-400'
                        }`}
                      >
                        {num.pool_type === 'shared_trial' ? 'Shared Trial' : num.pool_type === 'shared_multi_org' ? 'Multi-Org Shared' : 'Dedicated'}
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
                              <HugeiconsIcon icon={ExternalLinkIcon} className="h-2.5 w-2.5 shrink-0" />
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
                        {num.pool_type === 'shared_trial' ? 'Free Testing' : `$${(num.monthly_price_cents / 100).toFixed(2)}/mo`}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {num.pool_type === 'shared_trial' ? (
                        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium bg-blue-500/10 p-2 rounded-lg text-[11px]">
                          <HugeiconsIcon icon={UsersIcon} className="h-3.5 w-3.5 shrink-0" />
                          <span>Usable by all users for agent testing. Live bulk campaigns blocked.</span>
                        </div>
                      ) : num.pool_type === 'shared_multi_org' ? (
                        <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium bg-teal-500/10 p-2 rounded-lg text-[11px]">
                          <HugeiconsIcon icon={UsersIcon} className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {num.claimed_count && num.claimed_count > 0
                              ? `Claimed by ${num.claimed_count} workspace(s). Open for multiple orgs.`
                              : 'Available for multi-organization claiming.'}
                          </span>
                        </div>
                      ) : isClaimed ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded-lg text-[11px]">
                          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-3.5 w-3.5 shrink-0" />
                          <span>Claimed by Org #{num.assigned_organization_id}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/40 p-2 rounded-lg text-[11px]">
                          <HugeiconsIcon icon={SparklesIcon} className="h-3.5 w-3.5 shrink-0" />
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
                      <HugeiconsIcon icon={Delete02Icon} className="h-3.5 w-3.5 mr-1" /> Remove
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
                <HugeiconsIcon icon={PhoneIcon} className="h-5 w-5 text-blue-600" />
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
                    <HugeiconsIcon icon={PlusIcon} className="h-3.5 w-3.5 mr-1" /> Add New Configuration
                  </Button>
                </div>

                {loadingConfigs ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                    <HugeiconsIcon icon={Loading02Icon} className="h-4 w-4 animate-spin" /> Loading configurations...
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
                      <HugeiconsIcon icon={PlusIcon} className="h-3.5 w-3.5 mr-1" /> Add Telephony Configuration
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
                          View Config <HugeiconsIcon icon={ExternalLinkIcon} className="h-3 w-3" />
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
                        <SelectItem value="dedicated">Dedicated (Marketplace - 1 Org Exclusive)</SelectItem>
                        <SelectItem value="shared_multi_org">Multi-Org Shared (Multiple Orgs Can Claim)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock-country-code">Country Code Hint</Label>
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={GlobeIcon} className="h-4 w-4 text-muted-foreground shrink-0" />
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

                {isSmartflo && (
                  <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3.5 space-y-3 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                        <HugeiconsIcon icon={LockIcon} className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-blue-600 dark:text-blue-400 text-xs">
                          Tata Smartflo Per-Number Click-to-Call API Keys
                        </p>
                        <p className="text-muted-foreground text-[11px] mt-0.5 leading-relaxed">
                          Tata Smartflo Click-to-Call API keys are tied to individual DID numbers. You can set a <strong>Batch API Key</strong> below to apply to all numbers, OR provide unique keys per number in the text box using the format:
                          <code className="block mt-1 font-mono text-[11px] bg-background p-1.5 rounded border text-foreground">
                            +91XXXXXXXXXX | CLICK_TO_CALL_API_KEY [| OPTIONAL_JWT_TOKEN]
                          </code>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1.5">
                        <Label htmlFor="smartflo-batch-key" className="text-xs font-medium">
                          Batch Click-to-Call API Key (Fallback)
                        </Label>
                        <Input
                          id="smartflo-batch-key"
                          type="password"
                          placeholder="e.g. 3d8f1e94-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                          value={smartfloBatchApiKey}
                          onChange={(e) => setSmartfloBatchApiKey(e.target.value)}
                          className="font-mono text-xs h-8"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="smartflo-batch-jwt" className="text-xs font-medium">
                          Batch Smartflo JWT Token (Optional)
                        </Label>
                        <Input
                          id="smartflo-batch-jwt"
                          type="password"
                          placeholder="Optional JWT bearer token"
                          value={smartfloBatchJwt}
                          onChange={(e) => setSmartfloBatchJwt(e.target.value)}
                          className="font-mono text-xs h-8"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stock-phone-numbers">
                      Phone Number(s) (E.164)
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                      {isSmartflo
                        ? 'Format: +91XXXXXXXXXX | API_KEY or one per line'
                        : 'Comma or newline separated for multiple'}
                    </span>
                  </div>
                  <Textarea
                    id="stock-phone-numbers"
                    placeholder={
                      isSmartflo
                        ? "+918047361201 | 3d8f1e94-xxxx-xxxx-xxxx-xxxxxxxxxxxx\n+918047361202 | 9a4b2c11-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        : "+12025550143\n+12025550198"
                    }
                    value={phoneNumbers}
                    onChange={(e) => setPhoneNumbers(e.target.value)}
                    rows={isSmartflo ? 4 : 3}
                    className="font-mono text-sm resize-y"
                    required
                  />

                  {parsedPreview.length > 0 && (
                    <div className="rounded-lg border bg-muted/30 p-2.5 text-xs space-y-1.5 mt-2">
                      <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                        <span>Parsed Inventory Numbers ({parsedPreview.length})</span>
                        {isSmartflo && (
                          <span
                            className={
                              parsedPreview.every((p) => p.apiKey)
                                ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                : 'text-amber-600 dark:text-amber-400 font-semibold'
                            }
                          >
                            {parsedPreview.filter((p) => p.apiKey).length}/{parsedPreview.length} with API Key
                          </span>
                        )}
                      </div>
                      <div className="max-h-28 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
                        {parsedPreview.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-background/80 px-2 py-1 rounded border"
                          >
                            <span className="font-semibold">{item.address}</span>
                            {isSmartflo && (
                              item.apiKey ? (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono py-0 h-4"
                                >
                                  {item.isPerLineKey ? `Key: ...${item.apiKey.slice(-4)}` : 'Batch Key'}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] border-destructive/40 bg-destructive/10 text-destructive font-sans py-0 h-4"
                                >
                                  Missing Key
                                </Badge>
                              )
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    <HugeiconsIcon icon={Loading02Icon} className="mr-2 h-4 w-4 animate-spin" /> Stocking Numbers...
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
