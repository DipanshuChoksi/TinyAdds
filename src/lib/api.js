import { BLOGS, BLOG_POST, CATEGORIES, EMOTIONS, VENDOR, buildListings } from '@/data/site';

/**
 * Data access layer. Right now it reads static data;
 * swap each function body with fetch() to your backend later – pages won't change.
 */
export async function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}
export async function getEmotion(slug) {
  return EMOTIONS.find((e) => e.slug === slug) ?? null;
}
export async function getListings(categorySlug) {
  return buildListings(categorySlug);
}
export async function getListing(id) {
  return buildListings('automotive').find((l) => l.id === id) ?? buildListings('automotive')[0];
}
export async function getBlogs() {
  return BLOGS;
}
export async function getBlog(slug) {
  return BLOGS.find((b) => b.slug === slug) ? BLOG_POST : null;
}
export async function getVendor() {
  return VENDOR;
}
