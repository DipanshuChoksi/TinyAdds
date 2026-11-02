import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListingBrowser from '@/components/listing/ListingBrowser';
import { CATEGORIES } from '@/data/site';
import { getCategory, getListings } from '@/lib/api';

export const generateStaticParams = () => CATEGORIES.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  return { title: category?.name ?? 'Category' };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const items = await getListings(slug);

  return (
    <div className="container py-4">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: category.name }]} />
      <h1 className="h2 my-4">{category.name}</h1>
      <ListingBrowser items={items} allHref={`/category/${slug}`} />
    </div>
  );
}
