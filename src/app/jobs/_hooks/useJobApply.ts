import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { DetailedJob, DetailedRole } from "@/types/job";

export function useJobApply(job?: DetailedJob | null) {
  const { activeProfileId, isAuthenticated } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<DetailedRole | null>(null);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  const handleApply = useCallback(
    (role: DetailedRole) => {
      const alreadyApplied = role.has_applied || job?.has_applied;

      if (alreadyApplied) {
        toast.error(
          t("jobs.jobDetail.alreadyApplied") || "You already applied for this role"
        );
        return;
      }

      if (!isAuthenticated || !activeProfileId) {
        toast.error(t("jobs.jobDetail.loginToApply") || "Please log in to apply");
        router.push("/login");
        return;
      }

      if (role.can_apply !== false) {
        setSelectedRole(role);
        setIsApplicationOpen(true);
      } else {
        toast.error(
          t("jobs.jobDetail.notEligibleToApply") ||
            "You don't meet the requirements for this role"
        );
      }
    },
    [job, isAuthenticated, activeProfileId, router, t]
  );

  const closeApplicationModal = () => {
    setIsApplicationOpen(false);
    setSelectedRole(null);
  };

  return {
    selectedRole,
    isApplicationOpen,
    handleApply,
    closeApplicationModal,
  };
}
