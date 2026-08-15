import ShopMainArea from "@components/shop/shop-main-area";
import { getShowingCategories } from "@services/categoryService";

export async function generateMetadata({ searchParams }) {
  const { category, tag } = await searchParams;
  if (!category && !tag) {
    return { title: "Tienda", alternates: { canonical: "/shop" } };
  }
  if (category) {
    const { categories } = await getShowingCategories();
    const match = categories.find((c) => c.slug === category);
    if (match) {
      return {
        title: match.parent,
        description: match.description || `Productos de ${match.parent} en Jonahbruzzi.`,
        alternates: { canonical: `/shop?category=${category}` },
      };
    }
  }
  if (tag) {
    return {
      title: tag,
      alternates: { canonical: `/shop?tag=${tag}` },
    };
  }
  return { title: "Tienda", alternates: { canonical: "/shop" } };
}

export default async function ShopPage({searchParams}) {
  const { category, tag, brand, priceMin, max, priceMax, color } = await searchParams;
  return (
    <ShopMainArea
      category={category}
      tag={tag}
      brand={brand}
      priceMin={priceMin}
      max={max}
      priceMax={priceMax}
      color={color}
    />
  );
}
