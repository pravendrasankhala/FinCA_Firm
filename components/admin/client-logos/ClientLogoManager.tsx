"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SortableList } from "@/components/admin/SortableList";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { clientLogoSchema, type ClientLogoInput } from "@/lib/validations/client-logo";
import {
  createClientLogo,
  updateClientLogo,
  deleteClientLogo,
  toggleClientLogoPublished,
  reorderClientLogos,
} from "@/app/admin/client-logos/actions";
import type { ClientLogo } from "@prisma/client";

export function ClientLogoManager({ logos }: { logos: ClientLogo[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClientLogo | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Drag to reorder.</p>
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Add Logo
        </Button>
      </div>

      {logos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No client logos yet.</p>
      ) : (
        <SortableList
          items={logos}
          onReorder={reorderClientLogos}
          renderItem={(logo) => (
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-medium text-foreground">{logo.name}</p>
              <div className="flex shrink-0 items-center gap-3">
                {!logo.published && <Badge variant="secondary">Hidden</Badge>}
                <PublishToggle
                  id={logo.id}
                  defaultChecked={logo.published}
                  onToggle={toggleClientLogoPublished}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setEditing(logo);
                    setOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDeleteButton onDelete={() => deleteClientLogo(logo.id)} itemLabel="Client logo" />
              </div>
            </div>
          )}
        />
      )}

      <ClientLogoDialog open={open} onOpenChange={setOpen} logo={editing} />
    </div>
  );
}

function ClientLogoDialog({
  open,
  onOpenChange,
  logo,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  logo: ClientLogo | null;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ClientLogoInput>({
    resolver: zodResolver(clientLogoSchema),
    values: {
      name: logo?.name ?? "",
      logoUrl: logo?.logoUrl ?? "",
      website: logo?.website ?? "",
      published: logo?.published ?? true,
    },
  });

  const onSubmit = async (values: ClientLogoInput) => {
    const result = logo ? await updateClientLogo(logo.id, values) : await createClientLogo(values);
    if (result.success) {
      toast.success(logo ? "Logo updated." : "Logo added.");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{logo ? "Edit Client Logo" : "Add Client Logo"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cl-name">Company Name</Label>
            <Input id="cl-name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cl-logo">Logo URL</Label>
            <Input id="cl-logo" {...register("logoUrl")} placeholder="https://..." />
            {errors.logoUrl && <p className="text-xs text-destructive">{errors.logoUrl.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cl-website">Website</Label>
            <Input id="cl-website" {...register("website")} placeholder="https://..." />
          </div>
          <div className="flex items-center gap-2.5">
            <Switch
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
              id="cl-published"
            />
            <Label htmlFor="cl-published">Published</Label>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
