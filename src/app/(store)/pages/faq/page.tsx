import type { Metadata } from "next";
import CtaBanner from "@/components/pages/Static/CtaBanner";
import FaqAccordion from "@/components/pages/Static/Faq/FaqAccordion";
import PageHero from "@/components/pages/Static/PageHero";
import { siteConfig } from "@/config/site";
import { faqCategories } from "@/data/pages/faqData";

export const metadata: Metadata = {
  title: `FAQ | ${siteConfig.name}`,
  description: "Answers to common questions about orders, shipping, returns, and products.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions."
        description="Everything you need to know about ordering, delivery, returns, and your products."
      >
        <nav aria-label="FAQ categories" className="mt-10 flex flex-wrap justify-center gap-2">
          {faqCategories.map(({ id, title }) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full border border-line bg-surface px-4 py-2 text-[14px] text-ink transition-colors hover:border-ink"
            >
              {title}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="bg-surface-muted">
        <div className="mx-auto flex max-w-[860px] flex-col gap-14 px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
          {faqCategories.map(({ id, title, items }) => (
            <section key={id} id={id} className="scroll-mt-28">
              <h2 className="mb-5 text-[24px] font-semibold tracking-tight text-ink md:text-[28px]">{title}</h2>
              <FaqAccordion items={items} />
            </section>
          ))}
        </div>

        <CtaBanner
          title="Still have questions?"
          description="Our specialists are ready to help with anything you need."
          actionLabel="Contact Us"
          actionHref="/pages/contact"
        />
      </div>
    </>
  );
}
