"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/contexts/I18nContext";
import {
  HelpCircle,
  Users,
  ChevronDown,
} from "lucide-react";

type Category = "talents";

export default function FAQPage() {
  const { t, locale } = useI18n();
  const [activeCategory, setActiveCategory] = useState<Category>("talents");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = [
    {
      id: "talents" as Category,
      icon: Users,
      label: t("faq.categories.talents"),
    },
  ];

  // Get questions for active category
  const getQuestions = (
    category: Category
  ): Array<{ question: string; answer: string }> => {
    const questionCounts: Record<Category, number> = {
      talents: 4,
    };

    const count = questionCounts[category];
    const questions = [];

    for (let i = 1; i <= count; i++) {
      const question = t(`faq.${category}.q${i}.question`);
      const answer = t(`faq.${category}.q${i}.answer`);

      // Only add if we got actual translations (not the key back)
      if (question && !question.startsWith("faq.")) {
        questions.push({ question, answer });
      }
    }

    return questions;
  };

  const currentQuestions = getQuestions(activeCategory);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 ">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[rgba(196,154,71,0.05)] via-white to-emerald-50 ">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -start-10 top-10 h-96 w-96 rounded-full bg-[rgba(196,154,71,0.15)] blur-3xl" />
          <div className="absolute -end-10 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.12)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary ">
              <HelpCircle className="h-4 w-4" />
              {t("faq.hero.badge")}
            </p>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              {t("faq.hero.title")}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 sm:text-xl">
              {t("faq.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <div className="container mx-auto px-6 py-16 lg:px-12">
        <div className="mx-auto max-w-4xl">
          {currentQuestions.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <p className="text-gray-600">{t("faq.search.noResults")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentQuestions.map((item: any, index: number) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="flex w-full items-center justify-between gap-4 p-6 text-start transition-colors hover:bg-gray-50 "
                    >
                      <span className="flex-1 font-semibold text-gray-900 ">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-[#c49a47] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        } ${locale === "ar" ? "scale-x-[-1]" : ""}`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                          <p className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 pb-20 lg:px-8 lg:pb-28">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-linear-to-br from-gray-50 via-white to-gray-50 p-12 text-center shadow-xl lg:p-16">
            <div className="absolute -end-20 -top-20 h-64 w-64 rounded-full bg-[#c49a47]/10 blur-3xl"></div>
            <div className="absolute -bottom-20 -start-20 h-64 w-64 rounded-full bg-[#d4a855]/10 blur-3xl"></div>
            <div className="relative">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
                {t("faq.cta.title")}
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 ">
                {t("faq.cta.subtitle")}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#c49a47] via-[#d4a855] to-[#c49a47] bg-size-200 bg-pos-0 px-8 py-4 text-base font-medium text-white shadow-lg transition-all duration-500 hover:bg-pos-100 hover:shadow-xl"
              >
                {t("faq.cta.button")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
