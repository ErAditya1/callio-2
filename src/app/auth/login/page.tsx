import { redirect } from "next/navigation";

import { getAuthProvider, getSignupEnabled } from "@/lib/auth/config";

import { LoginForm } from "./LoginForm";

// Resolve the backend health check before rendering so the auth route is
// correct on first paint — redirects to Stack Auth when enabled.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const provider = await getAuthProvider();
  if (provider === "stack") {
    redirect("/handler/sign-in");
  }

  const signupEnabled = await getSignupEnabled();
  return <LoginForm signupEnabled={signupEnabled} />;
}

