"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import { TbPlus, TbInfoCircle } from "react-icons/tb";
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

  const translate = useCallback((
    key: string,
    fallback: string,
    options?: Record<string, string | number>
  ) => {
    let value = t(key);
    if (!value || value === key) value = fallback;
    
    // Interpolate variables like {{index}}, {{count}}, etc.
    if (options) {
      Object.keys(options).forEach((optionKey) => {
        const regex = new RegExp(`\\{\\{${optionKey}\\}\\}`, 'g');
        value = value.replace(regex, String(options[optionKey]));
      });
    }
    
    return value;
  }, [t]);

  const [professions, setProfessions] = useState<Profession[]>([]);
  const [entries, setEntries] = useState<ProfessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openStates, setOpenStates] = useState<boolean[]>([]);

  const entryCountLabel = useMemo(() => {
    if (entries.length === 0)
      return translate("account.profession.empty", "No professions added yet");
    if (entries.length === 1)
      return translate("account.profession.count.one", "1 profession added");
    return translate(
      "account.profession.count.other",
      `${entries.length} professions added`,
      { count: entries.length }
    );
  }, [entries.length, translate]);

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
            setOpenStates(new Array(savedEntries.length).fill(true));
          }
        } catch (error) {
          console.error("Failed to fetch saved professions:", error);
          // Not a critical error, user can still add new professions
        }
      } catch (error) {
        console.error("Failed to fetch professions:", error);
        toast.error(
          translate(
            "account.profession.errors.load",
            "Failed to load professions"
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [translate]);

  const handleAddEntry = () => {
    const newEntry: ProfessionEntry = {
      professionId: professions[0]?.id || 0,
      subProfessionId: null,
      languages: [],
      socials: [],
    };
    setEntries([...entries, newEntry]);
    setOpenStates([...openStates, true]);
  };

  const handleRemoveEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
    setOpenStates(openStates.filter((_, i) => i !== index));
  };

  const handleUpdateEntry = (index: number, updated: ProfessionEntry) => {
    const newEntries = [...entries];
    newEntries[index] = updated;
    setEntries(newEntries);
  };

  const handleToggleOpen = (index: number) => {
    setOpenStates((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const validateEntries = (): boolean => {
    if (entries.length === 0) {
      toast.error(
        translate(
          "account.profession.errors.selectProfession",
          "Please add at least one profession"
        )
      );
      return false;
    }

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const profession = professions.find((p) => p.id === entry.professionId);

      if (!profession) {
        toast.error(
          translate(
            "account.profession.errors.invalidProfession",
            `Invalid profession selected for entry ${i + 1}`
          )
        );
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

      // Validate required media
      if (requiresPhoto && !entry.photo) {
        toast.error(
          translate(
            "account.profession.errors.photoRequired",
            `Photo is required for ${label}`
          )
        );
        return false;
      }

      if (requiresVideo && !entry.video) {
        toast.error(
          translate(
            "account.profession.errors.videoRequired",
            `Video is required for ${label}`
          )
        );
        return false;
      }

      if (requiresAudio && !entry.audio) {
        toast.error(
          translate(
            "account.profession.errors.audioRequired",
            `Audio is required for ${label}`
          )
        );
        return false;
      }

      if (requiresLanguages && entry.languages.length === 0) {
        toast.error(
          translate(
            "account.profession.errors.languageRequired",
            `At least one language is required for ${label}`
          )
        );
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
        translate(
          "account.profession.success",
          "Professions saved successfully!"
        )
      );
      await fetchProfile();
      onNext();
    } catch (error: unknown) {
      console.error("Failed to save professions:", error);
      const errorMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message ||
            translate(
              "account.profession.errors.save",
              "Failed to save professions"
            )
          : translate(
              "account.profession.errors.save",
              "Failed to save professions"
            );
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
        text={translate("common.loading", "Loading...")}
        center
      />
    );
  }

  return (
    <AccountSection
      title={translate("account.profession.title", "Professional Information")}
      description={translate(
        "account.profession.description",
        "Add your professions and showcase your talents"
      )}
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#c49a47]/30 bg-linear-to-r from-white via-[#fefaf3] to-white dark:from-white/5 dark:via-white/0 dark:to-white/5 p-5 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#c49a47] dark:text-[#e3c37b] uppercase tracking-wide">
                {translate(
                  "account.profession.sectionLabel",
                  "Professional Profile"
                )}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {entryCountLabel}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {translate(
                  "account.profession.helper",
                  "Requirements adapt based on each profession and sub-profession."
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-700 dark:text-gray-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c49a47]/40 bg-white px-3 py-2 dark:bg-white/5">
                <TbInfoCircle className="h-4 w-4 text-[#c49a47]" />
                {translate(
                  "account.profession.mediaHint",
                  "Use JPG/PNG images and MP4 videos"
                )}
              </span>
            </div>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-white/20 dark:bg-white/5">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#c49a47]/10 text-[#c49a47] dark:bg-[#c49a47]/20">
              <TbPlus className="h-7 w-7" />
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {translate(
                "account.profession.emptyTitle",
                "Add your first profession"
              )}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {translate(
                "account.profession.emptyDesc",
                "Start with your main role, then add supporting roles or specialties."
              )}
            </p>
            <div className="mt-5 flex justify-center">
              <Button
                onClick={handleAddEntry}
                disabled={saving || professions.length === 0}
              >
                <div className="flex items-center gap-2">
                  <TbPlus className="h-4 w-4" />
                  {translate("account.profession.addEntry", "Add Profession")}
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {entries.map((entry, index) => (
              <ProfessionEntryForm
                key={index}
                index={index + 1}
                professions={professions}
                entry={entry}
                isOpen={openStates[index] ?? true}
                onChange={(updated) => handleUpdateEntry(index, updated)}
                onRemove={() => handleRemoveEntry(index)}
                onToggle={() => handleToggleOpen(index)}
                disabled={saving}
              />
            ))}

            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={handleAddEntry}
                disabled={saving || professions.length === 0}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:border-[#c49a47] hover:text-[#c49a47] dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-[#c49a47]"
              >
                <TbPlus className="h-4 w-4" />
                {translate(
                  "account.profession.addEntry",
                  "Add Another Profession"
                )}
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {translate(
              "account.profession.footerHint",
              "You can update your professional information at any time."
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              disabled={saving}
            >
              {translate("common.back", "Back")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || entries.length === 0}
            >
              {saving
                ? translate("common.saving", "Saving...")
                : translate("common.saveAndContinue", "Save & Continue")}
            </Button>
          </div>
        </div>
      </div>
    </AccountSection>
  );
}
