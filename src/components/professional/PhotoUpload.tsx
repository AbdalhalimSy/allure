"use client";

import { useState } from "react";
import { X } from "lucide-react";
import FileUploadZone from "@/components/ui/FileUploadZone";

interface PhotoUploadProps {
  photos: File[];
  onChange: (photos: File[]) => void;
}

export default function PhotoUpload({ photos, onChange }: PhotoUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPhotos = [...photos, ...files];
      onChange(newPhotos);

      // Generate previews
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemove = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onChange(newPhotos);
    setPreviews(newPreviews);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Photos <span className="text-red-500">*</span>
      </label>
      
      <FileUploadZone
        id="photo-upload"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        title="Click to upload photos"
        subtitle="PNG, JPG up to 10MB"
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Photo ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-white/10"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
