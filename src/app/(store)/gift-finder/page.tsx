import type { Metadata } from "next";
import AiToolShell from "@/components/ai/AiToolShell";
import GiftFinder from "@/components/ai/GiftFinder";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Gift Finder | ${siteConfig.name}`,
};

export default function GiftFinderPage() {
  return (
    <AiToolShell
      title="Find the perfect gift"
      description="Pick who it's for, the occasion and your budget. AI suggests the Apple gifts they'll love most."
    >
      <GiftFinder />
    </AiToolShell>
  );
}
