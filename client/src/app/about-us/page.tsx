import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import { getPublicCmsBySlug } from "@/lib/cmsApi";
import { createSeoMetadata } from "@/lib/seo";
import type { PublicCmsResponse } from "@/types/cms";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await getPublicCmsBySlug("about-us");
    const title = res?.data?.title || "About TinyAdds";
    return createSeoMetadata({
      title,
      description:
        "Learn about TinyAdds, our journey, and the people building a platform to help people discover local listings, businesses, and services.",
      path: "/about-us",
    });
  } catch {
    return createSeoMetadata({
      title: "About TinyAdds",
      description:
        "Learn about TinyAdds, our journey, and the people building a platform to help people discover local listings, businesses, and services.",
      path: "/about-us",
    });
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:5000";

function getImageUrl(src?: string) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  return `${BASE_URL.replace(/\/$/, "")}/${src.replace(/^\//, "")}`;
}

export default async function AboutUsPage() {
  let cmsData: PublicCmsResponse | null = null;

  try {
    const res = await getPublicCmsBySlug("about-us");
    if (res?.success && res.data) {
      cmsData = res.data;
    }
  } catch (error) {
    console.error("Error fetching CMS about-us:", error);
  }

  const pageTitle = cmsData?.title || "About Us";

  return (
    <main>
      <PageBanner
        title={pageTitle}
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <section className="lb-section py-5">
         {cmsData?.image && (
                  <div className="lb-article-hero mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getImageUrl(cmsData.image)} alt={pageTitle} />
                  </div>
                )}

                {/* <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 pb-3 border-bottom">
                  <h1 className="h2 mb-0 fw-bold text-dark">{pageTitle}</h1>
                </div> */}

                {cmsData?.content ? (
                  <div
                    className="lb-article-content terms-content"
                    style={{
                      lineHeight: "1.85",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      color: "var(--lb-ink, #333)",
                    }}
                    dangerouslySetInnerHTML={{ __html: cmsData.content }}
                  />
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">No about-us content found at this time.</p>
                  </div>
                )}
      </section>
    </main>
  );
}
