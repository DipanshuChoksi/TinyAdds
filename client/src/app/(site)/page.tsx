import type { Metadata } from 'next';
import HeroSearch from '@/components/home/HeroSearch';
import HeroSlider from '@/components/home/HeroSlider';
import EmotionRow from '@/components/home/EmotionRow';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import CategoryGrid from '@/components/home/CategoryGrid';
import ChooseEvent from '@/components/home/ChooseEvent';
import BlogCard from '@/components/listing/BlogCard';
import { getBlogs } from '@/lib/api';

export const metadata: Metadata = { title: 'Start Exploring Your City Today' };

export default async function HomePage() {
  const blogs = (await getBlogs()).slice(0, 3);
  return (
    <>
      <section className="hero py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold mb-3">Start Exploring Your City Today</h1>
              <p className="lead mb-4">Find the best places to stay, eat, shop, and visit—curated by trusted local experts and partners.</p>
              <HeroSearch />
              <div className="mt-5"><EmotionRow /></div>
            </div>
            <div className="col-lg-6"><HeroSlider /></div>
          </div>
        </div>
      </section>

      <UpcomingEvents />
      <CategoryGrid />
      <ChooseEvent />

      <section className="container py-5">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {blogs.map((post) => (
            <div className="col" key={post.slug}><BlogCard post={post} /></div>
          ))}
        </div>
      </section>
    </>
  );
}
