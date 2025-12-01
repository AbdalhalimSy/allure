"use client";

import Link from "next/link";
import { Calendar, MapPin, Users, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
}

const gradients = [
  "from-rose-500 via-pink-500 to-fuchsia-500",
  "from-cyan-500 via-blue-500 to-indigo-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-red-500 via-rose-500 to-pink-500",
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  });
};

export default function JobCard({ job }: JobCardProps) {
  const gradient = gradients[job.id % gradients.length];
  const daysUntilExpiry = Math.ceil(
    (new Date(job.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] dark:border-gray-800 dark:bg-gray-900">
      {/* Gradient Header */}
      <div className={`h-2 bg-linear-to-r ${gradient} transition-all duration-300 group-hover:h-3`} />
      
      {/* Status Badge */}
      {isExpiringSoon && (
        <div className="absolute right-4 top-6 flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
          <Clock className="h-3 w-3" />
          Expiring Soon
        </div>
      )}

      <div className="p-6">
        {/* Title */}
        <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
          {job.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {job.description}
        </p>

        {/* Meta Info Grid */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Calendar className="h-4 w-4 text-[#c49a47]" />
            <span className="font-medium">Shooting:</span>
            <span>{formatDate(job.shooting_date)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Clock className="h-4 w-4 text-[#c49a47]" />
            <span className="font-medium">Expires:</span>
            <span>{formatDate(job.expiration_date)}</span>
          </div>
          
          {job.countries && job.countries.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4 shrink-0 text-[#c49a47]" />
              <span className="line-clamp-1">{job.countries.slice(0, 2).join(", ")}
                {job.countries.length > 2 && ` +${job.countries.length - 2}`}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Users className="h-4 w-4 text-[#c49a47]" />
            <span className="font-medium">{job.roles_count} Roles Available</span>
          </div>
        </div>

        {/* Skills */}
        {job.skills && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#c49a47]" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Required Skills</span>
            </div>
            <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
              {job.skills}
            </p>
          </div>
        )}

        {/* Professions Tags */}
        {job.professions && job.professions.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {job.professions.slice(0, 3).map((profession) => (
              <span
                key={profession}
                className="rounded-lg bg-[#c49a47]/10 px-3 py-1 text-xs font-medium text-[#c49a47] dark:bg-[#c49a47]/20"
              >
                {profession}
              </span>
            ))}
            {job.professions.length > 3 && (
              <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                +{job.professions.length - 3}
              </span>
            )}
          </div>
        )}

        {/* View Details Button */}
        <Link
          href={`/jobs/${job.id}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#c49a47] to-[#d4a855] px-6 py-3 font-semibold text-white shadow-lg shadow-[#c49a47]/30 transition-all hover:shadow-xl hover:shadow-[#c49a47]/40 group-hover:gap-3"
        >
          View Details
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
