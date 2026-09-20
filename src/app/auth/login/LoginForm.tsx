"use client";

import Link from "next/link";
import { useState } from "react";

import { FlowShell } from "@/components/auth/FlowShell";
import { OrDivider, SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({ signupEnabled }: { signupEnabled: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // DEMO FLOW (frontend-only): no backend call — any email + password continues
  // to the create-agent step. This also removes the failure warning toast that
  // fired while the backend was unreachable.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      window.localStorage.setItem("demo_user_email", email.trim());
    } catch {
      // Storage unavailable — continue anyway.
    }
    window.location.href = "/create-agent";
  };

  return (
    <FlowShell step={1}>
      <div className="mx-auto w-full max-w-[340px]">
        <div className="text-center">
        <h1 className="text-[36px] font-medium leading-[1.08] tracking-[-0.02em] text-[#0b0b0e] sm:text-[40px]">
          Welcome back!
        </h1>
        <p className="mt-3 text-[16px] leading-[1.6] text-[#5b5c64]">
          Your calls, your team, your pipeline — all in one place.
        </p>
      </div>

      <div className="mt-7">
        <SocialAuthButtons mode="in" />
      </div>
      <div className="mt-5">
        <OrDivider />
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 rounded-xl bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 rounded-xl bg-white"
          />
        </div>
        <Button
          type="submit"
          className="h-11 w-full rounded-full bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Sign in with email
        </Button>
      </form>

      {signupEnabled && (
        <p className="mt-6 text-center text-xs text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-neutral-700 underline underline-offset-4 hover:text-neutral-900"
          >
            Sign Up
          </Link>
        </p>
      )}
      </div>
    </FlowShell>
  );
}
