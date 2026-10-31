import type { Metadata } from "next";
import AiToolShell from "@/components/ai/AiToolShell";
import UpgradeAdvisor from "@/components/ai/UpgradeAdvisor";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Upgrade Advisor | ${siteConfig.name}`,
};

export default function UpgradeAdvisorPage() {
  return (
    <AiToolShell
      title="Is it time to upgrade?"
      description="Tell us what you use today and what matters to you. AI compares it with our latest models and gives you an honest answer."
    >
      <UpgradeAdvisor />
    </AiToolShell>
  );
}
