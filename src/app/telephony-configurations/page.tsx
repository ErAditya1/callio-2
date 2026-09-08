"use client";

import {
  AlertTriangle,
  ChevronRight,
  Copy,
  ExternalLink,
  Loader2,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  deleteTelephonyConfigurationApiV1OrganizationsTelephonyConfigsConfigIdDelete,
  getTelephonyConfigurationByIdApiV1OrganizationsTelephonyConfigsConfigIdGet,
  listTelephonyConfigurationsApiV1OrganizationsTelephonyConfigsGet,
  reactivateTelephonyConfigurationApiV1OrganizationsTelephonyConfigsConfigIdReactivatePost,
  setDefaultOutboundApiV1OrganizationsTelephonyConfigsConfigIdSetDefaultOutboundPost,
} from "@/client/sdk.gen";
import type {
  TelephonyConfigurationDetail,
  TelephonyConfigurationListItem,
} from "@/client/types.gen";
import { ConfigFormDialog } from "@/components/telephony/ConfigFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTelephonyConfigWarnings } from "@/context/TelephonyConfigWarningsContext";
import { detailFromError } from "@/lib/apiError";
import { useAuth } from "@/lib/auth";
import { copyTextToClipboard } from "@/lib/clipboard";

export default function TelephonyConfigurationsPage() {
  const { user, getAccessToken, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const {
    telnyxMissingWebhookPublicKeyCount,
    vonageMissingSignatureSecretCount,
    refresh: refreshWarnings,
  } = useTelephonyConfigWarnings();
  const [items, setItems] = useState<TelephonyConfigurationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TelephonyConfigurationDetail | null>(
    null,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<TelephonyConfigurationListItem | null>(null);

  // Platform Numbers / Testing Pool state
  const [platformNumbers, setPlatformNumbers] = useState<any[]>([]);
  const [loadingPlatformNumbers, setLoadingPlatformNumbers] = useState(false);
  const [claimingNumberId, setClaimingNumberId] = useState<string | null>(null);
  const [purchasingNumber, setPurchasingNumber] = useState<any | null>(null);

  const loadPlatformNumbers = useCallback(async () => {
    if (authLoading || !user) return;
    setLoadingPlatformNumbers(true);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/v1/platform/numbers", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (res.ok) {
        const data = await res.json();
        setPlatformNumbers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load platform numbers", err);
    } finally {
      setLoadingPlatformNumbers(false);
    }
  }, [authLoading, user, getAccessToken]);

  const handleClaimNumber = async (num: any) => {
    try {
      setClaimingNumberId(num.id);
      const token = await getAccessToken();
      const res = await fetch(`/api/v1/platform/numbers/${num.id}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          set_as_default: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to provision number");
      }
      toast.success(data.message || `Successfully provisioned ${num.phone_number}!`);
      setPurchasingNumber(null);
      await fetchItems();
      await loadPlatformNumbers();
    } catch (err: any) {
      toast.error(err.message || "Failed to claim number");
    } finally {
      setClaimingNumberId(null);
    }
  };

  const fetchItems = useCallback(async () => {
    if (authLoading || !user) return;
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await listTelephonyConfigurationsApiV1OrganizationsTelephonyConfigsGet(
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.error) throw new Error(detailFromError(res.error));
      setItems(res.data?.configurations ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load configurations");
    } finally {
      setLoading(false);
    }
  }, [authLoading, user, getAccessToken]);

  // After a save (create/update), webhook-verification warning state may have
  // changed — refresh the cached warning state so the page banner and nav badge
  // update without a manual reload.
  const onSaved = useCallback(async () => {
    await fetchItems();
    await loadPlatformNumbers();
    await refreshWarnings();
  }, [fetchItems, loadPlatformNumbers, refreshWarnings]);

  useEffect(() => {
    fetchItems();
    loadPlatformNumbers();
  }, [fetchItems, loadPlatformNumbers]);

  // ?add=1 lands the user straight on the provider form — used by the Phone
  // Call dialog's "Add provider" action so the choice isn't asked twice.
  useEffect(() => {
    if (searchParams.get("add") === "1") setCreateOpen(true);
  }, [searchParams]);

  const onEdit = async (item: TelephonyConfigurationListItem) => {
    try {
      const token = await getAccessToken();
      const res = await getTelephonyConfigurationByIdApiV1OrganizationsTelephonyConfigsConfigIdGet(
        {
          headers: { Authorization: `Bearer ${token}` },
          path: { config_id: item.id },
        },
      );
      if (res.error) throw new Error(detailFromError(res.error));
      setEditTarget(res.data ?? null);
      setEditOpen(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load configuration");
    }
  };

  const onSetDefault = async (item: TelephonyConfigurationListItem) => {
    try {
      const token = await getAccessToken();
      const res = await setDefaultOutboundApiV1OrganizationsTelephonyConfigsConfigIdSetDefaultOutboundPost(
        {
          headers: { Authorization: `Bearer ${token}` },
          path: { config_id: item.id },
        },
      );
      if (res.error) throw new Error(detailFromError(res.error));
      toast.success(`${item.name} is now the default outbound configuration`);
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to set default");
    }
  };

  const onReactivate = async (item: TelephonyConfigurationListItem) => {
    try {
      const token = await getAccessToken();
      const res = await reactivateTelephonyConfigurationApiV1OrganizationsTelephonyConfigsConfigIdReactivatePost(
        {
          headers: { Authorization: `Bearer ${token}` },
          path: { config_id: item.id },
        },
      );
      if (res.error) throw new Error(detailFromError(res.error));
      toast.success(`${item.name} reactivated — reconnecting within a minute`);
      fetchItems();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reactivate configuration",
      );
    }
  };

  const onConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const token = await getAccessToken();
      const res = await deleteTelephonyConfigurationApiV1OrganizationsTelephonyConfigsConfigIdDelete(
        {
          headers: { Authorization: `Bearer ${token}` },
          path: { config_id: deleteTarget.id },
        },
      );
      if (res.error) throw new Error(detailFromError(res.error));
      toast.success("Configuration deleted");
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete configuration");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Telephony configurations</h1>
            <p className="text-muted-foreground">
              Connect one or more telephony provider accounts. Each campaign uses one
              configuration; inbound calls are routed to the right one by account ID.{" "}
              <a
                href="https://docs.dograh.com/integrations/telephony/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 underline"
              >
                Learn more <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add configuration
          </Button>
        </div>

        {/* Instant Testing Pool & Platform Numbers Showcase */}
        <div className="mb-8 rounded-xl border border-primary/20 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/15 dark:to-purple-950/20 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h2 className="text-xl font-bold tracking-tight">Instant Voice Testing &amp; Platform Numbers</h2>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                  Zero Config Required
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Test AI Voice Agents instantly without your own provider account. Claim a shared trial number for free sandbox testing, or purchase dedicated platform numbers with 1-click provisioning into your workspace.
              </p>
            </div>
            {platformNumbers.length > 0 && (
              <Badge variant="secondary" className="self-start md:self-auto font-mono text-xs px-2.5 py-1">
                {platformNumbers.filter(n => n.pool_type === 'shared_trial' || !n.in_use).length} Available in Inventory
              </Badge>
            )}
          </div>

          {loadingPlatformNumbers ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
          ) : platformNumbers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-background/70 p-5 text-center">
              <Phone className="h-7 w-7 mx-auto text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium">No Platform Numbers in Marketplace</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Bring your own provider account using &quot;Add configuration&quot; below, or superadmins can stock numbers in the Superadmin Inventory.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {platformNumbers.map((num) => {
                const isShared = num.pool_type === "shared_trial";
                const isClaiming = claimingNumberId === num.id;
                const isAlreadyInUse = !isShared && num.in_use;

                return (
                  <div
                    key={num.id}
                    className="flex flex-col justify-between p-4 rounded-lg border bg-card/85 backdrop-blur hover:border-primary/40 transition-all shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-base font-semibold tracking-tight">
                          {num.phone_number}
                        </span>
                        <Badge
                          variant={isShared ? "default" : "outline"}
                          className={`text-xs ${
                            isShared
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "border-purple-500/40 text-purple-600 dark:text-purple-400"
                          }`}
                        >
                          {isShared ? "Shared Trial" : "Dedicated"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <span className="capitalize font-medium text-foreground">{num.carrier}</span>
                        <span>•</span>
                        <span>
                          {isShared ? "Free for testing" : `$${(num.monthly_price_cents / 100).toFixed(2)}/mo`}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        {isShared ? "Instant Pool" : "Dedicated Caller ID"}
                      </span>

                      {isAlreadyInUse ? (
                        <Badge variant="secondary" className="text-xs opacity-75">
                          Assigned
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant={isShared ? "default" : "outline"}
                          disabled={isClaiming}
                          onClick={() => {
                            if (isShared) {
                              handleClaimNumber(num);
                            } else {
                              setPurchasingNumber(num);
                            }
                          }}
                          className="h-8 gap-1.5 text-xs font-medium"
                        >
                          {isClaiming ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Claiming...
                            </>
                          ) : isShared ? (
                            <>
                              <Zap className="h-3.5 w-3.5" /> Claim for Free
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-3.5 w-3.5" /> Purchase &amp; Claim
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Your Connected Configurations</h2>
        </div>

        {telnyxMissingWebhookPublicKeyCount > 0 && (
          <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-medium">Webhook public key not configured</p>
                <p>
                  {telnyxMissingWebhookPublicKeyCount === 1
                    ? "1 Telnyx configuration is"
                    : `${telnyxMissingWebhookPublicKeyCount} Telnyx configurations are`}{" "}
                  missing a webhook public key. Without it, Telnyx call status
                  updates and inbound calls are being rejected. Copy your
                  public key from{" "}
                  <span className="whitespace-nowrap">
                    Mission Control Portal → Keys &amp; Credentials → Public Key
                  </span>{" "}
                  and paste it into the affected Telnyx configuration below.
                </p>
              </div>
            </div>
          </div>
        )}

        {vonageMissingSignatureSecretCount > 0 && (
          <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-medium">Signature secret not configured</p>
                <p>
                  {vonageMissingSignatureSecretCount === 1
                    ? "1 Vonage configuration is"
                    : `${vonageMissingSignatureSecretCount} Vonage configurations are`}{" "}
                  missing a signature secret. Without it, Vonage signed webhooks
                  are rejected, so inbound calls and call status updates will not
                  work. Copy the signature secret from your Vonage account and
                  paste it into the affected Vonage configuration below.
                </p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid gap-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No telephony configurations yet</CardTitle>
              <CardDescription>
                Add one to enable outbound calls and receive inbound calls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add configuration
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                  <Link
                    href={`/telephony-configurations/${item.id}`}
                    className="flex flex-1 items-center gap-4 min-w-0"
                  >
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{item.name}</span>
                        <Badge variant="secondary">{item.provider}</Badge>
                        {item.is_default_outbound && (
                          <Badge className="gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Default
                          </Badge>
                        )}
                        {item.inactive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                        {!item.inactive && item.is_ready_for_outbound === false && (
                          <Badge
                            variant="outline"
                            className="gap-1 border-amber-400 text-amber-700 dark:border-amber-700 dark:text-amber-400"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Setup incomplete
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.phone_number_count} phone{" "}
                        {item.phone_number_count === 1 ? "number" : "numbers"}
                      </span>
                      {item.inactive && (
                        <span className="text-sm text-destructive">
                          Disabled after repeated connection failures
                          {item.inactive_reason ? `: ${item.inactive_reason}` : ""}
                        </span>
                      )}
                      {!item.inactive && item.outbound_blocked_reason && (
                        <span className="text-sm text-amber-700 dark:text-amber-500">
                          {item.outbound_blocked_reason}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          copyTextToClipboard(String(item.id))
                            .then(() => toast.success("Configuration ID copied"))
                            .catch(() => toast.error("Failed to copy ID"));
                        }}
                        title="Click to copy"
                        className="inline-flex items-center gap-1 self-start rounded font-mono text-xs text-muted-foreground hover:text-foreground"
                      >
                        <span className="truncate">Configuration ID: {item.id}</span>
                        <Copy className="h-3 w-3 shrink-0" />
                      </button>
                    </div>
                  </Link>
                  <div className="flex w-full flex-wrap items-center justify-end gap-1 sm:w-auto sm:flex-nowrap">
                    {item.inactive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onReactivate(item)}
                        title="Reconnect this configuration now"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reactivate
                      </Button>
                    )}
                    {!item.is_default_outbound && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSetDefault(item)}
                        title="Set as default outbound"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(item)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        href={`/telephony-configurations/${item.id}`}
                        aria-label={`Manage phone numbers for ${item.name}`}
                      >
                        Manage Phone Numbers
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ConfigFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        existing={null}
        suggestDefaultOutbound={!items.some((item) => item.is_default_outbound)}
        onSaved={onSaved}
      />
      <ConfigFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        existing={editTarget}
        onSaved={onSaved}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete configuration?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name} and all of its phone numbers will be removed. Any
              campaigns that reference this configuration will block the deletion until
              they are reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Purchase Confirmation Dialog */}
      <AlertDialog
        open={!!purchasingNumber}
        onOpenChange={(o) => !o && setPurchasingNumber(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Confirm Dedicated Number Purchase
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <div className="rounded-md bg-muted p-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone Number:</span>
                  <span className="font-mono font-medium text-foreground">{purchasingNumber?.phone_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carrier:</span>
                  <span className="font-medium text-foreground capitalize">{purchasingNumber?.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Recurring:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    ${purchasingNumber ? (purchasingNumber.monthly_price_cents / 100).toFixed(2) : "0.00"}/month
                  </span>
                </div>
              </div>
              <p className="text-sm">
                This number will be exclusively assigned to your organization, auto-configured with carrier credentials, and set as your workspace&apos;s default outbound caller ID.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (purchasingNumber) handleClaimNumber(purchasingNumber);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm &amp; Provision
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
