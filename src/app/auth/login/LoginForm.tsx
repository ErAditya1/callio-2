"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  Fingerprint,
} from "lucide-react";

import { loginApiV1AuthLoginPost } from "@/client/sdk.gen";
import { AuthEnterpriseCTA } from "@/components/auth/AuthEnterpriseCTA";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";

/* ── Stack-provider redirect variant ─────────────────────────── */
function StackSignInRedirect() {
  return (
    <AuthShell enterpriseSlot={<AuthEnterpriseCTA />}>
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10 shadow-lg shadow-indigo-500/10">
          <Fingerprint className="size-7 text-indigo-400" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-white">Sign in to workspace</h1>
          <p className="text-sm text-zinc-400">
            Your workspace uses enterprise authentication.
          </p>
        </div>
        <Button
          asChild
          className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all"
        >
          <Link href="/handler/sign-in">
            Open Sign In Portal
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </AuthShell>
  );
}

/* ── Main Login Form ──────────────────────────────────────────── */
export function LoginForm({ signupEnabled }: { signupEnabled: boolean }) {
  const { provider } = useAuth();

  // Stack auth — redirect to handler
  if (provider === "stack") {
    return <StackSignInRedirect />;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginApiV1AuthLoginPost({
        body: { email, password },
      });

      if (res.error || !res.data) {
        const detail = (res.error as { detail?: string })?.detail;
        toast.error(detail || "Invalid email or password");
        return;
      }

      // Set httpOnly cookies via server route
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: res.data.token, user: res.data.user }),
      });

      toast.success("Signed in successfully! Redirecting...");
      window.location.href = "/after-sign-in";
    } catch {
      toast.error("An error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password Reset", {
      description:
        "Please contact your organization administrator or support@callio.ai to reset your credentials.",
    });
  };

  return (
    <AuthShell enterpriseSlot={<AuthEnterpriseCTA />}>
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 shadow-sm">
          <Sparkles className="size-6 text-indigo-600" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[1.65rem]">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500">
            Enter your credentials to access your voice agents
          </p>
        </div>
      </div>

      {/* Google SSO Button */}
      <div className="mt-5">
        <a
          href="/api/auth/google"
          className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
            <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6a5.1 5.1 0 0 1-2.2 3.3v2.8h3.6c2-1.9 3.2-4.7 3.2-8.1z"/>
            <path fill="#34A853" d="M12 23c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.7H2v2.9A11 11 0 0 0 12 23z"/>
            <path fill="#FBBC05" d="M5.7 13.9a6.6 6.6 0 0 1 0-4.2V6.8H2a11 11 0 0 0 0 9.9z"/>
            <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2 6.8l3.7 2.9C6.6 7.3 9.1 5.4 12 5.4z"/>
          </svg>
          Continue with Google
        </a>
      </div>

      <div className="relative my-4 flex items-center gap-3 text-xs text-slate-400">
        <div className="h-px flex-1 bg-slate-200" />
        <span>OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-[11px] font-semibold uppercase tracking-wider text-slate-500"
          >
            Work Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-3 text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-[11px] font-semibold uppercase tracking-wider text-slate-500"
            >
              Password
            </Label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-500 hover:underline underline-offset-4 cursor-pointer transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-10 text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center space-x-2 pt-0.5">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
            className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
          />
          <Label
            htmlFor="remember"
            className="text-xs font-normal text-slate-500 cursor-pointer select-none"
          >
            Remember this device for 30 days
          </Label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          id="login-submit-btn"
          className="group relative mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-500/35 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Signing in...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Sign In to Workspace</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </Button>
      </form>

      {/* Divider with gradient */}
      {signupEnabled && (
        <>
          <div className="relative my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </div>

          {/* Sign up link */}
          <div className="text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-indigo-600 underline-offset-4 hover:text-indigo-500 hover:underline transition-colors"
              >
                Create free account
              </Link>
            </p>
          </div>
        </>
      )}
    </AuthShell>
  );
}
