import Link from "next/link";
import { siteConfig } from "@/config/site";
import { formatLongDate } from "@/lib/format";
import type { LegalDocument } from "@/data/pages/legalData";
import PageHero from "../PageHero";

interface LegalDocumentViewProps {
  document: LegalDocument;
  relatedDocuments: LegalDocument[];
}

export default function LegalDocumentView({ document, relatedDocuments }: LegalDocumentViewProps) {
  return (
    <>
      <PageHero eyebrow="Legal" title={document.title} description={document.summary}>
        <p className="mt-6 text-[14px] text-ink-subtle">Last updated {formatLongDate(siteConfig.legalUpdatedAt)}</p>
      </PageHero>

      <div className="bg-surface-muted pb-20 md:pb-28">
        <div className="mx-auto grid max-w-[1100px] gap-10 px-4 sm:px-6 lg:grid-cols-[240px_1fr] lg:gap-16 lg:px-8">
          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-[100px]">
              <p className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-ink-subtle">On this page</p>
              <ul className="flex flex-col gap-3 border-l border-line pl-4 text-[14px]">
                {document.sections.map(({ id, heading }) => (
                  <li key={id}>
                    <a href={`#${id}`} className="text-ink-muted transition-colors hover:text-ink">
                      {heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div>
            <article className="divide-y divide-line-light rounded-[28px] border border-line-light bg-surface px-6 shadow-soft sm:px-10 md:px-14">
              {document.sections.map(({ id, heading, paragraphs }, index) => (
                <section key={id} id={id} className="scroll-mt-28 py-10 md:py-12">
                  <h2 className="text-[24px] font-semibold tracking-tight text-ink">
                    <span className="mr-3 text-ink-subtle">{String(index + 1).padStart(2, "0")}</span>
                    {heading}
                  </h2>
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-4 text-[17px] leading-relaxed text-ink-muted">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </article>

            <nav aria-label="Other policies" className="mt-8 flex flex-wrap gap-2">
              {relatedDocuments.map(({ slug, title }) => (
                <Link
                  key={slug}
                  href={`/pages/${slug}`}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-[14px] text-ink transition-colors hover:border-ink"
                >
                  {title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
