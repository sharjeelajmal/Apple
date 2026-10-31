import type { Metadata } from "next";
import AiFeatureCard from "@/components/ai/AiFeatureCard";
import AiToolShell from "@/components/ai/AiToolShell";
import { aiFeatures } from "@/config/aiTools";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `AI Features | ${siteConfig.name}`,
  description: "Every AI-powered shopping tool in one place.",
};

export default function AiFeaturesPage() {
  return (
    <AiToolShell
      title="Shopping, made smarter with AI"
      description="Compare, choose, check out and get help in your own language. Every AI tool in our store, in one place."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {aiFeatures.map((feature, index) => (
          <AiFeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
    </AiToolShell>
  );
}
