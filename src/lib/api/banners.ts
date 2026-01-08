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
 * @param locale - The language locale (en or ar)
 * @returns Promise with banners data
 */
export async function getBanners(locale?: string): Promise<BannersResponse> {
  const response = await apiClient.get("/banners", {
    headers: locale ? { 'Accept-Language': locale } : {},
  });
  return response.data;
}
