"use client";
import React, { useEffect, useRef } from "react";

type OTPInputProps = {
  length?: number; // default 6
  value: string;
  onChange: (code: string) => void;
  onComplete?: (code: string) => void;
};

export default function OTPInput({ length = 6, value, onChange, onComplete }: OTPInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const chars = Array.from({ length });

  useEffect(() => {
    if (value.length === length && onComplete) onComplete(value);
  }, [value, length, onComplete]);

  const setChar = (index: number, char: string) => {
    const clean = char.replace(/\D/g, "");
    if (!clean) return;
    const arr = value.split("");
    arr[index] = clean[0];
    const next = arr.join("");
    onChange(next);
    // move focus next
    const nextEl = inputsRef.current[index + 1];
    if (nextEl) nextEl.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = value.split("");
      if (arr[index]) {
        arr[index] = "";
        onChange(arr.join(""));
      } else if (index > 0) {
        const prev = inputsRef.current[index - 1];
        if (prev) prev.focus();
        arr[index - 1] = "";
        onChange(arr.join(""));
      }
    } else if (e.key === "ArrowLeft") {
      const prev = inputsRef.current[index - 1];
      if (prev) prev.focus();
    } else if (e.key === "ArrowRight") {
      const next = inputsRef.current[index + 1];
      if (next) next.focus();
    }
  };

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    const arr = value.split("");
    for (let i = 0; i < pasted.length && index + i < length; i++) {
      arr[index + i] = pasted[i];
    }
    onChange(arr.join(""));
    const lastIndex = Math.min(index + pasted.length, length - 1);
    const lastEl = inputsRef.current[lastIndex];
    if (lastEl) lastEl.focus();
  };

  return (
    <div className="flex justify-center gap-2">
      {chars.map((_, i) => (
        <input
          key={i}
          ref={(el: HTMLInputElement | null) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => setChar(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
 className="h-12 w-10 rounded-lg border border-gray-300 bg-white text-center text-lg font-semibold tracking-widest text-gray-900 focus:border-[#c49a47] focus:outline-none focus:ring-1 focus:ring-[#c49a47] "
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
