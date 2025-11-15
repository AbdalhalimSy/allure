"use client";

import { ReactNode } from "react";

type FieldProps = {
  label: ReactNode;
  children: ReactNode;
  required?: boolean;
  description?: string;
};

export default function AccountField({ label, children, required, description }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="ms-1 text-rose-500">*</span>}
      </label>
      {children}
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}
