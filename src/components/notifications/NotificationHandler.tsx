"use client";

import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNotifications } from "@/contexts/NotificationContext";

export default function NotificationHandler() {
  const { notification } = useNotifications();

  useEffect(() => {
    if (!notification) return;

    const title = notification.notification?.title || "New notification";
    const body = notification.notification?.body || "";

    toast.success(`${title}${body ? ": " + body : ""}`, { duration: 5000 });
  }, [notification]);

  return null;
}
