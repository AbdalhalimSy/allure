"use client";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";
import { ChevronRight, Check, Menu, X } from "lucide-react";
import { logger } from "@/lib/utils/logger";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";

export default function Header() {
  const { t, locale } = useI18n();
  const isRTL = locale === "ar";
  const { isAuthenticated, user, logout, switchProfile, activeProfileId } =
    useAuth();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Removed showProfiles toggle; profiles list now always visible when other profiles exist
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSwitchingProfile, setIsSwitchingProfile] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
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

  const handleSwitchProfile = async (profileId: number) => {
    if (profileId === activeProfileId || isSwitchingProfile) return;

    try {
      setIsSwitchingProfile(true);
      await switchProfile(profileId);
      toast.success(t("profile.switched") || "Profile switched successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      logger.error("Failed to switch profile", error);
      toast.error(t("profile.switchFailed") || "Failed to switch profile");
    } finally {
      setIsSwitchingProfile(false);
    }
  };

  const currentProfile = user?.talent?.profiles.find(
    (p) => p.id === activeProfileId
  );
  const avatarSrc = useMemo(
    () => user?.avatarUrl || currentProfile?.featured_image_url || "",
    [user?.avatarUrl, currentProfile?.featured_image_url]
  );
  const avatarLetter = useMemo(() => {
    const firstName = user?.profile?.first_name;
    const fullName = currentProfile?.full_name || user?.name;
    const basis = firstName || fullName || user?.email || "U";
    return basis?.trim()?.charAt(0)?.toUpperCase() || "U";
  }, [
    user?.profile?.first_name,
    currentProfile?.full_name,
    user?.name,
    user?.email,
  ]);

  useEffect(() => {
    // reset error status when avatar source changes (e.g., after switch profile)
    setAvatarError(false);
  }, [avatarSrc]);
  const otherProfiles =
    user?.talent?.profiles.filter((p) => p.id !== activeProfileId) || [];

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
    ...(!isAuthenticated ? [{ href: "/packages", label: "Packages" }] : []),
    { href: "/faq", label: t("nav.faq") || "FAQ" },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
 <header className="sticky top-0 z-50 border-b border-[#c49a47]/30 bg-white/90 shadow-sm backdrop-blur ">
        <div
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
          suppressHydrationWarning
        >
          <div className="flex items-center gap-4" suppressHydrationWarning>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
 className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-gray-900 transition-all duration-200 ease-in-out hover:bg-gray-100 active:scale-95 "
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="group flex items-center gap-3">
              <Image
                src="/logo/logo-black.svg"
                alt="Allure Logo"
                width={40}
                height={40}
                className="h-10 w-auto"
                style={{ width: "auto" }}
              />
            </Link>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
 className="text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:text-[#c49a47] hover:-translate-y-0.5 "
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4" suppressHydrationWarning>
            <NotificationDropdown />
            <LanguageSwitcher />
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
 className="text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:text-[#c49a47] hover:-translate-y-0.5 "
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-[#c49a47] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#c49a47]/30 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-[#c49a47]/40 active:translate-y-0"
                >
                  {t("nav.signUp")}
                </Link>
              </>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen((v) => !v)}
 className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-100 text-sm font-semibold text-gray-700 transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-md active:scale-100 "
                  aria-label="Open user menu"
                >
                  {avatarSrc && !avatarError ? (
                    <Image
                      src={avatarSrc}
                      alt="Avatar"
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
 <span className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700 ">
                      {avatarLetter}
                    </span>
                  )}
                </button>
                <div
 className={`absolute end-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-lg transition-all duration-200 ease-in-out origin-top-right ${
                    open
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {/* Current Profile Info */}
 <div className="border-b border-gray-200 p-3 ">
 <div className="mb-2 rounded-md bg-gray-50 p-3 text-sm text-gray-700 ">
                      <div className="font-semibold">
                        {currentProfile?.full_name ||
                          user?.name ||
                          "Allure User"}
                      </div>
 <div className="truncate text-gray-500 ">
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
                            {user.profile.approval_status === "approved"
                              ? t("account.status.approved")
                              : user.profile.approval_status === "pending"
                              ? t("account.status.pending")
                              : t("account.status.rejected")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Profiles List (always visible when more profiles exist) */}
                    {otherProfiles.length > 0 && (
 <div className="mt-2 space-y-1 rounded-md border border-gray-200 bg-gray-50 p-2 ">
                        {otherProfiles.map((profile) => (
                          <button
                            key={profile.id}
                            onClick={() => handleSwitchProfile(profile.id)}
                            disabled={isSwitchingProfile}
 className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-sm transition-all duration-200 ease-in-out hover:bg-white hover:scale-102 disabled:opacity-50"
                          >
                            <Image
                              src={profile.featured_image_url}
                              alt={profile.full_name}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
 <div className="font-medium text-gray-900 ">
                                {profile.full_name}
                              </div>
                              {profile.is_primary && (
 <div className="text-xs text-gray-500 ">
                                  {t("profile.primary") || "Primary"}
                                </div>
                              )}
                            </div>
                            {profile.id === activeProfileId && (
                              <Check className="h-4 w-4 text-[#c49a47]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Menu Actions */}
                  <div className="p-3">
                    <Link
                      href="/account"
 className="block rounded-md px-3 py-2 text-sm text-gray-700 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:translate-x-1 "
                      onClick={() => setOpen(false)}
                    >
                      {t("nav.manageAccount") || "Manage Account"}
                    </Link>
                    <button
                      onClick={handleLogout}
 className="mt-1 w-full rounded-md px-3 py-2 text-start text-sm text-rose-600 transition-all duration-200 ease-in-out hover:bg-rose-50 hover:translate-x-1 "
                    >
                      {t("nav.logout") || "Logout"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Side Menu */}
      <>
        {/* Backdrop Overlay */}
        <div
          className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
          suppressHydrationWarning
        />

        {/* Side Drawer */}
        <div
 className={`fixed top-0 start-0 z-50 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
            mobileMenuOpen
              ? "translate-x-0"
              : isRTL
              ? "translate-x-full"
              : "-translate-x-full"
          }`}
          suppressHydrationWarning
        >
          <div className="flex h-full flex-col" suppressHydrationWarning>
            {/* Header */}
            <div
 className="flex items-center justify-between border-b border-gray-200 px-6 py-4 "
              suppressHydrationWarning
            >
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <Image
                  src="/logo/logo-black.svg"
                  alt="Allure Logo"
                  width={32}
                  height={32}
                  className="h-8 w-auto"
                  style={{ width: "auto" }}
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
 className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-900 transition-all duration-200 ease-in-out hover:bg-gray-100 active:scale-95 "
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* User Info (if authenticated) */}
            {isAuthenticated && (
              <div
 className="border-b border-gray-200 p-6 "
                suppressHydrationWarning
              >
                <div className="flex items-center gap-3">
 <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-gray-100 ">
                    {avatarSrc && !avatarError ? (
                      <Image
                        src={avatarSrc}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
 <span className="text-lg font-bold text-gray-700 ">
                        {avatarLetter}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
 <div className="truncate font-semibold text-gray-900 ">
                      {currentProfile?.full_name || user?.name || "Allure User"}
                    </div>
 <div className="truncate text-sm text-gray-500 ">
                      {user?.email || "user@example.com"}
                    </div>
                    {user?.profile?.approval_status && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`inline-flex h-2 w-2 rounded-full ${
                            user.profile.approval_status === "approved"
                              ? "bg-green-500"
                              : user.profile.approval_status === "pending"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        />
 <span className="text-xs font-medium capitalize text-gray-600 ">
                          {user.profile.approval_status === "approved"
                            ? t("account.status.approved")
                            : user.profile.approval_status === "pending"
                            ? t("account.status.pending")
                            : t("account.status.rejected")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Profiles */}
                {otherProfiles.length > 0 && (
 <div className="mt-4 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3 ">
 <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 ">
                      {t("profile.switchTo") || "Switch Profile"}
                    </div>
                    {otherProfiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => {
                          handleSwitchProfile(profile.id);
                          setMobileMenuOpen(false);
                        }}
                        disabled={isSwitchingProfile}
 className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-start text-sm transition-all duration-200 ease-in-out hover:bg-white hover:scale-[1.02] active:scale-100 disabled:opacity-50"
                      >
                        <Image
                          src={profile.featured_image_url}
                          alt={profile.full_name}
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <div className="flex-1">
 <div className="font-medium text-gray-900 ">
                            {profile.full_name}
                          </div>
                          {profile.is_primary && (
 <div className="text-xs text-gray-500 ">
                              {t("profile.primary") || "Primary"}
                            </div>
                          )}
                        </div>
                        {profile.id === activeProfileId && (
                          <Check className="h-4 w-4 text-[#c49a47]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-1" suppressHydrationWarning>
                {navItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
 className="group flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-900 transition-all duration-200 ease-in-out hover:bg-[#c49a47]/10 hover:translate-x-1 active:scale-95 "
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#c49a47] ${isRTL ? "rotate-180" : ""}`} />
                  </Link>
                ))}
              </div>
            </nav>

            {/* Footer Actions */}
            <div
 className="border-t border-gray-200 p-6 "
              suppressHydrationWarning
            >
              <div
                className="mb-4 flex items-center justify-center"
                suppressHydrationWarning
              >
                <LanguageSwitcher />
              </div>

              {!isAuthenticated ? (
                <div className="space-y-3" suppressHydrationWarning>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-lg border border-[#c49a47] px-5 py-3 text-center text-sm font-semibold text-[#c49a47] transition-all duration-200 ease-in-out hover:bg-[#c49a47]/10 active:scale-95"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full rounded-lg bg-[#c49a47] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#c49a47]/30 transition-all duration-200 ease-in-out hover:shadow-xl hover:shadow-[#c49a47]/40 active:scale-95"
                  >
                    {t("nav.signUp")}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
 className="block w-full rounded-lg px-4 py-3 text-center text-sm font-medium text-gray-700 transition-all duration-200 ease-in-out hover:bg-gray-50 active:scale-95 "
                  >
                    {t("nav.manageAccount") || "Manage Account"}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
 className="w-full rounded-lg px-4 py-3 text-sm font-medium text-rose-600 transition-all duration-200 ease-in-out hover:bg-rose-50 active:scale-95 "
                  >
                    {t("nav.logout") || "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>

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
