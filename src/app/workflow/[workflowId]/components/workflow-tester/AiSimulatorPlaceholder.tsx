"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
} from "@hugeicons/core-free-icons";;
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { DisabledNotice } from "./shared";

export function AiSimulatorPlaceholder({
    disabledReason,
}: {
    disabledReason: string | null;
}) {
    const [simulatorPrompt, setSimulatorPrompt] = useState(
        "Act like a skeptical prospect. Push on pricing, ask about integrations, and end the chat if the assistant becomes repetitive.",
    );

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
            {disabledReason ? <DisabledNotice reason={disabledReason} /> : null}
            <p className="text-sm text-[#737373]">
                Drive multi-turn, agent-vs-agent tests with a persona prompt.
            </p>
            <Textarea
                value={simulatorPrompt}
                onChange={(event) => setSimulatorPrompt(event.target.value)}
                placeholder="Describe the simulated user..."
                className="min-h-32 resize-none text-sm leading-6"
            />
            <Button size="sm" disabled className="self-start">
                <HugeiconsIcon icon={SparklesIcon} className="h-4 w-4" />
                Coming soon
            </Button>
        </div>
    );
}
