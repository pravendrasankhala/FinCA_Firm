import { PrismaClient, NavLocation, SectionType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdmin() {
  const name = process.env.ADMIN_NAME || "Admin";
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "change-me-before-seeding";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email, passwordHash, role: "ADMIN" },
  });

  console.log(`Seeded admin user: ${email}`);
}

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      firmName: "Aurevia & Co.",
      tagline: "Clarity in Numbers. Confidence in Decisions.",
      socialLinks: {},
    },
  });
  console.log("Seeded site settings");
}

async function seedNavigation() {
  const count = await prisma.navigationItem.count();
  if (count > 0) return;

  await prisma.navigationItem.createMany({
    data: [
      { location: NavLocation.HEADER, label: "Home", url: "/", sortOrder: 0 },
      { location: NavLocation.HEADER, label: "About", url: "/about", sortOrder: 1 },
      { location: NavLocation.HEADER, label: "Services", url: "/services", sortOrder: 2 },
      { location: NavLocation.HEADER, label: "Industries", url: "/#industries", sortOrder: 3 },
      { location: NavLocation.HEADER, label: "Insights", url: "/insights", sortOrder: 4 },
      { location: NavLocation.HEADER, label: "Contact", url: "/contact", sortOrder: 5 },

      { location: NavLocation.HEADER_CTA, label: "Book a Consultation", url: "/contact", sortOrder: 0 },

      { location: NavLocation.FOOTER_QUICK_LINKS, label: "About Us", url: "/about", sortOrder: 0 },
      { location: NavLocation.FOOTER_QUICK_LINKS, label: "Services", url: "/services", sortOrder: 1 },
      { location: NavLocation.FOOTER_QUICK_LINKS, label: "Insights", url: "/insights", sortOrder: 2 },
      { location: NavLocation.FOOTER_QUICK_LINKS, label: "Contact", url: "/contact", sortOrder: 3 },

      { location: NavLocation.FOOTER_LEGAL, label: "Privacy Policy", url: "/privacy-policy", sortOrder: 0 },
      { location: NavLocation.FOOTER_LEGAL, label: "Terms of Service", url: "/terms-of-service", sortOrder: 1 },
    ],
  });
  console.log("Seeded navigation items");
}

async function seedTrustStrip() {
  const count = await prisma.trustStripItem.count();
  if (count > 0) return;

  await prisma.trustStripItem.createMany({
    data: [
      { label: "CA-Led Expertise", sortOrder: 0 },
      { label: "Professional & Confidential", sortOrder: 1 },
      { label: "Compliance Focused", sortOrder: 2 },
      { label: "Business-Focused Advisory", sortOrder: 3 },
    ],
  });
  console.log("Seeded trust strip items");
}

async function seedWhyChooseUs() {
  const count = await prisma.whyChooseUsFeature.count();
  if (count > 0) return;

  await prisma.whyChooseUsFeature.createMany({
    data: [
      {
        title: "CA-Led Professional Guidance",
        description: "Every engagement is guided by qualified Chartered Accountants, not just support staff.",
        sortOrder: 0,
      },
      {
        title: "Clear Communication",
        description: "We explain financial and compliance matters in plain language, not jargon.",
        sortOrder: 1,
      },
      {
        title: "Timely Compliance",
        description: "Deadlines are tracked proactively so filings and filings never become last-minute fire drills.",
        sortOrder: 2,
      },
      {
        title: "Practical Advisory",
        description: "Recommendations are grounded in what actually works for your business, not textbook theory.",
        sortOrder: 3,
      },
      {
        title: "Confidential Handling",
        description: "Your financial information is handled with strict confidentiality at every stage.",
        sortOrder: 4,
      },
      {
        title: "Long-Term Business Perspective",
        description: "We look beyond the current filing to how each decision affects your business over time.",
        sortOrder: 5,
      },
    ],
  });
  console.log("Seeded why-choose-us features");
}

async function seedProcessSteps() {
  const count = await prisma.processStep.count();
  if (count > 0) return;

  await prisma.processStep.createMany({
    data: [
      { number: "01", title: "Understand", description: "We start by understanding your business, goals and current financial position.", sortOrder: 0 },
      { number: "02", title: "Analyse", description: "We review the relevant numbers, records and compliance status in detail.", sortOrder: 1 },
      { number: "03", title: "Advise", description: "We recommend a clear, practical course of action tailored to your situation.", sortOrder: 2 },
      { number: "04", title: "Execute", description: "We handle the filings, documentation and execution required.", sortOrder: 3 },
      { number: "05", title: "Review", description: "We review outcomes regularly and adjust the approach as your business grows.", sortOrder: 4 },
    ],
  });
  console.log("Seeded process steps");
}

