import PageBanner from "@/components/PageBanner";
import ContactInfo from "@/components/contact/ContactInfo";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Contact TinyAdds",
  description:
    "Get in touch with the TinyAdds team for questions, feedback, or help with listings and services on the platform.",
  path: "/contact",
});

export default function Contact() {
  return (
    <main>
      <PageBanner title="Get In Touch" crumbs={[{ label: "Home", href: "/" }, { label: "Pages" }, { label: "Contact" }]} />
      <ContactInfo />
    </main>
  );
}
