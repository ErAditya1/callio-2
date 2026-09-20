"use client";

import { toast } from "sonner";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 384 512" className="size-4 fill-neutral-900">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

/** Social sign-in buttons from the reference. OAuth isn't wired up yet, so a
    click explains that instead of failing silently. */
export function SocialAuthButtons({ mode }: { mode: "in" | "up" }) {
  const verb = mode === "in" ? "Sign in" : "Sign up";
  const comingSoon = (provider: "Google" | "Apple") =>
    toast(`${provider} sign-in isn't available yet — please continue with email.`);

  const buttonClass =
    "flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-[13px] font-medium whitespace-nowrap text-neutral-700 transition-colors hover:bg-neutral-50";

  return (
    <div className="flex gap-2.5">
      <button type="button" onClick={() => comingSoon("Google")} className={buttonClass}>
        <GoogleIcon />
        {verb} with Google
      </button>
      <button type="button" onClick={() => comingSoon("Apple")} className={buttonClass}>
        <AppleIcon />
        {verb} with Apple
      </button>
    </div>
  );
}

export function OrDivider() {
  return (
    <div aria-hidden="true" className="flex items-center gap-3">
      <span className="h-px flex-1 bg-neutral-200" />
      <span className="text-xs text-neutral-400">Or</span>
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}
