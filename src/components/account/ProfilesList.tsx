"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { Check, Crown, Plus, User as UserIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/utils/logger";

interface ProfilesListProps {
  onCreateNew: () => void;
}

export default function ProfilesList({ onCreateNew }: ProfilesListProps) {
  const { t } = useI18n();
  const { user, switchProfile, activeProfileId, fetchProfile } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const router = useRouter();

  const handleSwitchProfile = async (profileId: number) => {
    if (profileId === activeProfileId || isSwitching) return;

    try {
      setIsSwitching(true);
      await switchProfile(profileId);
      await fetchProfile();
      toast.success(t("profile.switched") || "Profile switched successfully");
      router.refresh();
    } catch (error) {
      logger.error("Failed to switch profile", error);
      toast.error(t("profile.switchFailed") || "Failed to switch profile");
    } finally {
      setIsSwitching(false);
    }
  };

  const handleImageError = (profileId: number) => {
    setImageErrors((prev) => ({ ...prev, [profileId]: true }));
  };

  const profiles = user?.talent?.profiles || [];
  const primaryProfileId = user?.talent?.primary_profile_id;
  const primaryProfile = profiles.find((p) => p.id === primaryProfileId);
  const otherProfiles = profiles.filter((p) => p.id !== primaryProfileId);

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t("account.profiles.noProfiles") || "No profiles found"}
        </h3>
        <p className="text-gray-600 mb-6">
          {t("account.profiles.noProfilesDescription") ||
            "Create your first profile to get started"}
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#c49a47] text-white rounded-lg hover:bg-[#b38a3f] transition-colors"
        >
          <Plus className="h-5 w-5" />
          {t("account.profiles.createFirst") || "Create Profile"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Primary Account Profile */}
      {primaryProfile && (
        <div className="pb-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
            {t("account.profiles.primaryAccount") || "Primary Account"}
          </h3>
          <button
            onClick={() => handleSwitchProfile(primaryProfile.id)}
            disabled={isSwitching || primaryProfile.id === activeProfileId}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
              primaryProfile.id === activeProfileId
                ? "bg-linear-to-r from-amber-100 to-amber-100/50 border-amber-400 shadow-md"
                : "bg-linear-to-r from-amber-50 to-amber-50/50 border-amber-200 hover:border-amber-300 hover:shadow-md hover:bg-linear-to-r hover:from-amber-100 hover:to-amber-100/50"
            } ${
              isSwitching ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              {/* Primary Profile Image */}
              <div className="relative shrink-0">
                {!imageErrors[primaryProfile.id] ? (
                  <Image
                    src={primaryProfile.featured_image_url}
                    alt={primaryProfile.full_name}
                    width={80}
                    height={80}
                    onError={() => handleImageError(primaryProfile.id)}
                    className="h-20 w-20 rounded-full object-cover border-3 border-white shadow-md"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-amber-200 border-3 border-white shadow-md flex items-center justify-center">
                    <UserIcon className="h-10 w-10 text-amber-700" />
                  </div>
                )}
              </div>

              {/* Primary Profile Info */}
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {primaryProfile.full_name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white">
                    <Crown className="h-3 w-3" />
                    {t("account.profiles.primary") || "Primary"}
                  </span>
                </div>
                <p className="text-sm text-start text-amber-700">
                  {t("account.profiles.createdOn") || "Created"}{" "}
                  {new Date(primaryProfile.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Active Badge for Primary */}
              {primaryProfile.id === activeProfileId && (
                <div className="shrink-0">
                  <span className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-white">
                    <Check className="h-3 w-3" />
                    {t("account.profiles.active") || "Active"}
                  </span>
                </div>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Other Profiles Grid */}
      {otherProfiles.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
            {t("account.profiles.otherProfiles") || "Other Profiles"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherProfiles.map((profile) => {
              const isActive = profile.id === activeProfileId;
              const hasImageError = imageErrors[profile.id];

              return (
                <button
                  key={profile.id}
                  onClick={() => handleSwitchProfile(profile.id)}
                  disabled={isSwitching || isActive}
                  className={`
                    relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200
                    ${
                      isActive
                        ? "border-[#c49a47] bg-[#c49a47]/5 shadow-md"
                        : "border-gray-200 hover:border-[#c49a47] hover:shadow-md hover:bg-gray-50"
                    }
                    ${
                      isSwitching
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                >
                  {/* Profile Image */}
                  <div className="relative mb-3 w-full flex justify-center">
                    {!hasImageError ? (
                      <Image
                        src={profile.featured_image_url}
                        alt={profile.full_name}
                        width={120}
                        height={120}
                        onError={() => handleImageError(profile.id)}
                        className="h-24 w-24 rounded-full object-cover border-3 border-white shadow-md"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-gray-200 border-3 border-white shadow-md flex items-center justify-center">
                        <UserIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-[#c49a47] flex items-center justify-center border-3 border-white">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <h3 className="font-semibold text-gray-900 text-center text-sm">
                    {profile.full_name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>

                  {/* Active Badge */}
                  {isActive && (
                    <div className="mt-3 w-full">
                      <span className="inline-flex items-center justify-center gap-1 w-full px-2 py-1.5 rounded-lg text-xs font-semibold bg-[#c49a47] text-white">
                        <Check className="h-3 w-3" />
                        {t("account.profiles.active") || "Active"}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
