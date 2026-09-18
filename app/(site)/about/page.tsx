import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SectionType } from "@prisma/client";
import { getSiteSettings } from "@/lib/data/settings";
import { getWhyChooseUsFeatures, getTeamMembers, getStatistics } from "@/lib/data/lists";
import { About } from "@/components/site/sections/About";
import { WhyChooseUs } from "@/components/site/sections/WhyChooseUs";
import { Team } from "@/components/site/sections/Team";
import { Stats } from "@/components/site/sections/Stats";
import type { AboutContent, AboutMedia } from "@/lib/types/sections";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `About | ${settings.firmName}`,
    description: settings.tagline,
  };
}

export default async function AboutPage() {
  const [aboutSection, features, members, stats] = await Promise.all([
    prisma.pageSection.findUnique({
      where: { page_type: { page: "home", type: SectionType.ABOUT } },
    }),
    getWhyChooseUsFeatures(),
    getTeamMembers(),
    getStatistics(),
  ]);

  const content = (aboutSection?.content as AboutContent) || {};
  const media = (aboutSection?.media as AboutMedia) || {};

  return (
    <div className="pt-10">
      <About content={content} media={media} />
      <Stats stats={stats} />
      <WhyChooseUs
        content={{
          label: "Why Choose Us",
          heading: "Guidance You Can Rely On",
          subtitle:
            "A dedicated team that combines technical depth with clear communication and genuine business perspective.",
        }}
        features={features}
      />
      <Team
        content={{
          label: "Our Team",
          heading: "Meet the People Behind the Advice",
          subtitle: "A qualified, approachable team invested in your outcomes.",
        }}
        members={members}
      />
    </div>
  );
}
