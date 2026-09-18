import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ServiceEditForm } from "./ServiceEditForm";
import { FaqManager } from "@/components/admin/FaqManager";

export const dynamic = "force-dynamic";

export default async function EditServicePage(props: PageProps<"/admin/services/[id]/edit">) {
  const { id } = await props.params;
  const service = await prisma.service.findUnique({
    where: { id },
    include: { faqs: { orderBy: { sortOrder: "asc" } } },
  });

  if (!service) notFound();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Edit Service</h1>
        <p className="mt-1 text-sm text-muted-foreground">{service.name}</p>
      </div>

      <ServiceEditForm
        id={service.id}
        defaultValues={{
          name: service.name,
          slug: service.slug,
          shortDescription: service.shortDescription,
          longDescription: service.longDescription,
          highlights: service.highlights,
          icon: service.icon ?? "",
          imageUrl: service.imageUrl ?? "",
          featured: service.featured,
          published: service.published,
          seoTitle: service.seoTitle ?? "",
          seoDescription: service.seoDescription ?? "",
        }}
      />

      <div className="max-w-3xl border-t border-border pt-8">
        <FaqManager serviceId={service.id} faqs={service.faqs} />
      </div>
    </div>
  );
}
