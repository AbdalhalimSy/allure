import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface JobDetailBackButtonProps {
  onClick: () => void;
}

export function JobDetailBackButton({ onClick }: JobDetailBackButtonProps) {
  const { t } = useI18n();

  return (
    <button
      onClick={onClick}
      className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#c49a47]"
    >
      <ArrowLeft className="h-4 w-4 rtl:scale-x-[-1]" />
      {t("jobs.jobDetail.backToJobs")}
    </button>
  );
}
