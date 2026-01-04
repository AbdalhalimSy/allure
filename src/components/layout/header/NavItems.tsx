"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  dropdown?: Array<{ href: string; label: string }>;
}

interface NavItemsProps {
  items: Array<NavItem>;
}

export default function NavItems({ items }: NavItemsProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="hidden items-center gap-8 md:flex">
      {items.map((item) => {
        const hasDropdown = item.dropdown && item.dropdown.length > 0;

        if (!hasDropdown) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:text-[#c49a47] hover:-translate-y-0.5"
            >
              {item.label}
            </Link>
          );
        }

        return (
          <div
            key={item.href}
            className="relative group"
            onMouseEnter={() => setOpenDropdown(item.href)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <Link
              href={item.href}
              className="flex items-center gap-1 text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:text-[#c49a47]"
            >
              {item.label}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openDropdown === item.href ? "rotate-180" : ""
                }`}
              />
            </Link>

            {/* Dropdown Menu */}
            <div
              className={`absolute top-full start-0 pt-2 w-48 transition-all duration-200 ease-in-out ${
                openDropdown === item.href
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                {item.dropdown?.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className="block px-4 py-3 text-sm text-gray-700 transition-all duration-200 ease-in-out hover:bg-[#c49a47]/10 hover:text-[#c49a47] hover:translate-x-1"
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
