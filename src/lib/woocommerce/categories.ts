import { storeApiFetch } from "./client";
import { mapStoreCategory } from "./mappers";
import type { WCStoreCategory, Category } from "./types";

export async function listCategories(): Promise<Category[]> {
  // hide_empty=false so all 9 catalog categories show up even before every
  // one has a product assigned yet (early-catalog state).
  const raw = await storeApiFetch<WCStoreCategory[]>(
    `/products/categories?per_page=100&hide_empty=false`
  );
  return raw.map(mapStoreCategory);
}
