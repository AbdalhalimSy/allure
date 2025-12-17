"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  const { isAuthenticated, hydrated } = useAuth();
  const { t } = useI18n();

  if (!hydrated) return null;

  if (isAuthenticated) {
    // Logged-in users see Upcoming Jobs section
    return (
      <section className="py-20 px-6 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-yellow-300" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  {t("cta.loggedIn.badge")}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {t("cta.loggedIn.title")}
              </h2>

              <p className="text-xl text-blue-100 mb-6 max-w-md">
                {t("cta.loggedIn.subtitle")}
              </p>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {t("cta.loggedIn.cta")}
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Right Stats */}
            <div className="flex-1 space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <p className="text-blue-100 text-sm mb-2">
                  {t("cta.loggedIn.stat1Label")}
                </p>
                <p className="text-4xl font-bold text-white">24</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <p className="text-blue-100 text-sm mb-2">
                  {t("cta.loggedIn.stat2Label")}
                </p>
                <p className="text-4xl font-bold text-white">156</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Non-logged-in users see registration CTA
  return (
    <section className="py-20 px-6 bg-linear-to-r from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            {t("cta.notLoggedIn.title")}
          </h2>

          <p className="text-xl text-gray-800 dark:text-gray-100 mb-8 max-w-2xl mx-auto">
            {t("cta.notLoggedIn.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {t("cta.notLoggedIn.ctaRegister")}
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold rounded-lg hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
            >
              {t("cta.notLoggedIn.ctaLogin")}
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              {
                title: t("cta.features.feature1"),
                description: t("cta.features.feature1Desc"),
              },
              {
                title: t("cta.features.feature2"),
                description: t("cta.features.feature2Desc"),
              },
              {
                title: t("cta.features.feature3"),
                description: t("cta.features.feature3Desc"),
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-800 dark:text-gray-200 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
