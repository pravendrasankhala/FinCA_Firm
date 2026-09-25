import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Privacy Policy | ${settings.firmName}`,
    description: `How ${settings.firmName} collects, uses and protects your information.`,
  };
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings();
  const updated = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">Legal</p>
      <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>

      <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-heading prose-a:text-primary">
        <p>
          {settings.firmName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your
          privacy and is committed to protecting the personal information you share with us
          through this website and in the course of providing our professional services.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect information you provide directly, such as your name, email address,
          phone number, company details and the content of any message you send us through our
          contact forms or consultation requests. We may also collect limited technical
          information, such as browser type and pages visited, to help us improve this website.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to enquiries and consultation requests</li>
          <li>To provide, manage and communicate about our professional services</li>
          <li>To comply with applicable legal, regulatory and professional obligations</li>
          <li>To improve the content and functionality of this website</li>
        </ul>

        <h2>Confidentiality</h2>
        <p>
          Any financial, tax or business information shared with us as part of an engagement is
          treated as confidential and handled in accordance with applicable professional
          standards and confidentiality obligations.
        </p>

        <h2>Sharing of Information</h2>
        <p>
          We do not sell your personal information. We may share information with trusted service
          providers who assist us in operating this website or delivering our services, and where
          required by law or regulatory authority.
        </p>

        <h2>Data Security</h2>
        <p>
          We take reasonable technical and organizational measures to protect the information you
          share with us from unauthorized access, loss or misuse.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may contact us at any time to ask what information we hold about you, to request a
          correction, or to ask us to delete information that we are not otherwise required to
          retain.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this
          page with a revised &ldquo;last updated&rdquo; date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please{" "}
          <a href="/contact">get in touch with us</a>
          {settings.email && (
            <>
              {" "}
              or write to us at <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </>
          )}
          .
        </p>
      </div>
    </div>
  );
}
