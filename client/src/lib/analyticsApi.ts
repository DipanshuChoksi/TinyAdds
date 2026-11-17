import http from './http';

export interface AdminAnalyticsResponse {
  totalUsers: number;
  totalPosts: number;
  totalContacts: number;
  totalBlogs: number;
  totalPackages: number;
  activePackages: number;
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
  pendingInquiries: number;
  inProgressInquiries: number;
  resolvedInquiries: number;
}

const emptyAnalytics: AdminAnalyticsResponse = {
  totalUsers: 0,
  totalPosts: 0,
  totalContacts: 0,
  totalBlogs: 0,
  totalPackages: 0,
  activePackages: 0,
  pendingPosts: 0,
  approvedPosts: 0,
  rejectedPosts: 0,
  pendingInquiries: 0,
  inProgressInquiries: 0,
  resolvedInquiries: 0,
};

export async function getAdminAnalytics(): Promise<AdminAnalyticsResponse> {
  const response = await http.get<AdminAnalyticsResponse>('/admin/analytics');

  if (!response.success || !response.data) {
    return emptyAnalytics;
  }

  return response.data;
}

export interface UserAnalyticsResponse {
  totalPosts: number;
  pendingPosts: number;
  approvedPosts: number;
  rejectedPosts: number;
}

const emptyUserAnalytics: UserAnalyticsResponse = {
  totalPosts: 0,
  pendingPosts: 0,
  approvedPosts: 0,
  rejectedPosts: 0,
};

export async function getUserAnalytics(): Promise<UserAnalyticsResponse> {
  const response = await http.get<UserAnalyticsResponse>('/auth/analytics');

  if (!response.success || !response.data) {
    return emptyUserAnalytics;
  }

  return response.data;
}
