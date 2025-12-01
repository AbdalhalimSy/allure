'use client';

import { TbPlus, TbX, TbBrandInstagram, TbBrandFacebook, TbBrandTwitter, TbBrandYoutube, TbBrandLinkedin, TbBrandTiktok } from 'react-icons/tb';
import { useI18n } from '@/contexts/I18nContext';
import { ProfessionSocial } from '@/types/profession';
import Input from '@/components/ui/Input';
import SingleSelect from '@/components/ui/SingleSelect';

const PLATFORM_OPTIONS = [
  { value: 'instagram', labelKey: 'account.profession.socials.platform.instagram', icon: TbBrandInstagram },
  { value: 'facebook', labelKey: 'account.profession.socials.platform.facebook', icon: TbBrandFacebook },
  { value: 'twitter', labelKey: 'account.profession.socials.platform.twitter', icon: TbBrandTwitter },
  { value: 'youtube', labelKey: 'account.profession.socials.platform.youtube', icon: TbBrandYoutube },
  { value: 'linkedin', labelKey: 'account.profession.socials.platform.linkedin', icon: TbBrandLinkedin },
  { value: 'tiktok', labelKey: 'account.profession.socials.platform.tiktok', icon: TbBrandTiktok },
  { value: 'other', labelKey: 'account.profession.socials.platform.other', icon: null },
];

interface SocialManagerProps {
  socials: ProfessionSocial[];
  onChange: (socials: ProfessionSocial[]) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function SocialManager({
  socials,
  onChange,
  disabled = false,
  required = false,
}: SocialManagerProps) {
  const { t, locale } = useI18n();
  const isRTL = locale === 'ar';

  const handleAdd = () => {
    onChange([...socials, { platform: 'instagram', url: '', followers: undefined }]);
  };

  const handleRemove = (index: number) => {
    onChange(socials.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof ProfessionSocial, value: string | number | undefined) => {
    const updated = [...socials];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const getPlatformLabel = (platform: string) => {
    const option = PLATFORM_OPTIONS.find(p => p.value === platform);
    return option ? t(option.labelKey) : platform;
  };

  return (
    <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('account.profession.socials.label') || 'Social Media Links'}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#c49a47] dark:text-[#e3c37b] hover:bg-[#c49a47]/10 dark:hover:bg-[#c49a47]/20 rounded-lg transition-colors disabled:opacity-50"
        >
          <TbPlus className="w-4 h-4" />
          {t('account.profession.socials.add') || 'Add Link'}
        </button>
      </div>

      {socials.length > 0 ? (
        <div className="space-y-4">
          {socials.map((social, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5 space-y-3"
              >
                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {/* Platform Selector */}
                  <div className="shrink-0 min-w-[180px]">
                    <SingleSelect
                      options={PLATFORM_OPTIONS.map(option => ({
                        value: option.value,
                        label: getPlatformLabel(option.value),
                      }))}
                      value={social.platform}
                      onChange={(value) => handleUpdate(index, 'platform', String(value))}
                      disabled={disabled}
                      searchable={true}
                    />
                  </div>

                  {/* URL Input */}
                  <div className="flex-1">
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={social.url}
                      onChange={(e) => handleUpdate(index, 'url', e.target.value)}
                      disabled={disabled}
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    disabled={disabled}
                    className="shrink-0 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <TbX className="w-5 h-5" />
                  </button>
                </div>

                {/* Followers Input (Optional) */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder={t('account.profession.socials.followers') || 'Followers (optional)'}
                      value={social.followers?.toString() || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleUpdate(index, 'followers', value ? parseInt(value) : undefined);
                      }}
                      disabled={disabled}
                      min={0}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {t('account.profession.socials.empty') || 'No social media links added yet'}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#c49a47] dark:text-[#e3c37b] hover:bg-[#c49a47]/10 dark:hover:bg-[#c49a47]/20 rounded-lg transition-colors disabled:opacity-50"
          >
            <TbPlus className="w-4 h-4" />
            {t('account.profession.socials.addFirst') || 'Add Your First Link'}
          </button>
        </div>
      )}
    </div>
  );
}
