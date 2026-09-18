import { prisma } from "@/lib/db";
import { TestimonialManager } from "@/components/admin/testimonials/TestimonialManager";

export const dynamic = "force-dynamic";

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Testimonials</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Shown in the homepage testimonial carousel. Hidden entirely when empty.
        </p>
      </div>
      <TestimonialManager testimonials={testimonials} />
    </div>
  );
}
