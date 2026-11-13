import {
  ADMIN_MASTER_ITEMS,
  ADMIN_PACKAGES,
  ADMIN_POST_APPROVALS,
  ADMIN_SEARCH_TERMS,
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
import { getPublicBlogs, getPublicBlogById } from './blogApi';
import type { PublicBlogResponse } from '@/src/types/blog';

function mapPublicBlogToSummary(b: PublicBlogResponse): BlogSummary {
  const dateFormatted = b.createdAt
    ? new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';

  return {
    slug: b._id,
    title: b.title,
    tag: 'Blog',
    date: dateFormatted,
    image: b.bannerImage || '/assets/img/blog/v1/01.jpg',
    thumb: b.bannerImage || '/assets/img/blog/v1/01.jpg',
    excerpt: b.content ? b.content.slice(0, 160) + '...' : '',
    comments: 0,
    views: '1',
    keywords: [],
  };
}

export async function getBlogs(): Promise<BlogSummary[]> {
  try {
    const res = await getPublicBlogs(1, 100);
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(mapPublicBlogToSummary);
    }
  } catch (err) {
    console.error('Failed to fetch public blogs from API:', err);
  }
  return [];
}

export async function getBlog(slug: string): Promise<BlogPost | null> {
  try {
    // If slug is a 24-character hex ObjectId, fetch from backend
    if (/^[0-9a-fA-F]{24}$/.test(slug)) {
      const res = await getPublicBlogById(slug);
      if (res.success && res.data) {
        const summary = mapPublicBlogToSummary(res.data);
        const paragraphs = res.data.content
          ? res.data.content.split('\n').filter((p) => p.trim().length > 0)
          : [];

        return {
          ...summary,
          content: res.data.content || '',
          paragraphs: paragraphs.length > 0 ? paragraphs : ['No content available for this blog post.'],
          inlineImage: res.data.bannerImage || summary.image,
          quote: { text: '', name: '', role: '', avatar: '' },
          tags: [],
          commentList: [],
        };
      }
    }
  } catch (err) {
    console.error(`Failed to fetch public blog by id '${slug}':`, err);
  }

  return null;
}

export async function searchBlogs(query = ''): Promise<BlogSummary[]> {
  const blogs = await getBlogs();
  const term = query.trim().toLowerCase();
  if (!term) return blogs;
  return blogs.filter((b) =>
    [b.title, b.excerpt ?? '', b.tag, ...(b.keywords ?? [])].join(' ').toLowerCase().includes(term),
  );
}

export async function getRecentBlogs(limit = 4): Promise<BlogSummary[]> {
  const blogs = await getBlogs();
  return blogs.slice(0, limit);
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
export * from './bannerSectionApi';
export * from './blogApi';


