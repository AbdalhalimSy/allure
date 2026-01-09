import ContactForm from "./ContactForm";
import ContactMap from "./ContactMap";

export default function ContactFormSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100 px-6 py-16 lg:px-12 lg:py-24">
      <div className="container mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ContactForm />
          <ContactMap />
        </div>
      </div>
    </section>
  );
}
