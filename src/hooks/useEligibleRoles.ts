import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
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

      const res = await fetch(`/api/profile/${activeProfileId}/eligible-roles`);

      if (!res.ok) {
        throw new Error("Failed to fetch eligible roles");
      }

      const data = await res.json();
      return data.success ? data.data : [];
    },
    enabled: !!activeProfileId,
  });
}
