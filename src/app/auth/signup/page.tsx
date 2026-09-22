"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  Loader2,
  Check,
  X,
  Fingerprint,
} from "lucide-react";

import { signupApiV1AuthSignupPost } from "@/client/sdk.gen";
import { AuthEnterpriseCTA } from "@/components/auth/AuthEnterpriseCTA";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

/* ── Stack-provider redirect variant ─────────────────────────── */
function StackSignUpRedirect() {
  return (
    <AuthShell enterpriseSlot={<AuthEnterpriseCTA />}>
      <div className="space-y-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 shadow-sm">
          <Fingerprint className="size-7 text-indigo-600" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
          <p className="text-sm text-slate-500">
            Your workspace uses enterprise authentication.
          </p>
        </div>
        <Button
          asChild
          className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 transition-all"
        >
          <Link href="/handler/sign-up">
            Open Sign Up Portal
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
        <p className="text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

/* ── Password Strength Rule Row ───────────────────────────────── */
function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="size-3.5 shrink-0 text-emerald-400" />
      ) : (
        <X className="size-3.5 shrink-0 text-slate-400" />
      )}
      <span className={`text-[11px] ${met ? "text-emerald-400 font-medium" : "text-slate-500"}`}>
        {label}
      </span>
    </div>
  );
}

/* ── Main Signup Page ─────────────────────────────────────────── */
export default function SignupPage() {
  const { provider } = useAuth();

  if (provider === "stack") {
    return <StackSignUpRedirect />;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isMatch = password !== "" && password === confirmPassword;
  const showRules = password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await signupApiV1AuthSignupPost({
        body: { email, password },
      });

      if (res.error || !res.data) {
        const detail = (res.error as { detail?: string })?.detail;
        toast.error(detail || "Signup failed");
        return;
      }

      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: res.data.token, user: res.data.user }),
      });

      toast.success("Account created! Welcome to CallioAI.");
      window.location.href = "/after-sign-in";
    } catch {
      toast.error("An error occurred during account creation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell enterpriseSlot={<AuthEnterpriseCTA />}>
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 shadow-sm">
          <UserPlus className="size-6 text-violet-600" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-[1.65rem]">
            Create an account
          </h1>
          <p className="text-sm text-slate-500">
            Start building human-level autonomous voice agents
          </p>
        </div>
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
          <Label
            htmlFor="password"
            className="text-[11px] font-semibold uppercase tracking-wider text-slate-500"
          >
            Password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-10 text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
              autoComplete="new-password"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-500 transition-colors cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-[11px] font-semibold uppercase tracking-wider text-slate-500"
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`h-11 rounded-xl bg-white pl-10 pr-10 text-slate-900 placeholder:text-slate-400 transition-colors focus-visible:ring-2 ${
                confirmPassword.length > 0
                  ? isMatch
                    ? "border-emerald-400 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                    : "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/20"
                  : "border-slate-200 focus-visible:border-indigo-400 focus-visible:ring-indigo-500/20"
              }`}
              autoComplete="new-password"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-500 transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Live Password Rules */}
        {showRules && (
          <div className="space-y-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <PasswordRule met={isMinLength} label="Minimum 8 characters" />
            <PasswordRule met={hasUpper} label="At least one uppercase letter" />
            <PasswordRule met={hasNumber} label="At least one number" />
            {confirmPassword.length > 0 && (
              <PasswordRule
                met={isMatch}
                label={isMatch ? "Passwords match" : "Passwords do not match"}
              />
            )}
          </div>
        )}

        {/* Terms notice */}
        <p className="text-[11px] leading-relaxed text-slate-400">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-indigo-600 hover:text-indigo-500 hover:underline underline-offset-4">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500 hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>

        {/* Submit */}
        <Button
          type="submit"
          id="signup-submit-btn"
          className="group relative mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-indigo-600 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/35 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Creating Account...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Create Free Account</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </Button>
      </form>

      {/* Sign in link */}
      <div className="relative mt-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
      <div className="mt-3 text-center">
        <p className="text-xs text-slate-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-indigo-600 underline-offset-4 hover:text-indigo-500 hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
