"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
 className={`w-full rounded-lg border bg-white px-4 py-3 text-black transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-20 hover:border-[#c49a47]/50 ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
 : "border-gray-300 focus:border-[#c49a47] focus:ring-[#c49a47] "
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
