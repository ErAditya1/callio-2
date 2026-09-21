import Image from "next/image";
import type { ReactNode } from "react";

const FLOW_STEPS = ["Login", "Create agent", "Payment", "Go live"];

export function FlowSteps({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Setup progress">
      {FLOW_STEPS.map((label, i) => {
        const n = i + 1;
        const reached = n <= step;
        const active = n === step;
        return (
          <li key={label} {...(active ? { "aria-current": "step" as const } : {})}>
            <span
              aria-hidden="true"
              className={`block h-[3px] rounded-full ${reached ? "bg-neutral-950" : "bg-neutral-200"}`}
            />
            <span className="sr-only">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Shared shell for the 4-step demo flow (login → create-agent → payment →
 * activation). Same split format on every step: step content on the LEFT,
 * the fixed garden artwork on the RIGHT (sticky full-height, identical on all
 * steps). Only the left content swaps. Mobile collapses to content only.
 */
export function FlowShell({
  step,
  children,
  imageSrc = "/auth-page-img.png",
  imageAlt = "Dithered grayscale garden with a circular moon gate over still water",
}: {
  step: 1 | 2 | 3 | 4;
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <div className="min-h-svh bg-white lg:grid lg:grid-cols-2">
      {/* Step content (LEFT) — 50% width */}
      <div className="flex min-h-svh flex-col px-6 py-8 sm:px-10 lg:px-10 xl:px-12">
        <div className="mx-auto w-full max-w-[520px]">
          <FlowSteps step={step} />
        </div>

        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col">
          <div className="m-auto w-full">{children}</div>
        </div>
      </div>

      {/* Fixed visual (RIGHT) — 50% width, sticky full-height, same image on every step */}
      <aside className="relative hidden lg:block">
        <div className="sticky top-0 h-svh overflow-hidden bg-neutral-100">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={step === 1}
            sizes="50vw"
            className="object-cover"
          />
        </div>
      </aside>
    </div>
  );
}
