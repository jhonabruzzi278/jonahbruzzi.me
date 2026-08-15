import { storeApiFetch } from "./client";
import { mapStoreProduct } from "./mappers";
import type { WCStoreProduct, Product } from "./types";

// Public catalog data — revalidate periodically instead of hitting
// WooCommerce on every request (see client.ts for why).
const PRODUCTS_REVALIDATE_SECONDS = 60;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function listProducts(
  params: Record<string, string> = {}
): Promise<Product[]> {
  const query = new URLSearchParams({ per_page: "100", ...params });
  const raw = await storeApiFetch<WCStoreProduct[]>(
    `/products?${query.toString()}`,
    undefined,
    PRODUCTS_REVALIDATE_SECONDS
  );
  return raw.map(mapStoreProduct);
}

export async function getProductById(id: string | number): Promise<Product> {
  const raw = await storeApiFetch<WCStoreProduct>(
    `/products/${id}`,
    undefined,
    PRODUCTS_REVALIDATE_SECONDS
  );
  return mapStoreProduct(raw);
}

export async function listRelatedProducts(
  tags: string[],
  excludeId?: string | number
): Promise<Product[]> {
  if (tags.length === 0) return [];
  // Store API's `tag` filter matches slugs, not display names — the old
  // Mongo backend matched free-text tags, so we approximate WordPress's
  // default slug generation here.
  const query = new URLSearchParams({
    tag: tags.map(slugify).join(","),
    per_page: "4",
  });
  const raw = await storeApiFetch<WCStoreProduct[]>(
    `/products?${query.toString()}`,
    undefined,
    PRODUCTS_REVALIDATE_SECONDS
  );
  const mapped = raw.map(mapStoreProduct);
  return excludeId
    ? mapped.filter((product) => String(product._id) !== String(excludeId))
    : mapped;
}
