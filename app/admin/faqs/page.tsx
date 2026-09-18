import { prisma } from "@/lib/db";
import { FaqManager } from "@/components/admin/FaqManager";

export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const faqs = await prisma.faq.findMany({
    where: { serviceId: null },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">General FAQs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          FAQs not tied to a specific service. Service-specific FAQs are managed from each
          service&apos;s edit page.
        </p>
      </div>
      <FaqManager serviceId={null} faqs={faqs} />
    </div>
  );
}
