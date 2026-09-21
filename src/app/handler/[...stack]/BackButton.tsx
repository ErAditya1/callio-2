"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";;
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  // On a direct load (e.g. an OAuth redirect or a deep link to /handler/sign-in)
  // there's no in-app history, so router.back() would bounce the user off-app.
  // Fall back to the home route in that case.
  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
      Go Back
    </Button>
  );
}
