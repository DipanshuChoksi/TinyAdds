import type { Metadata } from "next";
import SubscriptionPackages from "@/components/SubscriptionPackages";

export const metadata: Metadata = {
  title: "Subscription Packages",
  description: "Choose a TinyAdds subscription package for your business listings.",
};

export default function SubscriptionPackagesPage() {
  return <SubscriptionPackages />;
}
