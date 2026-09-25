import type { Metadata } from "next";
import { getVisibleSections } from "@/lib/data/page-sections";
import { getSiteSettings } from "@/lib/data/settings";
import { getFeaturedServices } from "@/lib/data/services";
import {
  getTrustStripItems,
  getWhyChooseUsFeatures,
  getProcessSteps,
  getIndustries,
  getStatistics,
  getTeamMembers,
  getClientLogos,
  getTestimonials,
} from "@/lib/data/lists";
import { getPublishedPosts } from "@/lib/data/blog";
import { SectionType } from "@prisma/client";

import { Hero } from "@/components/site/sections/Hero";
import { TrustStrip } from "@/components/site/sections/TrustStrip";
import { About } from "@/components/site/sections/About";
import { ServicesPreview } from "@/components/site/sections/ServicesPreview";
import { ProblemsSection } from "@/components/site/sections/ProblemsSection";
import { WhyChooseUs } from "@/components/site/sections/WhyChooseUs";
import { ProcessTimeline } from "@/components/site/sections/ProcessTimeline";
import { IndustriesGrid } from "@/components/site/sections/IndustriesGrid";
import { Stats } from "@/components/site/sections/Stats";
import { Team } from "@/components/site/sections/Team";
import { LogoMarquee } from "@/components/site/sections/LogoMarquee";
import { Testimonials } from "@/components/site/sections/Testimonials";
import { InsightsPreview } from "@/components/site/sections/InsightsPreview";
import { Cta } from "@/components/site/sections/Cta";
import { ContactSection } from "@/components/site/sections/ContactSection";

import type {
  HeroContent,
  HeroMedia,
  AboutContent,
  AboutMedia,
  SectionIntroContent,
  CtaContent,
  ContactContent,
} from "@/lib/types/sections";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.metaTitle || `${settings.firmName} | ${settings.tagline}`,
    description: settings.metaDescription || settings.tagline,
  };
}

export default async function HomePage() {
  const [
    sections,
    services,
    trustItems,
    whyChooseUsFeatures,
    processSteps,
    industries,
    statistics,
    teamMembers,
    clientLogos,
    testimonials,
    posts,
  ] = await Promise.all([
    getVisibleSections("home"),
    getFeaturedServices(),
    getTrustStripItems(),
    getWhyChooseUsFeatures(),
    getProcessSteps(),
    getIndustries(),
    getStatistics(),
    getTeamMembers(),
    getClientLogos(),
    getTestimonials(),
    getPublishedPosts(3),
  ]);

  return (
    <>
      {sections.map((section) => {
        switch (section.type) {
          case SectionType.HERO:
            return (
              <Hero
                key={section.id}
                content={section.content as HeroContent}
                media={section.media as HeroMedia}
              />
            );
          case SectionType.TRUST:
            return <TrustStrip key={section.id} items={trustItems} />;
          case SectionType.ABOUT:
            return (
              <About
                key={section.id}
                content={section.content as AboutContent}
                media={section.media as AboutMedia}
              />
            );
          case SectionType.CUSTOM:
            return <ProblemsSection key={section.id} />;
          case SectionType.SERVICES:
            return (
              <ServicesPreview
                key={section.id}
                content={section.content as SectionIntroContent}
                services={services}
              />
            );
          case SectionType.FEATURES:
            return (
              <WhyChooseUs
                key={section.id}
                content={section.content as SectionIntroContent}
                features={whyChooseUsFeatures}
              />
            );
          // case SectionType.PROCESS:
          //   return (
          //     <ProcessTimeline
          //       key={section.id}
          //       content={section.content as SectionIntroContent}
          //       steps={processSteps}
          //     />
          //   );
          case SectionType.INDUSTRIES:
            return (
              <IndustriesGrid
                key={section.id}
                content={section.content as SectionIntroContent}
                industries={industries}
              />
            );
          case SectionType.STATS:
            return <Stats key={section.id} stats={statistics} />;
          case SectionType.TEAM:
            return (
              <Team
                key={section.id}
                content={section.content as SectionIntroContent}
                members={teamMembers}
              />
            );
          case SectionType.LOGOS:
            return (
              <LogoMarquee
                key={section.id}
                content={section.content as SectionIntroContent}
                logos={clientLogos}
              />
            );
          case SectionType.TESTIMONIALS:
            return <Testimonials key={section.id} testimonials={testimonials} />;
          case SectionType.BLOGS:
            return (
              <InsightsPreview
                key={section.id}
                content={section.content as SectionIntroContent}
                posts={posts}
              />
            );
          case SectionType.CTA:
            return <Cta key={section.id} content={section.content as CtaContent} />;
          case SectionType.CONTACT:
            return (
              <ContactSection key={section.id} content={section.content as ContactContent} />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
