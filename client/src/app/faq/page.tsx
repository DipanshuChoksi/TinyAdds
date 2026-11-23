import type { Metadata } from 'next';
import PageBanner from '@/components/PageBanner';
import { getPublicCmsBySlug } from '@/lib/cmsApi';
import { formatFaqContent } from '@/lib/formatFaqContent';
import { createSeoMetadata } from '@/lib/seo';
import type { PublicCmsResponse } from '@/types/cms';
import styles from './faq.module.css';
import FaqCategoryTabs from './FaqCategoryTabs';

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
  const content = cmsData?.content ? formatFaqContent(cmsData.content, pageTitle) : null;

  return (
    <main>
      <PageBanner
        title={pageTitle}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'FAQ' },
        ]}
      />

      <section className={styles.section}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12">
              <article className={styles.card}>
                {cmsData?.image && (
                  <div className={styles.hero}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={getImageUrl(cmsData.image)} alt={pageTitle} />
                  </div>
                )}

                {content ? (
                  <div className={styles.content}>
                    {content.introHtml && (
                      <div
                        className={styles.faqIntro}
                        dangerouslySetInnerHTML={{ __html: content.introHtml }}
                      />
                    )}
                    {content.beforeHtml && (
                      <div dangerouslySetInnerHTML={{ __html: content.beforeHtml }} />
                    )}
                    <FaqCategoryTabs categories={content.categories} />
                    {content.afterHtml && (
                      <div dangerouslySetInnerHTML={{ __html: content.afterHtml }} />
                    )}
                  </div>
                ) : (
                  <div className={styles.empty}>
                    <p>No FAQs available at this time.</p>
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
