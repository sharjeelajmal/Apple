import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function AboutStory() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-surface-muted">
        <Image
          src="/images/promo/promo_macbook_pro.jpg"
          alt={`Inside the ${siteConfig.name} store`}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
      </div>
      <div>
        <h2 className="text-[32px] font-semibold tracking-tight text-ink md:text-[44px]">
          Technology, with a personal touch.
        </h2>
        <div className="mt-6 flex flex-col gap-4 text-[17px] leading-relaxed text-ink-muted">
          <p>
            {siteConfig.name} started with a simple belief: buying the products you love should feel as
            thoughtful as the products themselves.
          </p>
          <p>
            Today we help hundreds of thousands of customers find the right iPhone, Mac, iPad, and
            accessories, backed by expert advice, fast delivery, and support that doesn&apos;t end at
            checkout.
          </p>
        </div>
      </div>
    </div>
  );
}
