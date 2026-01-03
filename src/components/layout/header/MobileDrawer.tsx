"use client";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChevronRight, Check, X } from "lucide-react";
import { logger } from "@/lib/utils/logger";
import CountryFilter from "../CountryFilter";
import LanguageSwitcher from "../LanguageSwitcher";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: Array<{ href: string; label: string }>;
  onLogout: () => void;
}

export default function MobileDrawer({
  open,
  onClose,
  navItems,
  onLogout,
}: MobileDrawerProps) {
  const { t } = useI18n();
  const { isAuthenticated, user, switchProfile, activeProfileId } = useAuth();
  const [isSwitchingProfile, setIsSwitchingProfile] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const router = useRouter();

  const handleSwitchProfile = async (profileId: number) => {
    if (profileId === activeProfileId || isSwitchingProfile) return;

    try {
      setIsSwitchingProfile(true);
      await switchProfile(profileId);
      toast.success(
        t("accountSettings.profile.switched") || "Profile switched successfully"
      );
      onClose();
      router.refresh();
    } catch (error) {
      logger.error("Failed to switch profile", error);
      toast.error(
        t("accountSettings.profile.switchFailed") || "Failed to switch profile"
      );
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

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        suppressHydrationWarning
      />

      {/* Side Drawer */}
      <div
        className={`fixed top-0 start-0 z-50 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "rtl:translate-x-full ltr:-translate-x-full"
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
              onClick={onClose}
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
              onClick={onClose}
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
                          ? t("accountSettings.account.status.approved")
                          : user.profile.approval_status === "pending"
                          ? t("accountSettings.account.status.pending")
                          : t("accountSettings.account.status.rejected")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Other Profiles */}
              {otherProfiles.length > 0 && (
                <div className="mt-4 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3 ">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 ">
                    {t("accountSettings.profile.switchTo") || "Switch Profile"}
                  </div>
                  {otherProfiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        handleSwitchProfile(profile.id);
                        onClose();
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
                            {t("accountSettings.profile.primary") || "Primary"}
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
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-gray-900 transition-all duration-200 ease-in-out hover:bg-[#c49a47]/10 hover:translate-x-1 active:scale-95 "
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#c49a47] rtl:scale-x-[-1]" />
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
              className="mb-4 flex items-center justify-center gap-3"
              suppressHydrationWarning
            >
              <CountryFilter />
              <LanguageSwitcher />
            </div>

            {!isAuthenticated ? (
              <div className="space-y-3" suppressHydrationWarning>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block w-full rounded-lg border border-[#c49a47] px-5 py-3 text-center text-sm font-semibold text-[#c49a47] transition-all duration-200 ease-in-out hover:bg-[#c49a47]/10 active:scale-95"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  onClick={onClose}
                  className="block w-full rounded-lg bg-[#c49a47] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#c49a47]/30 transition-all duration-200 ease-in-out hover:shadow-xl hover:shadow-[#c49a47]/40 active:scale-95"
                >
                  {t("nav.signUp")}
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/account"
                  onClick={onClose}
                  className="block w-full rounded-lg px-4 py-3 text-center text-sm font-medium text-gray-700 transition-all duration-200 ease-in-out hover:bg-gray-50 active:scale-95 "
                >
                  {t("nav.manageAccount") || "Manage Account"}
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    onLogout();
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
  );
}
