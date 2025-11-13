import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export function useTalents() {
  return useQuery({
    queryKey: ['talents'],
    queryFn: async () => {
      const { data } = await apiClient.get(endpoints.talents);
      return data;
    },
  });
}
