import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Home,
  Navigation as NavigationIcon,
  PanelBottom,
  Landmark,
  MapPinned,
  Users,
  Quote,
  Images,
  HelpCircle,
  Newspaper,
  Tags,
  Inbox,
  FolderOpen,
  Settings,
  Search,
  Share2,
  UserCog,
  History,
} from "lucide-react";

export type NavLink = { label: string; href: string; icon: LucideIcon };
export type NavGroup = { title: string; links: NavLink[] };

export const ADMIN_NAV: NavGroup[] = [
  {
    title: "",
    links: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "Website",
    links: [
      { label: "Homepage", href: "/admin/homepage", icon: Home },
      { label: "Navigation", href: "/admin/navigation", icon: NavigationIcon },
      { label: "Footer", href: "/admin/footer", icon: PanelBottom },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "Services", href: "/admin/services", icon: Landmark },
      { label: "Industries", href: "/admin/industries", icon: MapPinned },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { label: "Client Logos", href: "/admin/client-logos", icon: Images },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    title: "Insights",
    links: [
      { label: "Blog Posts", href: "/admin/insights/posts", icon: Newspaper },
      { label: "Categories", href: "/admin/insights/categories", icon: Tags },
    ],
  },
  {
    title: "Leads",
    links: [{ label: "Enquiries", href: "/admin/leads", icon: Inbox }],
  },
  {
    title: "Media",
    links: [{ label: "Media Library", href: "/admin/media", icon: FolderOpen }],
  },
  {
    title: "Settings",
    links: [
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
      { label: "SEO", href: "/admin/settings/seo", icon: Search },
      { label: "Social Links", href: "/admin/settings/social", icon: Share2 },
      { label: "Users", href: "/admin/settings/users", icon: UserCog },
      { label: "Activity Logs", href: "/admin/settings/activity-logs", icon: History },
    ],
  },
];
