import type { Metadata } from "next";

export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tinyadds.com",
);

export function canonicalUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function createSeoMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = canonicalUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "TinyAdds",
      type,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}