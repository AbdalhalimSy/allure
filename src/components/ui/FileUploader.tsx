"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useState } from "react";
import { Upload, X, FileIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface FileItem {
  file: File;
  preview?: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
}

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  value?: (File | string)[];
  onChange?: (files: (File | string)[]) => void;
  description?: string;
  className?: string;
}

export default function FileUploader({
  accept = "*",
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  value = [],
  onChange,
  description = "Click to upload or drag and drop",
  className = "",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i)) + " " + sizes[i];
  };

  const validateFile = useCallback((file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File size exceeds ${formatFileSize(maxSize)}`;
    }
    
    if (accept !== "*") {
      const acceptedTypes = accept.split(",").map(t => t.trim());
      const fileType = file.type;
      const fileExtension = "." + file.name.split(".").pop();
      
      const isValid = acceptedTypes.some(type => {
        if (type.startsWith(".")) {
          return fileExtension.toLowerCase() === type.toLowerCase();
        }
        if (type.endsWith("/*")) {
          const baseType = type.split("/")[0];
          return fileType.startsWith(baseType + "/");
        }
        return fileType === type;
      });
      
      if (!isValid) {
        return `File type not accepted. Accepted: ${accept}`;
      }
    }
    
    return null;
  }, [accept, maxSize]);

  const simulateUpload = useCallback((fileItem: FileItem, index: number) => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setFileItems(prev => {
        const updated = [...prev];
        if (updated[index].progress < 100) {
          updated[index].progress += 10;
        } else {
          updated[index].status = "complete";
          clearInterval(interval);
        }
        return updated;
      });
    }, 200);
  }, []);

  const handleFiles = useCallback(
    (files: File[]) => {
      const newFileItems: FileItem[] = files.map(file => {
        const error = validateFile(file);
        const isImage = file.type.startsWith("image/");
        
        const item: FileItem = {
          file,
          progress: 0,
          status: error ? "error" : "uploading",
          error: error || undefined,
        };

        // Generate preview for images
        if (isImage && !error) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFileItems(prev =>
              prev.map(fi =>
                fi.file === file ? { ...fi, preview: e.target?.result as string } : fi
              )
            );
          };
          reader.readAsDataURL(file);
        }

        return item;
      });

      if (!multiple) {
        setFileItems(newFileItems);
        // Start upload simulation for single file
        if (newFileItems[0] && newFileItems[0].status === "uploading") {
          simulateUpload(newFileItems[0], 0);
        }
      } else {
        setFileItems(prev => [...prev, ...newFileItems]);
        // Start upload simulation for new files
        newFileItems.forEach((item, idx) => {
          if (item.status === "uploading") {
            simulateUpload(item, fileItems.length + idx);
          }
        });
      }

      // Update parent with valid files
      const validFiles = newFileItems.filter(fi => !fi.error).map(fi => fi.file);
      if (onChange && validFiles.length > 0) {
        onChange(multiple ? [...value, ...validFiles] : [validFiles[0]]);
      }
    },
    [multiple, value, onChange, fileItems.length, simulateUpload, validateFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
    e.target.value = ""; // Reset input
  };

  const removeFile = (index: number) => {
    setFileItems(prev => prev.filter((_, i) => i !== index));
    if (onChange) {
      const newValue = value.filter((_, i) => i !== index);
      onChange(newValue);
    }
  };

  const retryFile = (index: number) => {
    setFileItems(prev => {
      const updated = [...prev];
      updated[index].status = "uploading";
      updated[index].progress = 0;
      updated[index].error = undefined;
      return updated;
    });
    simulateUpload(fileItems[index], index);
  };

  // Show existing files from value
  const existingFiles = value.filter(v => typeof v === "string");

  // Check if there are any files (either new or existing)
  const hasFiles = fileItems.length > 0 || existingFiles.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone - Only show when no files exist */}
      {!hasFiles && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${
            isDragging
              ? "border-[#c49a47] bg-[#c49a47]/5 dark:bg-[#c49a47]/10"
              : "border-gray-200 dark:border-white/10 hover:border-[#c49a47] dark:hover:border-[#c49a47]"
          }`}
        >
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-3">
              <Upload className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="text-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Click to upload{" "}
                <span className="text-gray-500 dark:text-gray-400 font-normal">or drag and drop</span>
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept={accept}
              multiple={multiple}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {/* File List */}
      {fileItems.length > 0 && (
        <div className="space-y-3">
          {fileItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5"
            >
              {/* Preview or Icon */}
              <div className="flex-shrink-0">
                {item.preview ? (
                  <img
                    src={item.preview}
                    alt={item.file.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                    <FileIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(item.file.size)}
                </p>

                {/* Progress Bar */}
                {item.status === "uploading" && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
                      <span className="text-gray-600 dark:text-gray-400">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5">
                      <div
                        className="bg-[#c49a47] h-1.5 rounded-full transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {item.status === "error" && item.error && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{item.error}</p>
                )}
              </div>

              {/* Status Icons and Actions */}
              <div className="flex-shrink-0 flex items-center gap-2">
                {item.status === "uploading" && (
                  <Loader2 className="h-5 w-5 text-[#c49a47] animate-spin" />
                )}
                {item.status === "complete" && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                )}
                {item.status === "error" && (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <button
                      type="button"
                      onClick={() => retryFile(index)}
                      className="text-xs text-[#c49a47] hover:underline"
                    >
                      Try again
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing Files (from URLs) */}
      {existingFiles.length > 0 && (
        <div className="space-y-3">
          {existingFiles.map((url, index) => {
            // Extract filename from URL
            const getFilenameFromUrl = (urlStr: string) => {
              try {
                const parts = urlStr.split('/');
                const filename = parts[parts.length - 1];
                return decodeURIComponent(filename.split('?')[0]) || 'Existing file';
              } catch {
                return 'Existing file';
              }
            };

            // Check if URL is an image
            const isImageUrl = (urlStr: string) => {
              const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
              const lowerUrl = urlStr.toLowerCase();
              return imageExtensions.some(ext => lowerUrl.includes(ext)) || 
                     accept.includes('image');
            };

            const filename = getFilenameFromUrl(url);
            const showImagePreview = isImageUrl(url);

            return (
              <div
                key={`existing-${index}`}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-white/5"
              >
                {/* Preview or Icon */}
                <div className="flex-shrink-0">
                  {showImagePreview ? (
                    <img
                      src={url}
                      alt={filename}
                      className="w-10 h-10 rounded object-cover"
                      onError={(e) => {
                        // Fallback to icon if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-10 h-10 rounded bg-gray-100 dark:bg-white/5 flex items-center justify-center ${showImagePreview ? 'hidden' : ''}`}>
                    <FileIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Existing file: {filename}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Previously uploaded</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onChange) {
                      onChange(value.filter((_, i) => i !== fileItems.length + index));
                    }
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
