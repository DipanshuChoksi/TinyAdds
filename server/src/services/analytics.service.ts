import { Blog } from "../models/Blog.js";
import { ClientPost } from "../models/ClientPost.js";
import { Contact } from "../models/Contact.js";
import { Package } from "../models/Package.js";
import { User } from "../models/User.js";

export class AnalyticsService {
  async getAdminAnalytics() {
    const [
      totalUsers,
      totalPosts,
      totalContacts,
      totalBlogs,
      totalPackages,
      activePackages,
      pendingPosts,
      approvedPosts,
      rejectedPosts,
      pendingInquiries,
      inProgressInquiries,
      resolvedInquiries,
    ] = await Promise.all([
      User.countDocuments({ isDisplay: true }),
      ClientPost.countDocuments({ isDisplay: true }),
      Contact.countDocuments({ isDisplay: true }),
      Blog.countDocuments({ isDisplay: true }),
      Package.countDocuments({ isDisplay: true }),
      Package.countDocuments({ isDisplay: true, isActive: true }),
      ClientPost.countDocuments({ isDisplay: true, status: "pending" }),
      ClientPost.countDocuments({ isDisplay: true, status: "approved" }),
      ClientPost.countDocuments({ isDisplay: true, status: "rejected" }),
      Contact.countDocuments({ isDisplay: true, status: "pending" }),
      Contact.countDocuments({ isDisplay: true, status: "in_progress" }),
      Contact.countDocuments({ isDisplay: true, status: "resolved" }),
    ]);

    return {
      totalUsers,
      totalPosts,
      totalContacts,
      totalBlogs,
      totalPackages,
      activePackages,
      pendingPosts,
      approvedPosts,
      rejectedPosts,
      pendingInquiries,
      inProgressInquiries,
      resolvedInquiries,
    };
  }
}

export const analyticsService = new AnalyticsService();
