"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import ProfilePhotosManager from "@/components/account/ProfilePhotosManager";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

export default function ProfilePhotosPage() {
  const { user } = useAuth();
  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);

  return (
    <ProtectedRoute>
      <AccountLayout navItems={navItems}>
        <ProfilePhotosManager />
      </AccountLayout>
    </ProtectedRoute>
  );
}
