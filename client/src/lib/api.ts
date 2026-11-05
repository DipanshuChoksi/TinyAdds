import {
  ADMIN_MASTER_ITEMS,
  ADMIN_PACKAGES,
  ADMIN_POST_APPROVALS,
  ADMIN_SEARCH_TERMS,
  BLOGS,
  BLOG_POST,
  CATEGORIES,
  EMOTIONS,
  VENDOR,
  buildListings,
} from '@/data/site';
import type {
  AdminMasterItem,
  AdminPackage,
  AdminPostApproval,
  AdminSearchTerm,
  BlogPost,
  BlogSummary,
  Category,
  Emotion,
  Listing,
  Vendor,
} from '@/src/types';

/**
 * Data access layer. Right now it reads static data;
 * swap each function body with fetch() to your backend later – pages won't change.
 */
export async function getCategory(slug: string): Promise<Category | null> {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}
export async function getEmotion(slug: string): Promise<Emotion | null> {
  return EMOTIONS.find((e) => e.slug === slug) ?? null;
}
export async function getListings(categorySlug: string): Promise<Listing[]> {
  return buildListings(categorySlug);
}
export async function getListing(id: string): Promise<Listing> {
  const all = buildListings('automotive');
  return all.find((l) => l.id === id) ?? all[0];
}
export async function getBlogs(): Promise<BlogSummary[]> {
  return BLOGS;
}
export async function getBlog(slug: string): Promise<BlogPost | null> {
  const summary = BLOGS.find((b) => b.slug === slug);
  return summary ? { ...summary, ...BLOG_POST } : null;
}
export async function searchBlogs(query = ''): Promise<BlogSummary[]> {
  const term = query.trim().toLowerCase();
  if (!term) return BLOGS;
  return BLOGS.filter((b) =>
    [b.title, b.excerpt ?? '', b.tag, ...(b.keywords ?? [])].join(' ').toLowerCase().includes(term),
  );
}
export async function getRecentBlogs(limit = 4): Promise<BlogSummary[]> {
  return BLOGS.slice(-limit);
}
export async function getVendor(): Promise<Vendor> {
  return VENDOR;
}

export async function getAdminPostApprovals(): Promise<AdminPostApproval[]> {
  return ADMIN_POST_APPROVALS;
}

// export async function getAdminPackages(): Promise<AdminPackage[]> {
//   return ADMIN_PACKAGES;
// }

export async function getAdminSearchTerms(): Promise<AdminSearchTerm[]> {
  return ADMIN_SEARCH_TERMS;
}

export async function getAdminMasterItems(): Promise<AdminMasterItem[]> {
  return ADMIN_MASTER_ITEMS;
}

export * from './emotionApi';
export * from './contactApi';
export * from './packageApi';
export * from './groupApi';
export * from './searchCategoryApi';


