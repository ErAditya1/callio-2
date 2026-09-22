import { redirect } from "next/navigation";
import { getAuthProvider } from "@/lib/auth/config";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const provider = await getAuthProvider();
  if (provider === "stack") {
    redirect("/handler/sign-in");
  }
  redirect("/auth/login");
}

