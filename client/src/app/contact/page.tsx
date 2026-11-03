import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import ContactInfo from "@/components/contact/ContactInfo";

export const metadata: Metadata = { title: "Contact – TinyAdds" };

export default function Contact() {
  return (
    <main>
      <PageBanner title="Get In Touch" crumbs={[{ label: "Home", href: "/" }, { label: "Pages" }, { label: "Contact" }]} />
      <ContactInfo />
    </main>
  );
}
