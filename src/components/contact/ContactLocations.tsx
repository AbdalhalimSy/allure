import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

type Location = {
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
};

export default function ContactLocations() {
  const { t } = useI18n();

  const locations: Location[] = [
    {
      name: t("contact.locations.dubai.name"),
      address: t("contact.locations.dubai.address"),
      phone: t("contact.locations.dubai.phone"),
      email: t("contact.locations.dubai.email"),
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: t("contact.locations.riyadh.name"),
      address: t("contact.locations.riyadh.address"),
      phone: t("contact.locations.riyadh.phone"),
      email: t("contact.locations.riyadh.email"),
      image:
        "https://images.unsplash.com/photo-1506795213373-430e921fe2ed?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: t("contact.locations.lebanon.name"),
      address: t("contact.locations.lebanon.address"),
      phone: t("contact.locations.lebanon.phone"),
      email: t("contact.locations.lebanon.email"),
      image:
        "https://images.unsplash.com/photo-1496823407868-80f47c7453b5?q=80&w=2413&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <section className="px-6 py-16 lg:px-12 lg:py-24">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.12)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary ">
            {t("contact.locations.badge")}
          </p>
          <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            {t("contact.locations.title")}
          </h2>
          <p className="text-lg text-gray-600 ">
            {t("contact.locations.subtitle")}
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {locations.map((location, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition hover:shadow-xl "
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover transition group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 start-6">
                  <h3 className="text-xl font-bold text-white">
                    {location.name}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 p-6">
                <div className="flex items-start gap-3 text-sm text-gray-600 ">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{location.address}</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600 ">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <a
                    dir="ltr"
                    href={`tel:${location.phone.replace(/\s/g, "")}`}
                    className="hover:text-primary"
                  >
                    {location.phone}
                  </a>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-600 ">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <a
                    href={`mailto:${location.email}`}
                    className="hover:text-primary"
                  >
                    {location.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
