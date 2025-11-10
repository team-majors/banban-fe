import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://banban.today";

// ✅ Sitemap에 포함할 공개용 정적 페이지만 명시
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${siteUrl}/`,
    changeFrequency: "daily",
    priority: 1,
    lastModified: new Date(),
  },
  {
    url: `${siteUrl}/login`, // Public page지만 SEO 중요도 낮음
    changeFrequency: "monthly",
    priority: 0.3,
    lastModified: new Date(),
  },
  // ❌ admin, mypage, settings, profile 등은 Sitemap에 포함하지 않음 (권한 필요 / SEO 비노출)
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes;
}
