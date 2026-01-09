export default function ContactMap() {
  return (
    <div className="space-y-6">
      <div className="sticky top-16 overflow-hidden rounded-3xl border border-gray-100 shadow-xl">
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
  );
}
