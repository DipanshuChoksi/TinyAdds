import Hero from "@/components/Hero";
import SearchByLocation from "@/components/SearchByLocation";
import Listings from "@/components/Listings";
import PopularCategories from "@/components/PopularCategories";
import Brands from "@/components/Brands";
import Feedback from "@/components/Feedback";
import Blogs from "@/components/Blogs";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Local Listings, Businesses & Services",
  description:
    "Find local businesses, services, products, and opportunities on TinyAdds. Browse listings by category and location to discover what you need.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <SearchByLocation />
        <Listings />
        <PopularCategories />
        <Brands />
        <Feedback />
        <Blogs />
      </main>
    </>
  );
}
