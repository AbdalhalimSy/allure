"use client";

import { Video as VideoIcon } from "lucide-react";
import FileUploadZone from "@/components/ui/FileUploadZone";
import FileListItem from "@/components/ui/FileListItem";

interface VideoUploadProps {
  videos: File[];
  onChange: (videos: File[]) => void;
}

export default function VideoUpload({ videos, onChange }: VideoUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Only accept single video
      onChange([files[0]]);
    }
  };

  const handleRemove = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Video <span className="text-red-500">*</span>
      </label>
      
      <FileUploadZone
        id="video-upload"
        accept="video/*"
        onChange={handleFileChange}
        title="Click to upload video"
        subtitle="MP4, MOV up to 100MB (single file)"
      />

      {videos.length > 0 && (
        <div className="space-y-2">
          <FileListItem
            icon={<VideoIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
            fileName={videos[0].name}
            onRemove={handleRemove}
          />
        </div>
      )}
    </div>
  );
}
