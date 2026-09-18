import { prisma } from "@/lib/db";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return (
    settings ?? {
      id: "singleton",
      firmName: "Aurevia & Co.",
      tagline: "Clarity in Numbers. Confidence in Decisions.",
      logoUrl: null,
      faviconUrl: null,
      phone: null,
      email: null,
      address: null,
      whatsapp: null,
      businessHours: null,
      copyrightText: null,
      googleMapsEmbed: null,
      metaTitle: null,
      metaDescription: null,
      ogImageUrl: null,
      socialLinks: {},
      updatedAt: new Date(),
    }
  );
}
