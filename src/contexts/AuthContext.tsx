"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import apiClient, { setAuthToken, getActiveProfileId, setActiveProfileId } from "@/lib/api/client";
import { getMediaUrl } from "@/lib/utils/media";
import type { ExperienceResponseItem } from "@/types/experience";
import { isAxiosError } from "axios";

export type TalentProfile = {
  id: number;
  full_name: string;
  featured_image_url: string;
  is_primary: boolean;
  created_at: string;
};

export type TalentData = {
  primary_profile_id: number;
  profiles: TalentProfile[];
};

export type ProfileData = {
  id: number;
  talent_id: number;
  first_name: string;
  last_name: string;
  second_twin_name: string | null;
  gender: string | null;
  dob: string | null;
  mobile: string | null;
  whatsapp: string | null;
  progress_step: string;
  approval_status: string;
  lc_country_id?: number | null;
  country: {
    id: number;
    name: string;
    iso_alpha_2: string;
    iso_alpha_3: string;
  } | null;
  nationalities: Array<{
    id: number;
    code: string;
    name: string;
  }>;
  ethnicities: Array<{
    id: number;
    code: string;
    name: string;
  }>;
  experiences: ExperienceResponseItem[];
  created_at: string;
  updated_at: string;
  profile_picture?: string | null;
  // Appearance fields with IDs
  hair_color_id?: number | null;
  hair_color?: string | null;
  hair_color_option?: {
    id: number;
    slug: string;
    name: string;
    name_en: string;
    name_ar: string;
    is_active: boolean;
  } | null;
  hair_type_id?: number | null;
  hair_type?: string | null;
  hair_type_option?: {
    id: number;
    slug: string;
    name: string;
    name_en: string;
    name_ar: string;
    is_active: boolean;
  } | null;
  hair_length_id?: number | null;
  hair_length?: string | null;
  hair_length_option?: {
    id: number;
    slug: string;
    name: string;
    name_en: string;
    name_ar: string;
    is_active: boolean;
  } | null;
  eye_color_id?: number | null;
  eye_color?: string | null;
  eye_color_option?: {
    id: number;
    slug: string;
    name: string;
    name_en: string;
    name_ar: string;
    is_active: boolean;
  } | null;
  height?: number | string | null;
  shoe_size?: string | null;
  tshirt_size?: string | null;
  pants_size?: string | null;
  jacket_size?: string | null;
  chest?: number | null;
  bust?: number | null;
  waist?: number | null;
  // Social media fields
  instagram_url?: string | null;
  instagram_followers?: number | null;
  tiktok_url?: string | null;
  tiktok_followers?: number | null;
  youtube_url?: string | null;
  youtube_followers?: number | null;
  facebook_url?: string | null;
  facebook_followers?: number | null;
};

type User = {
  id?: number;
  name?: string;
  email?: string;
  avatarUrl?: string;
  profile?: ProfileData;
  talent?: TalentData;
};

type LogoutResult = { success: boolean; message?: string };
type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => Promise<LogoutResult>;
  hydrated: boolean;
  fetchProfile: () => Promise<void>;
  switchProfile: (profileId: number) => Promise<void>;
  activeProfileId: number | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserState] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [activeProfileId, setActiveProfileIdState] = useState<number | null>(null);

  const fetchProfile = async () => {
    try {
      // Get the active profile ID from localStorage
      const currentActiveId = getActiveProfileId();
      
      // Include profile_id as query parameter if available
      const url = currentActiveId 
        ? `/profile/me?profile_id=${currentActiveId}`
        : "/profile/me";
      
      const { data } = await apiClient.get(url);
      if (data.status === "success" && data.data) {
        const { profile, talent } = data.data;
        
        // Set active profile ID if not already set
        if (!currentActiveId && talent?.primary_profile_id) {
          setActiveProfileId(talent.primary_profile_id);
          setActiveProfileIdState(talent.primary_profile_id);
        } else if (currentActiveId) {
          setActiveProfileIdState(parseInt(currentActiveId));
        }
        
        setUserState((prev) => ({
          ...prev,
          id: profile.id,
          name: `${profile.first_name} ${profile.last_name}`,
          email: localStorage.getItem("auth_email") || undefined,
          avatarUrl: profile.profile_picture ? getMediaUrl(profile.profile_picture) : undefined,
          profile,
          talent,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const switchProfile = async (profileId: number) => {
    try {
      setActiveProfileId(profileId);
      setActiveProfileIdState(profileId);
      
      // Re-fetch profile data with new profile_id
      await fetchProfile();
    } catch (error) {
      console.error("Failed to switch profile:", error);
      throw error;
    }
  };

  useEffect(() => {
    // Hydrate from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const email = typeof window !== "undefined" ? localStorage.getItem("auth_email") : null;
    const storedProfileId = getActiveProfileId();
    
    setAuthToken(token);
    
    if (token) {
      setIsAuthenticated(true);
      setUserState({
        name: "Allure User",
        email: email || "user@example.com",
      });
      
      // Set active profile ID from localStorage if exists
      if (storedProfileId) {
        setActiveProfileIdState(parseInt(storedProfileId));
        // Fetch profile data only if we have a profile_id
        fetchProfile();
      }
      // If no profile_id, it will be set on login and then fetchProfile will be called
    } else {
      setIsAuthenticated(false);
      setUserState(null);
    }
    setHydrated(true);
  }, []);

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  const logout = async (): Promise<LogoutResult> => {
    let success = false;
    let message: string | undefined = undefined;
    try {
      const res = await apiClient.post("/auth/logout");
      success = res.status < 400;
      message = (res.data && (res.data.message || res.data.status)) || (success ? "Logged out" : "Logout failed");
    } catch (error: unknown) {
      console.warn("Logout request failed", error);
      success = false;
      if (isAxiosError(error)) {
        message = error.response?.data?.message || error.message || "Logout failed";
      } else {
        message = error instanceof Error ? error.message : "Logout failed";
      }
    } finally {
      setAuthToken(null);
      setIsAuthenticated(false);
      setUserState(null);
    }
    return { success, message };
  };

  const value: AuthContextValue = {
    isAuthenticated,
    user,
    setUser,
    logout,
    hydrated,
    fetchProfile,
    switchProfile,
    activeProfileId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
