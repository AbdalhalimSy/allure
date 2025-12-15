import { ReactNode } from "react";
import SurfaceCard, { SurfaceCardAccent } from "@/components/ui/SurfaceCard";

type AuthShellProps = {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  accent?: SurfaceCardAccent;
  icon?: ReactNode;

};
export default function AuthShell({
  title,
  description,
  children,
  footer,
  accent = "gold",
  icon,
}: AuthShellProps) {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-160px)] items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100 px-4 py-16 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 start-10 h-72 w-72 rounded-full bg-[#c49a47]/20 blur-3xl" />
        <div className="absolute bottom-0 -end-20 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-lg">
        <SurfaceCard
          accent={accent}
          padding="p-10"
          backgroundClassName="border border-white/40 bg-white/90 shadow-2xl dark:border-white/10 dark:bg-gray-900/90"
          className="text-center"
        >
          <div className="space-y-6">
            {icon && (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#c49a47]/15 text-3xl text-[#c49a47] shadow-inner">
                {icon}
              </div>
            )}
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h1>
              {description && (
                <p className="text-base text-gray-600 dark:text-gray-300">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="mt-10 text-start">{children}</div>
          {footer && (
            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              {footer}
            </div>
          )}
        </SurfaceCard>
      </div>
    </section>
  );
}
