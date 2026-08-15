import { listCategories } from "@lib/woocommerce/categories";
import type { Category } from "@lib/woocommerce/types";

export async function getShowingCategories(): Promise<{
  categories: Category[];
}> {
  const categories = await listCategories();
  return { categories };
}
