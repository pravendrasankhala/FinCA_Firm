"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { EnquiryDetailSheet } from "@/components/admin/leads/EnquiryDetailSheet";
import type { Enquiry, EnquiryNote } from "@prisma/client";

type EnquiryWithNotes = Enquiry & { internalNotes: EnquiryNote[] };

export function LeadsTable({ enquiries }: { enquiries: EnquiryWithNotes[] }) {
  const [selected, setSelected] = useState<EnquiryWithNotes | null>(null);

  if (enquiries.length === 0) {
    return <p className="text-sm text-muted-foreground">No enquiries found.</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enquiries.map((enquiry) => (
            <TableRow
              key={enquiry.id}
              className="cursor-pointer"
              onClick={() => setSelected(enquiry)}
            >
              <TableCell className="font-medium text-foreground">{enquiry.name}</TableCell>
              <TableCell>{enquiry.email}</TableCell>
              <TableCell>{enquiry.phone ?? "—"}</TableCell>
              <TableCell>{enquiry.serviceNeeded ?? "—"}</TableCell>
              <TableCell>{formatDate(enquiry.createdAt)}</TableCell>
              <TableCell>
                <Badge variant="secondary">{enquiry.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EnquiryDetailSheet
        enquiry={selected}
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </>
  );
}
