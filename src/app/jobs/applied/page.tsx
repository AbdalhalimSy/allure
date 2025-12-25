"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import CallTimeSelector from "@/components/jobs/CallTimeSelector";
import { toast } from "react-hot-toast";
import { AlertCircle, CheckCircle2, Clock, Filter, Search, XCircle, ChevronDown } from "lucide-react";
import { AppliedJob, AppliedJobsResponse } from "@/types/job";

interface StatItem {
  key: string;
  label: string;
  count: number;
  color: string;
}

type CallTimeSelection = {
  slotId: number | null;
  time: string | null;
  loading?: boolean;
  error?: string;
};

export default function AppliedJobsPage() {
  const { t, locale } = useI18n();
  const { isAuthenticated, activeProfileId } = useAuth();

  const [applications, setApplications] = useState([] as AppliedJob[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null as {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  } | null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(null as string | null);
  const [callTimeSelections, setCallTimeSelections] = useState({} as Record<number, CallTimeSelection>);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!isAuthenticated || !activeProfileId) {
      setLoading(false);
      return;
    }
    fetchAppliedJobs(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, activeProfileId, page]);

  const fetchAppliedJobs = async (pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
      const url = `/api/jobs/applied?profile_id=${activeProfileId}&per_page=20&page=${pageNum}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
          "Accept-Language": locale,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || t("jobs.appliedJobs.errors.loadFailed"));
      }

      const result: AppliedJobsResponse = await res.json();
      if (result.status === "success" || result.status === true) {
        const apps = result.data || [];
        setApplications(apps);
        setMeta(result.meta);

        const initialSelections = apps.reduce((acc, app) => {
          const selectedDetails = app.selected_time_details || app.role?.selected_time_details;
          const time =
            selectedDetails?.selected_time ||
            // Some backends might return the field as `time`
            (selectedDetails as any)?.time ||
            null;

          acc[app.id] = {
            slotId: selectedDetails?.slot_id ?? null,
            time,
            loading: false,
            error: "",
          };

          return acc;
        }, {} as Record<number, CallTimeSelection>);

        setCallTimeSelections(initialSelections);
      } else {
        throw new Error(result.message || t("jobs.appliedJobs.errors.loadFailed"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("jobs.appliedJobs.errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesStatus = !statusFilter || statusFilter === "total" ? true : app.status === statusFilter;
      if (!matchesStatus) return false;
      if (!term) return true;
      const { role } = app;
      return (
        role.name.toLowerCase().includes(term) ||
        role.description.toLowerCase().includes(term) ||
        (role.ethnicity?.join(" ") || "").toLowerCase().includes(term)
      );
    });
  }, [applications, search, statusFilter]);

  const stats: StatItem[] = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const shortlisted = applications.filter((a) => a.status === "shortlisted").length;
    const selected = applications.filter((a) => a.status === "selected").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    return [
 { key: "total", label: t("jobs.appliedJobs.stats.total"), count: total, color: "bg-gray-100 " },
 { key: "pending", label: t("jobs.appliedJobs.stats.pending"), count: pending, color: "bg-amber-50 " },
 { key: "shortlisted", label: t("jobs.appliedJobs.stats.shortlisted"), count: shortlisted, color: "bg-blue-50 " },
 { key: "selected", label: t("jobs.appliedJobs.stats.selected"), count: selected, color: "bg-emerald-50 " },
 { key: "rejected", label: t("jobs.appliedJobs.stats.rejected"), count: rejected, color: "bg-rose-50 " },
    ];
  }, [applications, t]);

  const handleCallTimeChange = (applicationId: number, slotId: number, time: string) => {
    setCallTimeSelections((prev) => ({
      ...prev,
      [applicationId]: {
        ...(prev[applicationId] || { slotId: null, time: null }),
        slotId,
        time,
        error: "",
      },
    }));
  };

  const formatCallTime = (value: string | null) => {
    if (!value) return "";
    const [hours, minutes] = value.split(":");
    const date = new Date();
    date.setHours(Number(hours || 0), Number(minutes || 0));
    return date.toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const findSlotDetails = (app: AppliedJob, slotId: number | null) => {
    if (!slotId) return null;
    const groups = app.call_time_slots || app.role.call_time_slots || [];
    for (const group of groups) {
      const slot = group.slots?.find((s) => s.id === slotId);
      if (slot) {
        return { date: group.date, start_time: slot.start_time, end_time: slot.end_time };
      }
    }
    return null;
  };

  const handleSubmitCallTime = async (app: AppliedJob) => {
    const selection = callTimeSelections[app.id] || { slotId: null, time: null };
    const shortlisted = (app.status || "").toLowerCase() === "shortlisted";
    const callTimeEnabled = app.call_time_enabled ?? app.role.call_time_enabled;

    if (!shortlisted) {
      toast.error(
        t("jobs.appliedJobs.errors.callTimeNotShortlisted") ||
          "Call time selection is only available for shortlisted applications"
      );
      return;
    }

    if (!callTimeEnabled) {
      toast.error(
        t("jobs.appliedJobs.errors.callTimeDisabled") ||
          "Call time selection is not enabled for this role"
      );
      return;
    }

    if (!selection.slotId || !selection.time) {
      setCallTimeSelections((prev) => ({
        ...prev,
        [app.id]: {
          ...(prev[app.id] || selection),
          error: t("jobs.jobApplication.callTimeRequired") || "Please choose a call time slot and time",
        },
      }));
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
    if (!token) {
      toast.error(t("jobs.jobs.authRequired") || "Please log in to confirm a call time");
      return;
    }

    setCallTimeSelections((prev) => ({
      ...prev,
      [app.id]: { ...(prev[app.id] || selection), loading: true, error: "" },
    }));

    try {
      const res = await fetch(`/api/role-applications/${app.id}/select-call-time`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept-Language": locale,
        },
        body: JSON.stringify({ call_time_slot_id: selection.slotId, selected_time: selection.time }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          data?.errors?.call_time_slot_id?.[0] ||
          data?.errors?.selected_time?.[0] ||
          data?.message ||
          t("jobs.appliedJobs.errors.callTimeFailed") ||
          "Could not save call time";

        setCallTimeSelections((prev) => ({
          ...prev,
          [app.id]: { ...(prev[app.id] || selection), loading: false, error: message },
        }));
        toast.error(message);
        return;
      }

      const slotDetails = findSlotDetails(app, selection.slotId);
      const selectedDetails = { ...slotDetails, selected_time: selection.time, slot_id: selection.slotId };

      setApplications((prev) =>
        prev.map((item) => (item.id === app.id ? { ...item, has_selected_time: true, selected_time_details: selectedDetails } : item))
      );

      setCallTimeSelections((prev) => ({ ...prev, [app.id]: { ...selection, loading: false, error: "" } }));

      toast.success(data?.message || t("jobs.appliedJobs.callTimeSaved") || "Call time saved");
    } catch (err) {
      console.error("Call time selection error", err);
      setCallTimeSelections((prev) => ({
        ...prev,
        [app.id]: {
          ...(prev[app.id] || selection),
          loading: false,
          error: t("jobs.appliedJobs.errors.generic") || "Failed to save call time",
        },
      }));
      toast.error(t("jobs.appliedJobs.errors.generic") || "Failed to save call time");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
 <div className="mx-auto w-fit rounded-2xl border border-dashed border-gray-200 bg-white p-8 shadow-sm ">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
 <h2 className="text-2xl font-semibold text-gray-900 ">{t("jobs.jobs.authRequired")}</h2>
 <p className="mt-2 text-sm text-gray-600 ">{t("jobs.jobs.authRequiredDescription")}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login" className="rounded-lg bg-[#c49a47] px-5 py-2 text-sm font-semibold text-white shadow hover:shadow-md">
              {t("nav.login")}
            </Link>
            <Link href="/register" className="rounded-lg border border-[#c49a47] px-5 py-2 text-sm font-semibold text-[#c49a47] hover:bg-[#c49a47]/10">
              {t("nav.signUp")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
 <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center ">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
 <h2 className="text-xl font-semibold text-rose-700 ">{t("jobs.appliedJobs.errors.loadFailed")}</h2>
 <p className="mt-2 text-sm text-rose-600 ">{error}</p>
          <button onClick={() => fetchAppliedJobs(page)} className="mt-4 rounded-lg bg-[#c49a47] px-5 py-2 text-sm font-semibold text-white shadow hover:shadow-md">
            {t("jobs.jobs.tryAgain") || "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (value: string) => {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
 <h1 className="text-3xl font-bold text-gray-900 ">{t("jobs.appliedJobs.subtitle")}</h1>
 <div className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm text-gray-600 ">
            <Clock className="h-4 w-4" />
            <span>
              {t("jobs.appliedJobs.stats.total")}: {meta?.total ?? applications.length}
            </span>
          </div>
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {stats.map((stat) => {
            const isActive = statusFilter ? statusFilter === stat.key : stat.key === "total";
            return (
              <button
                key={stat.key}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  setStatusFilter((current) => (stat.key === "total" ? null : current === stat.key ? null : stat.key))
                }
 className={`${stat.color} w-full rounded-xl border border-gray-200/70 p-4 text-start transition hover:-translate-y-0.5 hover:shadow ${isActive ? "ring-2 ring-[#c49a47] border-[#c49a47]/60 shadow-md" : ""}`}
              >
 <p className="text-xs uppercase tracking-wide text-gray-500 ">{stat.label}</p>
 <p className="text-2xl font-bold text-gray-900 ">{stat.count}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
 <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm ">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("jobs.appliedJobs.search")}
 className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 "
          />
        </div>
        {meta && meta.last_page > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page <= 1}
 className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 "
            >
              {t("jobs.appliedJobs.pagination.previous")}
            </button>
 <span className="text-sm text-gray-600 ">
              {meta.current_page} / {meta.last_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={meta.current_page >= meta.last_page}
 className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 "
            >
              {t("jobs.appliedJobs.pagination.next")}
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
 <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm ">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gray-400" />
 <h3 className="text-lg font-semibold text-gray-900 ">{t("jobs.appliedJobs.noApplications")}</h3>
 <p className="mt-1 text-sm text-gray-600 ">
            {search ? t("jobs.appliedJobs.noSearchResults") : t("jobs.appliedJobs.noApplicationsMessage")}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#c49a47]/10 px-4 py-2 text-sm font-semibold text-[#c49a47]">
            <Filter className="h-4 w-4" />
            {t("jobs.appliedJobs.browseJobs")}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((app) => {
            const role = app.role;
            const callTimeEnabled = app.call_time_enabled ?? role.call_time_enabled;
            const callTimeSlots = app.call_time_slots || role.call_time_slots || [];
            const shortlisted = (app.status || "").toLowerCase() === "shortlisted";
            const selection =
              callTimeSelections[app.id] || {
                slotId: app.selected_time_details?.slot_id ?? null,
                time: app.selected_time_details?.selected_time || (app.selected_time_details as any)?.time || null,
              };
            const hasSelectedTime = app.has_selected_time || Boolean(app.selected_time_details || selection.time);
            const selectedSlotDetails = findSlotDetails(app, selection.slotId);
            const selectedLabel = hasSelectedTime
              ? `${selectedSlotDetails?.date ? formatDate(selectedSlotDetails.date) : ""}${selection.time ? ` • ${formatCallTime(selection.time)}` : ""}`.trim()
              : "";

            return (
 <div key={app.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ">
                {/* Card brand header */}
                <div className="flex items-center justify-between bg-linear-to-r from-[#c49a47] to-[#d4a855] px-4 py-3 text-white">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-semibold">{role.name}</span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium">
                      {t("jobs.appliedJobs.details.status")}: {app.status}
                    </span>
                  </div>
                  {hasSelectedTime && (
                    <span className="truncate rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{selectedLabel}</span>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c49a47]/10 text-lg font-bold text-[#c49a47]">
                        {role.name.charAt(0)}
                      </div>
                      <div>
 <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 ">#{app.job_role_id}</p>
 <p className="text-sm text-gray-600 ">{role.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {app.approved_payment_terms && (
 <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 ">
                          <CheckCircle2 className="h-4 w-4" />
                          {t("jobs.appliedJobs.details.approved")}
                        </span>
                      )}
 <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 ">
                        {t("jobs.appliedJobs.details.appliedOn")}: {formatDate(app.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 ">
 <p className="text-xs text-gray-500 ">{t("jobs.appliedJobs.details.ageRange")}</p>
 <p className="font-semibold text-gray-900 ">
                        {role.start_age} - {role.end_age} {t("jobs.appliedJobs.details.years")}
                      </p>
                    </div>
 <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 ">
 <p className="text-xs text-gray-500 ">{t("jobs.appliedJobs.details.gender")}</p>
 <p className="font-semibold text-gray-900 ">{role.gender ? t(`filters.${role.gender}`) : "—"}</p>
                    </div>
 <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 ">
 <p className="text-xs text-gray-500 ">{t("jobs.appliedJobs.details.paymentTerms")}</p>
 <p className="font-semibold text-gray-900 ">{role.payment_terms_days} {t("jobs.appliedJobs.details.days")}</p>
                    </div>
 <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 ">
 <p className="text-xs text-gray-500 ">{t("jobs.appliedJobs.details.ethnicity")}</p>
 <p className="font-semibold text-gray-900 ">{role.ethnicity?.join(", ") || "-"}</p>
                    </div>
                  </div>

                  {callTimeEnabled && (
 <div className="mt-4 rounded-2xl border border-[#c49a47]/30 bg-white shadow-sm ">
                      {/* Header */}
                      <button
                        className="flex w-full items-center justify-between gap-3 rounded-t-2xl bg-linear-to-r from-[#c49a47] to-[#d4a855] px-4 py-3 text-left text-white"
                        onClick={() => setExpanded((prev) => ({ ...prev, [app.id]: !prev[app.id] }))}
                        aria-expanded={Boolean(expanded[app.id])}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="text-xs font-bold uppercase tracking-wide">
                            {t("jobs.appliedJobs.details.callTimeEnabled") || "Call Time"}
                          </span>
                          {hasSelectedTime && (
                            <span className="truncate rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                              {selectedLabel || t("jobs.appliedJobs.details.callTimeSelected") || "Selected"}
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${expanded[app.id] ? "rotate-180" : "rotate-0"}`} />
                      </button>

                      {/* Collapsible content */}
                      <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expanded[app.id] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                        <div className="overflow-hidden">
 <div className="space-y-4 px-4 py-4 text-sm text-gray-800 ">
 <p className="text-sm text-gray-600 ">
                              {shortlisted
                                ? t("jobs.appliedJobs.details.callTimeMessage") || "Select a call time slot to confirm your audition."
                                : t("jobs.appliedJobs.details.callTimeAwaiting") || "You will be able to pick a call time if your application is shortlisted."}
                            </p>

                            {shortlisted ? (
                              callTimeSlots.length > 0 ? (
                                <>
                                  <CallTimeSelector
                                    slotGroups={callTimeSlots}
                                    selectedSlotId={selection.slotId}
                                    selectedTime={selection.time}
                                    onSlotChange={(slotId, time) => handleCallTimeChange(app.id, slotId, time)}
                                    error={selection.error}
                                  />
                                  <div className="flex items-center justify-between">
 <p className="text-xs text-gray-600 ">
                                      {t("jobs.appliedJobs.details.callTimeNote") || "Times are first-come, first-served."}
                                    </p>
                                    <Button
                                      variant="primary"
                                      isLoading={selection.loading}
                                      disabled={!selection.slotId || !selection.time}
                                      onClick={() => handleSubmitCallTime(app)}
                                      className="bg-linear-to-r from-[#c49a47] to-[#d4a855] text-white hover:from-[#b8963f] hover:to-[#c89a4a]"
                                    >
                                      {hasSelectedTime
                                        ? t("jobs.appliedJobs.details.callTimeUpdate") || "Update Call Time"
                                        : t("jobs.appliedJobs.details.callTimeConfirm") || "Confirm Call Time"}
                                    </Button>
                                  </div>
                                </>
                              ) : (
 <p className="text-sm text-gray-600 ">
                                  {t("jobs.appliedJobs.details.noCallTimeSlots") || "Call time slots are not available yet."}
                                </p>
                              )
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
