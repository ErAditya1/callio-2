import { getSignupEnabled } from "@/lib/auth/config";

import { OnboardingFlow } from "@/components/auth/flow/OnboardingFlow";

export const dynamic = "force-dynamic";

export default async function AuthPage() {
  const signupEnabled = await getSignupEnabled();
  return <OnboardingFlow signupEnabled={signupEnabled} />;
}
