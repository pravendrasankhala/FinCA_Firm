import { prisma } from "@/lib/db";
import { PostStatus, EnquiryStatus } from "@prisma/client";

export async function getDashboardData() {
  const [
    serviceCount,
    publishedPostCount,
    draftPostCount,
    newEnquiryCount,
    teamCount,
    testimonialCount,
    recentEnquiries,
    recentPosts,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.blogPost.count({ where: { status: PostStatus.PUBLISHED } }),
    prisma.blogPost.count({ where: { status: PostStatus.DRAFT } }),
    prisma.enquiry.count({ where: { status: EnquiryStatus.NEW } }),
    prisma.teamMember.count(),
    prisma.testimonial.count(),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);

  return {
    serviceCount,
    publishedPostCount,
    draftPostCount,
    newEnquiryCount,
    teamCount,
    testimonialCount,
    recentEnquiries,
    recentPosts,
  };
}
