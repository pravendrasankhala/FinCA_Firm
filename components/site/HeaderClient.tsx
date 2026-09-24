"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type NavItem = { id: string; label: string; url: string };
type ServiceLink = { id: string; name: string; slug: string };

export function HeaderClient({
  firmName,
  logoUrl,
  navItems,
  ctaItem,
  services,
}: {
  firmName: string;
  logoUrl: string | null;
  navItems: NavItem[];
  ctaItem: NavItem | null;
  services: ServiceLink[];
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-border bg-background/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={firmName} width={140} height={36} className="h-9 w-auto" />
          ) : (
            <span
              className={cn(
                "font-heading text-xl font-semibold tracking-tight transition-colors",
                solid ? "text-foreground" : "text-white"
              )}
            >
              {firmName}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) =>
            item.url === "/services" && services.length > 0 ? (
              <NavigationMenu key={item.id} viewport={false} className="max-w-none flex-none">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "h-auto bg-transparent p-0 text-sm font-medium transition-colors hover:bg-transparent focus:bg-transparent",
                        solid
                          ? "text-foreground/80 hover:text-foreground data-open:bg-transparent data-open:text-foreground"
                          : "text-white/85 hover:text-white data-open:bg-transparent data-open:text-white"
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="w-max max-w-[90vw] p-2">
                      <ul className="flex flex-wrap gap-1">
                        {services.map((service) => (
                          <li key={service.id}>
                            <NavigationMenuLink asChild>
                              <Link href={`/services/${service.slug}`} className="whitespace-nowrap">
                                {service.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-1 border-t border-border pt-1">
                        <NavigationMenuLink asChild>
                          <Link href="/services" className="font-semibold text-primary">
                            View All Services
                          </Link>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            ) : (
              <Link
                key={item.id}
                href={item.url}
                className={cn(
                  "text-sm font-medium transition-colors",
                  solid
                    ? "text-foreground/80 hover:text-foreground"
                    : "text-white/85 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          {ctaItem && (
            <Button
              asChild
              size="lg"
              className={cn(
                !solid && "bg-white text-navy-950 hover:bg-white/90"
              )}
            >
              <Link href={ctaItem.url}>{ctaItem.label}</Link>
            </Button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md lg:hidden",
            solid ? "text-foreground" : "text-white"
          )}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-sm">
          <SheetHeader className="flex-row items-center justify-between border-b border-border">
            <SheetTitle>{firmName}</SheetTitle>
            <SheetClose asChild>
              <button aria-label="Close menu" className="rounded-md p-1 text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </SheetClose>
          </SheetHeader>
          <AnimatePresence>
            {open && (
              <nav className="flex flex-col gap-1 px-4">
                {navItems.map((item, i) =>
                  item.url === "/services" && services.length > 0 ? (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Accordion type="single" collapsible>
                        <AccordionItem value={item.id} className="border-b-0">
                          <AccordionTrigger className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted hover:no-underline">
                            {item.label}
                          </AccordionTrigger>
                          <AccordionContent className="pb-1 pl-3">
                            <div className="flex flex-col gap-1">
                              {services.map((service) => (
                                <Link
                                  key={service.id}
                                  href={`/services/${service.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                                >
                                  {service.name}
                                </Link>
                              ))}
                              <Link
                                href="/services"
                                onClick={() => setOpen(false)}
                                className="block rounded-md px-3 py-2 text-sm font-semibold text-primary hover:bg-muted"
                              >
                                View All Services
                              </Link>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={item.url}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  )
                )}
                {ctaItem && (
                  <Button asChild size="lg" className="mt-4">
                    <Link href={ctaItem.url} onClick={() => setOpen(false)}>
                      {ctaItem.label}
                    </Link>
                  </Button>
                )}
              </nav>
            )}
          </AnimatePresence>
        </SheetContent>
      </Sheet>
    </header>
  );
}
