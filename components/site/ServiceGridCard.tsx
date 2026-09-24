import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Service } from "@prisma/client";
import { DynamicIcon } from "@/components/DynamicIcon";

export function ServiceGridCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block aspect-[3/2] overflow-hidden rounded-2xl shadow-md transition-shadow hover:shadow-xl"
    >
      {service.imageUrl ? (
        <Image
          src={service.imageUrl}
          alt={service.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-navy-950">
          <DynamicIcon iconName={service.icon} className="h-10 w-10 text-gold-400" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 p-5">
        <h3 className="text-lg font-semibold text-white">{service.name}</h3>
        <span className="inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-gold-500 px-4 py-2 text-xs font-semibold text-navy-950 opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Read More
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
