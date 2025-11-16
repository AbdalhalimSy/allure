import { ProfileData } from "@/contexts/AuthContext";

export function calculateBasicCompletion(profile: ProfileData | undefined): number {
  if (!profile) return 0;

  const requiredFields = [
    profile.first_name,
    profile.last_name,
    profile.gender,
    profile.dob,
    profile.mobile,
    profile.whatsapp,
  ];

  const filledCount = requiredFields.filter((field) => field && field !== "").length;
  return Math.round((filledCount / requiredFields.length) * 100);
}

export function calculateAppearanceCompletion(profile: ProfileData | undefined): number {
  if (!profile) return 0;

  const requiredFields = [
    profile.hair_color,
    profile.hair_type,
    profile.hair_length,
    profile.eye_color,
    profile.height,
    profile.shoe_size,
    profile.tshirt_size,
    profile.pants_size,
    profile.jacket_size,
    profile.chest,
    profile.bust,
    profile.waist,
  ];

  const filledCount = requiredFields.filter((field) => field !== null && field !== undefined && field !== "").length;
  return Math.round((filledCount / requiredFields.length) * 100);
}

export function calculateProfessionCompletion(profile: ProfileData | undefined): number {
  if (!profile) return 0;

  // Check if user has at least one profession
  // @ts-expect-error professions may not yet be declared on ProfileData; treated as optional dynamic field
  if (profile.professions && Array.isArray(profile.professions) && profile.professions.length > 0) {
    return 100;
  }
  
  return 0;
}

export function calculateExperienceCompletion(profile: ProfileData | undefined): number {
  if (!profile) return 0;

  // Check if experiences array exists and has at least one entry
  if (profile.experiences && profile.experiences.length > 0) {
    return 100;
  }
  return 0;
}
