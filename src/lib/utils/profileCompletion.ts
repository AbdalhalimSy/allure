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

  // Check both ID fields and string fields for backward compatibility
  const requiredFields = [
    profile.hair_color_id || profile.hair_color,
    profile.hair_type_id || profile.hair_type,
    profile.hair_length_id || profile.hair_length,
    profile.eye_color_id || profile.eye_color,
    profile.height,
    profile.shoe_size,
    profile.tshirt_size,
    profile.pants_size,
    profile.jacket_size,
    profile.chest,
    profile.bust,
    profile.waist,
  ];

  const filledCount = requiredFields.filter((field) => {
    // Check for non-empty values (exclude null, undefined, empty string, and 0)
    return field !== null && field !== undefined && field !== "" && field !== 0;
  }).length;
  
  return Math.round((filledCount / requiredFields.length) * 100);
}

export function calculateProfessionCompletion(profile: ProfileData | undefined): number {
  if (!profile) return 0;

  // Professions are stored separately and fetched via /profile/professions API
  // Cannot be calculated from profile data alone
  // For now, assume complete if profile setup is finished
  return profile.progress_step === "complete" ? 100 : 0;
}

export function calculateExperienceCompletion(profile: ProfileData | undefined): number {
  if (!profile) return 0;

  // Check if experiences array exists and has at least one entry
  if (profile.experiences && Array.isArray(profile.experiences) && profile.experiences.length > 0) {
    return 100;
  }
  return 0;
}

export function calculatePortfolioCompletion(profile: ProfileData | undefined): number {
  if (!profile) return 0;

  // Portfolio items are stored separately and fetched via /profile/portfolio API
  // Cannot be calculated from profile data alone
  // For now, assume complete if profile setup is finished
  return profile.progress_step === "complete" ? 100 : 0;
}

export function calculatePhotosCompletion(profile: ProfileData | undefined): number {
  if (!profile) return 0;

  // Check if profile has profile picture
  if (profile.profile_picture) {
    return 100;
  }
  
  return 0;
}
