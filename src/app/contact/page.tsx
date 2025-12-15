"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import PhoneInput from "@/components/ui/PhoneInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { useI18n } from "@/contexts/I18nContext";
import TextArea from "@/components/ui/TextArea";
import { Mail, MapPin, Clock, Briefcase, Send } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const { t } = useI18n();
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
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactCards: Array<{
    icon: any;
    title: string;
    items: Array<{ label: string; value: string; href?: string }>;
  }> = [
    {
      icon: Mail,
      title: t("contact.forTalents"),
      items: [
        {
          label: "Email",
          value: "support@allureagencys.com",
          href: "mailto:support@allureagencys.com",
        },
        {
          label: "Phone",
          value: "+971 52 342 9898",
          href: "tel:+971523429898",
        },
      ],
    },
    {
      icon: Briefcase,
      title: t("contact.forClients"),
      items: [
        {
          label: "Email",
          value: "info@allureagencys.com",
          href: "mailto:info@allureagencys.com",
        },
        { label: "UAE", value: "+971 58 180 0807", href: "tel:+971581800807" },
        { label: "Lebanon", value: "+961 3 727 908", href: "tel:+9613727908" },
      ],
    },
    {
      icon: MapPin,
      title: t("contact.address"),
      items: [
        { label: "", value: "Churchill Tower, Office 3411" },
        { label: "", value: "Business Bay - Dubai" },
        { label: "", value: "United Arab Emirates" },
      ],
    },
    {
      icon: Clock,
      title: t("contact.openingHours"),
      items: [
        { label: "", value: "Monday - Saturday" },
        { label: "", value: "09:00 - 18:00" },
      ],
    },
  ];

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

  return (
    <div className="bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -start-10 top-10 h-72 w-72 rounded-full bg-[#c49a47]/20 blur-3xl" />
          <div className="absolute -end-10 bottom-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>
        <div className="container relative mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white md:text-6xl">
              {t("contact.titlePart1")} <span className="text-[#c49a47]">{t("contact.titlePart2")}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              {t("contact.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Contact Form */}
          <div>
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                {t("contact.sendMessage")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" required>
                  {t("contact.fullName")}
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t("contact.namePlaceholder")}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" required>
                  {t("contact.emailAddress")}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("contact.emailPlaceholder")}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">{t("contact.phoneNumber")}</Label>
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
                  {t("contact.message")}
                </Label>
                <TextArea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder={t("contact.messagePlaceholder")}
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
                <Send className="me-2 h-5 w-5" />
                {t("contact.sendBtn")}
              </Button>
            </form>

            {/* Social Media */}
            <div className="mt-10 border-t border-gray-200 pt-10 dark:border-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Follow Us
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white transition-all hover:border-[#c49a47] hover:bg-[#c49a47] hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-[#c49a47]"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5 text-gray-600 transition-colors group-hover:text-white dark:text-gray-400 dark:group-hover:text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactCards.map((card, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="absolute end-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-linear-to-br from-[#c49a47]/10 to-[#d4a855]/10 blur-2xl transition-all group-hover:scale-150"></div>

                <div className="relative">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-[#c49a47] to-[#d4a855] shadow-lg">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                    {card.title}
                  </h3>

                  <div className="space-y-2">
                    {card.items.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="group/link flex items-start gap-2 text-gray-600 transition-colors hover:text-[#c49a47] dark:text-gray-400 dark:hover:text-[#d4a855]"
                          >
                            {item.label && (
                              <span className="min-w-[60px] text-sm font-medium">
                                {item.label}:
                              </span>
                            )}
                            <span className="text-sm">{item.value}</span>
                          </a>
                        ) : (
                          <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                            {item.label && (
                              <span className="min-w-[60px] text-sm font-medium">
                                {item.label}:
                              </span>
                            )}
                            <span className="text-sm">{item.value}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.566982937897!2d55.26242207605644!3d25.18622833168819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f69d4f8f0b4c3%3A0x3b8e9f7c8e7e3c3e!2sChurchill%20Tower%2C%20Business%20Bay%20-%20Dubai!5e0!3m2!1sen!2sae!4v1699999999999!5m2!1sen!2sae"
                width="100%"
                height="400"
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
    </div>
  );
}
