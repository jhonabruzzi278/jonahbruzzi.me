import { siteConfig } from "@config/site";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/user-dashboard", "/cart", "/checkout"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
