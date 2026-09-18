"use client";
import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { SortableList } from "@/components/admin/SortableList";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { deleteService, toggleServicePublished, reorderServices } from "@/app/admin/services/actions";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to reorder. Services appear on the homepage and get their own page when published.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/services/new">
            <Plus className="h-4 w-4" />
            Add New
          </Link>
        </Button>
      </div>

      {services.length === 0 ? (
        <p className="text-sm text-muted-foreground">No services yet.</p>
      ) : (
        <SortableList
          items={services}
          onReorder={reorderServices}
          renderItem={(service) => (
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {service.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-gold-500 text-gold-500" />}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{service.name}</p>
                  <p className="truncate text-xs text-muted-foreground">/services/{service.slug}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {!service.published && <Badge variant="secondary">Draft</Badge>}
                <PublishToggle
                  id={service.id}
                  defaultChecked={service.published}
                  onToggle={toggleServicePublished}
                />
                <Button asChild variant="ghost" size="icon-sm">
                  <Link href={`/admin/services/${service.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
                <ConfirmDeleteButton onDelete={() => deleteService(service.id)} itemLabel="Service" />
              </div>
            </div>
          )}
        />
      )}
    </div>
  );
}
