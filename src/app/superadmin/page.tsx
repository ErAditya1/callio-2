"use client";

import { ArrowRight, List, Loader2, ShieldAlert } from "lucide-react";
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
import { useIsSuperuser } from "@/hooks/useIsSuperuser";
import { useAuth } from "@/lib/auth";
import { impersonateAsSuperadmin } from "@/lib/utils";

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
          "User impersonation is only available when using Stack Auth. In local development / OSS mode, sign in directly with the target account credentials.",
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
    <main className="container mx-auto p-6 space-y-6 max-w-5xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Superadmin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage users and view system-wide data
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Provider User ID</CardTitle>
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
            <CardTitle>Email</CardTitle>
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

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Workflow Runs</CardTitle>
            <CardDescription>
              View and manage all workflow runs across organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/superadmin/runs">
              <Button className="w-full md:w-auto">
                <List className="mr-2 h-4 w-4" />
                View All Runs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
