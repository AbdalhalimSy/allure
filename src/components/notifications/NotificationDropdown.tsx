"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bell, BellOff, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useNotifications } from "@/contexts/NotificationContext";

export type NotificationItem = {
  id: number;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
  sent_at?: string;
  read_at?: string | null;
};

type FetchResponse = {
  status?: string;
  message?: string;
  data?: {
    notifications?: NotificationItem[];
    unread_count?: number;
    total?: number;
  };
};

function formatTimestamp(value: string | undefined, locale: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function NotificationDropdown() {
  const { isAuthenticated, activeProfileId, hydrated } = useAuth();
  const { t, locale } = useI18n();
  const { notification: incomingNotification } = useNotifications();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const hasUnread = unreadCount > 0;
  const unreadText = useMemo(() => {
    const template = t("common.notifications.unread");
    if (template && template.includes("{{count}}")) {
      return template.replace("{{count}}", String(unreadCount));
    }
    return template || `${unreadCount} unread`;
  }, [t, unreadCount]);

  const fetchNotifications = useCallback(async () => {
    if (!activeProfileId) return;
    setLoading(true);
    setError(null);

    try {
      const { data } = await apiClient.get<FetchResponse>(
        `/profiles/${activeProfileId}/notifications`,
        {
          headers: {
            "x-profile-id": String(activeProfileId),
          },
        }
      );

      const payload = data?.data;
      setItems(payload?.notifications ?? []);
      setUnreadCount(payload?.unread_count ?? 0);
    } catch (err) {
      const fallback =
        t("common.notifications.fetchError") || "Could not load notifications";
      setError(fallback);
      toast.error(fallback);
    } finally {
      setLoading(false);
    }
  }, [activeProfileId, t]);

  const markAsRead = useCallback(
    async (id: number) => {
      if (!activeProfileId) return;

      const current = items.find((n) => n.id === id);
      if (current?.is_read) return;

      // Optimistic update
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, is_read: true, read_at: new Date().toISOString() }
            : item
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      try {
        await apiClient.post(
          `/profiles/${activeProfileId}/notifications/${id}/read`,
          undefined,
          {
            headers: {
              "x-profile-id": String(activeProfileId),
            },
          }
        );
      } catch (err) {
        // Revert on failure
        setItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, is_read: false, read_at: current?.read_at ?? null }
              : item
          )
        );
        setUnreadCount((prev) => prev + 1);
        toast.error(
          t("common.notifications.markOneFailed") || "Failed to mark as read"
        );
      }
    },
    [activeProfileId, items, t]
  );

  const markAllAsRead = useCallback(async () => {
    if (!activeProfileId || unreadCount === 0) return;

    const snapshot = items;
    const snapshotUnread = unreadCount;
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        is_read: true,
        read_at: item.read_at ?? new Date().toISOString(),
      }))
    );
    setUnreadCount(0);

    try {
      await apiClient.post(
        `/profiles/${activeProfileId}/notifications/read-all`,
        undefined,
        {
          headers: {
            "x-profile-id": String(activeProfileId),
          },
        }
      );
    } catch (err) {
      setItems(snapshot);
      setUnreadCount(snapshotUnread);
      toast.error(
        t("common.notifications.markAllFailed") || "Failed to mark all as read"
      );
    }
  }, [activeProfileId, items, unreadCount, t]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !items.length) {
      fetchNotifications();
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!hydrated || !isAuthenticated || !activeProfileId) return;
    fetchNotifications();
  }, [hydrated, isAuthenticated, activeProfileId, fetchNotifications]);

  useEffect(() => {
    if (!incomingNotification) return;
    // Refresh the list when a push notification arrives
    fetchNotifications();
  }, [incomingNotification, fetchNotifications]);

  const renderedItems = useMemo(() => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-start gap-3 rounded-lg bg-linear-to-r from-gray-50 to-white p-3 dark:from-white/5 dark:to-white/10"
            >
              <div className="h-10 w-10 rounded-full bg-gray-200/80 dark:bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 rounded bg-gray-200/80 dark:bg-white/10" />
                <div className="h-3 w-1/2 rounded bg-gray-200/70 dark:bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-200">
          {error}
        </div>
      );
    }

    if (!items.length) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-6 text-center dark:bg-white/5">
          <BellOff className="mb-2 h-8 w-8 text-gray-400" />
          <p className="font-semibold text-gray-900 dark:text-white">
            {t("common.notifications.empty") || "You're all caught up"}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("common.notifications.emptySubtitle") ||
              "New alerts will appear here."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => markAsRead(item.id)}
            className={`group relative flex w-full items-start gap-3 rounded-xl border p-3 text-start transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 ${
              item.is_read
                ? "border-gray-100 bg-white dark:bg-black"
                : "border-[#c49a47]/30 bg-linear-to-r from-white via-[#fff8ec] to-white shadow-sm dark:from-[#c49a47]/10 dark:via-black dark:to-black"
            }`}
          >
            <div
              className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                item.is_read
                  ? "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-200"
                  : "bg-[#c49a47]/15 text-[#c49a47]"
              }`}
            >
              {item.title?.charAt(0)?.toUpperCase() || "!"}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {item.title}
                </p>
                {!item.is_read && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="inline-flex h-2 w-2 rounded-full bg-[#c49a47]"
                      aria-hidden
                    />
                    <span className="inline-flex rounded-full bg-[#c49a47]/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#c49a47]">
                      {t("common.notifications.new") || "New"}
                    </span>
                  </div>
                )}
              </div>
              {item.body && (
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {item.body}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimestamp(item.sent_at || item.created_at, locale)}
              </p>
            </div>
          </button>
        ))}
      </div>
    );
  }, [error, items, loading, locale, markAsRead, t]);

  if (!hydrated || !isAuthenticated || !activeProfileId) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/10 dark:text-white"
        aria-label={t("common.notifications.title") || "Notifications"}
      >
        <Bell className="h-5 w-5" />
        {hasUnread && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c49a47] px-1 text-[11px] font-semibold text-white shadow-lg">
            {Math.min(unreadCount, 9)}
            {unreadCount > 9 ? "+" : ""}
          </span>
        )}
      </button>

      <div
        className={`absolute end-0 mt-3 w-[360px] max-w-[90vw] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl backdrop-blur dark:border-white/10 dark:bg-black/90 transition-all duration-200 ease-in-out origin-top-right ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/10">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("common.notifications.title") || "Notifications"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {hasUnread
                ? unreadText
                : t("common.notifications.caughtUp") || "You're caught up"}
            </p>
          </div>
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={!hasUnread || loading}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-[#c49a47] transition hover:bg-[#c49a47]/10 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            {t("common.notifications.markAllRead") || "Mark all as read"}
          </button>
        </div>

        <div className="max-h-[420px] space-y-3 overflow-y-auto px-4 py-3">
          {renderedItems}
        </div>

        <div className="flex items-center justify-start gap-2 border-t border-gray-100 bg-linear-to-r from-[#fff8ec] via-white to-white px-4 py-3 dark:border-white/10 dark:from-[#c49a47]/5 dark:via-black dark:to-black">
          <Link
            href="/account"
            className="text-sm font-medium text-gray-700 transition hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
            onClick={() => setOpen(false)}
          >
            {t("common.notifications.seeProfile") || "See the profile"}
          </Link>
        </div>
      </div>
    </div>
  );
}
