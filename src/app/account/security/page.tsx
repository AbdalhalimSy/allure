"use client";

import { useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import AccountSection from "@/components/account/AccountSection";
import AccountField from "@/components/account/AccountField";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

export default function SecurityPage() {
  const { user } = useAuth();
  const navItems = useMemo(() => getAccountNavItems(user?.profile), [user?.profile]);

  return (
    <ProtectedRoute requireAuth={true}>
      <AccountLayout navItems={navItems}>
        <div className="space-y-8">
          <AccountSection title="Change Password" description="Update your password regularly to keep your account secure">
            <div className="space-y-6">
              <AccountField label="Current Password" required>
                <PasswordInput placeholder="Enter current password" />
              </AccountField>
              <AccountField label="New Password" required>
                <PasswordInput placeholder="Enter new password" />
              </AccountField>
              <AccountField label="Confirm New Password" required>
                <PasswordInput placeholder="Confirm new password" />
              </AccountField>
              <div className="flex justify-end">
                <Button variant="primary">Update Password</Button>
              </div>
            </div>
          </AccountSection>

          <AccountSection title="Two-Factor Authentication" description="Add an extra layer of security to your account">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Authenticator App</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Not enabled</p>
              </div>
              <Button variant="secondary">Enable</Button>
            </div>
          </AccountSection>

          <AccountSection title="Active Sessions" description="Manage devices where you're currently logged in">
            {[
              { device: "Chrome on MacOS", location: "Los Angeles, CA", active: true },
              { device: "Safari on iPhone", location: "Los Angeles, CA", active: false },
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
                    {session.active && <span className="mt-1 inline-block text-xs font-medium text-emerald-600">Active now</span>}
                  </div>
                </div>
                <Button variant="secondary" className="text-sm">Revoke</Button>
              </div>
            ))}
          </AccountSection>

          <AccountSection title="Privacy Settings">
            <div className="space-y-4">
              {[
                { label: "Show profile in search results", checked: true },
                { label: "Allow others to see my email", checked: false },
                { label: "Show my activity status", checked: true },
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