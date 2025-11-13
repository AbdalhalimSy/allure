"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { TbCircleCheck, TbClock, TbAlertCircle } from "react-icons/tb";

type NavItem = {
  id: string;
  label: string | ReactNode;
  icon: ReactNode;
  completion?: number; // 0-100 for percentage, undefined means no indicator
};

type AccountLayoutProps = {
  children: ReactNode;
  navItems: NavItem[];
};

export default function AccountLayout({ children, navItems }: AccountLayoutProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isActive = (id: string) => {
    return pathname === `/dashboard/account/${id}` || (pathname === "/dashboard/account" && id === "basic");
  };

  const approvalStatus = user?.profile?.approval_status;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Approval Status Banner */}
      {approvalStatus && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-xl border p-4 ${
            approvalStatus === "approved"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-300"
              : approvalStatus === "pending"
              ? "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900/30 dark:bg-yellow-950/20 dark:text-yellow-300"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-300"
          }`}
        >
          {approvalStatus === "approved" && <TbCircleCheck size={24} />}
          {approvalStatus === "pending" && <TbClock size={24} />}
          {approvalStatus === "rejected" && <TbAlertCircle size={24} />}
          <div className="flex-1">
            <div className="font-semibold capitalize">{approvalStatus}</div>
            <div className="text-sm">
              {approvalStatus === "approved"
                ? "Your account has been approved and is active."
                : approvalStatus === "pending"
                ? "Your account is pending review. We'll notify you once it's approved."
                : "Your account application was not approved. Please contact support for details."}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Side Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="space-y-1 rounded-xl border border-gray-200 bg-white p-2 dark:border-white/10 dark:bg-black">
            {navItems.map((item) => {
              const active = isActive(item.id);
              return (
                <Link
                  key={item.id}
                  href={`/dashboard/account/${item.id}`}
                  className={`group flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#c49a47] text-white"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.completion !== undefined && (
                    <div className="flex items-center">
                      {item.completion === 100 ? (
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                          active 
                            ? "bg-white/20" 
                            : "bg-[#c49a47]/10 dark:bg-[#c49a47]/20"
                        }`}>
                          <TbCircleCheck 
                            size={16} 
                            className={active ? "text-white" : "text-[#c49a47]"} 
                          />
                        </div>
                      ) : (
                        <div className={`flex h-6 min-w-[2.5rem] items-center justify-center rounded-full px-2 text-xs font-semibold ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-[#c49a47]/10 text-[#c49a47] dark:bg-[#c49a47]/20"
                        }`}>
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
