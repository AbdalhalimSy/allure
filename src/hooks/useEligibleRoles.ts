import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { EligibleRolesResponse } from "@/types/job";

/**
 * Hook to fetch eligible roles for the active profile
 */
export function useEligibleRoles() {
  const { activeProfileId } = useAuth();
  const { locale } = useI18n();

  return useQuery({
    queryKey: ["eligible-roles", activeProfileId, locale],
    queryFn: async () => {
      if (!activeProfileId) {
        throw new Error("Profile ID is required");
      }

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : "";

      if (!token) {
        throw new Error("Authentication token is required");
      }

      const response = await fetch(
        `/api/profile/${activeProfileId}/eligible-roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": locale,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch eligible roles");
      }

      const data: EligibleRolesResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch eligible roles");
      }

      return data.data;
    },
    enabled: !!activeProfileId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });
}

/**
 * Fetch eligible roles manually (for use outside React Query)
 */
export async function fetchEligibleRoles(
  profileId: number,
  token: string,
  locale: string = "en"
): Promise<EligibleRolesResponse> {
  const response = await fetch(`/api/profile/${profileId}/eligible-roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": locale,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch eligible roles");
  }

  return response.json();
}
