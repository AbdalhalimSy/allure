"use client";

import { useI18n } from "@/contexts/I18nContext";
import { Award, Users, Zap, Shield } from "lucide-react";

export default function WelcomeSection() {
  const { t } = useI18n();

  const features = [
    {
      icon: Award,
      title: t("welcome.feature1"),
      description: t("welcome.feature1Desc"),
    },
    {
      icon: Users,
      title: t("welcome.feature2"),
      description: t("welcome.feature2Desc"),
    },
    {
      icon: Zap,
      title: t("welcome.feature3"),
      description: t("welcome.feature3Desc"),
    },
    {
      icon: Shield,
      title: t("welcome.feature4"),
      description: t("welcome.feature4Desc"),
    },
  ];

  return (
    <section className="py-20 px-6 bg-linear-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm uppercase tracking-wider mb-4">
                {t("welcome.eyebrow")}
              </p>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                {t("welcome.title")}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                {t("welcome.description")}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={idx}
                    className="group p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-amber-500 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent
                        size={24}
                        className="text-amber-600 dark:text-amber-400"
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                {t("welcome.learnMore")}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right - Stats Cards */}
          <div className="space-y-6">
            {[
              {
                number: "2009",
                label: t("welcome.stat1"),
              },
              {
                number: "1000+",
                label: t("welcome.stat2"),
              },
              {
                number: "500+",
                label: t("welcome.stat3"),
              },
              {
                number: "98%",
                label: t("welcome.stat4"),
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-amber-500 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-orange-500 mb-2">
                      {stat.number}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                  <div className="hidden sm:block w-16 h-16 bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
