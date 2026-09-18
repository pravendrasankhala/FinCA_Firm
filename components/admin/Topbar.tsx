import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/app/admin/actions";

export function Topbar({ userName }: { userName: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div />
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/" target="_blank">
            View Site
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">{userName}</span>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" size="sm">
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  );
}
