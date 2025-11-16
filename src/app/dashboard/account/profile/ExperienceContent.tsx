"use client";

import { useEffect, useState } from 'react';
import AccountSection from "@/components/account/AccountSection";
import Button from "@/components/ui/Button";
import Loader from "@/components/ui/Loader";
import { useI18n } from "@/contexts/I18nContext";
import { toast } from 'react-hot-toast';
import ExperienceEntryForm from "@/components/professional/ExperienceEntryForm";
import { ExperienceEntry } from "@/types/experience";
import { fetchSavedExperiences, syncExperiences } from "@/lib/api/experiences";

interface ExperienceContentProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ExperienceContent({ onNext, onBack }: ExperienceContentProps) {
  const { t } = useI18n();

  const [entries, setEntries] = useState<ExperienceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await fetchSavedExperiences();
        setEntries(saved);
      } catch {
        toast.error(t('account.experience.errors.load') || 'Failed to load experiences');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  const addEntry = () => {
    setEntries(prev => [
      ...prev,
      { title: '', company: '', start_year: null, end_year: null, is_current: false, description: '', attachment: undefined },
    ]);
  };

  const removeEntry = (index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, entry: ExperienceEntry) => {
    setEntries(prev => prev.map((e, i) => (i === index ? entry : e)));
  };

  const validate = (): boolean => {
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (!e.title || e.title.trim() === '') {
        toast.error(t('account.experience.errors.titleRequired') || 'Title is required');
        return false;
      }
      const start = e.start_year ?? undefined;
      const end = e.is_current ? undefined : (e.end_year ?? undefined);
      if (!e.is_current && end === undefined) {
        toast.error(t('account.experience.errors.endYearRequired') || 'End year is required unless current');
        return false;
      }
      if (start !== undefined && end !== undefined && start > end) {
        toast.error(t('account.experience.errors.yearOrder') || 'Start year must be less than or equal to end year');
        return false;
      }
    }
    return true;
  };

  const onSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await syncExperiences(entries);
      toast.success(t('account.experience.success') || 'Experiences saved successfully');
      onNext();
    } finally {
      setSaving(false);
    }
  };

  const onSaveWithErrors = async () => {
    try {
      await onSave();
    } catch (error: unknown) {
      const responseMessage =
        typeof error === "object" && error !== null && "response" in error
          ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message ?? null)
          : null;
      const msg = responseMessage || t('account.experience.errors.save') || 'Failed to save experiences';
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <Loader size="lg" text={t('common.loading') || 'Loading...'} center />
    );
  }

  return (
    <AccountSection
      title={t('account.experience.title') || 'Experience'}
      description={t('account.experience.description') || 'Add your relevant experience'}
    >
      <div className="space-y-6">
        {entries.map((entry, index) => (
          <ExperienceEntryForm
            key={index}
            entry={entry}
            onChange={(e) => updateEntry(index, e)}
            onRemove={() => removeEntry(index)}
            disabled={saving}
          />
        ))}

        <button
          type="button"
          onClick={addEntry}
          disabled={saving}
          className="w-full border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-6 text-center hover:border-[#c49a47] dark:hover:border-[#c49a47] hover:bg-[#c49a47]/10 dark:hover:bg-[#c49a47]/20 transition-all duration-200 disabled:opacity-50"
        >
          {t('account.experience.addEntry') || 'Add Experience'}
        </button>

        <div className="flex justify-between border-t border-gray-200 pt-6 dark:border-white/10">
          <Button type="button" variant="secondary" onClick={onBack}>
            {t('common.back') || 'Back'}
          </Button>
          <Button onClick={onSaveWithErrors} disabled={saving || entries.length === 0}>
            {saving ? (t('account.experience.buttons.saving') || 'Saving...') : (t('account.experience.buttons.save') || 'Save Experience')}
          </Button>
        </div>
      </div>
    </AccountSection>
  );
}
