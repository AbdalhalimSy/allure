"use client";

import { useState } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import FileUploader from "@/components/ui/FileUploader";
import CallTimeSelector from "@/components/jobs/CallTimeSelector";
import { CallTimeSlotGroup } from "@/types/job";
import { useI18n } from "@/contexts/I18nContext";

interface Condition {
  id: number;
  label: string;
  input_type: "yes_no" | "textarea" | "checkbox" | "radio" | "text" | "media_upload";
  options: Array<{ value: string; label: string }>;
  is_required: boolean;
}

interface Role {
  id: number;
  name: string;
  description: string;
  conditions: Condition[];
  call_time_enabled: boolean;
  call_time_slots?: CallTimeSlotGroup[];
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
  const { t } = useI18n();
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [mediaFiles, setMediaFiles] = useState<Record<number, File>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCallTimeSlotId, setSelectedCallTimeSlotId] = useState<number | null>(null);
  const [selectedCallTime, setSelectedCallTime] = useState<string | null>(null);
  const [callTimeError, setCallTimeError] = useState<string>("");

  if (!isOpen) return null;

  const handleCallTimeChange = (slotId: number, time: string) => {
    setSelectedCallTimeSlotId(slotId);
    setSelectedCallTime(time);
    setCallTimeError("");
  };

  const handleInputChange = (conditionId: number, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [conditionId]: value,
    }));
  };

  const handleCheckboxChange = (
    conditionId: number,
    optionValue: string,
    checked: boolean
  ) => {
    setResponses((prev) => {
      const current = prev[conditionId] || [];
      if (checked) {
        return { ...prev, [conditionId]: [...current, optionValue] };
      } else {
        return {
          ...prev,
          [conditionId]: current.filter((v: string) => v !== optionValue),
        };
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
    // Validate call time if enabled
    if (role.call_time_enabled) {
      if (!selectedCallTimeSlotId || !selectedCallTime) {
        setCallTimeError(t("jobApplication.callTimeRequired"));
        toast.error(t("jobApplication.callTimeRequired"));
        return false;
      }
    }

    // Validate conditions
    for (const condition of role.conditions) {
      if (condition.is_required) {
        if (condition.input_type === "media_upload") {
          // For media upload, check mediaFiles
          if (!mediaFiles[condition.id]) {
            toast.error(`${t("jobApplication.answerRequired")}: ${condition.label}`);
            return false;
          }
        } else {
          const response = responses[condition.id];
          if (!response || (Array.isArray(response) && response.length === 0)) {
            toast.error(`${t("jobApplication.answerRequired")}: ${condition.label}`);
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileId) {
      toast.error(t("jobApplication.loginToApply"));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("profile_id", profileId.toString());
      formData.append("approved_payment_terms", "true");

      // Add call time data if enabled
      if (role.call_time_enabled && selectedCallTimeSlotId && selectedCallTime) {
        formData.append("call_time_slot_id", selectedCallTimeSlotId.toString());
        formData.append("selected_time", selectedCallTime);
      }

      // Build responses array
      const responsesArray = role.conditions.map((condition) => {
        if (condition.input_type === "media_upload") {
          // For media upload, only include condition_id
          return {
            condition_id: condition.id,
            value: "", // Media handled separately
          };
        }
        return {
          condition_id: condition.id,
          value: responses[condition.id] || "",
        };
      });

      formData.append("responses", JSON.stringify(responsesArray));

      // Append media files separately
      Object.entries(mediaFiles).forEach(([conditionId, file]) => {
        formData.append(`media_${conditionId}`, file);
      });

      const response = await fetch(
        `/api/jobs/${jobId}/roles/${role.id}/apply`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      const isSuccess = response.ok && (result.status === "success" || result.status === true || result.success === true);

      if (isSuccess) {
        toast.success(result.message || t("jobApplication.submitted"));
        onClose();
        setResponses({});
        setMediaFiles({});
        setSelectedCallTimeSlotId(null);
        setSelectedCallTime(null);
        setCallTimeError("");
        return;
      }

      const callTimeErrorMessage =
        result?.errors?.selected_time?.[0] ||
        result?.errors?.call_time_slot_id?.[0] ||
        (typeof result.message === "string" ? result.message : "");

      if (callTimeErrorMessage) {
        setCallTimeError(callTimeErrorMessage);
      }

      const errorMessage =
        callTimeErrorMessage ||
        result?.errors?.message ||
        result?.error ||
        result?.message ||
        t("jobApplication.submitFailed");

      toast.error(errorMessage);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(t("jobApplication.genericError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConditionInput = (condition: Condition) => {
    switch (condition.input_type) {
      case "yes_no":
        return (
          <div className="flex flex-wrap gap-3">
            <label className="group relative cursor-pointer">
              <input
                type="radio"
                name={`condition_${condition.id}`}
                value="yes"
                checked={responses[condition.id] === "yes"}
                onChange={(e) =>
                  handleInputChange(condition.id, e.target.value)
                }
                className="peer sr-only"
              />
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 peer-checked:border-[#c49a47] peer-checked:bg-[#c49a47]/10 peer-checked:text-[#c49a47] peer-checked:ring-2 peer-checked:ring-[#c49a47]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:peer-checked:bg-[#c49a47]/20 dark:peer-checked:text-[#d4a855]">
                {responses[condition.id] === "yes" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                Yes
              </span>
            </label>
            <label className="group relative cursor-pointer">
              <input
                type="radio"
                name={`condition_${condition.id}`}
                value="no"
                checked={responses[condition.id] === "no"}
                onChange={(e) =>
                  handleInputChange(condition.id, e.target.value)
                }
                className="peer sr-only"
              />
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 peer-checked:border-[#c49a47] peer-checked:bg-[#c49a47]/10 peer-checked:text-[#c49a47] peer-checked:ring-2 peer-checked:ring-[#c49a47]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:peer-checked:bg-[#c49a47]/20 dark:peer-checked:text-[#d4a855]">
                {responses[condition.id] === "no" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                No
              </span>
            </label>
          </div>
        );

      case "text":
        return (
          <Input
            type="text"
            value={responses[condition.id] || ""}
            onChange={(e) => handleInputChange(condition.id, e.target.value)}
            placeholder={t('forms.enterYourAnswer') || "Enter your answer"}
          />
        );

      case "textarea":
        return (
          <TextArea
            value={responses[condition.id] || ""}
            onChange={(e) => handleInputChange(condition.id, e.target.value)}
            rows={4}
            placeholder={t('forms.enterYourAnswer') || "Enter your answer"}
          />
        );

      case "radio":
        return (
          <div className="flex flex-wrap gap-3">
            {condition.options.map((option) => (
              <label
                key={option.value}
                className="group relative cursor-pointer"
              >
                <input
                  type="radio"
                  name={`condition_${condition.id}`}
                  value={option.value}
                  checked={responses[condition.id] === option.value}
                  onChange={(e) =>
                    handleInputChange(condition.id, e.target.value)
                  }
                  className="peer sr-only"
                />
                <span className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 peer-checked:border-[#c49a47] peer-checked:bg-[#c49a47]/10 peer-checked:text-[#c49a47] peer-checked:ring-2 peer-checked:ring-[#c49a47]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:peer-checked:bg-[#c49a47]/20 dark:peer-checked:text-[#d4a855]">
                  {responses[condition.id] === option.value ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex flex-wrap gap-3">
            {condition.options.map((option) => {
              const isChecked = (responses[condition.id] || []).includes(
                option.value
              );
              return (
                <label
                  key={option.value}
                  className="group relative cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) =>
                      handleCheckboxChange(
                        condition.id,
                        option.value,
                        e.target.checked
                      )
                    }
                    className="peer sr-only"
                  />
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 ${
                      isChecked
                        ? "border-[#c49a47] bg-[#c49a47]/10 text-[#c49a47] ring-2 ring-[#c49a47]/20 dark:bg-[#c49a47]/20 dark:text-[#d4a855]"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border-2 transition-all ${
                        isChecked
                          ? "border-[#c49a47] bg-[#c49a47]"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {isChecked && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        );

      case "media_upload":
        return (
          <FileUploader
            accept="image/*,video/*,.pdf"
            maxSize={20 * 1024 * 1024}
            description={t("jobApplication.uploadDescription") || "Upload images, videos, or PDF (max 20MB)"}
            onChange={(files) => {
              if (files.length > 0 && files[0] instanceof File) {
                handleFileChange(condition.id, files[0]);
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-linear-to-r from-[#c49a47] to-[#d4a855] p-6 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-white">{t("jobApplication.applyForRole")}</h2>
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
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(90vh-180px)] overflow-y-auto p-6"
        >
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {role.description}
            </p>
          </div>

          <div className="space-y-6">
            {/* Call Time Selection */}
            {role.call_time_enabled && role.call_time_slots && role.call_time_slots.length > 0 && (
              <div className="space-y-2">
                <Label required>{t("jobApplication.callTime")}</Label>
                <CallTimeSelector
                  slotGroups={role.call_time_slots}
                  selectedSlotId={selectedCallTimeSlotId}
                  selectedTime={selectedCallTime}
                  onSlotChange={handleCallTimeChange}
                  error={callTimeError}
                />
              </div>
            )}

            {role.conditions.map((condition) => (
              <div key={condition.id} className="space-y-2">
                <Label required={condition.is_required}>
                  {condition.label}
                </Label>
                {renderConditionInput(condition)}
              </div>
            ))}

            {/* Optional: File upload for portfolio/showreel */}
            <div className="space-y-2">
              <Label>{t("jobApplication.additionalDocs")}</Label>
              <FileUploader
                accept="image/*,video/*,.pdf"
                maxSize={20 * 1024 * 1024}
                description={t("jobApplication.uploadDescription")}
                onChange={(files) => {
                  if (files.length > 0 && files[0] instanceof File) {
                    handleFileChange(999, files[0]);
                  }
                }}
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 flex items-start gap-3 rounded-lg border p-4 border-[#c49a47] bg-linear-to-r from-[#fff8ec] to-[#f7e6c2] dark:border-[#c49a47]/40 dark:bg-linear-to-r dark:from-[#2d2210] dark:to-[#3a2c13]">
            <AlertCircle className="h-5 w-5 shrink-0 text-[#c49a47] dark:text-[#c49a47]" />
            <p className="text-sm text-[#c49a47] dark:text-[#c49a47]">
              {t("jobApplication.infoBox")}
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800">
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant="secondary"
              className="flex-1"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              variant="primary"
              className="flex-1"
            >
              {!isSubmitting && (
                <>
                  <CheckCircle className="h-5 w-5 me-2" />
                  {t("jobApplication.submit")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
