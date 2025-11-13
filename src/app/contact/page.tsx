"use client";

import { useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Input from "@/components/ui/Input";
import PhoneInput from "@/components/ui/PhoneInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import SurfaceCard from "@/components/ui/SurfaceCard";
import { useI18n } from "@/contexts/I18nContext";
import TextArea from "@/components/ui/TextArea";

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
    // Add your contact form logic here
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white dark:bg-black">
      <div className="container mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <SectionHeader
          align="center"
          eyebrow={t("contact.eyebrow")}
          title={t("contact.title")}
          description={t("contact.description")}
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <SurfaceCard className="p-8">
            <h3 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">{t("contact.sendMessage")}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" required>
                  {t("contact.fullName")}
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
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
                  placeholder="you@example.com"
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
                  onChange={(value, countryCode) => {
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
                  rows={5}
                  placeholder="Tell us about your inquiry..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                {t("contact.sendBtn")}
              </Button>
            </form>
          </SurfaceCard>

          {/* Contact Info */}
          <div className="space-y-8">
            <SurfaceCard className="p-8">
              <h3 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">{t("contact.contactInfo")}</h3>

              <div className="space-y-6">
                {/* Address */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-[#c49a47]"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t("contact.address")}</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Churchill Tower, Office Number 3411
                    <br />
                    Business Bay - Dubai
                    <br />
                    United Arab Emirates
                  </p>
                </div>

                {/* Opening Hours */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-[#c49a47]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t("contact.openingHours")}</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monday - Saturday: 09:00 - 18:00</p>
                </div>

                {/* For Talents */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-[#c49a47]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t("contact.forTalents")}</h4>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <a href="mailto:support@allureagencys.com" className="hover:text-[#c49a47]">
                        support@allureagencys.com
                      </a>
                    </p>
                    <p>
                      <a href="tel:+971523429898" className="hover:text-[#c49a47]">
                        Phone: +971 52 342 9898
                      </a>
                    </p>
                  </div>
                </div>

                {/* For Clients */}
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-[#c49a47]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                      />
                    </svg>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t("contact.forClients")}</h4>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      <a href="mailto:info@allureagencys.com" className="hover:text-[#c49a47]">
                        info@allureagencys.com
                      </a>
                    </p>
                    <p>
                      <a href="tel:+971581800807" className="hover:text-[#c49a47]">
                        UAE: +971 58 180 0807
                      </a>
                    </p>
                    <p>
                      <a href="tel:+9613727908" className="hover:text-[#c49a47]">
                        Lebanon: +961 3 727 908
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </SurfaceCard>

            {/* Map */}
            <SurfaceCard className="overflow-hidden p-0">
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
            </SurfaceCard>
          </div>
        </div>
      </div>
    </div>
  );
}
