"use client";

import Image from "next/image";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { useI18n } from "@/contexts/I18nContext";

export default function MobileAppSection() {
  const { t } = useI18n();

  return (
    <section className="bg-linear-to-br from-[#c49a4760] to-[#c49a4710] px-6 pt-16 lg:px-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col-reverse md:flex-row  justify-between gap-8 items-center">
          {/* Left: Mobile App Image */}
          <div className="flex justify-center lg:justify-start items-end">
            <div className="relative h-auto">
              <Image
                src="/images/allure-mobile-app.webp"
                alt="Allure Mobile App"
                width={256}
                height={400}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:content-center gap-8 w-full justify-between">
            {/* Center: Content */}
            <div className="text-center sm:text-start space-y-4 content-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                {t("home.content.mobileApp.title")}
              </h2>
              <p className="text-base sm:text-lg text-[#c49a47] font-medium max-w-2xl">
                {t("home.content.mobileApp.subtitle")}
              </p>
            </div>

            {/* Right: App Store Buttons */}
            <div className="flex sm:flex-col gap-4 items-center lg:items-end justify-center min-w-[200px] sm:flex flex-wrap">
              {/* App Store Button */}
              <a
                href="#"
                className="flex items-center gap-3 bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-800 transition-colors duration-300 w-full max-w-[200px]"
              >
                <FaApple className="h-8 w-8" />
                <div className="text-start">
                  <div className="text-xs">
                    {t("home.content.mobileApp.appStore.label")}
                  </div>
                  <div className="text-lg font-semibold">
                    {t("home.content.mobileApp.appStore.title")}
                  </div>
                </div>
              </a>

              {/* Google Play Button */}
              <a
                href="#"
                className="flex items-center gap-3 bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-800 transition-colors duration-300 w-full max-w-[200px]"
              >
                <FaGooglePlay className="h-8 w-8" />
                <div className="text-start">
                  <div className="text-xs">
                    {t("home.content.mobileApp.googlePlay.label")}
                  </div>
                  <div className="text-lg font-semibold">
                    {t("home.content.mobileApp.googlePlay.title")}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
