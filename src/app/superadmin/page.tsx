"use client";

import {
  ArrowRight,
  List,
  Loader2,
  ShieldAlert,
  Key,
  Phone,
  DollarSign,
  Sparkles,
  Users,
  ShieldCheck,
} from "lucide-react";
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
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  if (!isSuperuser) {
    return (
      <div className="flex min-h-[75vh] w-full items-center justify-center p-4">
        <Card className="max-w-md border-border/80 shadow-2xl bg-card">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Access Restricted
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground pt-1">
              Superadmin privileges are required to view the administrative portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-xs text-muted-foreground leading-relaxed px-6 pb-6">
            Your account does not have superuser privileges. Please return to
            your workspace overview.
          </CardContent>
          <div className="p-6 pt-0 flex flex-col gap-2">
            <Button
              asChild
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Link href="/overview">Return to Workspace Overview</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">Platform Operations Center</h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
              Superadmin Mode
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure platform master API keys, stock telephony numbers, grant customer credits, and monitor system operations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/superadmin/runs">
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <List className="h-4 w-4" />
              Global Run Logs
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Tabbed Operations Dashboard */}
      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border h-11 w-full sm:w-auto flex-wrap justify-start">
          <TabsTrigger value="keys" className="gap-2 text-xs sm:text-sm">
            <Key className="h-4 w-4 text-emerald-500" />
            Master API Keys &amp; Pricing
          </TabsTrigger>
          <TabsTrigger value="telephony" className="gap-2 text-xs sm:text-sm">
            <Phone className="h-4 w-4 text-blue-500" />
            Telephony Inventory
          </TabsTrigger>
          <TabsTrigger value="wallets" className="gap-2 text-xs sm:text-sm">
            <DollarSign className="h-4 w-4 text-amber-500" />
            Customer Wallets &amp; Credits
          </TabsTrigger>
          <TabsTrigger value="showcase" className="gap-2 text-xs sm:text-sm">
            <Sparkles className="h-4 w-4 text-purple-500" />
            Public Showcase Agents
          </TabsTrigger>
          <TabsTrigger value="ops" className="gap-2 text-xs sm:text-sm">
            <Users className="h-4 w-4 text-indigo-500" />
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
