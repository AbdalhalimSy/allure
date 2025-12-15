"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/ui/Loader";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  XCircle,
} from "lucide-react";
import { AppliedJob, AppliedJobsResponse } from "@/types/job";

interface StatItem {
  key: string;
  label: string;
  count: number;
  color: string;
}

export default function AppliedJobsPage() {
  const { t, locale } = useI18n();
  const { isAuthenticated, activeProfileId } = useAuth();

  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<{
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  } | null>(null);
  const [search, setSearch] = useState("");

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
      const token =
        typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
      const url = `/api/jobs/applied?profile_id=${activeProfileId}&per_page=20&page=${pageNum}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token || ""}`,
          "Accept-Language": locale,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.message || data.error || t("appliedJobs.errors.loadFailed")
        );
      }

      const result: AppliedJobsResponse = await res.json();
      if (result.status === "success" || result.status === true) {
        setApplications(result.data || []);
        setMeta(result.meta);
      } else {
        throw new Error(result.message || t("appliedJobs.errors.loadFailed"));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("appliedJobs.errors.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return applications;
    const term = search.toLowerCase();
    return applications.filter((app) => {
      const { role } = app;
      return (
        role.name.toLowerCase().includes(term) ||
        role.description.toLowerCase().includes(term) ||
        (role.ethnicity?.join(" ") || "").toLowerCase().includes(term)
      );
    });
  }, [applications, search]);

  const stats: StatItem[] = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const shortlisted = applications.filter(
      (a) => a.status === "shortlisted"
    ).length;
    const selected = applications.filter((a) => a.status === "selected").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    return [
      {
        key: "total",
        label: t("appliedJobs.stats.total"),
        count: total,
        color: "bg-gray-100 dark:bg-gray-800",
      },
      {
        key: "pending",
        label: t("appliedJobs.stats.pending"),
        count: pending,
        color: "bg-amber-50 dark:bg-amber-900/20",
      },
      {
        key: "shortlisted",
        label: t("appliedJobs.stats.shortlisted"),
        count: shortlisted,
        color: "bg-blue-50 dark:bg-blue-900/20",
      },
      {
        key: "selected",
        label: t("appliedJobs.stats.selected"),
        count: selected,
        color: "bg-emerald-50 dark:bg-emerald-900/20",
      },
      {
        key: "rejected",
        label: t("appliedJobs.stats.rejected"),
        count: rejected,
        color: "bg-rose-50 dark:bg-rose-900/20",
      },
    ];
  }, [applications, t]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <div className="mx-auto w-fit rounded-2xl border border-dashed border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t("jobs.authRequired")}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t("jobs.authRequiredDescription")}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-[#c49a47] px-5 py-2 text-sm font-semibold text-white shadow hover:shadow-md"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-[#c49a47] px-5 py-2 text-sm font-semibold text-[#c49a47] hover:bg-[#c49a47]/10"
            >
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
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/30">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
          <h2 className="text-xl font-semibold text-rose-700 dark:text-rose-200">
            {t("appliedJobs.errors.loadFailed")}
          </h2>
          <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">
            {error}
          </p>
          <button
            onClick={() => fetchAppliedJobs(page)}
            className="mt-4 rounded-lg bg-[#c49a47] px-5 py-2 text-sm font-semibold text-white shadow hover:shadow-md"
          >
            {t("jobs.tryAgain") || "Try Again"}
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
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#c49a47]">
              {t("appliedJobs.title")}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("appliedJobs.subtitle")}
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <Clock className="h-4 w-4" />
            <span>
              {t("appliedJobs.stats.total")}:{" "}
              {meta?.total ?? applications.length}
            </span>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className={`${stat.color} rounded-xl border border-gray-200/70 p-4 dark:border-gray-800`}
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("appliedJobs.search")}
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
          />
        </div>
        {meta && meta.last_page > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page <= 1}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {t("appliedJobs.pagination.previous")}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {meta.current_page} / {meta.last_page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={meta.current_page >= meta.last_page}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {t("appliedJobs.pagination.next")}
            </button>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("appliedJobs.noApplications")}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {search
              ? t("appliedJobs.noSearchResults")
              : t("appliedJobs.noApplicationsMessage")}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#c49a47]/10 px-4 py-2 text-sm font-semibold text-[#c49a47]">
            <Filter className="h-4 w-4" />
            {t("appliedJobs.browseJobs")}
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((app) => {
            const role = app.role;
            return (
              <div
                key={app.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c49a47]/10 text-lg font-bold text-[#c49a47]">
                      {role.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        #{app.job_role_id}
                      </p>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {role.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {t("appliedJobs.details.status")}: {app.status}
                    </span>
                    {app.approved_payment_terms && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        {t("appliedJobs.details.approved")}
                      </span>
                    )}
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      {t("appliedJobs.details.appliedOn")}:{" "}
                      {formatDate(app.created_at)}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("appliedJobs.details.ageRange")}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {role.start_age} - {role.end_age}{" "}
                      {t("appliedJobs.details.years")}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("appliedJobs.details.gender")}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {t(`filters.${role.gender}`)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("appliedJobs.details.paymentTerms")}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {role.payment_terms_days} {t("appliedJobs.details.days")}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t("appliedJobs.details.ethnicity")}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {role.ethnicity?.join(", ") || "-"}
                    </p>
                  </div>
                  {role.call_time_enabled && (
                    <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-100">
                      <p className="text-xs font-semibold uppercase tracking-wide">
                        {t("appliedJobs.details.callTimeEnabled")}
                      </p>
                      <p className="mt-1 text-sm">
                        {t("appliedJobs.details.callTimeMessage")}
                      </p>
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
