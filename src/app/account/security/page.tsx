"use client";

import { useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import AccountSection from "@/components/account/AccountSection";
import AccountField from "@/components/account/AccountField";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

export default function SecurityPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
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
      </AccountLayout>
    </ProtectedRoute>
  );
}