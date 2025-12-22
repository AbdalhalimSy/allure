"use client";

import { useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import AccountSection from "@/components/account/AccountSection";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

export default function NotificationsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile?.progress_step]);

  const notificationSettings = [
    {
      category: t('account.notifications.accountActivity'),
      items: [
        { label: t('account.notifications.loginNewDevice'), email: true, push: true },
        { label: t('account.notifications.passwordChanges'), email: true, push: false },
        { label: t('account.notifications.accountSettingsUpdates'), email: true, push: false },
      ],
    },
    {
      category: t('account.notifications.projectsUpdates'),
      items: [
        { label: t('account.notifications.projectAssigned'), email: true, push: true },
        { label: t('account.notifications.projectStatusChanges'), email: true, push: true },
        { label: t('account.notifications.commentsOnWork'), email: false, push: true },
      ],
    },
    {
      category: t('account.notifications.marketing'),
      items: [
        { label: t('account.notifications.productUpdates'), email: true, push: false },
        { label: t('account.notifications.tipsAndTutorials'), email: false, push: false },
        { label: t('account.notifications.specialOffers'), email: false, push: false },
      ],
    },
  ];

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
        <AccountSection
          title={t('account.notifications.title')}
          description={t('account.notifications.description')}
        >
          <div className="space-y-8">
            {notificationSettings.map((section) => (
              <div key={section.category}>
                <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                  {section.category}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5"
                    >
                      <span className="text-sm text-gray-900 dark:text-white">{item.label}</span>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={item.email}
                            className="h-4 w-4 rounded border-gray-300 text-[#c49a47] focus:ring-[#c49a47]"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t('account.notifications.email')}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={item.push}
                            className="h-4 w-4 rounded border-gray-300 text-[#c49a47] focus:ring-[#c49a47]"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{t('account.notifications.push')}</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AccountSection>
      </AccountLayout>
    </ProtectedRoute>
  );
}