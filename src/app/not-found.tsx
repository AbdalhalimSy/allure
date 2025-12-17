"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="text-[12rem] font-bold text-gray-200 dark:text-gray-800 leading-none select-none">
            4
          </div>
          <div className="flex items-center justify-center">
            <Search className="w-32 h-32 text-gray-400 dark:text-gray-600 animate-pulse" />
          </div>
          <div className="text-[12rem] font-bold text-gray-200 dark:text-gray-800 leading-none select-none">
            4
          </div>
        </div>

        {/* Title and Description */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("notFound.title")}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {t("notFound.description")}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-[#c49a47] via-[#d4a855] to-[#c49a47] text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            {t("notFound.goHome")}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:border-gray-400 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            {t("notFound.goBack")}
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            {t("notFound.helpfulLinks")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/jobs"
              className="text-sm text-[#c49a47] hover:text-[#b08a37] font-medium transition-colors"
            >
              {t("notFound.browseJobs")}
            </Link>
            <Link
              href="/talents"
              className="text-sm text-[#c49a47] hover:text-[#b08a37] font-medium transition-colors"
            >
              {t("notFound.browseTalents")}
            </Link>
            <Link
              href="/about"
              className="text-sm text-[#c49a47] hover:text-[#b08a37] font-medium transition-colors"
            >
              {t("notFound.aboutUs")}
            </Link>
            <Link
              href="/contact"
              className="text-sm text-[#c49a47] hover:text-[#b08a37] font-medium transition-colors"
            >
              {t("notFound.contactSupport")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
