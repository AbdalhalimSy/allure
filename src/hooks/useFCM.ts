import { useCallback, useEffect, useMemo, useState } from "react";
import { getMessagingInstance } from "@/lib/firebase";
import { getToken, onMessage, type MessagePayload } from "firebase/messaging";
import apiClient from "@/lib/api/client";

export type FcmNotification = MessagePayload | null;

type RequestPermissionResult = string | null;

type UseFcmReturn = {
  fcmToken: string | null;
  notification: FcmNotification;
  isSupported: boolean;
  requestPermission: () => Promise<RequestPermissionResult>;
  sendTokenToBackend: (token: string) => Promise<boolean>;
};

export function useFCM(): UseFcmReturn {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<MessagePayload | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasNotificationSupport = "Notification" in window;
    const hasServiceWorker = "serviceWorker" in navigator;

    if (!hasNotificationSupport || !hasServiceWorker) {
      setIsSupported(false);
      return;
    }

    let cancelled = false;
    (async () => {
      const messaging = await getMessagingInstance();
      if (!cancelled) {
        setIsSupported(Boolean(messaging));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const requestPermission = useCallback(async (): Promise<RequestPermissionResult> => {
    if (!isSupported) return null;

    if (typeof window === "undefined") return null;

    // Respect existing denial
    if (Notification.permission === "denied") {
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;

      const messaging = await getMessagingInstance();
      if (!messaging) return null;

      // Ensure service worker is available for FCM
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
        scope: "/",
      });

      const swRegistration = registration ?? (await navigator.serviceWorker.ready);

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });

      if (token) {
        setFcmToken(token);
        return token;
      }
    } catch (error) {
      console.error("FCM permission request failed", error);
    }

    return null;
  }, [isSupported]);

  const sendTokenToBackend = useCallback(async (token: string): Promise<boolean> => {
    if (!token) return false;

    try {
      await apiClient.post("/auth/update-device", {
        fcm_token: token,
        platform: "web",
      });
      return true;
    } catch (error) {
      console.error("Failed to send FCM token", error);
      return false;
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let mounted = true;

    (async () => {
      if (!isSupported) return;
      const messaging = await getMessagingInstance();
      if (!messaging || !mounted) return;

      unsubscribe = onMessage(messaging, (payload) => {
        setNotification(payload);

        if (Notification.permission === "granted") {
          const title = payload.notification?.title || "New notification";
          const options: NotificationOptions = {
            body: payload.notification?.body,
            icon: "/logo/logo-white.svg",
            tag: payload.data?.type || "notification",
            data: payload.data,
          };

          try {
            new Notification(title, options);
          } catch (error) {
            console.error("Browser notification failed", error);
          }
        }
      });
    })();

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [isSupported]);

  const value: UseFcmReturn = useMemo(
    () => ({ fcmToken, notification, isSupported, requestPermission, sendTokenToBackend }),
    [fcmToken, notification, isSupported, requestPermission, sendTokenToBackend]
  );

  return value;
}
