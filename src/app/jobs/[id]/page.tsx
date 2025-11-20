"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import JobApplicationModal from "@/components/jobs/JobApplicationModal";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft, 
  Briefcase, 
  Sparkles,
  User,
  DollarSign,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { DetailedJob, DetailedRole, JobDetailResponse } from "@/types/job";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, activeProfileId } = useAuth();
  const [job, setJob] = useState<DetailedJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<DetailedRole | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/jobs/${params.id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch job details");
      }
      
      const result: JobDetailResponse = await response.json();
      
      if (result.status === "success" || result.status === true) {
        setJob(result.data);
      } else {
        throw new Error(result.message || "Failed to load job");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching job:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-300 bg-red-50 p-12 text-center dark:border-red-800 dark:bg-red-950/20">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-200">
            Failed to Load Job
          </h3>
          <p className="mb-4 text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            onClick={() => router.push("/jobs")}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const daysUntilExpiry = Math.ceil(
    (new Date(job.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/jobs")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#c49a47] dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </button>

        {/* Header Section */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="h-2 bg-gradient-to-r from-[#c49a47] via-[#d4a855] to-[#c49a47]" />
          
          <div className="p-8">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {job.title}
                </h1>
                {daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                    <Clock className="h-3 w-3" />
                    Expires in {daysUntilExpiry} days
                  </span>
                )}
              </div>
              {job.is_active && (
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Active
                </span>
              )}
            </div>

            <p className="mb-6 text-lg text-gray-700 dark:text-gray-300">
              {job.description}
            </p>

            {/* Quick Info Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <Calendar className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Shooting Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(job.shooting_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <Clock className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Expires On</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(job.expiration_date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <Users className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Open Roles</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {job.roles.length} Available
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <MapPin className="h-5 w-5 text-[#c49a47]" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Locations</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {job.job_countries?.length || 0} Countries
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills Section */}
            {job.skills && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#c49a47]" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Required Skills
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-[#c49a47]/10 px-4 py-2 text-sm font-medium text-[#c49a47] dark:bg-[#c49a47]/20"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Roles Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Available Roles ({job.roles.length})
              </h2>
              
              {job.roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="mb-4">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      {role.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {role.description}
                    </p>
                  </div>

                  {/* Role Requirements */}
                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Gender:
                      </span>
                      <span className="capitalize text-gray-900 dark:text-white">
                        {role.gender}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Age Range:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {role.start_age} - {role.end_age} years
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Ethnicity:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {role.ethnicity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-[#c49a47]" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Payment Terms:
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {role.payment_terms_days} days
                      </span>
                    </div>
                  </div>

                  {/* Meta Conditions */}
                  {role.meta_conditions.length > 0 && (
                    <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                        Physical Requirements
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2 text-sm">
                        {Object.entries(role.meta_conditions[0]).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize text-gray-600 dark:text-gray-400">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conditions */}
                  {role.conditions.length > 0 && (
                    <div>
                      <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                        Additional Requirements
                      </h4>
                      <div className="space-y-2">
                        {role.conditions.map((condition) => (
                          <div
                            key={condition.id}
                            className="flex items-start gap-2 text-sm"
                          >
                            {condition.is_required ? (
                              <CheckCircle className="h-4 w-4 flex-shrink-0 text-[#c49a47]" />
                            ) : (
                              <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                            )}
                            <span className="text-gray-700 dark:text-gray-300">
                              {condition.label}
                              {condition.is_required && (
                                <span className="ml-1 text-red-500">*</span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      setSelectedRole(role);
                      setIsModalOpen(true);
                    }}
                    className="mt-4 w-full rounded-lg bg-gradient-to-r from-[#c49a47] to-[#d4a855] px-6 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl"
                  >
                    Apply for {role.name}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Locations */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#c49a47]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Locations
                </h3>
              </div>
              <ul className="space-y-2">
                {job.job_countries?.map((country, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-[#c49a47]" />
                    {country}
                  </li>
                )) || <li className="text-sm text-gray-500">No locations specified</li>}
              </ul>
            </div>

            {/* Professions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#c49a47]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Professions
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.professions?.map((profession, index) => (
                  <span
                    key={index}
                    className="rounded-lg border border-[#c49a47] bg-[#c49a47]/5 px-3 py-1 text-sm font-medium text-[#c49a47]"
                  >
                    {profession}
                  </span>
                )) || <span className="text-sm text-gray-500">No professions specified</span>}
              </div>
            </div>

            {/* Sub Professions */}
            {job.sub_professions && job.sub_professions.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                  Sub-Professions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.sub_professions.map((subProf, index) => (
                    <span
                      key={index}
                      className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {subProf}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {selectedRole && (
        <JobApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRole(null);
          }}
          jobId={job.id}
          role={selectedRole}
          profileId={activeProfileId || undefined}
        />
      )}
    </div>
  );
}
