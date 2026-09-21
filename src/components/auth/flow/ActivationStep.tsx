"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckIcon,
} from "@hugeicons/core-free-icons";;
import { useEffect, useState } from "react";

const STEPS = [
  "Setting up your voice",
  "Learning your instructions",
  "Importing your contacts",
  "Activating your agent",
];

const STEP_MS = 1700;
const DASHBOARD_URL = "/dashboard/overview";

interface ActivationStepProps {
  agentName?: string;
}

export function ActivationStep({ agentName }: ActivationStepProps) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (done >= STEPS.length) {
      const t = setTimeout(() => {
        window.location.href = DASHBOARD_URL;
      }, 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setDone((d) => d + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [done]);

  const complete = done >= STEPS.length;

  // Heading — per request: always "Setting up your agent" (not "Your agent is ready")
  const heading = agentName ? `Setting up ${agentName}` : "Setting up your agent";

  return (
    <div className="mx-auto mt-10 w-full max-w-md text-center">
      <h1 className="text-[32px] font-medium leading-[1.1] tracking-[-0.02em] text-[#0b0b0e] sm:text-[36px]">
        {heading}
        {!complete && <span className="inline-block animate-pulse">…</span>}
      </h1>
      <p className="mt-3 text-[16px] leading-[1.6] text-[#5b5c64]">
        {complete ? "Everything is set. Taking you to your dashboard." : "Setting things up — this takes a few seconds."}
      </p>

      {/* Minimalist vertical progress timeline */}
      <div
        className="relative mx-auto mt-10 max-w-[320px] text-left"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={STEPS.length}
        aria-valuenow={done}
        aria-label="Agent setup progress"
      >
        {/* Fine vertical line — base */}
        <div className="absolute left-[7px] top-[8px] bottom-[8px] w-px bg-neutral-200" aria-hidden="true" />
        {/* Thin charcoal fill that grows smoothly */}
        <div
          className="absolute left-[7px] top-[8px] w-px bg-neutral-900 transition-all duration-700 ease-out"
          style={{ height: `calc(${(done / STEPS.length) * 100}% - 16px)` }}
          aria-hidden="true"
        />

        <ul className="relative space-y-7">
          {STEPS.map((step, i) => {
            const isDone = i < done || complete;
            const isActive = i === done && !complete;
            const isUpcoming = i > done && !complete;

            return (
              <li
                key={step}
                className={`flex items-center gap-4 transition-all duration-500 ${
                  isActive ? "opacity-100" : isDone ? "opacity-90" : "opacity-60"
                }`}
              >
                {/* Marker */}
                <span className="relative flex size-[15px] shrink-0 items-center justify-center">
                  {isDone ? (
                    // Completed — small muted check, no green circle / no card bg
                    <HugeiconsIcon icon={CheckIcon} className="size-[14px] text-neutral-500" strokeWidth={2} />
                  ) : isActive ? (
                    // Current — small dark dot with gentle pulse
                    <>
                      <span className="absolute size-[15px] rounded-full bg-neutral-900/10 animate-ping" aria-hidden="true" />
                      <span className="relative size-[9px] rounded-full bg-neutral-900 shadow-[0_0_0_4px_rgba(23,23,28,0.08)]" />
                    </>
                  ) : (
                    // Upcoming — subtle gray marker
                    <span className="size-[9px] rounded-full border border-neutral-300 bg-neutral-100" aria-hidden="true" />
                  )}
                </span>

                {/* Label — slight emphasis on active */}
                <span
                  className={`text-[14px] leading-none transition-all duration-500 ${
                    isActive
                      ? "font-medium text-neutral-900"
                      : isDone
                        ? "font-normal text-neutral-600"
                        : "font-normal text-neutral-400"
                  }`}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* No button — auto-redirect only (smooth fade to dashboard) */}
    </div>
  );
}
