import PageBanner from "@/components/PageBanner";
import AboutIntro from "@/components/about/AboutIntro";
import CompanyJourney from "@/components/about/CompanyJourney";
import Team from "@/components/about/Team";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "About TinyAdds",
  description:
    "Learn about TinyAdds, our journey, and the people building a platform to help people discover local listings, businesses, and services.",
  path: "/about-us",
});

export default function AboutUs() {
  return (
    <main>
      <PageBanner title="About Us" crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
      <AboutIntro />
      {/* <CompanyJourney /> */}
      {/* <Team /> */}
    </main>
  );
}
