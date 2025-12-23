"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useFCM } from "@/hooks/useFCM";
import { useAuth } from "@/contexts/AuthContext";

export type NotificationContextValue = {
  fcmToken: string | null;
  notification: ReturnType<typeof useFCM>["notification"];
  isSupported: boolean;
  requestPermission: () => Promise<string | null>;
  sendTokenToBackend: (token: string) => Promise<boolean>;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hydrated } = useAuth();
  const { fcmToken, notification, isSupported, requestPermission, sendTokenToBackend } = useFCM();
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    if (!hydrated || !isAuthenticated || !isSupported || hasRegistered) return;

    const shouldAutoRegister = typeof window !== "undefined" && Notification.permission === "granted";

    if (!shouldAutoRegister) return;

    (async () => {
      const token = await requestPermission();
      if (token) {
        await sendTokenToBackend(token);
        setHasRegistered(true);
      }
    })();
  }, [hydrated, isAuthenticated, isSupported, hasRegistered, requestPermission, sendTokenToBackend]);

  const value = useMemo(
    () => ({ fcmToken, notification, isSupported, requestPermission, sendTokenToBackend }),
    [fcmToken, notification, isSupported, requestPermission, sendTokenToBackend]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
