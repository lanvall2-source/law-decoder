import type { MetadataRoute } from "next";
import { CURATED_TERMS } from "@/data/terms";
import { GUIDE_ARTICLES } from "@/data/guides";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://law-decoder.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/review`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/lawsuit`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const termRoutes: MetadataRoute.Sitemap = CURATED_TERMS.map((term) => ({
    url: `${SITE_URL}/terms/${term.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const guideRoutes: MetadataRoute.Sitemap = GUIDE_ARTICLES.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.updatedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...termRoutes, ...guideRoutes];
}
