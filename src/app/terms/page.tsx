"use client";

import { useI18n } from "@/contexts/I18nContext";

export default function TermsPage() {
  const { t } = useI18n();

  const email = "info@allureagencys.com";
  const phone = "+971581546458";
  const website = "www.allureagencys.com";

  return (
    <main className="container mx-auto max-w-4xl px-6 py-12 lg:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("policies.terms.title")}
        </h1>
 <p className="mt-3 text-sm text-gray-600 ">
          {t("policies.terms.subtitle")}
        </p>
      </header>

 <section className="prose text-justify prose-gray max-w-none ">
        <p>{t("policies.terms.intro")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.acceptanceTitle")}
        </h2>
        <p>{t("policies.terms.acceptance")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.copyrightTitle")}
        </h2>
        <p>
          {
            t("policies.terms.copyright")
              .replace("{{email}}", "")
              .replace("{{phone}}", "")
              .split(", ")[0]
          }{" "}
          <a
            href={`mailto:${email}`}
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            {email}
          </a>
          ,{" "}
          <a
            href={`tel:${phone}`}
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            {phone}
          </a>
          .
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.ownershipTitle")}
        </h2>
        <p>{t("policies.terms.ownership")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.userAccountsTitle")}
        </h2>
        <p>{t("policies.terms.userAccountsP1")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.userContentTitle")}
        </h2>
        <p>{t("policies.terms.userContentP1")}</p>
        <p>{t("policies.terms.userContentP2")}</p>
        <p>{t("policies.terms.userContentP3")}</p>
        <p>
          {t("policies.terms.userContentP4").split("allureagencys.com")[0]}
          <a
            href={`https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            allureagencys.com
          </a>
          {
            t("policies.terms.userContentP4")
              .split("allureagencys.com")[1]
              ?.split("allureagencys.com")[0]
          }
          <a
            href={`https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            allureagencys.com
          </a>
          {t("policies.terms.userContentP4").split("allureagencys.com")[2]}
        </p>
        <p>
          {t("policies.terms.userContentP5").split("allureagencys.com")[0]}
          <a
            href={`https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            allureagencys.com
          </a>
          {
            t("policies.terms.userContentP5")
              .split("allureagencys.com")[1]
              ?.split("allureagencys.com")[0]
          }
          <a
            href={`https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            allureagencys.com
          </a>
          {t("policies.terms.userContentP5").split("allureagencys.com")[2]}
        </p>
        <p>{t("policies.terms.userContentP6")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.thirdPartyTitle")}
        </h2>
        <p>{t("policies.terms.thirdPartyP1")}</p>
        <p>{t("policies.terms.thirdPartyP2")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.subscriptionTitle")}
        </h2>
        <p>
          {t("policies.terms.subscription").split("allureagencys.com")[0]}
          <a
            href={`https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            allureagencys.com
          </a>
          {t("policies.terms.subscription").split("allureagencys.com")[1]}
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.feeRecoveryTitle")}
        </h2>
        <p>{t("policies.terms.feeRecovery")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.restrictedPermissionTitle")}
        </h2>
        <p>{t("policies.terms.restrictedPermissionIntro")}</p>
        <ul>
          <li>{t("policies.terms.restrictedPermissionItem1")}</li>
          <li>{t("policies.terms.restrictedPermissionItem2")}</li>
          <li>{t("policies.terms.restrictedPermissionItem3")}</li>
        </ul>
        <p>{t("policies.terms.restrictedPermissionP1")}</p>
        <p>{t("policies.terms.restrictedPermissionP2")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.usageRestrictionsTitle")}
        </h2>
        <p>{t("policies.terms.usageRestrictionsIntro")}</p>
        <ul>
          <li>{t("policies.terms.usageRestrictionsItem1")}</li>
          <li>{t("policies.terms.usageRestrictionsItem2")}</li>
          <li>{t("policies.terms.usageRestrictionsItem3")}</li>
          <li>{t("policies.terms.usageRestrictionsItem4")}</li>
          <li>{t("policies.terms.usageRestrictionsItem5")}</li>
          <li>{t("policies.terms.usageRestrictionsItem6")}</li>
          <li>{t("policies.terms.usageRestrictionsItem7")}</li>
          <li>{t("policies.terms.usageRestrictionsItem8")}</li>
          <li>{t("policies.terms.usageRestrictionsItem9")}</li>
          <li>{t("policies.terms.usageRestrictionsItem10")}</li>
          <li>{t("policies.terms.usageRestrictionsItem11")}</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.warrantyTitle")}
        </h2>
        <p>{t("policies.terms.warrantyIntro")}</p>
        <ul>
          <li>{t("policies.terms.warrantyItem1")}</li>
          <li>{t("policies.terms.warrantyItem2")}</li>
          <li>{t("policies.terms.warrantyItem3")}</li>
          <li>{t("policies.terms.warrantyItem4")}</li>
          <li>{t("policies.terms.warrantyItem5")}</li>
        </ul>
        <p>{t("policies.terms.warrantyOutro")}</p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.liabilitiesTitle")}
        </h2>
        <p>
          {t("policies.terms.liabilities").split("allureagencys.com")[0]}
          <a
            href={`https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#c49a47] underline hover:text-[#d4a855]"
          >
            allureagencys.com
          </a>
          {t("policies.terms.liabilities").split("allureagencys.com")[1]}
        </p>

        <h2 className="mt-10 text-2xl font-semibold text-[#c49a47]">
          {t("policies.terms.agreementTitle")}
        </h2>
        <p>{t("policies.terms.agreement")}</p>
      </section>
    </main>
  );
}
