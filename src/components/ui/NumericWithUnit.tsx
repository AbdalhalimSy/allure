"use client";

import { useI18n } from "@/contexts/I18nContext";

type Option = { value: string; label: string };

type NumericWithUnitProps = {
  name?: string;
  value: string;
  unit: string;
  onChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  step?: number | "any";
};

export default function NumericWithUnit({
  name,
  value,
  unit,
  onChange,
  onUnitChange,
  options,
  placeholder,
  required,
  disabled,
  min,
  step = "any",
}: NumericWithUnitProps) {
  const { t } = useI18n();
  return (
    <div className="flex w-full">
      <input
        name={name}
        type="number"
        inputMode="numeric"
 className={`flex-1 rounded-s-lg border border-gray-300 bg-white px-4 py-3 text-black transition-all focus:outline-none focus:ring-0 focus:border-[#c49a47] `}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        step={step}
      />
      <select
 className={`rounded-e-lg border border-s-0 border-gray-300 bg-white px-3 py-3 text-start text-black transition-all focus:outline-none focus:ring-0 focus:border-[#c49a47] `}
        value={unit}
        onChange={(e) => onUnitChange(e.target.value)}
        disabled={disabled}
        aria-label={t("ui.unit") || "unit"}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
