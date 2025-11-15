import {
  TbUser,
  TbSparkles,
  TbBriefcase,
  TbStar,
  TbPhoto,
  TbShieldCheck,
  TbBell,
  TbCreditCard,
} from "react-icons/tb";
import { ProfileData } from "@/contexts/AuthContext";
import {
  calculateBasicCompletion,
  calculateAppearanceCompletion,
  calculateProfessionCompletion,
  calculateExperienceCompletion,
} from "./profileCompletion";

export const getAccountNavItems = (profile: ProfileData | undefined) => {
  return [
    {
      id: "profile",
      label: "Profile Setup",
      labelKey: "account.nav.profile",
      icon: <TbUser />,
    },
    { id: "portfolio", label: "Portfolio", labelKey: "account.nav.portfolio", icon: <TbPhoto /> },
    { id: "security", label: "Security & Privacy", labelKey: "account.nav.security", icon: <TbShieldCheck /> },
    { id: "notifications", label: "Notifications", labelKey: "account.nav.notifications", icon: <TbBell /> },
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
