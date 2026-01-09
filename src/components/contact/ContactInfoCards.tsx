import { Mail, MapPin, Clock, Briefcase, Users, Phone } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

type ContactItem = {
  icon: any;
  label: string;
  value: string;
  href?: string;
};

type ContactInfo = {
  icon: any;
  title: string;
  description: string;
  items: ContactItem[];
  color: string;
};

export default function ContactInfoCards() {
  const { t } = useI18n();

  const contactInfo: ContactInfo[] = [
    {
      icon: Users,
      title: t("contact.info.talents.title"),
      description: t("contact.info.talents.description"),
      items: [
        {
          icon: Phone,
          label: "Phone",
          value: t("contact.info.talents.phone"),
          href: `tel:${t("contact.info.talents.phone").replace(/\s/g, "")}`,
        },
      ],
      color: "from-emerald-400 to-teal-500",
    },
    {
      icon: Briefcase,
      title: t("contact.info.clients.title"),
      description: t("contact.info.clients.description"),
      items: [
        {
          icon: Mail,
          label: "Email",
          value: t("contact.info.clients.email"),
          href: `mailto:${t("contact.info.clients.email")}`,
        },
        {
          icon: Phone,
          label: "UAE",
          value: t("contact.info.clients.uae"),
          href: `tel:${t("contact.info.clients.uae").replace(/\s/g, "")}`,
        },
        {
          icon: Phone,
          label: "Lebanon",
          value: t("contact.info.clients.lebanon"),
          href: `tel:${t("contact.info.clients.lebanon").replace(/\s/g, "")}`,
        },
      ],
      color: "from-sky-400 to-blue-600",
    },
    {
      icon: MapPin,
      title: t("contact.info.address.title"),
      description: t("contact.info.address.description"),
      items: [
        { icon: MapPin, label: "", value: t("contact.info.address.line1") },
        { icon: MapPin, label: "", value: t("contact.info.address.line2") },
        { icon: MapPin, label: "", value: t("contact.info.address.line3") },
      ],
      color: "from-primary to-[#a57b30]",
    },
    {
      icon: Clock,
      title: t("contact.info.hours.title"),
      description: t("contact.info.hours.description"),
      items: [
        { icon: Clock, label: "", value: t("contact.info.hours.days") },
        { icon: Clock, label: "", value: t("contact.info.hours.time") },
      ],
      color: "from-purple-400 to-pink-500",
    },
  ];

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="container mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl "
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${info.color} opacity-0 transition group-hover:opacity-5`}
                />

                <div className="relative space-y-4">
                  <div
                    className={`inline-flex rounded-2xl bg-linear-to-br ${info.color} p-3 text-white shadow-lg`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 ">
                    {info.title}
                  </h3>
                  <p className="text-sm text-gray-600 ">{info.description}</p>
                  <div className="space-y-2 border-t border-gray-100 pt-4 ">
                    {info.items.map((item, itemIndex) => {
                      const ItemIcon = item.icon;
                      const hasHref = "href" in item && item.href;
                      return (
                        <div key={itemIndex}>
                          {hasHref ? (
                            <a
                              href={item.href}
                              className="flex items-start gap-2 text-sm text-gray-600 transition hover:text-primary "
                            >
                              <ItemIcon className="mt-0.5 h-4 w-4 shrink-0" />
                              <span dir="ltr">{item.value}</span>
                            </a>
                          ) : (
                            <div className="flex items-start gap-2 text-sm text-gray-600 ">
                              <ItemIcon className="mt-0.5 h-4 w-4 shrink-0 opacity-0" />
                              <span>{item.value}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
