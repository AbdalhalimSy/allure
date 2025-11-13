import { ReactNode } from "react";

const variantClasses = {
  primary:
    "bg-[#c49a47]/10 border-[#c49a47]/30 text-[#c49a47] shadow-[0_0_1px_rgba(196,154,71,0.6)]",
  neutral:
    "bg-white/10 border-white/20 text-gray-800 dark:text-gray-200 shadow-none",
};

type AccentTagProps = {
  children: ReactNode;
  icon?: ReactNode;
  variant?: keyof typeof variantClasses;
  className?: string;
};

export default function AccentTag({
  children,
  icon,
  variant = "primary",
  className = "",
}: AccentTagProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm font-medium tracking-tight uppercase",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && <span className="text-base">{icon}</span>}
      {children}
    </span>
  );
}
