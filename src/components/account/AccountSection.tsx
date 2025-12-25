"use client";

import { ReactNode } from "react";

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function AccountSection({ title, description, children }: SectionProps) {
  return (
    <div className="space-y-6">
 <div className={`border-b border-gray-200 pb-4 text-start`}>
 <h2 className="text-xl font-semibold text-gray-900 ">{title}</h2>
        {description && (
 <p className="mt-1 text-sm text-gray-600 ">{description}</p>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
