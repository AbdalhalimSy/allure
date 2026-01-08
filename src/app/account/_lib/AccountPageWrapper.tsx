"use client";

import { ReactNode, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

interface AccountPageWrapperProps {
  children: ReactNode;
  requireCompleteProfile?: boolean;
}

/**
 * Reusable wrapper for account pages that provides:
 * - Authentication protection
 * - Account layout with navigation
 * - Automatic redirect to profile setup if incomplete (when required)
 */
export default function AccountPageWrapper({
  children,
  requireCompleteProfile = true,
}: AccountPageWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();
  const navItems = useMemo(
    () => getAccountNavItems(user?.profile),
    [user?.profile]
  );

  // Redirect to profile setup if profile is not complete
  useEffect(() => {
    if (
      requireCompleteProfile &&
      user?.profile &&
      user.profile.progress_step !== "complete"
    ) {
      router.replace("/account/profile");
    }
  }, [user?.profile, router, requireCompleteProfile]);

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>{children}</AccountLayout>
    </ProtectedRoute>
  );
}
