"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import AccountStepper, { StepConfig } from "@/components/account/AccountStepper";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";
import Loader from "@/components/ui/Loader";
import {
  TbUser,
  TbSparkles,
  TbBriefcase,
  TbStar,
} from "react-icons/tb";

// Import the content components
import BasicInformationContent from "./BasicInformationContent";
import AppearanceContent from "./AppearanceContent";
import ProfessionContent from "./ProfessionContentNew";
import ExperienceContent from "./ExperienceContent";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Map progress_step to step index
  const getInitialStepFromProgress = (progressStep?: string): number => {
    const stepMap: Record<string, number> = {
      "basic-information": 0,
      "appearance": 1,
      "profession": 2,
      "experience": 3,
    };
    return stepMap[progressStep || "basic-information"] || 0;
  };

  const [currentStep, setCurrentStep] = useState(() => 
    getInitialStepFromProgress(user?.profile?.progress_step)
  );

  // Update current step when user profile changes
  useEffect(() => {
    if (user?.profile?.progress_step) {
      const newStep = getInitialStepFromProgress(user.profile.progress_step);
      setCurrentStep(newStep);
      setIsLoadingProfile(false);
    } else if (user !== null) {
      setIsLoadingProfile(false);
    }
  }, [user?.profile?.progress_step]);

  // Get nav items
  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);

  // Define the 4 steps for the stepper
  const steps: StepConfig[] = useMemo(() => {
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
    ];
  }, [user?.profile]);

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInformationContent onNext={handleNext} />;
      case 1:
        return <AppearanceContent onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <ProfessionContent onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <ExperienceContent onBack={handleBack} />;
      default:
        return null;
    }
  };

  // Show loader while fetching profile data
  if (isLoadingProfile) {
    return (
      <ProtectedRoute requireAuth={true}>
        <AccountLayout navItems={navItems}>
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader
              size="xl"
              variant="spinner"
              color="primary"
              text={t('common.loading') || 'Loading...'}
              center
            />
          </div>
        </AccountLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
        <div className="space-y-8">
          <AccountStepper
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />
          <div className="min-h-[400px]">{renderStepContent()}</div>
        </div>
      </AccountLayout>
    </ProtectedRoute>
  );
}
