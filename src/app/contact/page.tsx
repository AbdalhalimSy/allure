"use client";

import { useState } from "react";
import Image from "next/image";
import Input from "@/components/ui/Input";
import PhoneInput from "@/components/ui/PhoneInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { useI18n } from "@/contexts/I18nContext";
import TextArea from "@/components/ui/TextArea";
import {
  Mail,
  MapPin,
  Clock,
  Briefcase,
  Send,
  Users,
  Phone,
  MessageSquare,
} from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const { t, locale } = useI18n();
  const isRTL = locale === "ar";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add your contact form logic here
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(t("contact.form.success"));
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error(t("contact.form.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Users,
      title: t("contact.info.talents.title"),
      description: t("contact.info.talents.description"),
      items: [
        {
          icon: Mail,
          label: "Email",
          value: t("contact.info.talents.email"),
          href: `mailto:${t("contact.info.talents.email")}`,
        },
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

  const locations = [
    {
      name: t("contact.locations.dubai.name"),
      address: t("contact.locations.dubai.address"),
      phone: t("contact.locations.dubai.phone"),
      email: t("contact.locations.dubai.email"),
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: t("contact.locations.abuDhabi.name"),
      address: t("contact.locations.abuDhabi.address"),
      phone: t("contact.locations.abuDhabi.phone"),
      email: t("contact.locations.abuDhabi.email"),
      image:
        "https://images.unsplash.com/photo-1624317937315-0ced8736c9e9?q=80&w=2402&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/allureagency",
      icon: FaInstagram,
      color:
        "hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-red-500",
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@allureagency",
      icon: FaTiktok,
      color: "hover:bg-black",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/@AllureMediaAgency",
      icon: FaYoutube,
      color: "hover:bg-red-600",
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/Allureagency1",
      icon: FaFacebook,
      color: "hover:bg-blue-600",
    },
  ];

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[rgba(196,154,71,0.05)] via-white to-emerald-50 dark:from-gray-950 dark:via-black dark:to-gray-950">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -start-10 top-10 h-96 w-96 rounded-full bg-[rgba(196,154,71,0.15)] blur-3xl" />
          <div className="absolute -end-10 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.12)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary dark:bg-[rgba(196,154,71,0.15)] dark:text-primary">
              <MessageSquare className="h-4 w-4" />
              {t("contact.hero.badge")}
            </p>

            {/* Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t("contact.hero.title")}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
              {t("contact.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-gray-900"
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
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {info.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {info.description}
                    </p>
                    <div className="space-y-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                      {info.items.map((item, itemIndex) => {
                        const ItemIcon = item.icon;
                        const hasHref = "href" in item && item.href;
                        return (
                          <div key={itemIndex}>
                            {hasHref ? (
                              <a
                                href={item.href}
                                className="flex items-start gap-2 text-sm text-gray-600 transition hover:text-primary dark:text-gray-400 dark:hover:text-primary "
                              >
                                <ItemIcon className="mt-0.5 h-4 w-4 shrink-0" />
                                <span dir="ltr">{item.value}</span>
                              </a>
                            ) : (
                              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
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

      {/* Form and Map Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100 px-6 py-16 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 lg:px-12 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Contact Form */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-gray-900 lg:p-10">
              <div className="mb-8">
                <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">
                  {t("contact.form.title")}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t("contact.form.subtitle")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" required>
                    {t("contact.form.name.label")}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t("contact.form.name.placeholder")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" required>
                    {t("contact.form.email.label")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("contact.form.email.placeholder")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t("contact.form.phone.label")}</Label>
                  <PhoneInput
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(value) => {
                      setFormData({ ...formData, phone: value });
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="message" required>
                    {t("contact.form.message.label")}
                  </Label>
                  <TextArea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder={t("contact.form.message.placeholder")}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                >
                  {!isLoading && (
                    <Send className={`h-5 w-5 ${isRTL ? "ms-2" : "me-2"}`} />
                  )}
                  {isLoading
                    ? t("contact.form.sending")
                    : t("contact.form.submit")}
                </Button>
              </form>

              {/* Social Media */}
              <div className="mt-10 border-t border-gray-200 pt-10 dark:border-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {t("contact.social.title")}
                </h3>
                <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                  {t("contact.social.subtitle")}
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white transition-all hover:scale-110 hover:border-transparent hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 ${social.color}`}
                        aria-label={social.name}
                      >
                        <Icon className="h-5 w-5 text-gray-600 transition-colors group-hover:text-white dark:text-gray-400" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-xl dark:border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.566982937897!2d55.26242207605644!3d25.18622833168819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69d4f8f0b4c3%3A0x3b8e9f7c8e7e3c3e!2sChurchill%20Tower%2C%20Business%20Bay%20-%20Dubai!5e0!3m2!1sen!2sae!4v1699999999999!5m2!1sen!2sae"
                  width="100%"
                  height="500"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="px-6 py-16 lg:px-12 lg:py-24">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-[rgba(196,154,71,0.12)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-primary dark:bg-[rgba(196,154,71,0.15)] dark:text-primary">
              {t("contact.locations.badge")}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
              {t("contact.locations.title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t("contact.locations.subtitle")}
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {locations.map((location, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg transition hover:shadow-xl dark:border-white/10 dark:bg-gray-900"
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
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <a
                      dir="ltr"
                      href={`tel:${location.phone.replace(/\s/g, "")}`}
                      className="hover:text-primary"
                    >
                      {location.phone}
                    </a>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
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
    </div>
  );
}
