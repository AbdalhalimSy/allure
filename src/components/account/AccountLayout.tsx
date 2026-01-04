"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TbCircleCheck, TbClock, TbAlertCircle } from "react-icons/tb";
import { useI18n } from "@/contexts/I18nContext";
import AccountSidebar from "./AccountSidebar";

type NavItem = {
  id: string;
  label: string | ReactNode;
  labelKey?: string;
  icon: ReactNode;
  completion?: number; // 0-100 for percentage, undefined means no indicator
  section?: string;
};

type AccountLayoutProps = {
  children: ReactNode;
  navItems: NavItem[];
};

export default function AccountLayout({
  children,
  navItems,
}: AccountLayoutProps) {
  const { user } = useAuth();
  const { t } = useI18n();

  const approvalStatus = user?.profile?.approval_status as
    | "approved"
    | "pending"
    | "rejected"
    | undefined;
  const statusTitleKey = approvalStatus
    ? `account.status.${approvalStatus}Title`
    : "";
  const translatedStatusTitle =
    statusTitleKey && t(statusTitleKey) !== statusTitleKey
      ? t(statusTitleKey)
      : approvalStatus;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 text-start">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 items-start">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            {t("account.title")}
          </h1>
          {approvalStatus && translatedStatusTitle && (
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs self font-medium ${
                approvalStatus === "approved"
                  ? "border-green-300 bg-green-50 text-green-700"
                  : approvalStatus === "pending"
                  ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                  : "border-red-300 bg-red-50 text-red-700"
              }`}
              aria-label={`Approval status: ${approvalStatus}`}
            >
              {approvalStatus === "approved" && <TbCircleCheck size={14} />}
              {approvalStatus === "pending" && <TbClock size={14} />}
              {approvalStatus === "rejected" && <TbAlertCircle size={14} />}
              <span className="capitalize">{translatedStatusTitle}</span>
            </div>
          )}
        </div>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          {t("account.subtitle")}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 lg:flex-row">
        {/* Sidebar Navigation */}
        <AccountSidebar
          navItems={navItems}
          currentApprovalStatus={approvalStatus}
        />

        {/* Main Content */}
        <main className="flex-1 rounded-lg sm:rounded-xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
