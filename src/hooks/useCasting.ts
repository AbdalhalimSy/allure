import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export function useCasting() {
  return useQuery({
    queryKey: ['castings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/castings');
      return data;
    },
  });
}
