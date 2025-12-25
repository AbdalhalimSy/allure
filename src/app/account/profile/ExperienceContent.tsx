"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { TbPlus } from 'react-icons/tb';
import AccountSection from "@/components/account/AccountSection";
import AccountPageLoader from "@/components/account/AccountPageLoader";
import Button from "@/components/ui/Button";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from 'react-hot-toast';
import { useAuth } from "@/contexts/AuthContext";
import ExperienceEntryForm from "@/components/professional/ExperienceEntryForm";
import { ExperienceEntry } from "@/types/experience";
import { fetchSavedExperiences, syncExperiences } from "@/lib/api/experiences";

interface ExperienceContentProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ExperienceContent({ onNext, onBack }: ExperienceContentProps) {
  const { t } = useI18n();
  const { fetchProfile } = useAuth();

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

  const [entries, setEntries] = useState<ExperienceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openStates, setOpenStates] = useState<boolean[]>([]);

  const entryCountLabel = useMemo(() => {
    if (entries.length === 0)
      return translate("account.experience.empty", "No experiences added yet");
    if (entries.length === 1)
      return translate("account.experience.count.one", "1 experience added");
    return translate(
      "account.experience.count.other",
      `${entries.length} experiences added`,
      { count: entries.length }
    );
  }, [entries.length, translate]);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await fetchSavedExperiences();
        if (saved.length > 0) {
          setEntries(saved);
          setOpenStates(new Array(saved.length).fill(true));
        }
      } catch {
        toast.error(translate('account.experience.errors.load', 'Failed to load experiences'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [translate]);

  const addEntry = () => {
    const newEntry: ExperienceEntry = {
      title: '',
      start_date: null,
      end_date: null,
      is_current: false,
      description: '',
      attachment: undefined
    };
    setEntries([...entries, newEntry]);
    setOpenStates([...openStates, true]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
    setOpenStates(openStates.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, entry: ExperienceEntry) => {
    const newEntries = [...entries];
    newEntries[index] = entry;
    setEntries(newEntries);
  };

  const handleToggleOpen = (index: number) => {
    setOpenStates((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const validate = (): boolean => {
    const currentYear = new Date().getFullYear();
    const maxDate = new Date();
    
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (!e.title || e.title.trim() === '') {
        toast.error(translate('account.experience.errors.titleRequired', 'Title is required'));
        return false;
      }
      
      // Backend requirement: non-current experiences must have an end date
      if (!e.is_current && !e.end_date) {
        toast.error(translate('account.experience.errors.endDateRequired', 'End date is required for past experiences'));
        return false;
      }
      
      // Validate year limits (must not be greater than current year/2025)
      if (e.start_date) {
        const startYear = new Date(e.start_date).getFullYear();
        const startDate = new Date(e.start_date);
        if (startYear > currentYear || startDate > maxDate) {
          toast.error(translate('account.experience.errors.futureDate', 'Date cannot be in the future'));
          return false;
        }
      }
      
      if (e.end_date) {
        const endYear = new Date(e.end_date).getFullYear();
        const endDate = new Date(e.end_date);
        if (endYear > currentYear || endDate > maxDate) {
          toast.error(translate('account.experience.errors.yearLimit', `Year must not be greater than ${currentYear}`));
          return false;
        }
      }
      
      // Validate date order: start must be before or equal to end
      const start = e.start_date;
      const end = e.end_date;
      if (start && end && new Date(start) > new Date(end)) {
        toast.error(translate('account.experience.errors.dateOrder', 'Start date must be before or equal to end date'));
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setSaving(true);
    try {
      await syncExperiences(entries);
      toast.success(translate('account.experience.success', 'Experiences saved successfully!'));
      
      // Reload experiences from API to show what was actually saved
      const reloadedExperiences = await fetchSavedExperiences();
      setEntries(reloadedExperiences);
      setOpenStates(new Array(reloadedExperiences.length).fill(true));
      
      await fetchProfile();
      onNext();
    } catch (error: unknown) {
      console.error('Failed to save experiences:', error);
      const errorMessage =
        typeof error === 'object' && error !== null && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
            translate('account.experience.errors.save', 'Failed to save experiences')
          : translate('account.experience.errors.save', 'Failed to save experiences');
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AccountPageLoader message={translate('account.experience.loading', 'Loading experiences...')} />
    );
  }

  return (
    <AccountSection
      title={translate('account.experience.title', 'Work Experience')}
      description={translate('account.experience.description', 'Add your professional experience entries')}
    >
      <div className="space-y-6">
        {/* Entry Count Label */}
        <div className="flex items-center justify-between">
 <p className="text-sm font-medium text-gray-600 ">
            {entryCountLabel}
          </p>
        </div>

        {/* Experience Entries (Accordion Cards) */}
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <ExperienceEntryForm
              key={index}
              index={index + 1}
              entry={entry}
              onChange={(updated) => updateEntry(index, updated)}
              onRemove={() => removeEntry(index)}
              onToggle={() => handleToggleOpen(index)}
              isOpen={openStates[index] ?? false}
              disabled={saving}
            />
          ))}
        </div>

        {/* Add Entry Button */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={addEntry}
            disabled={saving}
 className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:border-[#c49a47] hover:text-[#c49a47] disabled:opacity-50 "
          >
            <TbPlus className="h-4 w-4" />
            {translate('account.experience.addEntry', 'Add Experience')}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button onClick={onBack} variant="secondary" disabled={saving}>
            {translate('common.back', 'Back')}
          </Button>
          <Button onClick={handleSave} variant="primary" disabled={saving}>
            {saving
              ? translate('account.experience.buttons.saving', 'Saving...')
              : translate('common.saveAndContinue', 'Save & Continue')}
          </Button>
        </div>
      </div>
    </AccountSection>
  );
}
