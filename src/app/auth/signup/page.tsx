"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { AuthCardShell } from "@/components/auth/AuthCardShell";
import { OrDivider, SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // DEMO FLOW (frontend-only): no backend call — validated details continue to
  // the create-agent step.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      window.localStorage.setItem("demo_user_email", email.trim());
    } catch {
      // Storage unavailable — continue anyway.
    }
    window.location.href = "/create-agent";
  };

  return (
    <AuthCardShell>
      <div className="text-center">
        <h1 className="text-[30px] font-medium leading-[1.08] tracking-[-0.02em] text-[#0b0b0e] sm:text-[34px] sm:whitespace-nowrap">
          Create your account
        </h1>
        <p className="mt-3 text-[16px] leading-[1.6] text-[#5b5c64]">
          Your calls, your team, your pipeline — all in one place.
        </p>
      </div>

      <div className="mt-7">
        <SocialAuthButtons mode="up" />
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
            placeholder="Create a password (8+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="h-11 rounded-xl bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="sr-only">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="h-11 rounded-xl bg-white"
          />
        </div>
        <Button
          type="submit"
          className="h-11 w-full rounded-full bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Sign up with email
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-neutral-400">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-neutral-700 underline underline-offset-4 hover:text-neutral-900"
        >
          Sign In
        </Link>
      </p>
    </AuthCardShell>
  );
}
