import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import AboutIntro from "@/components/about/AboutIntro";
import CompanyJourney from "@/components/about/CompanyJourney";
import Team from "@/components/about/Team";

export const metadata: Metadata = { title: "About Us – TinyAdds" };

export default function AboutUs() {
  return (
    <main>
      <PageBanner title="About Us" crumbs={[{ label: "Home", href: "/" }, { label: "Pages" }, { label: "About Us" }]} />
      <AboutIntro />
      <CompanyJourney />
      <Team />
    </main>
  );
}
