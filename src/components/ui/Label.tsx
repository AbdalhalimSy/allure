"use client";

import { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export default function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${className}`} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
