"use client";

import { I18nProvider } from '@/contexts/I18nContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Toaster
            position="top-right"
            toastOptions={{ duration: 4000 }}
            containerStyle={{ top: 88 }}
          />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </AuthProvider>
    </I18nProvider>
  );
}
