"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Dollar01Icon,
  Key01Icon,
  ListIcon,
  Loading02Icon,
  PhoneIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "@hugeicons/core-free-icons";;
import Link from "next/link";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useIsSuperuser } from "@/hooks/useIsSuperuser";
import { useAuth } from "@/lib/auth";
import { impersonateAsSuperadmin } from "@/lib/utils";
import { SuperadminShowcaseManager } from "@/components/superadmin/SuperadminShowcaseManager";
import { SuperadminMasterKeysManager } from "@/components/superadmin/SuperadminMasterKeysManager";
import { SuperadminTelephonyInventoryManager } from "@/components/superadmin/SuperadminTelephonyInventoryManager";
import { SuperadminWalletManager } from "@/components/superadmin/SuperadminWalletManager";

type ImpersonationTarget = "provider" | "email";

export default function SuperadminPage() {
  const [providerUserId, setProviderUserId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<{
    target: ImpersonationTarget;
    message: string;
  } | null>(null);
  const [loadingTarget, setLoadingTarget] =
    useState<ImpersonationTarget | null>(null);
  const { user, getAccessToken, provider } = useAuth();
  const { isSuperuser, isLoading: checkingSuperuser } = useIsSuperuser();

  const handleImpersonate = async (
    target: ImpersonationTarget,
    value: string
  ) => {
    const trimmedValue = value.trim();
    setError(null);

    if (!trimmedValue) {
      setError({
        target,
        message:
          target === "provider"
            ? "Enter a provider user ID."
            : "Enter an email address.",
      });
      return;
    }

    if (provider !== "stack") {
      setError({
        target,
        message:
          "User impersonation is only available on enterprise cloud authentication. Sign in directly with the target account credentials.",
      });
      return;
    }

    setLoadingTarget(target);

    try {
      if (!user) {
        setError({
          target,
          message: "User not authenticated. Please log in and try again.",
        });
        return;
      }

      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Missing admin access token");
      }

      await impersonateAsSuperadmin({
        accessToken: accessToken,
        ...(target === "provider"
          ? { providerUserId: trimmedValue }
          : { email: trimmedValue }),
        redirectPath: "/workflow",
        openInNewTab: true,
      });
    } catch (err) {
      setError({
        target,
        message:
          err instanceof Error
            ? err.message
            : "Failed to impersonate user. Please try again.",
      });
      console.error("Impersonation error:", err);
    } finally {
      setLoadingTarget(null);
    }
  };

  const handleProviderImpersonate = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleImpersonate("provider", providerUserId);
  };

  const handleEmailImpersonate = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleImpersonate("email", email);
  };

  if (checkingSuperuser) {
    return (
      <div className="app-page flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-[#737373]">
          <HugeiconsIcon icon={Loading02Icon} className="h-6 w-6 animate-spin" />
          <span>Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  if (!isSuperuser) {
    return (
      <div className="flex min-h-[75vh] w-full items-center justify-center p-4">
        <Card className="max-w-md border-[#E5E5E5] shadow-2xl bg-[#FFFFFF]">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
              <HugeiconsIcon icon={ShieldAlertIcon} className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Access Restricted
            </CardTitle>
            <CardDescription className="text-sm text-[#737373] pt-1">
              Superadmin privileges are required to view the administrative portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-xs text-[#737373] leading-relaxed px-6 pb-6">
            Your account does not have superuser privileges. Please return to
            your workspace overview.
          </CardContent>
          <div className="p-6 pt-0 flex flex-col gap-2">
            <Button
              asChild
              className="w-full bg-neutral-950 hover:bg-neutral-800 text-white"
            >
              <Link href="/dashboard/overview">Return to Workspace Overview</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <main className="app-page space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F0F3F9] text-[#7186AD] border border-[#DCE3EF]">
              <HugeiconsIcon icon={ShieldCheckIcon} className="h-4 w-4" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Platform Operations Center</h1>
            <Badge variant="outline" className="bg-[#F0F3F9] text-[#7186AD] dark:text-[#7186AD] border-[#DCE3EF] text-xs">
              Superadmin Mode
            </Badge>
          </div>
          <p className="text-sm text-[#737373]">
            Configure platform master API keys, stock telephony numbers, grant customer credits, and monitor system operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/superadmin/runs">
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <HugeiconsIcon icon={ListIcon} className="h-4 w-4" />
              Global Run Logs
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Tabbed Operations Dashboard */}
      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList className="bg-[#F7F7F7] p-1 border h-11 w-full sm:w-auto flex-wrap justify-start">
          <TabsTrigger value="keys" className="gap-2 text-xs sm:text-sm">
            <HugeiconsIcon icon={Key01Icon} className="h-4 w-4 text-[#7186AD]" />
            Master API Keys &amp; Pricing
          </TabsTrigger>
          <TabsTrigger value="telephony" className="gap-2 text-xs sm:text-sm">
            <HugeiconsIcon icon={PhoneIcon} className="h-4 w-4 text-[#7186AD]" />
            Telephony Inventory
          </TabsTrigger>
          <TabsTrigger value="wallets" className="gap-2 text-xs sm:text-sm">
            <HugeiconsIcon icon={Dollar01Icon} className="h-4 w-4 text-amber-500" />
            Customer Wallets &amp; Credits
          </TabsTrigger>
          <TabsTrigger value="showcase" className="gap-2 text-xs sm:text-sm">
            <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4 text-[#7186AD]" />
            Public Showcase Agents
          </TabsTrigger>
          <TabsTrigger value="ops" className="gap-2 text-xs sm:text-sm">
            <HugeiconsIcon icon={UsersIcon} className="h-4 w-4 text-[#7186AD]" />
            Account Impersonation
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Master Keys */}
        <TabsContent value="keys" className="space-y-4">
          <SuperadminMasterKeysManager />
        </TabsContent>

        {/* Tab 2: Telephony Inventory */}
        <TabsContent value="telephony" className="space-y-4">
          <SuperadminTelephonyInventoryManager />
        </TabsContent>

        {/* Tab 3: Customer Wallets & Credit Grants */}
        <TabsContent value="wallets" className="space-y-4">
          <SuperadminWalletManager />
        </TabsContent>

        {/* Tab 4: Showcase Agents */}
        <TabsContent value="showcase" className="space-y-4">
          <SuperadminShowcaseManager />
        </TabsContent>

        {/* Tab 5: Account Impersonation & Tools */}
        <TabsContent value="ops" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Provider User ID</CardTitle>
                <CardDescription>
                  Impersonate with the Stack provider user ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProviderImpersonate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="providerUserId">Provider User ID</Label>
                    <Input
                      id="providerUserId"
                      value={providerUserId}
                      onChange={(e) => setProviderUserId(e.target.value)}
                      placeholder="Provider user ID"
                      required
                    />
                  </div>

                  {error?.target === "provider" && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                      {error.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loadingTarget !== null}
                    className="w-full"
                  >
                    {loadingTarget === "provider" ? (
                      <>
                        <HugeiconsIcon icon={Loading02Icon} className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Impersonate by Provider ID"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Email Address</CardTitle>
                <CardDescription>
                  Impersonate with a primary email address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailImpersonate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@example.com"
                      required
                    />
                  </div>

                  {error?.target === "email" && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                      {error.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loadingTarget !== null}
                    className="w-full"
                  >
                    {loadingTarget === "email" ? (
                      <>
                        <HugeiconsIcon icon={Loading02Icon} className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Impersonate by Email"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
