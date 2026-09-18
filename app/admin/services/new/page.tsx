"use client";

import { ServiceForm } from "@/components/admin/services/ServiceForm";
import { createService } from "@/app/admin/services/actions";

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Add Service</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new service. It will appear on the homepage and get its own page once published.
        </p>
      </div>
      <ServiceForm onSubmit={createService} />
    </div>
  );
}
