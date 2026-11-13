import SubscriptionPackages from "@/components/SubscriptionPackages";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Business Listing Packages",
  description:
    "Compare TinyAdds subscription packages for promoting your business and managing its listings on the platform.",
  path: "/subscription-packages",
});

export default function SubscriptionPackagesPage() {
  return <SubscriptionPackages />;
}
