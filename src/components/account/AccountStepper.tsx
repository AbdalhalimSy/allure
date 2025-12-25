"use client";

import { ReactNode } from "react";
import { TbCheck } from "react-icons/tb";
import { useI18n } from "@/contexts/I18nContext";

export type StepConfig = {
  id: string;
  label: string;
  labelKey: string;
  icon: ReactNode;
};

type AccountStepperProps = {
  steps: StepConfig[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
  progressStep?: string;
};

export default function AccountStepper({
  steps,
  currentStep,
  onStepClick,
  progressStep,
}: AccountStepperProps) {
  const { t } = useI18n();

  // Map progress_step to the maximum accessible step index
  const getMaxAccessibleStep = (): number => {
    if (!progressStep) return currentStep;

    const stepMap: Record<string, number> = {
      basic: 0,
      appearance: 1,
      profession: 2,
      experience: 3,
      portfolio: 4,
      complete: 4,
    };

    return stepMap[progressStep] ?? currentStep;
  };

  const maxAccessibleStep = getMaxAccessibleStep();

  const isStepAccessible = (stepIndex: number): boolean => {
    // Allow navigating to any completed step or current step
    // Based on the user's progress_step from the backend
    return stepIndex <= maxAccessibleStep;
  };

  const isStepCompleted = (stepIndex: number): boolean => {
    // A step is completed if it's before the max accessible step
    return stepIndex < maxAccessibleStep;
  };

  return (
    <div className="mb-8">
      <div className="relative">
        {/* Progress Line */}
        <div
 className="absolute top-5 h-0.5 bg-gray-200 "
          style={{
            width: `calc(100% - ${100 / steps.length}%)`,
            insetInlineStart: `${50 / steps.length}%`,
          }}
        >
          <div
            className="h-full bg-[#c49a47] transition-all duration-500"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex  justify-between">
          {steps.map((step, index) => {
            const accessible = isStepAccessible(index);
            const completed = isStepCompleted(index);
            const active = currentStep === index;

            return (
              <div
                key={step.id}
                className={`flex flex-1 flex-col items-center ${
                  accessible ? "cursor-pointer" : "cursor-not-allowed"
                }`}
                onClick={() => accessible && onStepClick(index)}
              >
                {/* Step Circle */}
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    completed
                      ? "border-[#c49a47] bg-[#c49a47] text-white"
                      : active
 ? "border-[#c49a47] bg-white text-[#c49a47] "
                      : accessible
 ? "border-gray-300 bg-white text-gray-400 "
 : "border-gray-200 bg-gray-100 text-gray-300 "
                  }`}
                >
                  {completed ? (
                    <TbCheck size={20} className="font-bold" />
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-medium transition-colors ${
                      active || completed
                        ? "text-[#c49a47]"
                        : accessible
 ? "text-gray-700 "
 : "text-gray-400 "
                    }`}
                  >
                    {t(step.labelKey)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