async function seedServices() {
  const count = await prisma.service.count();
  if (count > 0) return;

  const services = [
    {
      name: "Income Tax",
      slug: "income-tax",
      shortDescription: "Individual and business income tax filing, planning and representation.",
      longDescription:
        "We handle income tax return filing, advance tax planning and assessment representation for individuals, professionals and businesses — helping you stay compliant while making the most of legitimate tax-saving opportunities.",
      featured: true,
    },
    {
      name: "GST & Indirect Tax",
      slug: "gst-indirect-tax",
      shortDescription: "GST registration, filing, reconciliation and advisory.",
      longDescription:
        "From GST registration to monthly and annual return filing, input tax credit reconciliation and notice handling, we manage the full indirect tax compliance cycle so your business stays on the right side of the law.",
      featured: true,
    },
    {
      name: "Accounting & Bookkeeping",
      slug: "accounting-bookkeeping",
      shortDescription: "Accurate, timely books of accounts for confident decision-making.",
      longDescription:
        "We maintain accurate and up-to-date books of accounts using modern accounting systems, giving you reliable financial data to run your business and make informed decisions.",
      featured: true,
    },
    {
      name: "Audit & Assurance",
      slug: "audit-assurance",
      shortDescription: "Statutory, tax and internal audits conducted with rigor.",
      longDescription:
        "Our audit engagements go beyond compliance — we assess controls, identify risks and provide assurance that your financial statements present a true and fair view.",
      featured: true,
    },
    {
      name: "Company & LLP Compliance",
      slug: "company-llp-compliance",
      shortDescription: "ROC filings and ongoing corporate compliance.",
      longDescription:
        "We manage annual ROC filings, statutory registers, board resolutions and other ongoing compliance requirements for companies and LLPs, so you can focus on running the business.",
      featured: true,
    },
    {
      name: "Business Registration",
      slug: "business-registration",
      shortDescription: "Company, LLP and firm incorporation, done right the first time.",
      longDescription:
        "Whether you're starting a private limited company, LLP or partnership firm, we handle the end-to-end registration process along with the foundational compliance setup.",
      featured: true,
    },
    {
      name: "Tax Planning & Advisory",
      slug: "tax-planning-advisory",
      shortDescription: "Proactive strategies to legitimately reduce your tax burden.",
      longDescription:
        "We work with you throughout the year — not just at filing time — to structure your finances and transactions in a tax-efficient, fully compliant manner.",
    },
    {
      name: "Virtual CFO & MIS",
      slug: "virtual-cfo-mis",
      shortDescription: "CFO-level financial oversight without a full-time hire.",
      longDescription:
        "Our Virtual CFO service gives growing businesses access to senior financial oversight, MIS reporting and cash flow management, at a fraction of the cost of an in-house CFO.",
    },
    {
      name: "Payroll & TDS Compliance",
      slug: "payroll-tds-compliance",
      shortDescription: "Accurate payroll processing and TDS compliance, every cycle.",
      longDescription:
        "We manage payroll processing, statutory deductions and TDS return filing so your employees are paid accurately and your compliance obligations are always met on time.",
    },
    {
      name: "Startup Advisory",
      slug: "startup-advisory",
      shortDescription: "Financial and compliance guidance built for early-stage businesses.",
      longDescription:
        "From entity structuring to fundraising-readiness and ongoing compliance, we help startups build a solid financial foundation as they scale.",
    },
    {
      name: "International Taxation",
      slug: "international-taxation",
      shortDescription: "Cross-border tax structuring and compliance.",
      longDescription:
        "We advise on cross-border transactions, transfer pricing, DTAA benefits and international compliance requirements for businesses and individuals with overseas dealings.",
    },
    {
      name: "Business Advisory",
      slug: "business-advisory",
      shortDescription: "Practical, financially-grounded guidance for business decisions.",
      longDescription:
        "Beyond compliance, we act as a sounding board for key business decisions — from pricing and expansion to restructuring — bringing a financially disciplined perspective to the table.",
    },
  ];

  await prisma.service.createMany({
    data: services.map((service, index) => ({
      ...service,
      published: true,
      sortOrder: index,
    })),
  });
  console.log("Seeded services");
}

async function seedIndustries() {
  const count = await prisma.industry.count();
  if (count > 0) return;

  const industries = [
    { name: "Startups", slug: "startups", description: "Financial and compliance foundations built for speed and growth." },
    { name: "Manufacturing", slug: "manufacturing", description: "Costing, compliance and advisory tailored to manufacturing operations." },
    { name: "Retail & Trading", slug: "retail-trading", description: "Inventory-aware accounting and GST compliance for retail and trading businesses." },
    { name: "Professional Services", slug: "professional-services", description: "Compliance and advisory for firms and independent professionals." },
    { name: "E-Commerce", slug: "e-commerce", description: "GST, payment reconciliation and compliance for online sellers." },
    { name: "Real Estate", slug: "real-estate", description: "Project-wise accounting and regulatory compliance for real estate businesses." },
    { name: "Healthcare", slug: "healthcare", description: "Financial management and compliance for clinics, hospitals and healthcare providers." },
    { name: "Technology", slug: "technology", description: "Advisory built around the financial realities of technology businesses." },
    { name: "Export & Import", slug: "export-import", description: "Cross-border compliance and taxation for import-export businesses." },
    { name: "Individuals & Professionals", slug: "individuals-professionals", description: "Personal tax planning and compliance for individuals and independent professionals." },
  ];

  await prisma.industry.createMany({
    data: industries.map((industry, index) => ({
      ...industry,
      published: true,
      sortOrder: index,
    })),
  });
  console.log("Seeded industries");
}

