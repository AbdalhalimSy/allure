"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";

const DISMISS_KEY = "notification-prompt-dismissed";

export default function NotificationPermissionPrompt() {
  const { isSupported, requestPermission, sendTokenToBackend } = useNotifications();
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isSupported || !isAuthenticated) return;

    const dismissed = localStorage.getItem(DISMISS_KEY);
    const shouldShow = Notification.permission === "default" && !dismissed;
    setIsVisible(shouldShow);
  }, [isSupported, isAuthenticated]);

  const handleEnable = async () => {
    setIsSubmitting(true);
    try {
      const token = await requestPermission();
      if (token) {
        await sendTokenToBackend(token);
        setIsVisible(false);
        localStorage.setItem(DISMISS_KEY, "1");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(DISMISS_KEY, "1");
    }
  };

  if (!isVisible) return null;

  return (
 <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-lg ">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg">🔔</div>
        <div className="flex-1">
 <h3 className="mb-1 font-semibold text-gray-900 ">Enable notifications</h3>
 <p className="mb-3 text-sm text-gray-600 ">
            Stay updated with job matches, payments, and account alerts in real time.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEnable}
              disabled={isSubmitting}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isSubmitting ? "Enabling..." : "Enable"}
            </button>
            <button
              type="button"
              onClick={handleDismiss}
 className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 "
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
