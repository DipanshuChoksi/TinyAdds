import Hero from "@/components/Hero";
import SliderBannerCarousel from "@/components/SliderBannerCarousel";
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
        {/* Hero Section containing the Mascot, Standy Slider (Black Friday sale spot) & Slider Banner (Minimalist Facebook Ads spot) */}
        <Hero />
        {/* Additional Slider Banner Carousel section */}
        <SliderBannerCarousel />
        <SearchByLocation />
        {/* Top Notch Items listing dynamically showing Listing ads */}
        <Listings />
        {/* <PopularCategories /> */}
        {/* <Brands /> */}
        {/* <Feedback /> */}
        <Blogs />
      </main>
    </>
  );
}
