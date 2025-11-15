/**
 * Get full media URL by prepending the base media URL to a relative path
 * @param path - Relative path from API (can be null/undefined)
 * @returns Full URL or empty string if path is invalid
 */
export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  
  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "https://allureportal.sawatech.ae/storage";
  
  // If path already starts with http/https, return as-is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  
  // Ensure path starts with slash for proper concatenation
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  return `${baseUrl}${cleanPath}`;
}

/**
 * Get full media URLs for an array of paths
 * @param paths - Array of relative paths
 * @returns Array of full URLs
 */
export function getMediaUrls(paths: (string | null | undefined)[]): string[] {
  return paths.map(getMediaUrl).filter(Boolean);
}
