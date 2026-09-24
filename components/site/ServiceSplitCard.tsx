"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Service } from "@prisma/client";
import { DynamicIcon } from "@/components/DynamicIcon";

export function ServiceSplitCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-shadow hover:shadow-xl sm:grid-cols-1 lg:grid-cols-5"
    >
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:col-span-3 lg:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-950 text-gold-400">
          <DynamicIcon iconName={service.icon} className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-foreground sm:text-2xl">{service.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {service.shortDescription}
          </p>
        </div>

      </div>

      <div className="relative min-h-56 p-3 sm:p-4 lg:col-span-2 lg:p-4">
        <div className="relative h-full min-h-72 w-full overflow-hidden rounded-xl">
          {service.imageUrl ? (
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-navy-950">
              <DynamicIcon iconName={service.icon} className="h-10 w-10 text-gold-400" />
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />

          <span className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 translate-y-2 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy-950 opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View detail
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
