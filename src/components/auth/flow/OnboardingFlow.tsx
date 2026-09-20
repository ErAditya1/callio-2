"use client";

import { useEffect, useState } from "react";

import { FlowShell } from "@/components/auth/FlowShell";

import { ActivationStep } from "./ActivationStep";
import { CreateAgentStep } from "./CreateAgentStep";
import { LoginStep } from "./LoginStep";
import { PaymentStep } from "./PaymentStep";

interface OnboardingFlowProps {
  signupEnabled: boolean;
}

export function OnboardingFlow({ signupEnabled }: OnboardingFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [agentName, setAgentName] = useState("");
  const [contactCount, setContactCount] = useState<number | null>(null);

  // Restore email / draft on mount to allow refresh persistence
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("demo_agent_draft");
      if (raw) {
        const d = JSON.parse(raw) as { agentName?: string; validContacts?: number; contactTotal?: number };
        if (d.agentName) setAgentName(d.agentName);
        if (typeof d.validContacts === "number") setContactCount(d.validContacts);
        else if (typeof d.contactTotal === "number") setContactCount(d.contactTotal);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleLoginNext = () => {
    setStep(2);
    // Smooth scroll to top for next step content
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateAgentNext = (draft: Record<string, string | number>) => {
    if (draft.agentName && typeof draft.agentName === "string") setAgentName(draft.agentName);
    if (typeof draft.validContacts === "number") setContactCount(draft.validContacts as number);
    else if (typeof draft.contactTotal === "number") setContactCount(draft.contactTotal as number);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentNext = () => {
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <FlowShell step={step}>
      <div className="animate-in fade-in duration-300">
        {step === 1 && <LoginStep signupEnabled={signupEnabled} onNext={handleLoginNext} />}
        {step === 2 && (
          <CreateAgentStep onNext={handleCreateAgentNext} onBack={() => setStep(1)} />
        )}
        {step === 3 && (
          <PaymentStep
            onNext={handlePaymentNext}
            onBack={() => setStep(2)}
            agentName={agentName}
            contactCount={contactCount}
          />
        )}
        {step === 4 && <ActivationStep agentName={agentName} />}
      </div>
    </FlowShell>
  );
}
