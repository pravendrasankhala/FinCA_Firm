import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  await requireAdmin();

  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } });

  const header = ["Name", "Email", "Phone", "Company", "Service", "Message", "Status", "Date"];
  const rows = enquiries.map((e) =>
    [
      e.name,
      e.email,
      e.phone ?? "",
      e.company ?? "",
      e.serviceNeeded ?? "",
      e.message,
      e.status,
      e.createdAt.toISOString(),
    ]
      .map((value) => csvEscape(String(value)))
      .join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="enquiries-${Date.now()}.csv"`,
    },
  });
}
