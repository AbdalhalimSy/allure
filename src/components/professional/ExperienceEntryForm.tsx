"use client";

import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import FileUploader from '@/components/ui/FileUploader';
import { useI18n } from '@/contexts/I18nContext';
import { ExperienceEntry } from '@/types/experience';

interface ExperienceEntryFormProps {
  entry: ExperienceEntry;
  onChange: (entry: ExperienceEntry) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function ExperienceEntryForm({ entry, onChange, onRemove, disabled = false }: ExperienceEntryFormProps) {
  const { t } = useI18n();

  const update = (patch: Partial<ExperienceEntry>) => {
    const next = { ...entry, ...patch };
    // business rules: current => clear end_year
    if (patch.is_current === true) {
      next.end_year = null;
    }
    onChange(next);
  };

  const handleStartYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    update({ start_year: value });
  };

  const handleEndYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : null;
    update({ end_year: value });
  };

  return (
    <div className="border-2 border-gray-200 dark:border-white/10 rounded-xl p-6 bg-white dark:bg-white/5 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('account.experience.fields.title') || 'Title'} <span className="text-red-500">*</span>
          </label>
          <Input value={entry.title} onChange={(e) => update({ title: e.target.value })} disabled={disabled} placeholder={t('account.experience.placeholders.title') || 'e.g., Photographer'} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('account.experience.fields.company') || 'Company'}
          </label>
          <Input value={entry.company || ''} onChange={(e) => update({ company: e.target.value })} disabled={disabled} placeholder={t('account.experience.placeholders.company') || 'e.g., Allure Media'} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('account.experience.fields.startYear') || 'Start Year'}
          </label>
          <Input type="number" value={entry.start_year ?? ''} onChange={handleStartYearChange} disabled={disabled} placeholder={t('forms.yyyy') || "YYYY"} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('account.experience.fields.endYear') || 'End Year'}
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!entry.is_current} onChange={(e) => update({ is_current: e.target.checked })} disabled={disabled} />
              <span>{t('account.experience.fields.current') || 'Current'}</span>
            </label>
          </div>
          <Input type="number" value={entry.is_current ? '' : (entry.end_year ?? '')} onChange={handleEndYearChange} disabled={disabled || entry.is_current} placeholder={t('forms.yyyy') || "YYYY"} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('account.experience.fields.description') || 'Description'}
          </label>
          <TextArea
            rows={4}
            value={entry.description || ''}
            onChange={(e) => update({ description: e.target.value })}
            disabled={disabled}
            placeholder={t('account.experience.placeholders.description') || 'Brief description of your role'}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('account.experience.fields.attachment') || 'Attachment (optional)'}
          </label>
          <FileUploader
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
            multiple={false}
            maxSize={10 * 1024 * 1024}
            value={entry.attachment ? [entry.attachment] : []}
            onChange={(files) => update({ attachment: files[0] })}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button type="button" onClick={onRemove} disabled={disabled} className="px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg">
          {t('common.remove') || 'Remove'}
        </button>
      </div>
    </div>
  );
}
