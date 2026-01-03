"use client";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Check } from "lucide-react";
import { logger } from "@/lib/utils/logger";

interface UserMenuProps {
  open: boolean;
  onClose: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onLogout: () => void;
}

export default function UserMenu({
  open,
  onClose,
  menuRef,
  onLogout,
}: UserMenuProps) {
  const { t } = useI18n();
  const { user, switchProfile, activeProfileId } = useAuth();
  const [isSwitchingProfile, setIsSwitchingProfile] = useState(false);
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

  const otherProfiles =
    user?.talent?.profiles.filter((p) => p.id !== activeProfileId) || [];

  return (
    <div
      ref={menuRef}
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
            {currentProfile?.full_name || user?.name || "Allure User"}
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
                  ? t("accountSettings.account.status.approved")
                  : user.profile.approval_status === "pending"
                  ? t("accountSettings.account.status.pending")
                  : t("accountSettings.account.status.rejected")}
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

      {/* Menu Actions */}
      <div className="p-3">
        <Link
          href="/account"
          className="block rounded-md px-3 py-2 text-sm text-gray-700 transition-all duration-200 ease-in-out hover:bg-gray-50 hover:translate-x-1 "
          onClick={onClose}
        >
          {t("nav.manageAccount") || "Manage Account"}
        </Link>
        <button
          onClick={onLogout}
          className="mt-1 w-full rounded-md px-3 py-2 text-start text-sm text-rose-600 transition-all duration-200 ease-in-out hover:bg-rose-50 hover:translate-x-1 "
        >
          {t("nav.logout") || "Logout"}
        </button>
      </div>
    </div>
  );
}
