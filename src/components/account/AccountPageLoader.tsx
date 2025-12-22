"use client";

import Loader from "@/components/ui/Loader";
import { useI18n } from "@/contexts/I18nContext";

interface AccountPageLoaderProps {
  message?: string;
}

export default function AccountPageLoader({ message }: AccountPageLoaderProps) {
  const { t } = useI18n();
  
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader
        size="xl"
        variant="spinner"
        color="primary"
        text={message || t('common.loading') || 'Loading...'}
        center
      />
    </div>
  );
}
