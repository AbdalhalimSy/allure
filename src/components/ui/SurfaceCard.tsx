import { ReactNode } from "react";

export type SurfaceCardAccent = "gold" | "midnight" | "rose" | "emerald" | "none";

const accentMap: Record<SurfaceCardAccent, string> = {
  gold: "from-[#f2d199]/50 via-transparent to-transparent",
  midnight: "from-blue-500/30 via-transparent to-transparent",
  rose: "from-rose-400/40 via-transparent to-transparent",
  emerald: "from-emerald-400/40 via-transparent to-transparent",
  none: "from-transparent via-transparent to-transparent",
};

type SurfaceCardProps = {
  children: ReactNode;
  accent?: SurfaceCardAccent;
  className?: string;
  padding?: string;
  backgroundClassName?: string;
};

export default function SurfaceCard({
  children,
  accent = "gold",
  className = "",
  padding = "p-6",
  backgroundClassName,
}: SurfaceCardProps) {
  const background =
    backgroundClassName ?? "border border-white/20 bg-white/80 dark:bg-gray-900/60";
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-3xl backdrop-blur-2xl shadow-[0_25px_80px_rgba(15,23,42,0.15)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl",
        background,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute inset-0 opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105",
          "bg-gradient-to-br",
          accentMap[accent],
        ]
          .filter(Boolean)
          .join(" ")}
      />
      <div className={["relative z-10", padding].join(" ")}>{children}</div>
    </div>
  );
}
