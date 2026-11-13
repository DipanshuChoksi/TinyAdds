import type { MetadataRoute } from "next";
import { getBlogs } from "@/lib/api";
import { canonicalUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = await getBlogs();

  return [
    { url: canonicalUrl("/") },
    { url: canonicalUrl("/about-us") },
    { url: canonicalUrl("/blog") },
    { url: canonicalUrl("/contact") },
    { url: canonicalUrl("/subscription-packages") },
    ...blogs.map((blog) => ({
      url: canonicalUrl(`/blog/${blog.slug}`),
    })),
  ];
}