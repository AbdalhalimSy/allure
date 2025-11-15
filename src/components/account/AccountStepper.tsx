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
};

export default function AccountStepper({
  steps,
  currentStep,
  onStepClick,
}: AccountStepperProps) {
  const { t, locale } = useI18n();
  const isRTL = locale === "ar";

  const isStepAccessible = (stepIndex: number): boolean => {
    // Allow navigating only to already completed steps and the current step
    return stepIndex <= currentStep;
  };

  const isStepCompleted = (stepIndex: number): boolean => {
    // A step is completed if it's before the current step
    return stepIndex < currentStep;
  };

  return (
    <div className="mb-8">
      <div className="relative">
        {/* Progress Line */}
        <div
          className={`absolute top-5 ${
            isRTL ? "right-0" : "left-0"
          } h-0.5 bg-gray-200 dark:bg-gray-700`}
          style={{
            width: `calc(100% - ${100 / steps.length}%)`,
            [isRTL ? "right" : "left"]: `${50 / steps.length}%`,
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
        <div
          className={`relative flex ${
            isRTL ? "flex-row-reverse" : ""
          } justify-between`}
        >
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
                role={accessible ? "button" : undefined}
                tabIndex={accessible ? 0 : -1}
                aria-current={active ? "step" : undefined}
                aria-disabled={!accessible}
                title={accessible ? t(step.labelKey) : t('account.step.locked') || 'Complete previous steps first'}
                onClick={() => accessible && onStepClick(index)}
                onKeyDown={(e) => {
                  if (!accessible) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onStepClick(index);
                  }
                }}
              >
                {/* Step Circle */}
                <div
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    completed
                      ? "border-[#c49a47] bg-[#c49a47] text-white"
                      : active
                      ? "border-[#c49a47] bg-white text-[#c49a47] dark:bg-black"
                      : accessible
                      ? "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-black dark:text-gray-500"
                      : "border-gray-200 bg-gray-100 text-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-600"
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
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-600"
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
