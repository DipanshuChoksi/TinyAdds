import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListingBrowser from '@/components/listing/ListingBrowser';
import { EMOTIONS } from '@/data/site';
import { getEmotion, getListings } from '@/lib/api';

export const generateStaticParams = () => EMOTIONS.map((e) => ({ slug: e.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const emotion = await getEmotion(slug);
  return { title: emotion?.name ?? 'Emotion' };
}

export default async function EmotionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const emotion = await getEmotion(slug);
  if (!emotion) notFound();
  const items = (await getListings('automotive')).filter((i) => i.emotion === slug);

  return (
    <div className="container py-4">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: emotion.name }]} />
      <h1 className="h2 my-4">{emotion.name}</h1>
      <ListingBrowser items={items} activeEmotion={slug} allHref="/category/automotive" />
    </div>
  );
}
