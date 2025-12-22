import { useI18n } from "@/contexts/I18nContext";
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook } from "react-icons/fa";

const CURRENT_YEAR = new Intl.DateTimeFormat("en", {
  timeZone: "UTC",
  year: "numeric",
}).format(new Date());

export default function Footer() {
  const { t } = useI18n();
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/allureagency",
      icon: FaInstagram,
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@allureagency",
      icon: FaTiktok,
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@AllureMediaAgency",
      icon: FaYoutube,
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/Allureagency1",
      icon: FaFacebook,
    },
  ];

  const quickLinks = [
    { name: t("nav.home") || "Home", href: "/" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.talents"), href: "/talents" },
    { name: t("nav.jobs"), href: "/jobs" },
    { name: t("nav.faq"), href: "/faq" },
    { name: t("nav.contact"), href: "/contact" },
    { name: t("nav.terms") || "Terms", href: "/terms" },
    { name: t("nav.privacy") || "Privacy", href: "/privacy" },
  ];

  return (
    <footer className="w-full border-t border-[#c49a47]/30 bg-gray-50 py-12 shadow-inner dark:border-[#c49a47]/20 dark:bg-gray-950">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8" suppressHydrationWarning>
        <div className="flex flex-col items-center gap-8" suppressHydrationWarning>
          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-gray-600 transition-colors hover:text-[#c49a47] dark:text-gray-400 dark:hover:text-[#c49a47]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-6" suppressHydrationWarning>
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors hover:text-[#c49a47] dark:text-gray-400 dark:hover:text-[#c49a47]"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; <span suppressHydrationWarning>{CURRENT_YEAR}</span>{" "}
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
