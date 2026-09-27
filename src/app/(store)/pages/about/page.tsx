import type { Metadata } from "next";
import AboutStats from "@/components/pages/Static/About/AboutStats";
import AboutStory from "@/components/pages/Static/About/AboutStory";
import AboutTimeline from "@/components/pages/Static/About/AboutTimeline";
import CtaBanner from "@/components/pages/Static/CtaBanner";
import FeatureGrid from "@/components/pages/Static/FeatureGrid";
import PageHero from "@/components/pages/Static/PageHero";
import SectionHeading from "@/components/pages/Static/SectionHeading";
import { siteConfig } from "@/config/site";
import { aboutStats, aboutValues, milestones } from "@/data/pages/aboutData";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.name}`,
  description: `Learn the story behind ${siteConfig.name} and the values that guide everything we do.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Made for people who love great design."
        description={`For over a decade, ${siteConfig.name} has been bringing the best of Apple to customers who expect more.`}
      />

      <div className="bg-surface-muted">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-20 px-4 pb-20 sm:px-6 md:gap-28 md:pb-28 lg:px-8">
          <AboutStats stats={aboutStats} />
          <AboutStory />
          <section>
            <SectionHeading
              title="What we stand for."
              description="Four promises we keep with every customer, every order, every day."
            />
            <FeatureGrid features={aboutValues} />
          </section>
          <section>
            <SectionHeading title="Our journey." />
            <AboutTimeline milestones={milestones} />
          </section>
        </div>

        <CtaBanner
          title="Find your next favorite device."
          description="Explore the latest iPhone, Mac, iPad, and more, with free delivery on every order."
          actionLabel="Shop Now"
          actionHref="/collections/all"
        />
      </div>
    </>
  );
}
