import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalDocumentView from "@/components/pages/Static/Legal/LegalDocumentView";
import { siteConfig } from "@/config/site";
import { getLegalDocument, legalDocuments } from "@/data/pages/legalData";

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocuments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/pages/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const document = getLegalDocument(slug);

  return document
    ? { title: `${document.title} | ${siteConfig.name}`, description: document.summary }
    : {};
}

export default async function LegalPage({ params }: PageProps<"/pages/[slug]">) {
  const { slug } = await params;
  const document = getLegalDocument(slug);

  if (!document) {
    notFound();
  }

  const relatedDocuments = legalDocuments.filter((item) => item.slug !== slug);

  return <LegalDocumentView document={document} relatedDocuments={relatedDocuments} />;
}
