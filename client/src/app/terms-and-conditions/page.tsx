import type { Metadata } from 'next';
import PageBanner from '@/components/PageBanner';
import { getPublicCmsBySlug } from '@/lib/cmsApi';
import { formatCmsContent } from '@/lib/formatCmsContent';
import { createSeoMetadata } from '@/lib/seo';
import type { PublicCmsResponse } from '@/types/cms';
import styles from './terms-and-conditions.module.css';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await getPublicCmsBySlug('terms-and-conditions');
    const title = res?.data?.title || 'Terms & Conditions';
    return createSeoMetadata({
      title,
      description: 'Review the Terms and Conditions for using TinyAdds marketplace and services.',
      path: '/terms-and-conditions',
    });
  } catch {
    return createSeoMetadata({
      title: 'Terms & Conditions',
      description: 'Review the Terms and Conditions for using TinyAdds marketplace and services.',
      path: '/terms-and-conditions',
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

export default async function TermsAndConditionsPage() {
  let cmsData: PublicCmsResponse | null = null;

  try {
    const res = await getPublicCmsBySlug('terms-and-conditions');
    if (res?.success && res.data) {
      cmsData = res.data;
    }
  } catch (error) {
    console.error('Error fetching CMS terms-and-conditions:', error);
  }

  const pageTitle = cmsData?.title || 'Terms & Conditions';
  const content = cmsData?.content ? formatCmsContent(cmsData.content, pageTitle) : '';

  return (
    <main>
      <PageBanner
        title={pageTitle}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Terms & Conditions' },
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
                  <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <div className={styles.empty}>
                    <p>No terms and conditions found at this time.</p>
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
