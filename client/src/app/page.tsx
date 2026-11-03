import Hero from "@/components/Hero";
import SearchByLocation from "@/components/SearchByLocation";
import Listings from "@/components/Listings";
import PopularCategories from "@/components/PopularCategories";
import Brands from "@/components/Brands";
import Feedback from "@/components/Feedback";
import Blogs from "@/components/Blogs";

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
