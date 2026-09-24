"use client";

import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SortableList } from "@/components/admin/SortableList";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { FeaturedStarToggle } from "@/components/admin/FeaturedStarToggle";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import {
  deleteService,
  toggleServicePublished,
  toggleServiceFeatured,
  reorderServices,
} from "@/app/admin/services/actions";
import type { Service } from "@prisma/client";

export function ServicesManager({ services }: { services: Service[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to reorder. Star a service to show it on the homepage; published services get their
            own page.
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
                <FeaturedStarToggle
                  id={service.id}
                  defaultChecked={service.featured}
                  onToggle={toggleServiceFeatured}
                />
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
