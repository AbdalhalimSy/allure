"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { isAuthenticated, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return <div className="mx-auto max-w-sm px-6 py-20 text-center text-gray-500">Loading...</div>;
  }
  if (!isAuthenticated) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">Welcome to your dashboard. More coming soon.</p>
    </div>
  );
}