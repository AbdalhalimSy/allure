"use client";

import {
  ContactHero,
  ContactInfoCards,
  ContactFormSection,
  ContactLocations,
} from "@/components/contact";

export default function ContactPage() {
  return (
    <div className="bg-white">
      <ContactHero />
      <ContactInfoCards />
      <ContactFormSection />
      <ContactLocations />
    </div>
  );
}
