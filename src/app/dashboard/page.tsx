"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Briefcase, User, Settings, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, hydrated, user } = useAuth();
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

  const quickLinks = [
    {
      title: "My Applications",
      description: "Track and manage your job applications",
      icon: Briefcase,
      href: "/dashboard/applied-jobs",
      color: "from-[#c49a47] to-amber-500",
      iconBg: "bg-[#c49a47]/10",
      iconColor: "text-[#c49a47]"
    },
    {
      title: "Account Settings",
      description: "Manage your profile and preferences",
      icon: Settings,
      href: "/dashboard/account",
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600"
    },
    {
      title: "Browse Jobs",
      description: "Find new opportunities to apply",
      icon: Briefcase,
      href: "/jobs",
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600"
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || "there"}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's what's happening with your talent profile
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
              >
                <div className="relative z-10">
                  <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${link.iconBg}`}>
                    <Icon className={`h-7 w-7 ${link.iconColor}`} />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                    {link.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                    {link.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#c49a47]">
                    View
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-linear-to-br ${link.color} opacity-10 blur-2xl transition-opacity group-hover:opacity-20`} />
              </Link>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-linear-to-br from-[#c49a47]/5 to-amber-50/50 p-6 dark:border-[#c49a47]/20 dark:from-[#c49a47]/10 dark:to-[#c49a47]/5">
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
            📢 Quick Tip
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Keep your profile updated and check your applications regularly to stay on top of new opportunities!
          </p>
        </div>
      </div>
    </div>
  );
}