"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import AccountSection from "@/components/account/AccountSection";
import Button from "@/components/ui/Button";
import ProfessionRepeater from "@/components/professional/ProfessionRepeater";
import PerProfessionFields from "@/components/professional/PerProfessionFields";
import { useAuth } from "@/contexts/AuthContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";
import {
  Profession,
  ProfessionRequirements,
  ProfessionEntry,
} from "@/types/profession";
import apiClient from "@/lib/api/client";

export default function ProfessionPage() {
  const { user } = useAuth();
  const navItems = useMemo(
    () => getAccountNavItems(user?.profile),
    [user?.profile]
  );

  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state - changed to support multiple professions
  const [professionEntries, setProfessionEntries] = useState<ProfessionEntry[]>(
    []
  );
  // Per-entry data for profession fields (photos, videos, audios, languages)
  const [perEntryData, setPerEntryData] = useState<
    {
      photos: File[];
      videos: File[];
      audios: File[];
      languages: string[];
    }[]
  >([]);

  // Fetch professions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profession types (lookups)
        const professionsResponse = await apiClient.get("/lookups/professions");
        const professionsData = Array.isArray(professionsResponse.data)
          ? professionsResponse.data
          : professionsResponse.data?.data || [];
        setProfessions(professionsData);

        // Fetch user's saved professions
        // TODO: This endpoint uses hardcoded profile ID (1) - update to use actual user profile ID
        try {
          const savedProfessionsResponse = await apiClient.get("/profile/professions");
          const savedData = savedProfessionsResponse.data?.data || [];
          
          // Transform saved professions into form entries
          if (savedData.length > 0) {
            const entries: ProfessionEntry[] = [];
            const dataArray: any[] = [];
            
            savedData.forEach((professionGroup: any) => {
              professionGroup.sub_professions?.forEach((subProf: any) => {
                entries.push({
                  id: Date.now().toString() + Math.random(),
                  professionId: professionGroup.profession.id,
                  subProfessionId: subProf.sub_profession.id,
                });
                
                // Add media data if available
                dataArray.push({
                  photos: [], // Photos are URLs, not File objects - would need separate handling
                  videos: [],
                  audios: [],
                  languages: subProf.media?.languages || [],
                });
              });
            });
            
            setProfessionEntries(entries);
            setPerEntryData(dataArray);
          }
        } catch (error) {
          console.error("Failed to fetch saved professions:", error);
          // Don't show error toast - user might not have saved professions yet
        }
      } catch (error) {
        console.error("Failed to fetch professions:", error);
        toast.error("Failed to load professions");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate requirements based on ALL selected professions
  const requirements = useMemo((): ProfessionRequirements => {
    // If no professions selected, all requirements are false
    if (
      professionEntries.length === 0 ||
      professionEntries.every((e) => !e.professionId)
    ) {
      return {
        requiresPhoto: false,
        requiresVideo: false,
        requiresAudio: false,
        requiresLanguages: false,
      };
    }

    // Aggregate requirements from all selected professions
    // A field is required if ANY profession requires it
    let requiresPhoto = false;
    let requiresVideo = false;
    let requiresAudio = false;
    let requiresLanguages = false;

    professionEntries.forEach((entry) => {
      if (!entry.professionId) return;

      const profession = professions.find((p) => p.id === entry.professionId);
      if (!profession) return;

      const subProfession = entry.subProfessionId
        ? profession.sub_professions.find(
            (sp) => sp.id === entry.subProfessionId
          )
        : null;

      // Check each requirement from sub-profession or profession
      if (subProfession) {
        if (subProfession.requires_photo) requiresPhoto = true;
        if (subProfession.requires_video) requiresVideo = true;
        if (subProfession.requires_audio) requiresAudio = true;
        if (subProfession.requires_languages) requiresLanguages = true;
      } else {
        if (profession.requires_photo) requiresPhoto = true;
        if (profession.requires_video) requiresVideo = true;
        if (profession.requires_audio) requiresAudio = true;
        if (profession.requires_languages) requiresLanguages = true;
      }
    });

    return {
      requiresPhoto,
      requiresVideo,
      requiresAudio,
      requiresLanguages,
    };
  }, [professions, professionEntries]);

  // Handle per-entry field change
  const handlePerEntryChange = (
    field: string,
    value: any,
    entryIndex: number
  ) => {
    setPerEntryData((prev) => {
      const updated = [...prev];
      if (!updated[entryIndex]) {
        updated[entryIndex] = {
          photos: [],
          videos: [],
          audios: [],
          languages: [],
        };
      }
      updated[entryIndex] = { ...updated[entryIndex], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    // Validate that at least one profession is selected with both profession and sub-profession
    const validEntries = professionEntries.filter(
      (e) => e.professionId && e.subProfessionId
    );

    if (validEntries.length === 0) {
      toast.error(
        "Please select at least one profession with a sub-profession"
      );
      return;
    }

    // Validate per-entry required fields
    for (let i = 0; i < validEntries.length; i++) {
      const entry = validEntries[i];
      const profession = professions.find((p) => p.id === entry.professionId);
      const subProfession = entry.subProfessionId
        ? profession?.sub_professions.find(
            (sp) => sp.id === entry.subProfessionId
          )
        : undefined;
      const entryData = perEntryData[i] || {
        photos: [],
        videos: [],
        audios: [],
        languages: [],
      };

      if (
        (subProfession?.requires_photo ?? profession?.requires_photo) &&
        entryData.photos.length === 0
      ) {
        toast.error(
          `Please upload at least one photo for profession #${i + 1}`
        );
        return;
      }
      if (
        (subProfession?.requires_video ?? profession?.requires_video) &&
        entryData.videos.length === 0
      ) {
        toast.error(
          `Please upload at least one video for profession #${i + 1}`
        );
        return;
      }
      if (
        (subProfession?.requires_audio ?? profession?.requires_audio) &&
        entryData.audios.length === 0
      ) {
        toast.error(
          `Please upload at least one audio for profession #${i + 1}`
        );
        return;
      }
      if (
        (subProfession?.requires_languages ?? profession?.requires_languages) &&
        entryData.languages.length === 0
      ) {
        toast.error(
          `Please select at least one language for profession #${i + 1}`
        );
        return;
      }
    }

    setSaving(true);
    try {
      // Send each profession entry as a separate request
      const savePromises = validEntries.map(async (entry, idx) => {
        const formData = new FormData();
        const entryData = perEntryData[idx] || {
          photos: [],
          videos: [],
          audios: [],
          languages: [],
        };

        // Required fields
        formData.append("profile_id", user?.profile?.id?.toString() || "");
        formData.append("profession_id", entry.professionId?.toString() || "");
        formData.append(
          "sub_profession_id",
          entry.subProfessionId?.toString() || ""
        );

        // Photo - single file
        if (entryData.photos && entryData.photos.length > 0) {
          formData.append("photo", entryData.photos[0]);
        }

        // Video - single file
        if (entryData.videos && entryData.videos.length > 0) {
          formData.append("video", entryData.videos[0]);
        }

        // Audio/Voice - single file
        if (entryData.audios && entryData.audios.length > 0) {
          formData.append("audio", entryData.audios[0]);
        }

        // Languages - array with code and optional voice file
        if (entryData.languages && entryData.languages.length > 0) {
          entryData.languages.forEach((lang, langIdx) => {
            formData.append(`languages[${langIdx}][code]`, lang);
          });
        }

        // Call the API
        return apiClient.post("/profile/professions", formData);
      });

      await Promise.all(savePromises);
      toast.success("Professional information saved successfully");
    } catch (error: any) {
      console.error("Failed to save professional information:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save professional information";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireAuth={true}>
        <AccountLayout navItems={navItems}>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </AccountLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
        <AccountSection
          title="Professional Information"
          description="Select your professions and provide the required information"
        >
          <div className="space-y-6">
            {/* Profession Repeater */}
            <ProfessionRepeater
              professions={professions}
              value={professionEntries}
              onChange={(entries) => {
                setProfessionEntries(entries);
                // Adjust perEntryData length
                setPerEntryData((prev) => {
                  const arr = [...prev];
                  while (arr.length < entries.length)
                    arr.push({
                      photos: [],
                      videos: [],
                      audios: [],
                      languages: [],
                    });
                  return arr.slice(0, entries.length);
                });
              }}
            />

            {/* Per-Profession Required Fields */}
            {professionEntries.map((entry, idx) => {
              if (!entry.professionId || !entry.subProfessionId) return null;
              const profession = professions.find(
                (p) => p.id === entry.professionId
              );
              const subProfession = profession?.sub_professions.find(
                (sp) => sp.id === entry.subProfessionId
              );
              return (
                <PerProfessionFields
                  key={entry.id}
                  profession={profession}
                  subProfession={subProfession}
                  entryIndex={idx}
                  formData={
                    perEntryData[idx] || {
                      photos: [],
                      videos: [],
                      audios: [],
                      languages: [],
                    }
                  }
                  onChange={handlePerEntryChange}
                />
              );
            })}

            {/* Save Button - Show if any profession entry is complete */}
            {professionEntries.some(
              (e) => e.professionId && e.subProfessionId
            ) && (
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button onClick={handleSave} disabled={saving} className="px-6">
                  {saving ? "Saving..." : "Save Professional Information"}
                </Button>
              </div>
            )}
          </div>
        </AccountSection>
      </AccountLayout>
    </ProtectedRoute>
  );
}