async function upsertSection(type: SectionType, data: {
  title?: string;
  subtitle?: string;
  content?: object;
  media?: object;
  sortOrder: number;
}) {
  await prisma.pageSection.upsert({
    where: { page_type: { page: "home", type } },
    update: {},
    create: {
      page: "home",
      type,
      title: data.title,
      subtitle: data.subtitle,
      content: data.content ?? {},
      media: data.media ?? {},
      sortOrder: data.sortOrder,
      isVisible: true,
    },
  });
}

async function seedHomepageSections() {
  await upsertSection(SectionType.HERO, {
    sortOrder: 0,
    content: {
      eyebrow: "CHARTERED ACCOUNTANTS • TAX • ADVISORY",
      titleLine1: "Numbers You Can Trust.",
      titleLine2: "Decisions You Can Build On.",
      subtitle:
        "From taxation and compliance to accounting and business advisory, we help businesses stay financially clear, compliant and ready for growth.",
      primaryCtaText: "Book a Consultation",
      primaryCtaLink: "/contact",
      secondaryCtaText: "Explore Our Services",
      secondaryCtaLink: "/services",
      overlayOpacity: 0.55,
      alignment: "left",
    },
    media: { videoUrl: null, posterUrl: null },
  });

  await upsertSection(SectionType.TRUST, { sortOrder: 1, content: {} });

  await upsertSection(SectionType.ABOUT, {
    sortOrder: 2,
    content: {
      label: "About Us",
      headingLine1: "More Than Compliance.",
      headingLine2: "A Partner for Your Financial Journey.",
      description:
        "Aurevia & Co. partners with businesses and individuals to bring clarity to complex financial decisions — combining technical expertise with a practical, business-first approach to taxation, compliance and advisory.",
      buttonText: "Learn More About Us",
      buttonUrl: "/about",
    },
    media: { imageUrl: null },
  });

  await upsertSection(SectionType.SERVICES, {
    sortOrder: 3,
    content: {
      label: "What We Do",
      heading: "Comprehensive Financial & Compliance Services",
      subtitle:
        "From day-to-day compliance to long-term financial strategy, our services are built around what your business actually needs.",
    },
  });

  await upsertSection(SectionType.FEATURES, {
    sortOrder: 4,
    content: {
      label: "Why Choose Us",
      heading: "Guidance You Can Rely On",
      subtitle:
        "A dedicated team that combines technical depth with clear communication and genuine business perspective.",
    },
  });

  await upsertSection(SectionType.PROCESS, {
    sortOrder: 5,
    content: {
      label: "Our Process",
      heading: "How We Work With You",
      subtitle: "A structured, transparent process from the first conversation to ongoing advisory.",
    },
  });

  await upsertSection(SectionType.INDUSTRIES, {
    sortOrder: 6,
    content: {
      label: "Industries We Serve",
      heading: "Built to Understand Your Business Context",
      subtitle: "Practical, industry-aware advisory across sectors.",
    },
  });

  await upsertSection(SectionType.STATS, { sortOrder: 7, content: {} });

  await upsertSection(SectionType.TEAM, {
    sortOrder: 8,
    content: {
      label: "Our Team",
      heading: "Meet the People Behind the Advice",
      subtitle: "A qualified, approachable team invested in your outcomes.",
    },
  });

  await upsertSection(SectionType.LOGOS, {
    sortOrder: 9,
    content: { label: "Trusted By", heading: "Businesses We've Worked With" },
  });

  await upsertSection(SectionType.TESTIMONIALS, {
    sortOrder: 10,
    content: { label: "Client Feedback", heading: "What Our Clients Say" },
  });

  await upsertSection(SectionType.BLOGS, {
    sortOrder: 11,
    content: {
      label: "Insights",
      heading: "Latest Thinking & Updates",
      subtitle: "Practical perspectives on tax, compliance and business finance.",
    },
  });

  await upsertSection(SectionType.CTA, {
    sortOrder: 12,
    content: {
      heading: "Have a Financial or Compliance Question?",
      description: "Let's discuss your requirement and identify the right way forward.",
      primaryCtaText: "Book a Consultation",
      primaryCtaLink: "/contact",
      secondaryCtaText: "Talk to Us",
      secondaryCtaLink: "/contact",
      whatsappNumber: "",
    },
  });

  await upsertSection(SectionType.CONTACT, {
    sortOrder: 13,
    content: {
      heading: "Get in Touch",
      description: "Share your requirement and our team will get back to you shortly.",
    },
  });

  console.log("Seeded homepage sections");
}

async function main() {
  await seedAdmin();
  await seedSiteSettings();
  await seedNavigation();
  await seedTrustStrip();
  await seedWhyChooseUs();
  await seedProcessSteps();
  await seedServices();
  await seedIndustries();
  await seedHomepageSections();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
