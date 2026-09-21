import { redirect } from "next/navigation";

export default function ActivationRedirect() {
  redirect("/auth/login");
}
