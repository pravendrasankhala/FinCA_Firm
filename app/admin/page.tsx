import Link from "next/link";
import { Landmark, Newspaper, FileEdit, Inbox, Users, Quote, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/data/dashboard";
import { formatDate } from "@/lib/format";

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  const stats = [
    { label: "Total Services", value: data.serviceCount, icon: Landmark },
    { label: "Published Blogs", value: data.publishedPostCount, icon: Newspaper },
    { label: "Draft Blogs", value: data.draftPostCount, icon: FileEdit },
    { label: "New Enquiries", value: data.newEnquiryCount, icon: Inbox },
    { label: "Team Members", value: data.teamCount, icon: Users },
    { label: "Testimonials", value: data.testimonialCount, icon: Quote },
  ];

  const quickActions = [
    { label: "Add Blog Post", href: "/admin/insights/posts/new" },
    { label: "Add Service", href: "/admin/services/new" },
    { label: "Add Team Member", href: "/admin/team" },
    { label: "View Enquiries", href: "/admin/leads" },
    { label: "Edit Homepage", href: "/admin/homepage" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          An overview of your website content and activity.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col gap-2 px-4">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Button key={action.href} asChild variant="outline" size="sm">
            <Link href={action.href}>
              <Plus className="h-3.5 w-3.5" />
              {action.label}
            </Link>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            {data.recentEnquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No enquiries yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {data.recentEnquiries.map((enquiry) => (
                  <li key={enquiry.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{enquiry.name}</p>
                      <p className="text-xs text-muted-foreground">{enquiry.email}</p>
                    </div>
                    <Badge variant="secondary">{enquiry.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild variant="link" className="mt-1 px-0">
              <Link href="/admin/leads">View all enquiries</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            {data.recentPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blog posts yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {data.recentPosts.map((post) => (
                  <li key={post.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{post.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated {formatDate(post.updatedAt)}
                      </p>
                    </div>
                    <Badge variant="secondary">{post.status}</Badge>
                  </li>
                ))}
              </ul>
            )}
            <Button asChild variant="link" className="mt-1 px-0">
              <Link href="/admin/insights/posts">View all posts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
