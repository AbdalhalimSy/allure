"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link";
  isLoading?: boolean;
}

export default function Button({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-[#c49a47] text-white shadow-lg shadow-[#c49a47]/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#c49a47]/40 active:translate-y-0",
    secondary:
      "bg-gray-200 text-gray-900 shadow-sm hover:bg-gray-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
    link: "bg-transparent px-4 py-2 text-[#c49a47] hover:text-[#b88833] hover:underline transition-colors duration-200",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 me-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
