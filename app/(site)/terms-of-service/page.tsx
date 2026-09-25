import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Terms of Service | ${settings.firmName}`,
    description: `Terms and conditions for using the ${settings.firmName} website and services.`,
  };
}

export default async function TermsOfServicePage() {
  const settings = await getSiteSettings();
  const updated = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">Legal</p>
      <h1 className="mt-4 text-3xl font-semibold text-foreground sm:text-4xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>

      <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-heading prose-a:text-primary">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of this website, operated
          by {settings.firmName}. By accessing or using this website, you agree to these Terms.
        </p>

        <h2>Use of This Website</h2>
        <p>
          This website is provided for general informational purposes about our services. You
          agree to use it only for lawful purposes and in a manner that does not infringe the
          rights of, or restrict or inhibit the use of, this website by any third party.
        </p>

        <h2>No Professional Advice</h2>
        <p>
          The content on this website, including service descriptions, articles and insights, is
          provided for general informational purposes only and does not constitute professional,
          financial, tax or legal advice. You should not act, or refrain from acting, on the
          basis of any content on this website without seeking appropriate professional advice
          specific to your circumstances.
        </p>

        <h2>Engagement of Services</h2>
        <p>
          Any professional services are provided only pursuant to a separate, specific engagement
          agreed between you and {settings.firmName}. Submitting an enquiry or consultation
          request through this website does not, by itself, create a client relationship or an
          engagement.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on this website, including text, graphics, logos and design, is the
          property of {settings.firmName} or its licensors and is protected by applicable
          intellectual property laws. You may not reproduce, distribute or otherwise use this
          content without our prior written permission.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, {settings.firmName} shall not be liable for any
          loss or damage arising from your use of, or inability to use, this website or reliance
          on its content.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          This website may contain links to third-party websites. We are not responsible for the
          content or practices of any linked third-party websites.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of this website after any
          changes constitutes acceptance of the revised Terms.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about these Terms, please <a href="/contact">get in touch with us</a>
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
