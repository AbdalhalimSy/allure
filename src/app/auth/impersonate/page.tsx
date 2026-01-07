"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { setAuthToken, setActiveProfileId } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";

function toProfileId(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function ImpersonateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, fetchProfile } = useAuth();
  const [status, setStatus] = useState("Preparing impersonation...");
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return; // Prevent reruns when searchParams identity changes
    ranRef.current = true;

    const token = searchParams.get("token");
    const profileId = toProfileId(searchParams.get("profile_id"));
    const email = searchParams.get("email") || undefined;

    if (!token) {
      setStatus("Missing token. Redirecting...");
      toast.error("Missing impersonation token.");
      router.replace("/login");
      return;
    }

    setStatus("Signing you in...");
    setAuthToken(token);
    if (email) {
      localStorage.setItem("auth_email", email);
    }
    if (profileId !== null) {
      setActiveProfileId(profileId);
    }

    // Mark authenticated immediately; full profile loads afterward.
    setUser({
      name: "Impersonated User",
      email,
    });

    fetchProfile()
      .catch(() => {
        // Profile fetch failures should not block login.
      })
      .finally(() => {
        toast.success("Impersonation sign-in complete.");
        router.replace("/");
      });
  }, [fetchProfile, router, searchParams, setUser]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#c49a47]" />
      <h1 className="text-xl font-semibold text-gray-900">Switching user</h1>
      <p className="text-sm text-gray-600">{status}</p>
    </div>
  );
}

export default function ImpersonatePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#c49a47]" />
          <h1 className="text-xl font-semibold text-gray-900">Loading...</h1>
          <p className="text-sm text-gray-600">Preparing impersonation...</p>
        </div>
      }
    >
      <ImpersonateContent />
    </Suspense>
  );
}
