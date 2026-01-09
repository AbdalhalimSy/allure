"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import PhoneInput from "@/components/ui/PhoneInput";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import { useI18n } from "@/contexts/I18nContext";
import TextArea from "@/components/ui/TextArea";
import { Send } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaFacebook } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function ContactForm() {
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
      toast.success(t("contact.form.success"));
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
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

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/allureagency",
      icon: FaInstagram,
      color:
        "hover:bg-linear-to-r hover:from-purple-500 hover:via-pink-500 hover:to-red-500",
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
    <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl lg:p-10">
      <div className="mb-8">
        <h2 className="mb-3 text-3xl font-bold text-gray-900 ">
          {t("contact.form.title")}
        </h2>
        <p className="text-gray-600 ">{t("contact.form.subtitle")}</p>
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
          {!isLoading && <Send className="h-5 w-5 rtl:ms-2 ltr:me-2" />}
          {isLoading ? t("contact.form.sending") : t("contact.form.submit")}
        </Button>
      </form>

      {/* Social Media */}
      <div className="mt-10 border-t border-gray-200 pt-10 ">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 ">
          {t("contact.social.title")}
        </h3>
        <p className="mb-6 text-sm text-gray-600 ">
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
                className={`group flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-white transition-all hover:scale-110 hover:border-transparent hover:shadow-lg ${social.color}`}
                aria-label={social.name}
              >
                <Icon className="h-5 w-5 text-gray-600 transition-colors group-hover:text-white " />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
