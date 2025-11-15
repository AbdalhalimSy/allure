import { redirect } from "next/navigation";

export default function AccountPage() {
  // Server-side redirect to the profile setup page
  redirect("/dashboard/account/profile");
}
