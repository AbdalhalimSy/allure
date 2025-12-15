"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { TbPlus } from "react-icons/tb";
import AccountSection from "@/components/account/AccountSection";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import ProfessionEntryForm from "@/components/professional/ProfessionEntryForm";
import { useAuth } from "@/contexts/AuthContext";
import { Profession, ProfessionEntry } from "@/types/profession";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { syncProfessions, fetchSavedProfessions } from "@/lib/api/professions";

interface ProfessionContentProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ProfessionContent({
  onNext,
  onBack,
}: ProfessionContentProps) {
  const { fetchProfile } = useAuth();
  const { t } = useI18n();

  const [professions, setProfessions] = useState<Profession[]>([]);
  const [entries, setEntries] = useState<ProfessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch professions and saved data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profession types
        const professionsResponse = await apiClient.get("/lookups/professions");
        const professionsData = Array.isArray(professionsResponse.data)
          ? professionsResponse.data
          : professionsResponse.data?.data || [];
        setProfessions(professionsData);

        // Fetch saved professions
        try {
          const savedEntries = await fetchSavedProfessions();
          if (savedEntries.length > 0) {
            setEntries(savedEntries);
          }
        } catch (error) {
          console.error("Failed to fetch saved professions:", error);
          // Not a critical error, user can still add new professions
        }
      } catch (error) {
        console.error("Failed to fetch professions:", error);
        toast.error(
          t("account.profession.errors.load") || "Failed to load professions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

  const handleAddEntry = () => {
    const newEntry: ProfessionEntry = {
      professionId: professions[0]?.id || 0,
      subProfessionId: null,
      languages: [],
      socials: [],
    };
    setEntries([...entries, newEntry]);
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleUpdateEntry = (index: number, updated: ProfessionEntry) => {
    const newEntries = [...entries];
    newEntries[index] = updated;
    setEntries(newEntries);
  };

  const validateEntries = (): boolean => {
    if (entries.length === 0) {
      toast.error(
        t("account.profession.errors.selectProfession") ||
          "Please add at least one profession"
      );
      return false;
    }

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const profession = professions.find((p) => p.id === entry.professionId);

      if (!profession) {
        toast.error(`Invalid profession selected for entry ${i + 1}`);
        return false;
      }

      const subProfession = entry.subProfessionId
        ? profession.sub_professions.find(
            (sp) => sp.id === entry.subProfessionId
          )
        : null;

      const label = subProfession
        ? `${profession.name} - ${subProfession.name}`
        : profession.name;

      // Combine requirements from both profession and sub-profession (additive)
      const requiresPhoto = Boolean(
        profession.requires_photo || subProfession?.requires_photo
      );
      const requiresVideo = Boolean(
        profession.requires_video || subProfession?.requires_video
      );
      const requiresAudio = Boolean(
        profession.requires_audio || subProfession?.requires_audio
      );
      const requiresLanguages = Boolean(
        profession.requires_languages || subProfession?.requires_languages
      );
      const requiresSizes = Boolean(subProfession?.requires_sizes);

      // Validate required media
      if (requiresPhoto && !entry.photo) {
        toast.error(`Photo is required for ${label}`);
        return false;
      }

      if (requiresVideo && !entry.video) {
        toast.error(`Video is required for ${label}`);
        return false;
      }

      if (requiresAudio && !entry.audio) {
        toast.error(`Audio is required for ${label}`);
        return false;
      }

      if (requiresLanguages && entry.languages.length === 0) {
        toast.error(`At least one language is required for ${label}`);
        return false;
      }

      if (requiresSizes && entry.socials.length === 0) {
        toast.error(`At least one social media link is required for ${label}`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateEntries()) {
      return;
    }

    setSaving(true);
    try {
      await syncProfessions(entries);
      toast.success(
        t("account.profession.success") || "Professions saved successfully!"
      );
      await fetchProfile();
      onNext();
    } catch (error: unknown) {
      console.error("Failed to save professions:", error);
      const errorMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message ||
            t("account.profession.errors.save") ||
            "Failed to save professions"
          : t("account.profession.errors.save") || "Failed to save professions";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Loader
        size="xl"
        variant="spinner"
        color="primary"
        text={t("common.loading") || "Loading..."}
        center
      />
    );
  }

  return (
    <AccountSection
      title={t("account.profession.title") || "Professional Information"}
      description={
        t("account.profession.description") ||
        "Add your professions and showcase your talents"
      }
    >
      <div className="space-y-6">
        {/* Profession Entries */}
        {entries.map((entry, index) => (
          <ProfessionEntryForm
            key={index}
            professions={professions}
            entry={entry}
            onChange={(updated) => handleUpdateEntry(index, updated)}
            onRemove={() => handleRemoveEntry(index)}
            disabled={saving}
          />
        ))}

        {/* Add Entry Button */}
        <button
          type="button"
          onClick={handleAddEntry}
          disabled={saving || professions.length === 0}
          className="
            w-full border-2 border-dashed border-gray-300 dark:border-white/20
            rounded-xl p-6 text-center
            hover:border-[#c49a47] dark:hover:border-[#c49a47]
            hover:bg-[#c49a47]/10 dark:hover:bg-[#c49a47]/20
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            group
          "
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#c49a47]/10 dark:bg-[#c49a47]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TbPlus className="w-6 h-6 text-[#c49a47] dark:text-[#e3c37b]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t("account.profession.addEntry") || "Add Another Profession"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t("account.profession.addEntryDesc") ||
                  "Showcase multiple talents and skills"}
              </p>
            </div>
          </div>
        </button>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 border-t border-gray-200 dark:border-white/10 pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={saving}
          >
            {t("common.back") || "Back"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || entries.length === 0}
          >
            {saving
              ? t("common.saving") || "Saving..."
              : t("common.saveAndContinue") || "Save & Continue"}
          </Button>
        </div>
      </div>
    </AccountSection>
  );
}
