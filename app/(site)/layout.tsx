import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

// All content on this site is CMS-driven from Postgres; render dynamically
// so admin edits are reflected immediately without a rebuild.
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
