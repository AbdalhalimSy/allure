import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const { data } = await apiClient.get('/auth/profile');
      return data;
    },
    retry: false,
  });
}
