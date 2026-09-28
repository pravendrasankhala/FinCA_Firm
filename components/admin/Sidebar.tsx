"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ADMIN_NAV } from "@/components/admin/nav-config";
import { cn } from "@/lib/utils";

export function Sidebar({
  firmName,
  logoUrl,
}: {
  firmName: string;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const hasValidLogo = !!logoUrl && (logoUrl.startsWith("/") || logoUrl.startsWith("http"));

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-navy-800 bg-navy-950 lg:flex">
      <div className="flex h-16 items-center border-b border-navy-800 px-6">
        {hasValidLogo ? (
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          <Image src={logoUrl!} alt={firmName} width={180} height={32} className="w-auto" />
        ) : (
          <span className="font-heading text-base font-semibold text-white">{firmName}</span>
        )}
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {ADMIN_NAV.map((group, i) => (
          <div key={i}>
            {group.title && (
              <p className="px-3 text-xs font-semibold tracking-wide text-navy-500 uppercase">
                {group.title}
              </p>
            )}
            <div className={cn("space-y-0.5", group.title && "mt-2")}>
              {group.links.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/admin" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-navy-800 text-white"
                        : "text-navy-300 hover:bg-navy-900 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
