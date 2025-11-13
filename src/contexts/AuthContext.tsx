"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient, { setAuthToken } from "@/lib/api/client";

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
  experiences: any[];
  created_at: string;
  updated_at: string;
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
  name?: string;
  email?: string;
  avatarUrl?: string;
  profile?: ProfileData;
};

type LogoutResult = { success: boolean; message?: string };
type AuthContextValue = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => Promise<LogoutResult>;
  hydrated: boolean;
  fetchProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUserState] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await apiClient.get("/profile/me");
      if (data.status === "success" && data.data) {
        const profileData = data.data;
        setUserState({
          name: `${profileData.first_name} ${profileData.last_name}`,
          email: localStorage.getItem("auth_email") || undefined,
          profile: profileData,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    // Hydrate from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    const email = typeof window !== "undefined" ? localStorage.getItem("auth_email") : null;
    setAuthToken(token);
    if (token) {
      setIsAuthenticated(true);
      setUserState({
        name: "Allure User",
        email: email || "user@example.com",
      });
      // Fetch profile data
      fetchProfile();
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
      // Fetch profile when user is set
      if (u && !u.profile) {
        fetchProfile();
      }
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
    } catch (e: any) {
      console.warn("Logout request failed", e);
      success = false;
      message = e?.response?.data?.message || e?.message || "Logout failed";
    } finally {
      setAuthToken(null);
      setIsAuthenticated(false);
      setUserState(null);
    }
    return { success, message };
  };

  const value = useMemo(() => ({ isAuthenticated, user, setUser, logout, hydrated, fetchProfile }), [isAuthenticated, user, hydrated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
