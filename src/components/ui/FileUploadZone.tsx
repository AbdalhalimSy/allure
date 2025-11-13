"use client";

import { Upload } from "lucide-react";
import { ReactNode } from "react";

interface FileUploadZoneProps {
  id: string;
  accept: string;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  title: string;
  subtitle: string;
}

export default function FileUploadZone({
  id,
  accept,
  multiple = false,
  onChange,
  icon,
  title,
  subtitle,
}: FileUploadZoneProps) {
  return (
    <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg p-6 hover:border-[#c49a47] dark:hover:border-[#c49a47] transition-colors">
      <label htmlFor={id} className="cursor-pointer flex flex-col items-center">
        {icon || <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />}
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {title}
        </span>
        <span className="text-xs text-gray-500 mt-1">
          {subtitle}
        </span>
        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={onChange}
        />
      </label>
    </div>
  );
}
