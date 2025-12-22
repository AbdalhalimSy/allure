"use client";

import { useI18n } from "@/contexts/I18nContext";

export default function PrivacyPolicyPage() {
  const { t } = useI18n();

  const supportEmail = "support@allureagencys.com";
  const naiUrl = "https://www.networkadvertising.org";

  return (
    <main className="container mx-auto max-w-4xl px-6 py-12 lg:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("policies.privacy.title")}
        </h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {t("policies.privacy.updated")}
        </p>
      </header>

      <section className="prose text-justify prose-gray max-w-none dark:prose-invert">
        <p>{t("policies.privacy.intro")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.privacy.infoTitle")}
        </h2>

        <h3 className="mt-6 text-xl font-semibold text-[#c49a47]">
          {t("policies.privacy.nonPIITitle")}
        </h3>
        <p>{t("policies.privacy.nonPII_p1")}</p>
        <p>{t("policies.privacy.nonPII_p2")}</p>
        <p>{t("policies.privacy.nonPII_p3")}</p>
        <p>
          {t("policies.privacy.nonPII_p4").split("www.networkadvertising.org")[0]}
          <a
            href={naiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            www.networkadvertising.org
          </a>
          {t("policies.privacy.nonPII_p4").split("www.networkadvertising.org")[1]}
        </p>

        <h3 className="mt-6 text-xl font-semibold text-[#c49a47]">
          {t("policies.privacy.piiTitle")}
        </h3>
        <p>{t("policies.privacy.pii_p1")}</p>
        <p>{t("policies.privacy.pii_p2")}</p>
        <p>{t("policies.privacy.pii_p3")}</p>
        <p>
          {t("policies.privacy.pii_p4").split("support@allureagencys.com")[0]}
          <a
            href={`mailto:${supportEmail}`}
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            {supportEmail}
          </a>
          {t("policies.privacy.pii_p4").split("support@allureagencys.com")[1]}
        </p>
        <p>{t("policies.privacy.pii_p5")}</p>
        <p>{t("policies.privacy.pii_p6")}</p>
        <p>{t("policies.privacy.pii_p7")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.privacy.dataSecurityTitle")}
        </h2>
        <p>{t("policies.privacy.dataSecurity_p1")}</p>
        <p>{t("policies.privacy.dataSecurity_p2")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.privacy.under18Title")}
        </h2>
        <h3 className="mt-4 text-xl font-semibold text-[#c49a47]">
          {t("policies.privacy.parentConsentTitle")}
        </h3>
        <p>{t("policies.privacy.parentConsent_p1")}</p>
        <h3 className="mt-4 text-xl font-semibold text-[#c49a47]">
          {t("policies.privacy.accessChildTitle")}
        </h3>
        <p>{t("policies.privacy.accessChild_p1")}</p>
        <p>
          {t("policies.privacy.accessChild_p2").split("support@allureagencys.com")[0]}
          <a
            href={`mailto:${supportEmail}`}
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            {supportEmail}
          </a>
          {t("policies.privacy.accessChild_p2").split("support@allureagencys.com")[1]}
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.privacy.accessTitle")}
        </h2>
        <p>
          {t("policies.privacy.access_p1").split("support@allureagencys.com")[0]}
          <a
            href={`mailto:${supportEmail}`}
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            {supportEmail}
          </a>
          {t("policies.privacy.access_p1").split("support@allureagencys.com")[1]}
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.privacy.linksTitle")}
        </h2>
        <p>{t("policies.privacy.links_p1")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.privacy.changesTitle")}
        </h2>
        <p>{t("policies.privacy.changes_p1")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.privacy.securityTitle")}
        </h2>
        <p>{t("policies.privacy.security_p1")}</p>
      </section>
    </main>
  );
}
