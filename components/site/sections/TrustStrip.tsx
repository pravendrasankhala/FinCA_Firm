import { BadgeCheck } from "lucide-react";

export function TrustStrip({ items }: { items: { id: string; label: string }[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border-b border-border bg-secondary/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2.5">
            <BadgeCheck className="h-5 w-5 shrink-0 text-gold-600" />
            <span className="text-sm font-medium text-foreground/80">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
