"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import apiClient from "@/lib/api/client";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Sparkles,
  Filter,
  Search,
  ArrowRight,
  Loader2,
  Users,
  Info
} from "lucide-react";

type ApplicationStatus = "pending" | "shortlisted" | "rejected" | "selected";

interface Role {
  id: number;
  name: string;
  description: string;
  start_age: number;
  end_age: number;
  gender: string;
  ethnicity: string[];
  payment_terms_days: number;
  call_time_enabled: boolean;
  meta_conditions: any[];
  conditions: any[];
}

interface JobApplication {
  id: number;
  status: ApplicationStatus;
  approved_payment_terms: boolean;
  job_role_id: number;
  profile_id: number;
  role: Role;
  created_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    dot: "bg-yellow-500"
  },
  shortlisted: {
    label: "Shortlisted",
    icon: Sparkles,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    dot: "bg-blue-500"
  },
  selected: {
    label: "Selected",
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    dot: "bg-green-500"
  },
  rejected: {
    label: "Not Selected",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    dot: "bg-red-500"
  }
};

const genderIcons: Record<string, string> = {
  male: "♂",
  female: "♀",
  other: "⚧"
};

export default function AppliedJobsPage() {
  const { t } = useI18n();
  const { user, activeProfileId } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  const fetchApplications = async (page = 1) => {
    if (!activeProfileId) return;

    try {
      setLoading(true);
      const params: Record<string, string> = {
        profile_id: activeProfileId.toString(),
        per_page: "20",
        page: page.toString()
      };

      if (statusFilter !== "all") {
        params.application_status = statusFilter;
      }

      const response = await apiClient.get("/jobs/applied", { params });

      if (response.data.status === "success") {
        setApplications(response.data.data || []);
        setPagination({
          current_page: response.data.meta?.current_page || 1,
          last_page: response.data.meta?.last_page || 1,
          per_page: response.data.meta?.per_page || 20,
          total: response.data.meta?.total || 0
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch applications:", error);
      toast.error("Failed to load your applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(1);
  }, [activeProfileId, statusFilter]);

  const filteredApplications = applications.filter((app) =>
    app.role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.role.ethnicity.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getStatusCounts = () => {
    return {
      all: applications.length,
      pending: applications.filter(a => a.status === "pending").length,
      shortlisted: applications.filter(a => a.status === "shortlisted").length,
      selected: applications.filter(a => a.status === "selected").length,
      rejected: applications.filter(a => a.status === "rejected").length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#c49a47] to-amber-500 shadow-lg shadow-[#c49a47]/30">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Applications
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track and manage your job applications
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-2xl border-2 p-4 transition-all duration-200 hover:scale-105 active:scale-100 ${
              statusFilter === "all"
                ? "border-[#c49a47] bg-[#c49a47]/5 shadow-lg shadow-[#c49a47]/20"
                : "border-gray-200 bg-white dark:border-white/10 dark:bg-white/5"
            }`}
          >
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.all}</p>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total</p>
          </button>
          
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status as ApplicationStatus)}
                className={`rounded-2xl border-2 p-4 transition-all duration-200 hover:scale-105 active:scale-100 ${
                  statusFilter === status
                    ? `${config.border} ${config.bg} shadow-lg`
                    : "border-gray-200 bg-white dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <Icon className={`mb-2 h-5 w-5 ${config.color}`} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {statusCounts[status as keyof typeof statusCounts]}
                </p>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {config.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by role name, description, or ethnicity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-[#c49a47] focus:outline-none focus:ring-2 focus:ring-[#c49a47]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#c49a47]" />
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10">
              <Briefcase className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              No applications found
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {searchQuery ? "Try adjusting your search" : "Start applying to jobs to see them here"}
            </p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-full bg-[#c49a47] px-6 py-3 font-semibold text-white shadow-lg shadow-[#c49a47]/30 transition-all hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
            >
              Browse Jobs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const statusInfo = statusConfig[application.status];
              const StatusIcon = statusInfo.icon;
              
              return (
                <div
                  key={application.id}
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex flex-col gap-6 p-6">
                    {/* Header Section */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {/* Role Icon */}
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-[#c49a47] to-amber-500 shadow-lg">
                          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
                            {genderIcons[application.role.gender] || "👤"}
                          </div>
                        </div>

                        {/* Role Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {application.role.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {application.role.description}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 ${statusInfo.border} ${statusInfo.bg}`}>
                        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                        <span className={`text-xs font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Age Range */}
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
                        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Age Range
                        </div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          {application.role.start_age} - {application.role.end_age} years
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
                        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Gender
                        </div>
                        <div className="flex items-center gap-2 text-base font-semibold capitalize text-gray-900 dark:text-white">
                          <span>{genderIcons[application.role.gender]}</span>
                          <span>{application.role.gender}</span>
                        </div>
                      </div>

                      {/* Payment Terms */}
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
                        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Payment Terms
                        </div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          {application.role.payment_terms_days} days
                        </div>
                        {application.approved_payment_terms && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Approved</span>
                          </div>
                        )}
                      </div>

                      {/* Applied Date */}
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
                        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Applied On
                        </div>
                        <div className="flex items-center gap-1.5 text-base font-semibold text-gray-900 dark:text-white">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(application.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ethnicity Tags */}
                    {application.role.ethnicity.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Ethnicity:
                        </span>
                        {application.role.ethnicity.map((eth, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-full bg-[#c49a47]/10 px-3 py-1 text-xs font-medium text-[#c49a47]"
                          >
                            {eth}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Call Time Badge */}
                    {application.role.call_time_enabled && (
                      <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <div className="font-semibold text-blue-900 dark:text-blue-100">
                            Call Time Enabled
                          </div>
                          <div className="text-sm text-blue-700 dark:text-blue-300">
                            Specific timing requirements apply for this role
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="flex gap-3">
                      <Link
                        href={`/jobs?role_id=${application.role.id}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-6 py-2.5 font-semibold text-gray-900 transition-all hover:border-[#c49a47] hover:bg-[#c49a47]/5 hover:text-[#c49a47] active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      >
                        <Info className="h-4 w-4" />
                        View Role Details
                      </Link>
                      <button
                        className="inline-flex items-center gap-2 rounded-full border-2 border-[#c49a47] bg-[#c49a47] px-6 py-2.5 font-semibold text-white transition-all hover:bg-[#c49a47]/90 active:scale-95"
                      >
                        <Users className="h-4 w-4" />
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => fetchApplications(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-all hover:border-[#c49a47] hover:bg-[#c49a47]/5 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => fetchApplications(pageNum)}
                    className={`h-10 w-10 rounded-full font-semibold transition-all ${
                      pagination.current_page === pageNum
                        ? "bg-[#c49a47] text-white shadow-lg shadow-[#c49a47]/30"
                        : "border border-gray-200 bg-white text-gray-900 hover:border-[#c49a47] hover:bg-[#c49a47]/5 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => fetchApplications(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-all hover:border-[#c49a47] hover:bg-[#c49a47]/5 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
