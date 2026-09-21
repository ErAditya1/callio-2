import { redirect } from "next/navigation";

export default function CreateAgentRedirect() {
  redirect("/auth/login");
}
