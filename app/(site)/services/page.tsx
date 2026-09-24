import type { Metadata } from "next";
import { getPublishedServices } from "@/lib/data/services";
import { getSiteSettings } from "@/lib/data/settings";
import { ServiceGridCard } from "@/components/site/ServiceGridCard";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: `Services | ${settings.firmName}`,
    description: `Taxation, compliance, accounting and advisory services from ${settings.firmName}.`,
  };
}

export default async function ServicesPage() {
  const services = await getPublishedServices();

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-600 uppercase">
          What We Do
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-foreground">
          Comprehensive Financial & Compliance Services
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          From day-to-day compliance to long-term financial strategy, our services are built
          around what your business actually needs.
        </p>
      </div>

      {services.length === 0 ? (
        <p className="mt-14 text-sm text-muted-foreground">No services published yet.</p>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceGridCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
