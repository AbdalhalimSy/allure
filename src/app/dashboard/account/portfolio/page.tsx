"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import PortfolioContent from "../profile/PortfolioContent";
import { useAuth } from "@/contexts/AuthContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

export default function PortfolioPage() {
  const { user } = useAuth();
  const router = useRouter();
  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);

  // Redirect to profile setup if profile is not complete
  useEffect(() => {
    if (user?.profile && user.profile.progress_step !== "complete_all") {
      router.replace("/dashboard/account/profile");
    }
  }, [user?.profile, router]);

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
        <PortfolioContent onBack={() => {}} />
      </AccountLayout>
    </ProtectedRoute>
  );
}
