import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { EnquiryStatus } from "@prisma/client";
import { LeadsTable } from "@/components/admin/leads/LeadsTable";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_TABS = ["ALL", ...Object.values(EnquiryStatus)] as const;

export default async function LeadsAdminPage(props: PageProps<"/admin/leads">) {
  const searchParams = await props.searchParams;
  const statusParam = typeof searchParams.status === "string" ? searchParams.status : "ALL";
  const status = STATUS_TABS.includes(statusParam as (typeof STATUS_TABS)[number])
    ? statusParam
    : "ALL";

  const enquiries = await prisma.enquiry.findMany({
    where: status === "ALL" ? {} : { status: status as EnquiryStatus },
    orderBy: { createdAt: "desc" },
    include: { internalNotes: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Enquiries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Leads submitted through the website contact form.
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/admin/leads/export">
            <Download className="h-4 w-4" />
            Export CSV
          </a>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab}
            href={tab === "ALL" ? "/admin/leads" : `/admin/leads?status=${tab}`}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              status === tab
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {tab}
          </Link>
        ))}
      </div>

      <LeadsTable enquiries={enquiries} />
    </div>
  );
}
