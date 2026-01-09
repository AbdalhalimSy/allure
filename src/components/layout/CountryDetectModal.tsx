"use client";

import Button from "@/components/ui/Button";
import { useI18n } from "@/contexts/I18nContext";

type Props = {
  open: boolean;
  currentLabel: string;
  detectedLabel: string;
  onKeep: () => void;
  onSwitch: () => void;
  onClose?: () => void;
};

export default function CountryDetectModal({ open, currentLabel, detectedLabel, onKeep, onSwitch, onClose }: Props) {
  const { t } = useI18n();
  if (!open) return null;

  const body = t("countryDetection.body")
    .replace("{{current}}", currentLabel)
    .replace("{{detected}}", detectedLabel);
  const keepLabel = t("countryDetection.keepCurrent").replace("{{current}}", currentLabel);
  const switchLabel = t("countryDetection.switchToDetected").replace("{{detected}}", detectedLabel);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="mb-2 text-xs uppercase tracking-wider text-primary/80 font-semibold">
            {t("countryDetection.badge")}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {t("countryDetection.title")}
          </h3>
          <p className="text-gray-600 leading-relaxed">{body}</p>
        </div>

        <div className="px-6 pb-6 pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end bg-gray-50">
          <Button variant="secondary" onClick={() => { onKeep(); onClose?.(); }} className="w-full sm:w-auto">
            {keepLabel}
          </Button>
          <Button variant="primary" onClick={() => { onSwitch(); onClose?.(); }} className="w-full sm:w-auto">
            {switchLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
