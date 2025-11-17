"use client";

import { useState } from "react";
import { X, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface Condition {
  id: number;
  label: string;
  input_type: "yes_no" | "textarea" | "checkbox" | "radio" | "text";
  options: Array<{ value: string; label: string }>;
  is_required: boolean;
}

interface Role {
  id: number;
  name: string;
  description: string;
  conditions: Condition[];
}

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number;
  role: Role;
  profileId?: number;
}

interface ResponseData {
  condition_id: number;
  value: string | string[];
  media?: File;
}

export default function JobApplicationModal({
  isOpen,
  onClose,
  jobId,
  role,
  profileId,
}: JobApplicationModalProps) {
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [mediaFiles, setMediaFiles] = useState<Record<number, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (conditionId: number, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [conditionId]: value,
    }));
  };

  const handleCheckboxChange = (conditionId: number, optionValue: string, checked: boolean) => {
    setResponses((prev) => {
      const current = prev[conditionId] || [];
      if (checked) {
        return { ...prev, [conditionId]: [...current, optionValue] };
      } else {
        return { ...prev, [conditionId]: current.filter((v: string) => v !== optionValue) };
      }
    });
  };

  const handleFileChange = (conditionId: number, file: File | null) => {
    if (file) {
      setMediaFiles((prev) => ({ ...prev, [conditionId]: file }));
    } else {
      setMediaFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[conditionId];
        return newFiles;
      });
    }
  };

  const validateForm = () => {
    for (const condition of role.conditions) {
      if (condition.is_required) {
        const response = responses[condition.id];
        if (!response || (Array.isArray(response) && response.length === 0)) {
          toast.error(`Please answer: ${condition.label}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileId) {
      toast.error("Please login to apply for this role");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("profile_id", profileId.toString());

      // Build responses array
      const responsesArray = role.conditions.map((condition) => {
        const response: ResponseData = {
          condition_id: condition.id,
          value: responses[condition.id] || "",
        };

        // Add media if exists
        if (mediaFiles[condition.id]) {
          response.media = mediaFiles[condition.id];
        }

        return response;
      });

      formData.append("responses", JSON.stringify(responsesArray));

      // Append media files separately
      Object.entries(mediaFiles).forEach(([conditionId, file]) => {
        formData.append(`media_${conditionId}`, file);
      });

      const response = await fetch(`/api/jobs/${jobId}/roles/${role.id}/apply`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        toast.success(result.message || "Application submitted successfully!");
        onClose();
        setResponses({});
        setMediaFiles({});
      } else {
        toast.error(result.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("An error occurred while submitting your application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConditionInput = (condition: Condition) => {
    switch (condition.input_type) {
      case "yes_no":
        return (
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`condition_${condition.id}`}
                value="yes"
                checked={responses[condition.id] === "yes"}
                onChange={(e) => handleInputChange(condition.id, e.target.value)}
                className="h-4 w-4 text-[#c49a47] focus:ring-[#c49a47]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`condition_${condition.id}`}
                value="no"
                checked={responses[condition.id] === "no"}
                onChange={(e) => handleInputChange(condition.id, e.target.value)}
                className="h-4 w-4 text-[#c49a47] focus:ring-[#c49a47]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
            </label>
          </div>
        );

      case "text":
        return (
          <input
            type="text"
            value={responses[condition.id] || ""}
            onChange={(e) => handleInputChange(condition.id, e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#c49a47] focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Enter your answer"
          />
        );

      case "textarea":
        return (
          <textarea
            value={responses[condition.id] || ""}
            onChange={(e) => handleInputChange(condition.id, e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#c49a47] focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            placeholder="Enter your answer"
          />
        );

      case "radio":
        return (
          <div className="space-y-2">
            {condition.options.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`condition_${condition.id}`}
                  value={option.value}
                  checked={responses[condition.id] === option.value}
                  onChange={(e) => handleInputChange(condition.id, e.target.value)}
                  className="h-4 w-4 text-[#c49a47] focus:ring-[#c49a47]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {condition.options.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(responses[condition.id] || []).includes(option.value)}
                  onChange={(e) =>
                    handleCheckboxChange(condition.id, option.value, e.target.checked)
                  }
                  className="h-4 w-4 rounded text-[#c49a47] focus:ring-[#c49a47]"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-[#c49a47] to-[#d4a855] p-6 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Apply for Role</h2>
            <p className="text-sm text-white/90">{role.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white transition hover:bg-white/20"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {role.description}
            </p>
          </div>

          <div className="space-y-6">
            {role.conditions.map((condition) => (
              <div key={condition.id} className="space-y-2">
                <label className="flex items-start gap-2 text-sm font-medium text-gray-900 dark:text-white">
                  <span>{condition.label}</span>
                  {condition.is_required && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                {renderConditionInput(condition)}
              </div>
            ))}

            {/* Optional: File upload for portfolio/showreel */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Additional Documents (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Click to upload documents
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileChange(999, file);
                      }
                    }}
                    accept="image/*,video/*,.pdf"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 flex items-start gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-950/20">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-900 dark:text-blue-300">
              Make sure all required fields are filled before submitting. Your application
              will be reviewed by the casting team.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#c49a47] to-[#d4a855] px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Submit Application
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
