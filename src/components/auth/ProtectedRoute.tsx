"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAuth?: boolean; // true = must be logged in, false = must be logged out
};

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (!hydrated) return;

    if (requireAuth && !isAuthenticated) {
      // User must be authenticated but isn't
      router.replace("/login");
    } else if (!requireAuth && isAuthenticated) {
      // User must NOT be authenticated but is (guest-only page)
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, requireAuth, router]);

  // Show loading while checking auth status
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#c49a47] border-t-transparent"></div>
 <p className="mt-4 text-sm text-gray-500 ">
            {t("auth.loading") || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // If requiring auth and not authenticated, show nothing (will redirect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If guest-only page and authenticated, show nothing (will redirect)
  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
