import Link from "next/link";
import { getRecentBlogs } from "@/lib/api";

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000";

const getImageUrl = (src?: string) => {
  if (!src) return "/assets/img/blog/v1/01.jpg";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  return `${BASE_URL.replace(/\/$/, "")}/${src.replace(/^\//, "")}`;
};

export default async function Blogs() {
  const blogs = await getRecentBlogs(3);

  return (
    <>
      <section className="lb-section lb-blogs-section">
        <div className="container">
          <div className="lb-head text-center">
            <span className="lb-badge">insights</span>
            <h2>Company blogs</h2>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {blogs.map((blog) => (
              <div className="col" key={blog.slug}>
                <article className="lb-blog h-100 d-flex flex-column">
                  <Link href={`/blog/${blog.slug}`} className="lb-blog-img">
                    <img
                      src={getImageUrl(blog.image)}
                      alt={blog.title}
                      loading="lazy"
                    />
                    {/* <span className="lb-blog-tag">{blog.tag || "Blog"}</span> */}
                  </Link>
                  <div className="lb-blog-body d-flex flex-column flex-grow-1">
                    <p className="lb-meta mb-2">
                      <span>By <em>TinyAdds</em></span>
                      <span>{blog.date}</span>
                    </p>
                    <h3 className="mb-3">
                      <Link href={`/blog/${blog.slug}`} className="d-inline-block text-truncate w-100" title={blog.title}>
                        {blog.title}
                      </Link>
                    </h3>
                    <div className="mt-auto d-flex align-items-center justify-content-between pt-3 border-top">
                      <Link href={`/blog/${blog.slug}`} className="lb-link">
                        Read More <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link href="/blog" className="btn lb-btn-primary btn-lg px-5">
              View All Blogs <i className="bi bi-arrow-right ms-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
