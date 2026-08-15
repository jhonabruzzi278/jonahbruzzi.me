import {
  listProducts,
  getProductById,
  listRelatedProducts,
} from "@lib/woocommerce/products";
import type { Product } from "@lib/woocommerce/types";

// Response envelopes below intentionally mirror the previous backend shapes
// ({ products: [...] }, direct object, { product: [...] }) so
// src/redux/features/productApi.js can point at these without UI changes.

export async function getShowingProducts(
  params: Record<string, string> = {}
): Promise<{ products: Product[] }> {
  const products = await listProducts(params);
  return { products };
}

export async function getDiscountProducts(): Promise<{
  products: Product[];
}> {
  const products = await listProducts({ on_sale: "true" });
  return { products };
}

export async function getProduct(id: string): Promise<Product> {
  return getProductById(id);
}

export async function getRelatedProducts(
  tags: string[],
  excludeId?: string
): Promise<{ product: Product[] }> {
  const product = await listRelatedProducts(tags, excludeId);
  return { product };
}
