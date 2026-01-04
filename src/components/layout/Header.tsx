"use client";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";
import { Menu } from "lucide-react";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { FaInstagram } from "react-icons/fa";
import CountryFilter from "./CountryFilter";
import UserMenu from "./header/UserMenu";
import UserAvatar from "./header/UserAvatar";
import MobileDrawer from "./header/MobileDrawer";
import NavItems from "./header/NavItems";

export default function Header() {
  const { t } = useI18n();
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

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
        toast.error(
          result.message || t("auth.logoutFailed") || "Logout failed"
        );
      }
      setOpen(false);
      setConfirmLogoutOpen(false);
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const cancelLogout = () => setConfirmLogoutOpen(false);

  const navItems = [
    { href: "/", label: t("nav.home") || "Home" },
    { href: "/about", label: t("nav.about") },
    { href: "/talents", label: t("nav.talents") },
    { href: "/jobs", label: t("nav.jobs") || "Jobs" },
    ...(isAuthenticated
      ? [
          {
            href: "/jobs/applied",
            label: t("nav.appliedJobs") || "Applied Jobs",
          },
        ]
      : []),
    ...(isAuthenticated ? [{ href: "/packages", label: t("nav.packages") || "Packages" }] : []),
    { href: "/faq", label: t("nav.faq") || "FAQ" },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#c49a47]/30 bg-white/90 shadow-sm backdrop-blur">
        <div
          className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 lg:px-8"
          suppressHydrationWarning
        >
          {/* Left Section: Menu Button & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0" suppressHydrationWarning>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg text-gray-900 transition-all duration-200 ease-in-out hover:bg-gray-100 active:scale-95 shrink-0"
              aria-label="Open menu"
            >
              <Menu className="h-5 sm:h-6 w-5 sm:w-6" />
            </button>

            <Link href="/" className="group flex items-center gap-2 sm:gap-3 shrink-0">
              <Image
                src="/logo/logo-black.svg"
                alt="Allure Logo"
                width={40}
                height={40}
                className="h-8 sm:h-9 md:h-10 w-auto"
                style={{ width: "auto" }}
              />
            </Link>
          </div>

          {/* Center Section: Navigation */}
          <NavItems items={navItems} />

          {/* Right Section: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 min-w-0" suppressHydrationWarning>
            {/* Notification */}
            <div className="hidden sm:block">
              <NotificationDropdown />
            </div>
            
            {/* Instagram */}
            <a
              href="https://www.instagram.com/allureagency"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-200 ease-in-out hover:scale-110 hover:border-transparent hover:bg-linear-to-br hover:from-purple-500 hover:via-pink-500 hover:to-red-500 hover:text-white active:scale-95 shrink-0"
            >
              <FaInstagram className="h-4 sm:h-5 w-4 sm:w-5" />
            </a>

            {/* Country & Language - Hidden on mobile, visible on md+ */}
            <div className="hidden md:flex md:items-center md:gap-2 lg:gap-3">
              <CountryFilter />
              <LanguageSwitcher />
            </div>

            {/* Auth Section */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/login"
                  className="hidden sm:block text-xs sm:text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:text-[#c49a47] hover:-translate-y-0.5"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[#c49a47] px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-[#c49a47]/30 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-[#c49a47]/40 active:translate-y-0 whitespace-nowrap"
                >
                  {t("nav.signUp")}
                </Link>
              </div>
            ) : (
              <div className="relative" ref={menuRef}>
                <UserAvatar onClick={() => setOpen((v) => !v)} />
                <UserMenu
                  open={open}
                  onClose={() => setOpen(false)}
                  menuRef={menuRef}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Side Menu */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        onLogout={handleLogout}
      />

      <ConfirmDialog
        open={confirmLogoutOpen}
        title={t("auth.logoutTitle") || "Log out?"}
        description={
          t("auth.logoutConfirm") ||
          "Are you sure you want to log out of your account?"
        }
        confirmText={t("nav.logout") || "Logout"}
        cancelText={t("common.cancel") || "Cancel"}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        loading={isLoggingOut}
      />
    </>
  );
}
