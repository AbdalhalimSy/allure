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
        <div className="space-y-8">
          <AccountSection title={t('account.security.password.title')} description={t('account.security.password.description')}>
            <div className="space-y-6">
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

          <AccountSection title={t('account.security.twoFactor.title')} description={t('account.security.twoFactor.description')}>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{t('account.security.twoFactor.method')}</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t('account.security.twoFactor.status')}</p>
              </div>
              <Button variant="secondary">{t('account.security.twoFactor.enable')}</Button>
            </div>
          </AccountSection>

          <AccountSection title={t('account.security.sessions.title')} description={t('account.security.sessions.description')}>
            {[
              { device: t('account.security.sessions.mac'), location: t('account.security.sessions.location'), active: true },
              { device: t('account.security.sessions.iphone'), location: t('account.security.sessions.location'), active: false },
            ].map((session, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-[#c49a47]/10 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-[#c49a47]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{session.device}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{session.location}</p>
                    {session.active && <span className="mt-1 inline-block text-xs font-medium text-emerald-600">{t('account.security.sessions.active')}</span>}
                  </div>
                </div>
                <Button variant="secondary" className="text-sm">{t('account.security.sessions.revoke')}</Button>
              </div>
            ))}
          </AccountSection>

          <AccountSection title={t('account.security.privacy.title')}>
            <div className="space-y-4">
              {[
                { label: t('account.security.privacy.search'), checked: true },
                { label: t('account.security.privacy.email'), checked: false },
                { label: t('account.security.privacy.status'), checked: true },
              ].map((setting, idx) => (
                <label key={idx} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{setting.label}</span>
                  <input type="checkbox" defaultChecked={setting.checked} className="h-5 w-5 rounded border-gray-300 text-[#c49a47] focus:ring-[#c49a47]" />
                </label>
              ))}
            </div>
          </AccountSection>
        </div>
      </AccountLayout>
    </ProtectedRoute>
  );
}