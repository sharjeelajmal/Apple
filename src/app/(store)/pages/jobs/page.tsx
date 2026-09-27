import type { Metadata } from "next";
import CtaBanner from "@/components/pages/Static/CtaBanner";
import FeatureGrid from "@/components/pages/Static/FeatureGrid";
import JobList from "@/components/pages/Static/Jobs/JobList";
import PageHero from "@/components/pages/Static/PageHero";
import SectionHeading from "@/components/pages/Static/SectionHeading";
import { siteConfig } from "@/config/site";
import { jobOpenings, jobPerks } from "@/data/pages/jobsData";

export const metadata: Metadata = {
  title: `Jobs | ${siteConfig.name}`,
  description: `Join the ${siteConfig.name} team and help people discover technology they love.`,
};

export default function JobsPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Do the best work of your life."
        description="Join a team that's passionate about technology, obsessed with detail, and dedicated to our customers."
      />

      <div className="bg-surface-muted">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-20 px-4 pb-20 sm:px-6 md:gap-28 md:pb-28 lg:px-8">
          <section>
            <SectionHeading title="Why you'll love it here." />
            <FeatureGrid features={jobPerks} />
          </section>

          <section id="openings" className="mx-auto w-full max-w-[900px] scroll-mt-28">
            <SectionHeading
              title="Open positions."
              description={`${jobOpenings.length} roles open across our store and remote teams.`}
            />
            <JobList jobs={jobOpenings} />
          </section>
        </div>

        <CtaBanner
          title="Don't see your role?"
          description="We're always looking for great people. Send us your resume and tell us what you'd love to do."
          actionLabel="Get in Touch"
          actionHref={`mailto:${siteConfig.contact.careersEmail}`}
        />
      </div>
    </>
  );
}
