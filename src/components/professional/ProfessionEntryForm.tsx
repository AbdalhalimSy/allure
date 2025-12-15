'use client';

import { TbX, TbCamera, TbVideo, TbMicrophone, TbLanguage, TbShare, TbRuler } from 'react-icons/tb';
import { Profession, ProfessionEntry } from '@/types/profession';
import { useI18n } from '@/contexts/I18nContext';
import MediaUploader from '@/components/ui/MediaUploader';
import LanguageManager from './LanguageManager';
import SocialManager from './SocialManager';
import SingleSelect from '@/components/ui/SingleSelect';

interface ProfessionEntryFormProps {
  professions: Profession[];
  entry: ProfessionEntry;
  onChange: (entry: ProfessionEntry) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export default function ProfessionEntryForm({
  professions,
  entry,
  onChange,
  onRemove,
  disabled = false,
}: ProfessionEntryFormProps) {
  const { t, locale } = useI18n();

  const selectedProfession = professions.find(p => p.id === entry.professionId);
  const availableSubProfessions = selectedProfession?.sub_professions || [];
  const selectedSubProfession = entry.subProfessionId
    ? availableSubProfessions.find(sp => sp.id === entry.subProfessionId)
    : null;

  // Determine requirements - combine parent (profession) and child (sub-profession)
  // If either requires a field, it is required (additive/union behavior)
  const professionRequirements = selectedProfession;
  const subProfessionRequirements = selectedSubProfession;

  const requiresPhoto = Boolean(
    professionRequirements?.requires_photo || subProfessionRequirements?.requires_photo
  );
  const requiresVideo = Boolean(
    professionRequirements?.requires_video || subProfessionRequirements?.requires_video
  );
  const requiresAudio = Boolean(
    professionRequirements?.requires_audio || subProfessionRequirements?.requires_audio
  );
  const requiresLanguages = Boolean(
    professionRequirements?.requires_languages || subProfessionRequirements?.requires_languages
  );
  const requiresSizes = Boolean(subProfessionRequirements?.requires_sizes);
  // Socials currently defined at profession level, but safely union with sub if ever present
  const requiresSocials = Boolean(professionRequirements?.requires_socials);

  const handleProfessionChange = (professionId: number) => {
    onChange({
      ...entry,
      professionId,
      subProfessionId: null,
      photo: undefined,
      video: undefined,
      audio: undefined,
      languages: [],
      socials: entry.socials, // Preserve socials
    });
  };

  const handleSubProfessionChange = (subProfessionId: number | null) => {
    onChange({
      ...entry,
      subProfessionId,
      photo: undefined,
      video: undefined,
      audio: undefined,
      languages: [],
    });
  };

  const professionLabel = selectedSubProfession
    ? `${selectedProfession?.name} - ${selectedSubProfession.name}`
    : selectedProfession?.name || 'Unknown';

  return (
    <div className="border-2 border-gray-200 dark:border-white/10 rounded-xl p-6 bg-white dark:bg-white/5 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {professionLabel}
          </h4>
          
          {/* Required Badges */}
          {(requiresPhoto || requiresVideo || requiresAudio || requiresLanguages || requiresSizes || requiresSocials) && (
            <div className="flex gap-2 flex-wrap mt-2">
              {requiresPhoto && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 bg-[#c49a47]/10 dark:bg-[#c49a47]/20 text-[#c49a47] dark:text-[#e3c37b] rounded-full font-medium">
                  <TbCamera className="w-3.5 h-3.5" />
                  {t('account.profession.upload.photo') || 'Photo'}
                </span>
              )}
              {requiresVideo && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 bg-[#c49a47]/10 dark:bg-[#c49a47]/20 text-[#c49a47] dark:text-[#e3c37b] rounded-full font-medium">
                  <TbVideo className="w-3.5 h-3.5" />
                  {t('account.profession.upload.video') || 'Video'}
                </span>
              )}
              {requiresAudio && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 bg-[#c49a47]/10 dark:bg-[#c49a47]/20 text-[#c49a47] dark:text-[#e3c37b] rounded-full font-medium">
                  <TbMicrophone className="w-3.5 h-3.5" />
                  {t('account.profession.upload.audio') || 'Audio'}
                </span>
              )}
              {requiresLanguages && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 bg-[#c49a47]/10 dark:bg-[#c49a47]/20 text-[#c49a47] dark:text-[#e3c37b] rounded-full font-medium">
                  <TbLanguage className="w-3.5 h-3.5" />
                  {t('account.profession.languages.label') || 'Languages'}
                </span>
              )}
              {requiresSizes && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 bg-[#c49a47]/10 dark:bg-[#c49a47]/20 text-[#c49a47] dark:text-[#e3c37b] rounded-full font-medium">
                  <TbRuler className="w-3.5 h-3.5" />
                  {t('account.profession.sizes.label') || 'Sizes in Appearance'}
                </span>
              )}
              {requiresSocials && (
                <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 bg-[#c49a47]/10 dark:bg-[#c49a47]/20 text-[#c49a47] dark:text-[#e3c37b] rounded-full font-medium">
                  <TbShare className="w-3.5 h-3.5" />
                  {t('account.profession.socials.label') || 'Social Media'}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
        >
          <TbX className="w-5 h-5" />
        </button>
      </div>

      {/* Profession Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('account.profession.selector.profession') || 'Profession'} <span className="text-red-500">*</span>
          </label>
          <SingleSelect
            options={professions.map(profession => ({
              value: profession.id,
              label: profession.name,
            }))}
            value={entry.professionId || null}
            onChange={(value) => handleProfessionChange(Number(value))}
            disabled={disabled}
            placeholder="Select profession..."
            searchable={true}
          />
        </div>

        {availableSubProfessions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('account.profession.selector.subProfession') || 'Sub-Profession'}
            </label>
            <SingleSelect
              options={[
                { value: '', label: 'None (General)' },
                ...availableSubProfessions.map(subProfession => ({
                  value: subProfession.id,
                  label: subProfession.name,
                }))
              ]}
              value={entry.subProfessionId || ''}
              onChange={(value) => handleSubProfessionChange(value ? Number(value) : null)}
              disabled={disabled}
              placeholder="Select sub-profession..."
              searchable={true}
            />
          </div>
        )}
      </div>

      {/* Media Uploads */}
      {(requiresPhoto || requiresVideo || requiresAudio) && (
        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h5 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TbCamera className="w-4 h-4" />
            {t('account.profession.media.title') || 'Media Files'}
          </h5>

          <div className="grid grid-cols-1 gap-6">
            {requiresPhoto && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('account.profession.uploads.photo') || 'Photo'} <span className="text-red-500">*</span>
                </label>
                <MediaUploader
                  type="photo"
                  value={entry.photo}
                  onChange={(file) => onChange({ ...entry, photo: file || undefined })}
                  disabled={disabled}
                  required={requiresPhoto}
                  maxSize={5 * 1024 * 1024}
                />
              </div>
            )}

            {requiresVideo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('account.profession.uploads.video') || 'Video'} <span className="text-red-500">*</span>
                </label>
                <MediaUploader
                  type="video"
                  value={entry.video}
                  onChange={(file) => onChange({ ...entry, video: file || undefined })}
                  disabled={disabled}
                  required={requiresVideo}
                  maxSize={50 * 1024 * 1024}
                />
              </div>
            )}

            {requiresAudio && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('account.profession.uploads.audio') || 'Audio'} <span className="text-red-500">*</span>
                </label>
                <MediaUploader
                  type="audio"
                  value={entry.audio}
                  onChange={(file) => onChange({ ...entry, audio: file || undefined })}
                  disabled={disabled}
                  required={requiresAudio}
                  maxSize={10 * 1024 * 1024}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Languages */}
      {requiresLanguages && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <LanguageManager
            languages={entry.languages}
            onChange={(languages) => onChange({ ...entry, languages })}
            disabled={disabled}
          />
        </div>
      )}

      {/* Social Media Links - Show if required by profession */}
      {requiresSocials && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <SocialManager
            socials={entry.socials}
            onChange={(socials) => onChange({ ...entry, socials })}
            disabled={disabled}
            required={requiresSocials}
          />
        </div>
      )}
    </div>
  );
}
