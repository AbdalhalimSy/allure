import { redirect } from "next/navigation";

export default function AccountPage() {
  // Server-side redirect to the default tab for instant navigation
  redirect("/dashboard/account/basic");
}
