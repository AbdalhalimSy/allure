import apiClient from "./client";

export interface Banner {
  id: number;
  title: string | null;
  media_url: string;
  media_type: "image" | "video";
  sort_order: number;
}

export interface BannersResponse {
  success: boolean;
  data: Banner[];
}

/**
 * Fetch active banners for display on the frontend.
 * Banners are returned in sorted order (by sort_order and creation date).
 * 
 * Language is automatically handled by apiClient's Accept-Language header.
 * 
 * @returns Promise with banners data
 */
export async function getBanners(): Promise<BannersResponse> {
  const response = await apiClient.get("/banners");
  return response.data;
}
