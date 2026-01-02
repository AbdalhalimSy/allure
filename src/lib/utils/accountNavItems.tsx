import {
  TbUser,
  TbSparkles,
  TbBriefcase,
  TbStar,
  TbPhoto,
  TbShieldCheck,
  TbCreditCard,
  TbCamera,
} from "react-icons/tb";
import { ProfileData } from "@/contexts/AuthContext";
import {
  calculateBasicCompletion,
  calculateAppearanceCompletion,
  calculateProfessionCompletion,
  calculateExperienceCompletion,
} from "./profileCompletion";

export const getAccountNavItems = (profile: ProfileData | undefined) => {
  const isProfileComplete = profile?.progress_step === "complete";

  if (isProfileComplete) {
    // Show individual profile steps as tabs when profile is complete
    return [
      {
        id: "basic",
        label: "Basic Information",
        labelKey: "account.nav.basic",
        icon: <TbUser />,
      },
      {
        id: "appearance",
        label: "Appearance",
        labelKey: "account.nav.appearance",
        icon: <TbSparkles />,
      },
      {
        id: "profession",
        label: "Professions",
        labelKey: "account.nav.profession",
        icon: <TbBriefcase />,
      },
      {
        id: "experience",
        label: "Experience",
        labelKey: "account.nav.experience",
        icon: <TbStar />,
      },
      {
        id: "portfolio",
        label: "Portfolio",
        labelKey: "account.nav.portfolio",
        icon: <TbPhoto />,
      },
      {
        id: "photos",
        label: "Profile Photos",
        labelKey: "account.nav.photos",
        icon: <TbCamera />,
      },
      { id: "security", label: "Security & Privacy", labelKey: "account.nav.security", icon: <TbShieldCheck /> },
      { id: "billing", label: "Billing & Plans", labelKey: "account.nav.billing", icon: <TbCreditCard /> },
    ];
  }

  // Show Profile Setup during onboarding
  return [
    {
      id: "profile",
      label: "Profile Setup",
      labelKey: "account.nav.profile",
      icon: <TbUser />,
    },
    { id: "security", label: "Security & Privacy", labelKey: "account.nav.security", icon: <TbShieldCheck /> },
    { id: "billing", label: "Billing & Plans", labelKey: "account.nav.billing", icon: <TbCreditCard /> },
  ];
};

// Helper function to get individual step completions (used by Profile Setup page)
export const getProfileStepCompletions = (profile: ProfileData | undefined) => {
  return {
    basic: calculateBasicCompletion(profile),
    appearance: calculateAppearanceCompletion(profile),
    profession: calculateProfessionCompletion(profile),
    experience: calculateExperienceCompletion(profile),
  };
};
