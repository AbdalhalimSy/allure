import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

export function useCasting() {
  return useQuery({
    queryKey: ['castings'],
    queryFn: async () => {
      const { data } = await apiClient.get(endpoints.castings);
      return data;
    },
  });
}
