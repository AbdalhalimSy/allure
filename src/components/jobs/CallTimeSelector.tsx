"use client";

import { useState } from "react";
import { Calendar, Clock, Users, AlertCircle } from "lucide-react";
import { CallTimeSlotGroup } from "@/types/job";
import Label from "@/components/ui/Label";

interface CallTimeSelectorProps {
  slotGroups: CallTimeSlotGroup[];
  selectedSlotId: number | null;
  selectedTime: string | null;
  onSlotChange: (slotId: number, time: string) => void;
  error?: string;
}

export default function CallTimeSelector({
  slotGroups,
  selectedSlotId,
  selectedTime,
  onSlotChange,
  error,
}: CallTimeSelectorProps) {
  const [expandedSlotId, setExpandedSlotId] = useState<number | null>(
    selectedSlotId
  );

  const formatDate = (dateString: string) => {
    // Extract just the date part from "YYYY-MM-DD HH:MM:SS"
    const datePart = dateString.split(" ")[0];
    const date = new Date(datePart);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (time: string | undefined) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAvailableCount = (slot: { available_times?: Array<{ is_fully_booked: boolean }> }) => {
    return slot.available_times?.filter((t) => !t.is_fully_booked).length || 0;
  };

  const getTotalCount = (slot: { available_times?: Array<any> }) => {
    return slot.available_times?.length || 0;
  };

  const handleTimeSelect = (slotId: number, time: string) => {
    onSlotChange(slotId, time);
    setExpandedSlotId(slotId);
  };

  if (slotGroups.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No call time slots available for this role
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg border border-[#c49a47] bg-linear-to-r from-[#fff8ec] to-[#f7e6c2] p-4 dark:border-[#c49a47]/40 dark:bg-linear-to-r dark:from-[#2d2210] dark:to-[#3a2c13]">
        <AlertCircle className="h-5 w-5 shrink-0 text-[#c49a47] dark:text-[#c49a47]" />
        <div className="text-sm text-[#c49a47] dark:text-[#c49a47]">
          <p className="font-semibold mb-1">Call Time Required</p>
          <p>
            This role requires you to select a call time slot. Please choose an
            available date and time below.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {slotGroups.map((group) => (
          <div key={group.date} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4 text-[#c49a47]" />
              {formatDate(group.date)}
            </div>

            <div className="space-y-2 ps-6">
              {group.slots.map((slot) => {
                const availableCount = getAvailableCount(slot);
                const totalCount = getTotalCount(slot);
                const isExpanded = expandedSlotId === slot.id;
                const hasAvailability = availableCount > 0;

                return (
                  <div
                    key={slot.id}
                    className={`overflow-hidden rounded-lg border transition-all duration-200 ${
                      selectedSlotId === slot.id
                        ? "border-[#c49a47] bg-[#c49a47]/5 ring-2 ring-[#c49a47]/20"
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedSlotId(isExpanded ? null : slot.id)
                      }
                      disabled={!hasAvailability}
                      className={`flex w-full items-center justify-between p-4 text-start transition-colors ${
                        !hasAvailability
                          ? "cursor-not-allowed opacity-60"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-[#c49a47]" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            {/* Show selected time if this slot is selected */}
                            {selectedSlotId === slot.id && selectedTime && (
                              <span className="ms-2 inline-flex items-center rounded bg-[#c49a47]/10 px-2 py-0.5 text-xs font-semibold text-[#c49a47] border border-[#c49a47]/30">
                                <Clock className="me-1 h-3 w-3 text-[#c49a47]" />
                                {selectedTime}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {slot.interval_minutes} min intervals
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="h-4 w-4" />
                          <span
                            className={
                              hasAvailability
                                ? "text-[#c49a47] dark:text-[#c49a47]"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {availableCount}/{totalCount}
                          </span>
                        </div>
                        <svg
                          className={`h-5 w-5 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {isExpanded && hasAvailability && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                        <Label>Select Time</Label>
                        <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {slot.available_times?.map((availableTime) => {
                            const isSelected =
                              selectedSlotId === slot.id &&
                              selectedTime === availableTime.time;
                            const isBooked = availableTime.is_fully_booked;

                            return (
                              <button
                                key={availableTime.time}
                                type="button"
                                onClick={() =>
                                  handleTimeSelect(slot.id, availableTime.time)
                                }
                                disabled={isBooked}
                                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                  isBooked
                                    ? "cursor-not-allowed bg-gray-200 text-gray-400 line-through dark:bg-gray-700 dark:text-gray-600"
                                    : isSelected
                                    ? "bg-[#c49a47] text-white shadow-lg ring-2 ring-[#c49a47]/40"
                                    : "bg-white text-gray-700 hover:bg-[#c49a47]/10 hover:text-[#c49a47] dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-[#c49a47]/20"
                                }`}
                              >
                                {formatTime(availableTime.time)}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
