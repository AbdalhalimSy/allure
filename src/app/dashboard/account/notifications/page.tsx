"use client";

import { useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import AccountSection from "@/components/account/AccountSection";
import { useAuth } from "@/contexts/AuthContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

const notificationSettings = [
  {
    category: "Account Activity",
    items: [
      { label: "Login from new device", email: true, push: true },
      { label: "Password changes", email: true, push: false },
      { label: "Account settings updates", email: true, push: false },
    ],
  },
  {
    category: "Projects & Updates",
    items: [
      { label: "New project assigned", email: true, push: true },
      { label: "Project status changes", email: true, push: true },
      { label: "Comments on your work", email: false, push: true },
    ],
  },
  {
    category: "Marketing",
    items: [
      { label: "Product updates and news", email: true, push: false },
      { label: "Tips and tutorials", email: false, push: false },
      { label: "Special offers", email: false, push: false },
    ],
  },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
        <AccountSection
          title="Notification Preferences"
          description="Choose how you want to be notified about activity"
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
                          <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={item.push}
                            className="h-4 w-4 rounded border-gray-300 text-[#c49a47] focus:ring-[#c49a47]"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Push</span>
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
