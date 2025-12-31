import SurfaceCard from "@/components/ui/SurfaceCard";
import { AlertCircle } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

interface JobsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function JobsErrorState({ error, onRetry }: JobsErrorStateProps) {
  const { t } = useI18n();

  return (
    <div className="flex min-h-[500px] items-center justify-center">
      <SurfaceCard className="max-w-md p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          {t("jobs.jobs.failedToLoad")}
        </h3>
        <p className="mb-6 text-gray-600">{error}</p>
        <button
          onClick={onRetry}
          className="rounded-full bg-linear-to-r from-[#c49a47] to-[#d4af69] px-6 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        >
          {t("jobs.jobs.tryAgain")}
        </button>
      </SurfaceCard>
    </div>
  );
}
