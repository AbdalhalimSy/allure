"use client";
import Link from "next/link";

interface NavItemsProps {
  items: Array<{ href: string; label: string }>;
}

export default function NavItems({ items }: NavItemsProps) {
  return (
    <nav className="hidden items-center gap-8 md:flex">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-gray-900 transition-all duration-200 ease-in-out hover:text-[#c49a47] hover:-translate-y-0.5 "
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
