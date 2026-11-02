import { BLOGS, BLOG_POST, CATEGORIES, EMOTIONS, VENDOR, buildListings } from '@/data/site';
import type { BlogPost, BlogSummary, Category, Emotion, Listing, Vendor } from '@/types';

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
  return BLOGS.some((b) => b.slug === slug) ? BLOG_POST : null;
}
export async function getVendor(): Promise<Vendor> {
  return VENDOR;
}
