import type { Metadata } from "next";
import Link from "next/link";
import ContactChannels from "@/components/pages/Static/Contact/ContactChannels";
import ContactForm from "@/components/pages/Static/Contact/ContactForm";
import PageHero from "@/components/pages/Static/PageHero";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description: "Questions about an order or a product? Our team is here to help.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="We're here to help."
        description="Questions about a product, an order, or anything else? Send us a message and we'll reply within one business day."
      />

      <div className="bg-surface-muted pb-20 md:pb-28">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_380px] lg:gap-12 lg:px-8">
          <section className="rounded-[28px] border border-line-light bg-surface p-6 shadow-soft sm:p-10">
            <h2 className="text-[28px] font-semibold tracking-tight text-ink">Send us a message</h2>
            <p className="mb-8 mt-2 text-[15px] text-ink-muted">
              Looking for a quick answer? Check our{" "}
              <Link href="/pages/faq" className="text-hyperlink hover:underline">
                FAQ
              </Link>
              .
            </p>
            <ContactForm />
          </section>

          <aside>
            <ContactChannels />
          </aside>
        </div>
      </div>
    </>
  );
}
