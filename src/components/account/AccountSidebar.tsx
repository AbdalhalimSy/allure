"use client";

import { ReactNode, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbCircleCheck, TbMenu2, TbX } from "react-icons/tb";
import { useI18n } from "@/contexts/I18nContext";

type NavItem = {
  id: string;
  label: string | ReactNode;
  labelKey?: string;
  icon: ReactNode;
  completion?: number;
  section?: string;
};

type AccountSidebarProps = {
  navItems: NavItem[];
  currentApprovalStatus?: "approved" | "pending" | "rejected";
};

type GroupedNavItems = {
  [key: string]: NavItem[];
};

/**
 * AccountSidebar - Modern, accessible navigation sidebar for account settings
 * Features:
 * - Section-based grouping for better organization
 * - Visual completion indicators with smooth animations
 * - Responsive mobile drawer
 * - Accessibility improvements (ARIA labels, keyboard navigation)
 * - Smooth transitions and hover states
 * - Better visual hierarchy
 */
export default function AccountSidebar({
  navItems,
  currentApprovalStatus,
}: AccountSidebarProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Group nav items by section if defined
  const groupedItems = useMemo(() => {
    return navItems.reduce((groups: GroupedNavItems, item) => {
      const section = item.section || "default";
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(item);
      return groups;
    }, {} as GroupedNavItems);
  }, [navItems]);

  const isActive = (id: string) => {
    return (
      pathname === `/account/${id}` ||
      (pathname === "/account" && id === "basic")
    );
  };

  const getCompletionColor = (completion?: number) => {
    if (completion === undefined) return "text-gray-400";
    if (completion === 100) return "text-green-500";
    if (completion >= 75) return "text-blue-500";
    if (completion >= 50) return "text-amber-500";
    return "text-orange-500";
  };

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const active = isActive(item.id);
    const label =
      typeof item.label === "string" && item.labelKey
        ? t(item.labelKey)
        : item.label;

    return (
      <Link
        href={`/account/${item.id}`}
        onClick={() => setMobileDrawerOpen(false)}
        className={`
          group flex items-center justify-between gap-3 
          px-4 py-3 rounded-xl 
          font-medium text-sm
          transition-all duration-200 ease-out
          relative overflow-hidden
          ${
            active
              ? "bg-linear-to-r from-[#c49a47] to-[#d4af57] text-white shadow-md"
              : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
          }
        `}
        role="menuitem"
        aria-current={active ? "page" : undefined}
      >
        {/* Animated background for active state */}
        {active && (
          <div className="absolute inset-0 bg-white/10 animate-pulse rounded-xl" />
        )}

        {/* Icon and Label */}
        <div className="flex items-center gap-3 min-w-0 relative z-10">
          <span
            className={`
              flex h-6 w-6 items-center justify-center shrink-0
              transition-transform duration-200 ease-out
              ${active ? "scale-110" : "group-hover:scale-105"}
            `}
            aria-hidden="true"
          >
            {item.icon}
          </span>
          <span className="truncate font-medium">{label}</span>
        </div>

        {/* Completion Indicator */}
        {item.completion !== undefined && (
          <div className="flex items-center shrink-0 relative z-10">
            {item.completion === 100 ? (
              <div
                className={`
                  flex h-6 w-6 items-center justify-center rounded-full
                  transition-all duration-200
                  ${
                    active
                      ? "bg-white/30 text-white"
                      : "bg-green-50 text-green-600"
                  }
                `}
                aria-label={`${label} - Complete`}
              >
                <TbCircleCheck size={18} className="stroke-current" />
              </div>
            ) : (
              <div
                className={`
                  flex h-6 w-6 items-center justify-center rounded-full
                  text-xs font-bold
                  transition-all duration-200
                  ${
                    active
                      ? "bg-white/30 text-white"
                      : `bg-opacity-10 ${getCompletionColor(item.completion)}`
                  }
                `}
                aria-label={`${label} - ${item.completion}% complete`}
              >
                {item.completion}%
              </div>
            )}
          </div>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <nav
      className="space-y-1"
      role="navigation"
      aria-label="Account settings navigation"
    >
      {Object.entries(groupedItems).map(([section, items], index) => (
        <div key={section}>
          {section !== "default" && (
            <div
              className={`px-4 py-3 ${
                index !== 0 ? "pt-4 border-t border-gray-100" : ""
              }`}
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t(`account.section.${section}`) || section}
              </h3>
            </div>
          )}

          <div className={`space-y-1 ${section !== "default" ? "pl-2" : ""}`}>
            {items.map((item) => (
              <NavItemComponent key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:block w-64 shrink-0"
        role="complementary"
        aria-label="Account settings sidebar"
      >
        <div className="sticky top-24 space-y-4">
          {/* Sidebar Container */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            {currentApprovalStatus && (
              <div className="border-b border-gray-100 px-4 py-3 bg-gray-50/50">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                  {t("account.profile")}
                </p>
                <div
                  className={`
                  inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
                  ${
                    currentApprovalStatus === "approved"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : currentApprovalStatus === "pending"
                      ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }
                `}
                >
                  <span
                    className={`
                    h-2 w-2 rounded-full
                    ${
                      currentApprovalStatus === "approved"
                        ? "bg-green-500"
                        : currentApprovalStatus === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }
                  `}
                  />
                  <span className="capitalize">
                    {t(`account.status.${currentApprovalStatus}Title`) ||
                      currentApprovalStatus}
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="p-2">
              <SidebarContent />
            </div>
          </div>

          {/* Quick Stats/Info Card (Optional - for future enhancement) */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 hidden xl:block">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              {t("account.progress")}
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {t("account.profileComplete")}
                </span>
                <span className="text-sm font-semibold text-[#c49a47]">
                  {Math.round(
                    navItems.reduce(
                      (sum, item) => sum + (item.completion || 0),
                      0
                    ) / navItems.length
                  )}
                  %
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#c49a47] to-[#d4af57] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      navItems.reduce(
                        (sum, item) => sum + (item.completion || 0),
                        0
                      ) / navItems.length
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Button */}
      <div className="lg:hidden mb-4 flex items-center gap-2">
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
          aria-label={mobileDrawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileDrawerOpen}
        >
          {mobileDrawerOpen ? (
            <>
              <TbX size={20} />
              Close
            </>
          ) : (
            <>
              <TbMenu2 size={20} />
              Menu
            </>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden mb-4 rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="p-2 max-h-96 overflow-y-auto">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
