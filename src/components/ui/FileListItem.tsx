"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface FileListItemProps {
  icon: ReactNode;
  fileName: string;
  onRemove: () => void;
}

export default function FileListItem({ icon, fileName, onRemove }: FileListItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-sm text-gray-700 dark:text-gray-300">{fileName}</span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
