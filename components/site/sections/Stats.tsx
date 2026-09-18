import type { Statistic } from "@prisma/client";
import { StatCounter } from "@/components/site/StatCounter";

export function Stats({ stats }: { stats: Statistic[] }) {
  if (stats.length === 0) return null;

  return (
    <section className="border-y border-border bg-card py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.id} className="text-center">
            <div className="text-4xl font-semibold text-primary sm:text-5xl">
              <StatCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </div>
            <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
