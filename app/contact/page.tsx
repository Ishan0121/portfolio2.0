import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import { SocialLinks } from "@/components/social-links";

export default function ContactPage() {
  return (
    <>
      <div className="h-16" />
      <section className="container py-12 sm:py-12 ">
        <SectionHeading
          title="Get in Touch"
          description="Have a question or want to work together? Feel free to reach out!"
        />
        <div className="mx-auto max-w-2xl grid gap-8 md:grid-cols-2 glass p-7 rounded-md">
          <div>
            <h3 className="text-lg font-semibold mb-4">Send a Message</h3>
            <ContactForm />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Me</h3>
            <SocialLinks />
          </div>
        </div>
      </section>
    </>
  );
}