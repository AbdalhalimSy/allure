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
  calculatePortfolioCompletion,
} from "./profileCompletion";

export const getAccountNavItems = (profile: ProfileData | undefined) => {
  const isProfileComplete = profile?.progress_step === "complete";

  if (isProfileComplete) {
    // Show individual profile steps as tabs when profile is complete, organized by sections
    return [
      // Profile Section
      {
        id: "basic",
        label: "Basic Information",
        labelKey: "account.nav.basic",
        icon: <TbUser />,
        section: "profile",
        completion: calculateBasicCompletion(profile),
      },
      {
        id: "appearance",
        label: "Appearance",
        labelKey: "account.nav.appearance",
        icon: <TbSparkles />,
        section: "profile",
        completion: calculateAppearanceCompletion(profile),
      },
      // Professional Section
      {
        id: "profession",
        label: "Professions",
        labelKey: "account.nav.profession",
        icon: <TbBriefcase />,
        section: "professional",
        completion: calculateProfessionCompletion(profile),
      },
      {
        id: "experience",
        label: "Experience",
        labelKey: "account.nav.experience",
        icon: <TbStar />,
        section: "professional",
        completion: calculateExperienceCompletion(profile),
      },
      {
        id: "portfolio",
        label: "Portfolio",
        labelKey: "account.nav.portfolio",
        icon: <TbPhoto />,
        section: "professional",
        completion: calculatePortfolioCompletion(profile),
      },
      {
        id: "photos",
        label: "Profile Photos",
        labelKey: "account.nav.photos",
        icon: <TbCamera />,
        section: "professional",
        // No completion field - photo gallery management page
      },
      // Account Section
      {
        id: "security",
        label: "Security & Privacy",
        labelKey: "account.nav.security",
        icon: <TbShieldCheck />,
        section: "account",
        // No completion field - these are informational pages
      },
      {
        id: "billing",
        label: "Billing & Plans",
        labelKey: "account.nav.billing",
        icon: <TbCreditCard />,
        section: "account",
        // No completion field - these are informational pages
      },
    ];
  }

  // Show Profile Setup during onboarding with completion percentages
  const basicCompletion = calculateBasicCompletion(profile);
  const appearanceCompletion = calculateAppearanceCompletion(profile);
  const professionCompletion = calculateProfessionCompletion(profile);
  const experienceCompletion = calculateExperienceCompletion(profile);

  // Calculate overall profile completion (average of the 4 main steps)
  const overallCompletion = Math.round(
    (basicCompletion + appearanceCompletion + professionCompletion + experienceCompletion) / 4
  );

  return [
    {
      id: "profile",
      label: "Profile Setup",
      labelKey: "account.nav.profile",
      icon: <TbUser />,
      section: "default",
      completion: overallCompletion,
    },
    {
      id: "security",
      label: "Security & Privacy",
      labelKey: "account.nav.security",
      icon: <TbShieldCheck />,
      section: "account",
      // No completion field - informational page
    },
    {
      id: "billing",
      label: "Billing & Plans",
      labelKey: "account.nav.billing",
      icon: <TbCreditCard />,
      section: "account",
      // No completion field - informational page
    },
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
