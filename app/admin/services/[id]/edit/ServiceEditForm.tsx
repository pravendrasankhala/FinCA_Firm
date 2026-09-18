"use client";

import { ServiceForm } from "@/components/admin/services/ServiceForm";
import { updateService } from "@/app/admin/services/actions";
import type { ServiceInput } from "@/lib/validations/service";

export function ServiceEditForm({
  id,
  defaultValues,
}: {
  id: string;
  defaultValues: Partial<ServiceInput>;
}) {
  return (
    <ServiceForm
      defaultValues={defaultValues}
      onSubmit={(input) => updateService(id, input)}
    />
  );
}
