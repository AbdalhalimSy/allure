import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/api/client";
import type { Job } from "@/types/job";

export interface EligibleRole {
  id: number;
  title: string;
  eligibility_score: number;
}

export type EligibleJob = Job & {
  roles: EligibleRole[];
};

export function useEligibleRoles() {
  const { activeProfileId } = useAuth();

  return useQuery<EligibleJob[]>({
    queryKey: ["eligible-roles", activeProfileId],
    queryFn: async () => {
      if (!activeProfileId) {
        return [];
      }

      const res = await apiClient.get(
        `/profile/${activeProfileId}/eligible-roles`
      );

      const data = res.data;
      return data.success ? data.data : [];
    },
    enabled: !!activeProfileId,
  });
}
