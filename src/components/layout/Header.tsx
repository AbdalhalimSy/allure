"use client";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";

export default function Header() {
  const { t } = useI18n();
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setConfirmLogoutOpen(true);
  };
  const confirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logout();
      if (result.success) {
        toast.success(result.message || t("auth.loggedOut") || "Logged out");
      } else {
        toast.error(result.message || t("auth.logoutFailed") || "Logout failed");
      }
      setOpen(false);
      setConfirmLogoutOpen(false);
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };
  const cancelLogout = () => setConfirmLogoutOpen(false);
  return (
    <>
    <header className="sticky top-0 z-50 border-b border-[#c49a47]/30 bg-white/90 shadow-sm backdrop-blur dark:border-[#c49a47]/20 dark:bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo/logo-black.svg"
            alt="Allure Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: "/dashboard", label: t("nav.dashboard") },
            { href: "/about", label: t("nav.about") },
            { href: "/find-talent", label: t("nav.findTalent") || "Find Talent" },
            { href: "/casting", label: t("nav.castingCalls") },
            { href: "/talent", label: t("nav.talents") },
            { href: "/contact", label: t("nav.contact") },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-900 transition-colors hover:text-[#c49a47] dark:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-900 transition-colors hover:text-[#c49a47] dark:text-white"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#c49a47] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#c49a47]/30 transition hover:-translate-y-0.5"
              >
                {t("nav.signUp")}
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-100 text-sm font-semibold text-gray-700 dark:border-white/20 dark:bg-white/10 dark:text-white"
                aria-label="Open user menu"
              >
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span>
                    {user?.profile?.first_name 
                      ? user.profile.first_name.charAt(0).toUpperCase() 
                      : (user?.name || user?.email || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-black">
                  <div className="mb-2 rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-200">
                    <div className="font-semibold">
                      {user?.name || "Allure User"}
                    </div>
                    <div className="truncate text-gray-500 dark:text-gray-400">
                      {user?.email || "user@example.com"}
                    </div>
                    {user?.profile?.approval_status && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span
                          className={`inline-flex h-2 w-2 rounded-full ${
                            user.profile.approval_status === "approved"
                              ? "bg-green-500"
                              : user.profile.approval_status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="text-xs font-medium capitalize">
                          {user.profile.approval_status}
                        </span>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/dashboard/account"
                    className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                    onClick={() => setOpen(false)}
                  >
                    {t("nav.manageAccount") || "Manage Account"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-md px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                  >
                    {t("nav.logout") || "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
    <ConfirmDialog
      open={confirmLogoutOpen}
      title={t("auth.logoutTitle") || "Log out?"}
      description={t("auth.logoutConfirm") || "Are you sure you want to log out of your account?"}
      confirmText={t("nav.logout") || "Logout"}
      cancelText={t("common.cancel") || "Cancel"}
      onConfirm={confirmLogout}
      onCancel={cancelLogout}
      loading={isLoggingOut}
    />
    </>
  );
}
