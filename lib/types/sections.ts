export type HeroContent = {
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  overlayOpacity?: number;
  alignment?: "left" | "center";
};

export type HeroMedia = {
  videoUrl?: string | null;
  posterUrl?: string | null;
};

export type AboutContent = {
  label?: string;
  headingLine1?: string;
  headingLine2?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
};

export type AboutMedia = {
  imageUrl?: string | null;
};

export type SectionIntroContent = {
  label?: string;
  heading?: string;
  subtitle?: string;
};

export type CtaContent = {
  heading?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  whatsappNumber?: string;
};

export type ContactContent = {
  heading?: string;
  description?: string;
};
