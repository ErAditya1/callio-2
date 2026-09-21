"use client";

import { Loader2, ShieldAlert, UserCheck, Users } from "lucide-react";
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
import { useAuth } from "@/lib/auth";
import { impersonateAsSuperadmin } from "@/lib/utils";

type ImpersonationTarget = "provider" | "email";

export function SuperadminImpersonationManager() {
  const [providerUserId, setProviderUserId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<{
    target: ImpersonationTarget;
    message: string;
  } | null>(null);
  const [loadingTarget, setLoadingTarget] = useState<ImpersonationTarget | null>(null);
  const { user, getAccessToken, provider } = useAuth();

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Account Impersonation</h2>
            <p className="text-xs text-muted-foreground">
              Sign in as any customer account to troubleshoot issues, test voice agent setups, and verify limits.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-400" />
              Impersonate by Provider User ID
            </CardTitle>
            <CardDescription className="text-xs">
              Access the account using their unique Stack provider user identifier.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProviderImpersonate} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="providerUserId" className="text-xs">Provider User ID</Label>
                <Input
                  id="providerUserId"
                  value={providerUserId}
                  onChange={(e) => setProviderUserId(e.target.value)}
                  placeholder="e.g. usr_9f81a7b..."
                  required
                  className="h-9 text-sm"
                />
              </div>

              {error?.target === "provider" && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-md text-xs flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error.message}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loadingTarget !== null}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white h-9 text-xs"
              >
                {loadingTarget === "provider" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Opening Workspace...
                  </>
                ) : (
                  "Impersonate by Provider ID"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              Impersonate by Email Address
            </CardTitle>
            <CardDescription className="text-xs">
              Lookup the customer by their primary registered email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailImpersonate} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@organization.com"
                  required
                  className="h-9 text-sm"
                />
              </div>

              {error?.target === "email" && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-md text-xs flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error.message}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loadingTarget !== null}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-9 text-xs"
              >
                {loadingTarget === "email" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Opening Workspace...
                  </>
                ) : (
                  "Impersonate by Email"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
