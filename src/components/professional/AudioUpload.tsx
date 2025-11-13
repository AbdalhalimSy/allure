"use client";

import { Music } from "lucide-react";
import FileUploadZone from "@/components/ui/FileUploadZone";
import FileListItem from "@/components/ui/FileListItem";

interface AudioUploadProps {
  audios: File[];
  onChange: (audios: File[]) => void;
}

export default function AudioUpload({ audios, onChange }: AudioUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Only accept single audio
      onChange([files[0]]);
    }
  };

  const handleRemove = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Audio File <span className="text-red-500">*</span>
      </label>
      
      <FileUploadZone
        id="audio-upload"
        accept="audio/*"
        onChange={handleFileChange}
        title="Click to upload audio file"
        subtitle="MP3, WAV up to 50MB (single file)"
      />

      {audios.length > 0 && (
        <div className="space-y-2">
          <FileListItem
            icon={<Music className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
            fileName={audios[0].name}
            onRemove={handleRemove}
          />
        </div>
      )}
    </div>
  );
}
