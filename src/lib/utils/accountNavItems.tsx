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
        labelKey: "accountSettings.account.nav.basic",
        icon: <TbUser />,
      },
      {
        id: "appearance",
        label: "Appearance",
        labelKey: "accountSettings.account.nav.appearance",
        icon: <TbSparkles />,
      },
      {
        id: "profession",
        label: "Professions",
        labelKey: "accountSettings.account.nav.profession",
        icon: <TbBriefcase />,
      },
      {
        id: "experience",
        label: "Experience",
        labelKey: "accountSettings.account.nav.experience",
        icon: <TbStar />,
      },
      {
        id: "portfolio",
        label: "Portfolio",
        labelKey: "accountSettings.account.nav.portfolio",
        icon: <TbPhoto />,
      },
      {
        id: "photos",
        label: "Profile Photos",
        labelKey: "accountSettings.account.nav.photos",
        icon: <TbCamera />,
      },
      { id: "security", label: "Security & Privacy", labelKey: "accountSettings.account.nav.security", icon: <TbShieldCheck /> },
      { id: "billing", label: "Billing & Plans", labelKey: "accountSettings.account.nav.billing", icon: <TbCreditCard /> },
    ];
  }

  // Show Profile Setup during onboarding
  return [
    {
      id: "profile",
      label: "Profile Setup",
      labelKey: "accountSettings.account.nav.profile",
      icon: <TbUser />,
    },
    { id: "security", label: "Security & Privacy", labelKey: "accountSettings.account.nav.security", icon: <TbShieldCheck /> },
    { id: "billing", label: "Billing & Plans", labelKey: "accountSettings.account.nav.billing", icon: <TbCreditCard /> },
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
