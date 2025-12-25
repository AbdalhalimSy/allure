"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider, useI18n } from "@/contexts/I18nContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect, useMemo } from "react";
import NotificationHandler from "@/components/notifications/NotificationHandler";
import NotificationPermissionPrompt from "@/components/notifications/NotificationPermissionPrompt";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { locale } = useI18n();
  const isRTL = locale === "ar";

  return (
    <div className="flex min-h-screen flex-col">
      <Toaster
        position={isRTL ? "top-left" : "top-right"}
        toastOptions={{ duration: 4000 }}
        containerStyle={{ top: 88 }}
      />
      <NotificationHandler />
      <NotificationPermissionPrompt />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.style.colorScheme = "light";

    if (document.body) {
      document.body.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
      document.body.style.color = "#111827";
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <NotificationProvider>
            <LayoutContent>{children}</LayoutContent>
          </NotificationProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
