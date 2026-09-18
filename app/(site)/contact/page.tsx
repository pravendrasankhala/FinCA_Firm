import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SectionType } from "@prisma/client";
import { getSiteSettings } from "@/lib/data/settings";
import { ContactSection } from "@/components/site/sections/ContactSection";
import type { ContactContent } from "@/lib/types/sections";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Contact | ${settings.firmName}`,
    description: `Get in touch with ${settings.firmName}.`,
  };
}

export default async function ContactPage() {
  const [section, settings] = await Promise.all([
    prisma.pageSection.findUnique({
      where: { page_type: { page: "home", type: SectionType.CONTACT } },
    }),
    getSiteSettings(),
  ]);

  const content = (section?.content as ContactContent) || {
    heading: "Get in Touch",
    description: "Share your requirement and our team will get back to you shortly.",
  };

  return (
    <div className="pt-10">
      <ContactSection content={content} />
      {settings.googleMapsEmbed && (
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
          <iframe
            src={settings.googleMapsEmbed}
            className="h-96 w-full rounded-2xl border border-border"
            loading="lazy"
            title="Location map"
          />
        </div>
      )}
    </div>
  );
}
