"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TbCircleCheck, TbClock, TbAlertCircle } from "react-icons/tb";
import { useI18n } from "@/contexts/I18nContext";

type NavItem = {
  id: string;
  label: string | ReactNode;
  labelKey?: string;
  icon: ReactNode;
  completion?: number; // 0-100 for percentage, undefined means no indicator
};

type AccountLayoutProps = {
  children: ReactNode;
  navItems: NavItem[];
};

export default function AccountLayout({
  children,
  navItems,
}: AccountLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useI18n();

  const isActive = (id: string) => {
    return (
      pathname === `/account/${id}` ||
      (pathname === "/account" && id === "basic")
    );
  };

  const approvalStatus = user?.profile?.approval_status;
  const statusTitleKey = approvalStatus
    ? `account.status.${approvalStatus}Title`
    : "";
  const translatedStatusTitle =
    statusTitleKey && t(statusTitleKey) !== statusTitleKey
      ? t(statusTitleKey)
      : approvalStatus;
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className={`mb-8 text-start`}>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("account.title")}
          </h1>
          {approvalStatus && translatedStatusTitle && (
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                approvalStatus === "approved"
                  ? "border-green-300 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300"
                  : approvalStatus === "pending"
                  ? "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-900/40 dark:bg-yellow-900/20 dark:text-yellow-300"
                  : "border-red-300 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
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
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("account.subtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Side Navigation */}
        <aside className={`w-full lg:w-64 shrink-0`}>
          <nav className="space-y-1 rounded-xl border border-gray-200 bg-white p-2 dark:border-white/10 dark:bg-black">
            {navItems.map((item) => {
              const active = isActive(item.id);
              const label =
                typeof item.label === "string" && item.labelKey
                  ? t(item.labelKey)
                  : item.label;
              return (
                <Link
                  key={item.id}
                  href={`/account/${item.id}`}
                  className={`group flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#c49a47] text-white"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center text-lg">
                      {item.icon}
                    </span>
                    <span>{label}</span>
                  </div>
                  {item.completion !== undefined && (
                    <div className="flex items-center">
                      {item.completion === 100 ? (
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            active
                              ? "bg-white/20"
                              : "bg-[#c49a47]/10 dark:bg-[#c49a47]/20"
                          }`}
                        >
                          <TbCircleCheck
                            size={16}
                            className={active ? "text-white" : "text-[#c49a47]"}
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex h-6 min-w-10 items-center justify-center rounded-full px-2 text-xs font-semibold ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-[#c49a47]/10 text-[#c49a47] dark:bg-[#c49a47]/20"
                          }`}
                        >
                          {item.completion}%
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-black lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
