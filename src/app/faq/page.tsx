"use client";

import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import SurfaceCard from "@/components/ui/SurfaceCard";
import Accordion from "@/components/ui/Accordion";
import { useI18n } from "@/contexts/I18nContext";

export default function FAQPage() {
  const { t } = useI18n();

  const faqItems = [
    {
      question: t("faq.questions.q1.question"),
      answer: t("faq.questions.q1.answer"),
    },
    {
      question: t("faq.questions.q2.question"),
      answer: t("faq.questions.q2.answer"),
    },
    {
      question: t("faq.questions.q3.question"),
      answer: t("faq.questions.q3.answer"),
    },
    {
      question: t("faq.questions.q4.question"),
      answer: t("faq.questions.q4.answer"),
    },
    {
      question: t("faq.questions.q5.question"),
      answer: t("faq.questions.q5.answer"),
    },
    {
      question: t("faq.questions.q6.question"),
      answer: t("faq.questions.q6.answer"),
    },
    {
      question: t("faq.questions.q7.question"),
      answer: t("faq.questions.q7.answer"),
    },
    {
      question: t("faq.questions.q8.question"),
      answer: t("faq.questions.q8.answer"),
    },
  ];

  return (
    <div className="bg-white dark:bg-black">
      <div className="container mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">
        <SectionHeader
          align="center"
          eyebrow={t("faq.eyebrow")}
          title={t("faq.title")}
          description=""
        />

        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t("faq.subtitle")}{" "}
            <Link
              href="/contact"
              className="font-medium text-[#c49a47] hover:text-[#b08935] dark:text-[#d4a855] dark:hover:text-[#c49a47] transition-colors"
            >
              {t("faq.contactUs")}
            </Link>
          </p>
        </div>

        <SurfaceCard className="mt-12 p-8 lg:p-12">
          <Accordion items={faqItems} />
        </SurfaceCard>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black p-8 lg:p-12">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t("faq.stillHaveQuestions")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              {t("faq.weAreHereToHelp")}
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#c49a47] via-[#d4a855] to-[#c49a47] bg-size-200 bg-pos-0 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all duration-500 hover:bg-pos-100 hover:shadow-xl"
            >
              {t("faq.contactUs")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
