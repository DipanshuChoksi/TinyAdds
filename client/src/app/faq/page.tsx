import type { Metadata } from 'next';
import PageBanner from '@/components/PageBanner';
import { getPublicCmsBySlug } from '@/lib/cmsApi';
import { createSeoMetadata } from '@/lib/seo';
import type { PublicCmsResponse } from '@/types/cms';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await getPublicCmsBySlug('faqs');
    const title = res?.data?.title || 'Frequently Asked Questions';
    return createSeoMetadata({
      title,
      description: 'Frequently asked questions and answers about TinyAdds marketplace.',
      path: '/faq',
    });
  } catch {
    return createSeoMetadata({
      title: 'Frequently Asked Questions',
      description: 'Frequently asked questions and answers about TinyAdds marketplace.',
      path: '/faq',
    });
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000';

function getImageUrl(src?: string) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  return `${BASE_URL.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
}

export default async function FaqPage() {
  let cmsData: PublicCmsResponse | null = null;

  try {
    const res = await getPublicCmsBySlug('faqs');
    if (res?.success && res.data) {
      cmsData = res.data;
    }
  } catch (error) {
    console.error('Error fetching CMS faqs:', error);
  }

  const pageTitle = cmsData?.title || 'Frequently Asked Questions';

  return (
    <main>
      <PageBanner
        title={pageTitle}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'FAQ' },
        ]}
      />

      <section className="lb-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-9">
              <article className="lb-article bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
                {cmsData?.image && (
                  <div className="lb-article-hero mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getImageUrl(cmsData.image)} alt={pageTitle} />
                  </div>
                )}

                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4 pb-3 border-bottom">
                  <h1 className="h2 mb-0 fw-bold text-dark">{pageTitle}</h1>
                  {/* {cmsData?.updatedAt && (
                    <span className="text-muted small">
                      Last Updated: {new Date(cmsData.updatedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )} */}
                </div>

                {cmsData?.content ? (
                  <div
                    className="lb-article-content terms-content"
                    style={{
                      lineHeight: '1.85',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      color: 'var(--lb-ink, #333)',
                    }}
                    dangerouslySetInnerHTML={{ __html: cmsData.content }}
                  />
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">No FAQs available at this time.</p>
                  </div>
                )}
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
