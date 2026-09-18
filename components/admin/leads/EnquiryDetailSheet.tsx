"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formatDate } from "@/lib/format";
import { updateEnquiryStatus, addEnquiryNote } from "@/app/admin/leads/actions";
import { EnquiryStatus, type Enquiry, type EnquiryNote } from "@prisma/client";

const STATUS_OPTIONS = Object.values(EnquiryStatus);

export function EnquiryDetailSheet({
  enquiry,
  open,
  onOpenChange,
}: {
  enquiry: (Enquiry & { internalNotes: EnquiryNote[] }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [note, setNote] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!enquiry) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{enquiry.name}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-5 overflow-y-auto px-4">
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Email: </span>
              {enquiry.email}
            </p>
            {enquiry.phone && (
              <p>
                <span className="text-muted-foreground">Phone: </span>
                {enquiry.phone}
              </p>
            )}
            {enquiry.company && (
              <p>
                <span className="text-muted-foreground">Company: </span>
                {enquiry.company}
              </p>
            )}
            {enquiry.serviceNeeded && (
              <p>
                <span className="text-muted-foreground">Service: </span>
                {enquiry.serviceNeeded}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Received {formatDate(enquiry.createdAt)}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-foreground">
            {enquiry.message}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select
              defaultValue={enquiry.status}
              onValueChange={(value) => {
                startTransition(async () => {
                  const result = await updateEnquiryStatus(enquiry.id, value as EnquiryStatus);
                  if (!result.success) toast.error("Failed to update status.");
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Internal Notes</p>
            {enquiry.internalNotes.length === 0 ? (
              <p className="text-xs text-muted-foreground">No notes yet.</p>
            ) : (
              <div className="space-y-2">
                {enquiry.internalNotes.map((n) => (
                  <div key={n.id} className="rounded-md border border-border p-2.5 text-sm">
                    <p>{n.note}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="border-t border-border">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an internal note..."
            rows={2}
          />
          <Button
            type="button"
            disabled={isPending || !note.trim()}
            onClick={() => {
              startTransition(async () => {
                const result = await addEnquiryNote(enquiry.id, note);
                if (result.success) {
                  setNote("");
                  toast.success("Note added.");
                } else {
                  toast.error(result.error || "Failed to add note.");
                }
              });
            }}
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Note
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
