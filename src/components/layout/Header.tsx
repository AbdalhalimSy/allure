"use client";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";
import { ChevronRight, Check } from "lucide-react";

export default function Header() {
  const { t } = useI18n();
  const { isAuthenticated, user, logout, switchProfile, activeProfileId } = useAuth();
  const [open, setOpen] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
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

  const handleSwitchProfile = async (profileId: number) => {
    if (profileId === activeProfileId || isSwitchingProfile) return;
    
    try {
      setIsSwitchingProfile(true);
      await switchProfile(profileId);
      toast.success(t("profile.switched") || "Profile switched successfully");
      setShowProfiles(false);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to switch profile:", error);
      toast.error(t("profile.switchFailed") || "Failed to switch profile");
    } finally {
      setIsSwitchingProfile(false);
    }
  };

  const currentProfile = user?.talent?.profiles.find(p => p.id === activeProfileId);
  const avatarSrc = useMemo(() => user?.avatarUrl || currentProfile?.featured_image_url || "", [user?.avatarUrl, currentProfile?.featured_image_url]);
  const avatarLetter = useMemo(() => {
    const firstName = user?.profile?.first_name;
    const fullName = currentProfile?.full_name || user?.name;
    const basis = firstName || fullName || user?.email || "U";
    return basis?.trim()?.charAt(0)?.toUpperCase() || "U";
  }, [user?.profile?.first_name, currentProfile?.full_name, user?.name, user?.email]);

  useEffect(() => {
    // reset error status when avatar source changes (e.g., after switch profile)
    setAvatarError(false);
  }, [avatarSrc]);
  const otherProfiles = user?.talent?.profiles.filter(p => p.id !== activeProfileId) || [];
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
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700 dark:bg-white/20 dark:text-white">
                    {avatarLetter}
                  </span>
                )}
              </button>
              {open && (
                <div className="absolute end-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/10 dark:bg-black">
                  {/* Current Profile Info */}
                  <div className="border-b border-gray-200 p-3 dark:border-white/10">
                    <div className="mb-2 rounded-md bg-gray-50 p-3 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-200">
                      <div className="font-semibold">
                        {currentProfile?.full_name || user?.name || "Allure User"}
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

                    {/* Profile Switcher */}
                    {otherProfiles.length > 0 && (
                      <button
                        onClick={() => setShowProfiles(!showProfiles)}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                      >
                        <span>{t("profile.switchProfile") || "Switch Profile"}</span>
                        <ChevronRight 
                          className={`h-4 w-4 transition-transform ${showProfiles ? "rotate-90" : ""}`} 
                        />
                      </button>
                    )}

                    {/* Sub-profiles List */}
                    {showProfiles && otherProfiles.length > 0 && (
                      <div className="mt-2 space-y-1 rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-white/10 dark:bg-white/5">
                        {otherProfiles.map((profile) => (
                          <button
                            key={profile.id}
                            onClick={() => handleSwitchProfile(profile.id)}
                            disabled={isSwitchingProfile}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-white dark:hover:bg-white/10 disabled:opacity-50"
                          >
                            <Image
                              src={profile.featured_image_url}
                              alt={profile.full_name}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {profile.full_name}
                              </div>
                              {profile.is_primary && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
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
                      href="/dashboard/account"
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
                      onClick={() => setOpen(false)}
                    >
                      {t("nav.manageAccount") || "Manage Account"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="mt-1 w-full rounded-md px-3 py-2 text-start text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
                    >
                      {t("nav.logout") || "Logout"}
                    </button>
                  </div>
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
