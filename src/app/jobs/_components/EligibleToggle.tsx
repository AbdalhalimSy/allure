import { Briefcase, Sparkles } from "lucide-react";
import Switch from "@/components/ui/Switch";
import { useI18n } from "@/contexts/I18nContext";

interface EligibleToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function EligibleToggle({ checked, onChange, disabled }: EligibleToggleProps) {
  const { t } = useI18n();

  return (
    <div className="mb-8 flex items-center justify-center">
      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white/80 px-6 py-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {t("jobs.jobs.allJobs") || "All Jobs"}
          </span>
        </div>
        <Switch checked={checked} onChange={onChange} disabled={disabled} />
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#c49a47]" />
          <span className="text-sm font-medium text-[#c49a47]">
            {t("jobs.jobs.eligibleOnly") || "Eligible for Me"}
          </span>
        </div>
      </div>
    </div>
  );
}
