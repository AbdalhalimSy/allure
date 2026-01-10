"use client";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";

interface UserAvatarProps {
  onClick: () => void;
}

export default function UserAvatar({ onClick }: UserAvatarProps) {
  const { user, activeProfileId } = useAuth();
  const [avatarError, setAvatarError] = useState(false);

  const currentProfile = user?.talent?.profiles.find(
    (p) => p.id === activeProfileId
  );

  const isPremium = user?.is_premium;

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

  return (
    <button
      onClick={onClick}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-sm font-semibold text-gray-700 transition-all duration-200 ease-in-out hover:scale-110 hover:shadow-md active:scale-100 "
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
      {isPremium && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-[#c49a47]/30">
          <Star className="h-3 w-3 text-[#c49a47] fill-[#c49a47]" />
        </span>
      )}
    </button>
  );
}
