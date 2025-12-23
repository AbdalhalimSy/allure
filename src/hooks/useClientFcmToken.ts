"use client";

import { useCallback } from "react";
import { useNotifications } from "@/contexts/NotificationContext";

/**
 * Returns a memoized function that resolves with an FCM token.
 * The helper prefers the cached token (localStorage/context) and otherwise
 * triggers the permission flow so login payloads can always include the token.
 */
export function useClientFcmToken() {
  const { fcmToken, requestPermission, isSupported } = useNotifications();

  return useCallback(async (): Promise<string | null> => {
    if (typeof window === "undefined") return null;

    const storedToken = localStorage.getItem("fcm_token");
    console.log("useClientFcmToken - stored token:", storedToken);
    console.log("useClientFcmToken - fcmToken from context:", fcmToken);
    console.log("useClientFcmToken - Notification.permission:", typeof Notification !== "undefined" ? Notification.permission : "undefined");
    
    if (storedToken) {
      return storedToken;
    }

    if (fcmToken) {
      return fcmToken;
    }

    if (!isSupported || Notification.permission === "denied") {
      return null;
    }

    try {
      return await requestPermission();
    } catch (error) {
      console.error("Failed to obtain FCM token", error);
      return null;
    }
  }, [fcmToken, isSupported, requestPermission]);
}
