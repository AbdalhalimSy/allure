import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const { data } = await apiClient.get(endpoints.auth.profile);
      return data;
    },
    retry: false,
  });
}
