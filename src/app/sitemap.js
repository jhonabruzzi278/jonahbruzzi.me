import { getShowingProducts } from "@services/productService";
import { getShowingCategories } from "@services/categoryService";
import { siteConfig } from "@config/site";

const STATIC_ROUTES = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/shop", priority: 0.9, changeFrequency: "daily" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.4, changeFrequency: "monthly" },
];

export default async function sitemap() {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [{ products }, { categories }] = await Promise.all([
    getShowingProducts(),
    getShowingCategories(),
  ]);

  const productEntries = products.map((product) => ({
    url: `${siteConfig.url}/product-details/${product._id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryEntries = categories
    .filter((category) => category.slug)
    .map((category) => ({
      url: `${siteConfig.url}/shop?category=${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
