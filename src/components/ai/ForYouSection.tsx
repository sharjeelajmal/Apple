"use client";

import { useEffect, useMemo, useState } from "react";
import { getPersonalRecommendations, type AiPick } from "@/actions/aiActions";
import useRecentlyViewed from "@/hooks/useRecentlyViewed";
import AiBadge from "./AiBadge";
import AiLoading from "./AiLoading";
import AiPickGrid from "./AiPickGrid";

type Recommendations = { headline: string; picks: AiPick[] };

type ForYouSectionProps = {
  variant?: "home" | "account";
};

export default function ForYouSection({ variant = "home" }: ForYouSectionProps) {
  const recentlyViewed = useRecentlyViewed();
  const handlesKey = useMemo(() => recentlyViewed.map((item) => item.handle).join(","), [recentlyViewed]);
  const [result, setResult] = useState<{ key: string; data: Recommendations | null } | null>(null);

  useEffect(() => {
    let isCurrent = true;
    getPersonalRecommendations(handlesKey ? handlesKey.split(",") : []).then((response) => {
      if (isCurrent) setResult({ key: handlesKey, data: response.data ?? null });
    });
    return () => {
      isCurrent = false;
    };
  }, [handlesKey]);

  const isLoading = result?.key !== handlesKey;
  const recommendations = result?.data;
  if (!isLoading && !recommendations?.picks.length) return null;

  const isHome = variant === "home";

  return (
    <section
      aria-label="Recommended for you"
      className={isHome ? "mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8" : "rounded-card border border-line-light bg-surface p-5 md:p-6"}
    >
      <div className={`mb-8 flex flex-col gap-3 ${isHome ? "items-center text-center" : ""}`}>
        <AiBadge label="Picked for you by AI" />
        <h2 className={`font-semibold tracking-tight text-ink ${isHome ? "text-[32px] md:text-[40px]" : "text-[21px]"}`}>
          {recommendations?.headline ?? "Finding products you'll love"}
        </h2>
      </div>
      {isLoading || !recommendations ? (
        <AiLoading message="Looking at what you've viewed and bought…" />
      ) : (
        <AiPickGrid picks={recommendations.picks} />
      )}
    </section>
  );
}
