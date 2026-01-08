"use client";

"use client";

import AccountPageWrapper from "../_lib/AccountPageWrapper";
import AccountSection from "@/components/account/AccountSection";
import AccountField from "@/components/account/AccountField";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { useI18n } from "@/contexts/I18nContext";

export default function SecurityPage() {
  const { t } = useI18n();

  return (
    <AccountPageWrapper requireCompleteProfile={false}>
      <div className="space-y-6 sm:space-y-8">
          <AccountSection title={t('account.security.password.title')} description={t('account.security.password.description')}>
            <div className="space-y-4 sm:space-y-6">
              <AccountField label={t('account.security.password.fields.current')} required>
                <PasswordInput placeholder={t('account.security.password.placeholders.current')} />
              </AccountField>
              <AccountField label={t('account.security.password.fields.new')} required>
                <PasswordInput placeholder={t('account.security.password.placeholders.new')} />
              </AccountField>
              <AccountField label={t('account.security.password.fields.confirm')} required>
                <PasswordInput placeholder={t('account.security.password.placeholders.confirm')} />
              </AccountField>
              <div className="flex justify-end">
                <Button variant="primary">{t('account.security.password.update')}</Button>
              </div>
            </div>
          </AccountSection>
        </div>
      </AccountPageWrapper>
    );
  }