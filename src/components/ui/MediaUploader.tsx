"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from "react";
import { TbX, TbFile, TbPhoto, TbVideo, TbMusic } from "react-icons/tb";
import { useI18n } from "@/contexts/I18nContext";

export type MediaType = "photo" | "video" | "audio";

interface MediaUploaderProps {
  type: MediaType;
  value?: File | string;
  onChange: (file: File | null) => void;
  required?: boolean;
  disabled?: boolean;
  maxSize?: number; // in bytes
}

export default function MediaUploader({
  type,
  value,
  onChange,
  required = false,
  disabled = false,
  maxSize = 50 * 1024 * 1024, // 50MB default
}: MediaUploaderProps) {
  const { t, locale } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptTypes = () => {
    switch (type) {
      case "photo":
        return "image/jpeg,image/png,image/jpg,image/webp";
      case "video":
        return "video/mp4,video/quicktime,video/x-msvideo";
      case "audio":
        return "audio/mpeg,audio/wav,audio/mp3,audio/ogg";
      default:
        return "*/*";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "photo":
        return TbPhoto;
      case "video":
        return TbVideo;
      case "audio":
        return TbMusic;
      default:
        return TbFile;
    }
  };

  const Icon = getIcon();

  const getFileTypeLabel = () => {
    switch (type) {
      case "photo":
        return t("account.profession.upload.photo") || "Photo";
      case "video":
        return t("account.profession.upload.video") || "Video";
      case "audio":
        return t("account.profession.upload.audio") || "Audio";
      default:
        return t("account.profession.upload.file") || "File";
    }
  };

  const getPreviewUrl = (file: File | string): string | null => {
    if (typeof file === "string") {
      // Existing file URL from backend
      return file.startsWith("http")
        ? file
        : `https://allureportal.sawatech.ae/storage/${file}`;
    }

    if (file instanceof File) {
      // New file upload
      if (type === "photo") {
        return URL.createObjectURL(file);
      }
      if (type === "video") {
        return URL.createObjectURL(file);
      }
      // Audio doesn't need visual preview
      return null;
    }

    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }

    // Check file type
    const acceptTypes = getAcceptTypes().split(",");
    const fileType = file.type;
    const isValidType = acceptTypes.some((accept) => {
      if (accept.endsWith("/*")) {
        return fileType.startsWith(accept.replace("/*", ""));
      }
      return fileType === accept;
    });

    if (!isValidType) {
      return `Invalid file type. Please upload a ${getFileTypeLabel().toLowerCase()} file.`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      onChange(file);
      setTimeout(() => setUploadProgress(0), 500);
    }, 600);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]); // Only accept first file
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const previewUrl = value ? getPreviewUrl(value) : null;
  const fileName =
    value instanceof File ? value.name : value ? value.split("/").pop() : null;
  const fileSize = value instanceof File ? formatFileSize(value.size) : null;

  return (
    <div className="space-y-2" aria-required={required}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {!value ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
            transition-all duration-200 ease-in-out
            ${
              isDragging
                ? "border-[#c49a47] bg-[#c49a47]/10 dark:bg-[#c49a47]/20 scale-[1.02]"
                : "border-gray-300 dark:border-white/20 hover:border-[#c49a47] dark:hover:border-[#c49a47] hover:bg-gray-50 dark:hover:bg-white/5"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {uploadProgress > 0 && uploadProgress < 100 ? (
            <div className="space-y-3">
              <div className="animate-pulse">
                <Icon className="w-12 h-12 mx-auto text-[#c49a47]" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("account.profession.upload.uploading") || "Uploading..."}
                </p>
                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#c49a47] h-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {uploadProgress}%
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`${isDragging ? "animate-bounce" : ""}`}>
                <Icon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span className="text-[#c49a47] dark:text-[#e3c37b] hover:underline">
                    {t("account.profession.upload.clickToUpload") ||
                      "Click to upload"}
                  </span>{" "}
                  {t("account.profession.upload.orDragDrop") ||
                    "or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {type === "photo" && "JPG, PNG, WEBP up to 5MB"}
                  {type === "video" && "MP4, MOV, AVI up to 50MB"}
                  {type === "audio" && "MP3, WAV, OGG up to 10MB"}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative border-2 border-gray-300 dark:border-white/20 rounded-xl overflow-hidden bg-white dark:bg-white/5">
          {/* Preview */}
          {previewUrl && type === "photo" && (
            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {previewUrl && type === "video" && (
            <div className="relative aspect-video bg-gray-900">
              <video src={previewUrl} controls className="w-full h-full" />
            </div>
          )}

          {type === "audio" && (
            <div className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#c49a47] flex items-center justify-center shrink-0">
                <TbMusic className="w-6 h-6 text-white" />
              </div>
              {value instanceof File && (
                <audio
                  src={URL.createObjectURL(value)}
                  controls
                  className="flex-1"
                />
              )}
              {typeof value === "string" && (
                <audio
                  src={getPreviewUrl(value) || ""}
                  controls
                  className="flex-1"
                />
              )}
            </div>
          )}

          {/* File Info */}
          <div className="p-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {fileName}
              </p>
              {fileSize && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {fileSize}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="ms-3 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TbX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 dark:bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}
