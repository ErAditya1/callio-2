import { redirect } from "next/navigation";
import { getAuthProvider } from "@/lib/auth/config";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  const provider = await getAuthProvider();
  if (provider === "stack") {
    redirect("/handler/sign-up");
  }
  redirect("/auth/signup");
}

