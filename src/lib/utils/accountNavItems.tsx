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
  const basicCompletion = calculateBasicCompletion(profile);
  const appearanceCompletion = calculateAppearanceCompletion(profile);
  const professionCompletion = calculateProfessionCompletion(profile);
  const experienceCompletion = calculateExperienceCompletion(profile);

  return [
    {
      id: "basic",
      label: "Basic Information",
      icon: <TbUser />,
      completion: basicCompletion,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <TbSparkles />,
      completion: appearanceCompletion,
    },
    {
      id: "profession",
      label: "Profession",
      icon: <TbBriefcase />,
      completion: professionCompletion,
    },
    {
      id: "experience",
      label: "Experience",
      icon: <TbStar />,
      completion: experienceCompletion,
    },
    { id: "portfolio", label: "Portfolio", icon: <TbPhoto /> },
    { id: "security", label: "Security & Privacy", icon: <TbShieldCheck /> },
    { id: "notifications", label: "Notifications", icon: <TbBell /> },
    { id: "billing", label: "Billing & Plans", icon: <TbCreditCard /> },
  ];
};
