"use client";

import {
  TbX,
  TbChevronDown,
  TbCalendar,
  TbLock,
} from 'react-icons/tb';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { ExperienceEntry } from '@/types/experience';
import { Input, TextArea, FileUploader, DatePicker } from '@/components/ui';

interface ExperienceEntryFormProps {
  index: number;
  entry: ExperienceEntry;
  onChange: (entry: ExperienceEntry) => void;
  onRemove: () => void;
  onToggle: () => void;
  isOpen: boolean;
  disabled?: boolean;
}

export default function ExperienceEntryForm({
  index,
  entry,
  onChange,
  onRemove,
  onToggle,
  isOpen,
  disabled = false,
}: ExperienceEntryFormProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const isPremium = user?.is_premium ?? false;

  const translate = (
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
  };

  const update = (patch: Partial<ExperienceEntry>) => {
    const next = { ...entry, ...patch };
    // business rules: current => clear end_date
    if (patch.is_current === true) {
      next.end_date = null;
    }
    onChange(next);
  };

  // Check for missing required fields
  const missingRequirements: string[] = [];
  
  if (!entry.title || entry.title.trim() === '') {
    missingRequirements.push(
      translate('account.experience.fields.title', 'Title')
    );
  }
  
  if (!entry.is_current && !entry.end_date) {
    missingRequirements.push(
      translate('account.experience.fields.endDate', 'End Date')
    );
  }

  const hasMissingRequiredFields = !isOpen && missingRequirements.length > 0;

  const experienceLabel = entry.title
    ? entry.title
    : translate('account.experience.placeholders.title', 'e.g., Photographer');

  const dateRange = entry.end_date || entry.is_current
    ? entry.is_current ? translate('account.experience.fields.current', 'Current') : entry.end_date || '...'
    : null;

  return (
 <div className="rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5 ">
      <div
        className={`flex items-start justify-between gap-3 px-5 py-4 ${
 isOpen ? "border-b border-gray-100 " : ""
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="group flex flex-1 flex-col items-start gap-2 text-start focus:outline-none"
        >
 <div className="inline-flex items-center gap-2 rounded-full bg-[#c49a47]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#c49a47] ">
            <span>
              {translate(
                'account.experience.cardTitle',
                `Experience ${index}`,
                { index }
              )}
            </span>
            <TbChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
 <h4 className="text-lg font-semibold text-gray-900 ">
            {experienceLabel}
          </h4>
          {dateRange && (
 <div className="flex items-center gap-1.5 text-sm text-gray-600 ">
              <TbCalendar className="h-4 w-4" />
              <span>{dateRange}</span>
            </div>
          )}
          {hasMissingRequiredFields && (
 <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ">
              <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden />
              {translate(
                'account.experience.validation.incomplete',
                'Complete required fields'
              )}
              <span className="text-[10px] font-bold opacity-80">
                · {missingRequirements.length}
              </span>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
 className="inline-flex items-center gap-2 rounded-full border border-red-100 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 "
        >
          <TbX className="h-4 w-4" />
          {translate('common.remove', 'Remove')}
        </button>
      </div>

      <div
        className={`${
          isOpen ? "overflow-visible" : "overflow-hidden"
        } transition-[max-height] duration-300 ease-in-out`}
        style={{ maxHeight: isOpen ? 3000 : 0 }}
      >
        <div className="space-y-5 px-5 py-5">
          {/* Title */}
          <div>
 <label className="block text-sm font-medium text-gray-800 mb-2">
              {translate('account.experience.fields.title', 'Title')}{' '}
              <span className="text-red-500">*</span>
            </label>
            <Input
              value={entry.title}
              onChange={(e) => update({ title: e.target.value })}
              disabled={disabled}
              placeholder={translate('account.experience.placeholders.title', 'e.g., Photographer')}
            />
          </div>

          {/* Date Fields */}
          <div>
            <div className="mb-1 flex items-center justify-between">
 <label className="block text-sm font-medium text-gray-800 ">
                  {translate('account.experience.fields.endDate', 'End Date')}
                  {!entry.is_current && <span className="text-red-500"> *</span>}
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!entry.is_current}
                    onChange={(e) => update({ is_current: e.target.checked })}
                    disabled={disabled}
                    className="rounded border-gray-300 text-[#c49a47] focus:ring-[#c49a47]"
                  />
 <span className="text-gray-700 ">
                    {translate('account.experience.fields.current', 'Current')}
                  </span>
                </label>
              </div>
              <div className={entry.is_current ? 'opacity-50 pointer-events-none' : ''}>
                <DatePicker
                  value={entry.is_current ? '' : (entry.end_date || '')}
                  onChange={(date) => update({ end_date: date })}
                  placeholder={translate('ui.selectDate', 'Select date')}
                  maxDate={new Date().toISOString().split('T')[0]}
                />
              </div>
          </div>

          {/* Description */}
          <div>
 <label className="block text-sm font-medium text-gray-800 mb-2">
              {translate('account.experience.fields.description', 'Description')}
            </label>
            <TextArea
              rows={4}
              value={entry.description || ''}
              onChange={(e) => update({ description: e.target.value })}
              disabled={disabled}
              placeholder={translate('account.experience.placeholders.description', 'Brief description of your role')}
            />
          </div>

          {/* Attachment */}
          <div>
 <label className="block text-sm font-medium text-gray-800 mb-2">
              {translate('account.experience.fields.attachment', 'Attachment (optional)')}
            </label>
            {isPremium ? (
              <FileUploader
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                multiple={false}
                maxSize={10 * 1024 * 1024}
                value={entry.attachment ? [entry.attachment] : []}
                onChange={(files) => update({ attachment: files[0] })}
              />
            ) : (
              <div className="rounded-lg border-2 border-dashed border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <TbLock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-amber-900 mb-1">
                      {translate('account.experience.premiumFeature', 'Premium Feature')}
                    </h4>
                    <p className="text-sm text-amber-700">
                      {translate(
                        'account.experience.premiumAttachmentMessage',
                        'Upgrade to premium to attach documents and media to your experiences.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
