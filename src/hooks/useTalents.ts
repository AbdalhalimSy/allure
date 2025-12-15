import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export function useTalents() {
  return useQuery({
    queryKey: ['talents'],
    queryFn: async () => {
      const { data } = await apiClient.get('/talents');
      return data;
    },
  });
}
