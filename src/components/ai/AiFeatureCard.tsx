"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  AudioLines,
  Bot,
  Camera,
  Gift,
  GitCompareArrows,
  MapPinCheck,
  MessageCircleQuestion,
  PackageX,
  Rocket,
  ShoppingBag,
  Star,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";
import type { AiFeature, AiFeatureIcon } from "@/config/aiTools";
import { openAssistant } from "@/lib/assistantEvents";

const icons: Record<AiFeatureIcon, LucideIcon> = {
  chat: Bot,
  compare: GitCompareArrows,
  reviews: Star,
  ask: MessageCircleQuestion,
  camera: Camera,
  foryou: WandSparkles,
  upgrade: Rocket,
  gift: Gift,
  bag: ShoppingBag,
  address: MapPinCheck,
  orders: PackageX,
  voice: AudioLines,
};

const cardClassName =
  "group flex h-full flex-col rounded-card border border-line-light bg-surface p-6 text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-float";

export default function AiFeatureCard({ feature, index }: { feature: AiFeature; index: number }) {
  const Icon = icons[feature.icon];
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-violet-500 text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
          <Icon size={26} />
        </span>
        <span className="text-[13px] font-semibold text-ink-subtle">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h2 className="mt-5 text-[19px] font-semibold text-ink">{feature.title}</h2>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">{feature.description}</p>
      <span className="mt-5 flex items-center gap-1 text-[14px] font-medium text-accent">
        Try it
        <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </>
  );

  return feature.href ? (
    <Link href={feature.href} className={cardClassName}>
      {content}
    </Link>
  ) : (
    <button type="button" onClick={() => openAssistant()} className={cardClassName}>
      {content}
    </button>
  );
}
