"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import Label from "./Label";
import { useI18n } from "@/contexts/I18nContext";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  minDate?: string;
  maxDate?: string;
  className?: string;
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DatePicker({
  value,
  onChange,
  placeholder,
  label,
  minDate,
  maxDate,
  className = "",
}: DatePickerProps) {
  const { t, locale } = useI18n();
  const isRTL = locale === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const pickerRef = useRef<HTMLDivElement>(null);

  // Parse the value to date object
  const selectedDate = useMemo(() => (value ? new Date(value) : null), [value]);

  // Initialize calendar to selected date or today
  useEffect(() => {
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    // Format as YYYY-MM-DD without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateString = `${year}-${month}-${dayStr}`;
    onChange(dateString);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dateString = date.toISOString().split("T")[0];

    if (minDate && dateString < minDate) return true;
    if (maxDate && dateString > maxDate) return true;
    return false;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate || isNaN(selectedDate.getTime())) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const today = isToday(day);
      const selected = isSelected(day);

      days.push(
        <button
          key={day}
          type="button"
          disabled={disabled}
          onClick={() => handleDateSelect(day)}
          className={`
            aspect-square rounded-lg text-sm font-medium transition-all duration-200 ease-in-out
            ${
              selected
                ? "bg-[#c49a47] text-white shadow-lg shadow-[#c49a47]/40 scale-105"
                : today
                ? "bg-[#c49a47]/10 text-[#c49a47] border border-[#c49a47]/30"
                : disabled
                ? "text-gray-300 cursor-not-allowed "
                : "text-gray-700 hover:bg-gray-100 hover:scale-105 active:scale-100 "
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div ref={pickerRef} className={`relative ${className}`}>
      {label && <Label>{label}</Label>}

      <div className="relative flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white transition-all duration-200 ease-in-out hover:border-[#c49a47]/50 focus-within:border-[#c49a47] focus-within:ring-2 focus-within:ring-[#c49a47]/20 ">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-1 items-center gap-2 px-4 py-3 text-start text-black "
        >
          <Calendar className="h-4 w-4 text-[#c49a47]" />
          <span className={value ? "text-gray-900 " : "text-gray-500 "}>
            {value
              ? formatDate(selectedDate)
              : placeholder || t("ui.selectDate")}
          </span>
        </button>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="me-2 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 "
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Calendar Dropdown */}
      <div
        className={`absolute start-0 top-full z-40 mt-2 w-80 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="rounded-lg p-2 text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:scale-110 active:scale-100 "
          >
            {isRTL ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900 ">
              {MONTHS[currentMonth]} {currentYear}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="rounded-lg p-2 text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:scale-110 active:scale-100 "
          >
            {isRTL ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Days of week */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-500 "
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

        {/* Quick actions */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 ">
          <button
            type="button"
            onClick={() => {
              const today = new Date();
              handleDateSelect(today.getDate());
              setCurrentMonth(today.getMonth());
              setCurrentYear(today.getFullYear());
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#c49a47] transition-all duration-200 hover:bg-[#c49a47]/10 hover:scale-105 active:scale-100"
          >
            {t("ui.today")}
          </button>
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:scale-105 active:scale-100 "
            >
              {t("ui.clear")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
