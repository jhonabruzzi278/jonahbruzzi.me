import type {
  WCStoreProduct,
  WCStoreCategory,
  WCStoreCart,
  Product,
  Category,
  Cart,
} from "./types";

/**
 * Store API prices are strings in the currency's smallest unit (e.g.
 * "1499000" with currency_minor_unit 2 → 14990.00), independent of the
 * store's *display* decimal setting — always convert through minor_unit.
 */
export function parseStorePrice(amountMinor: string, minorUnit: number): number {
  const value = Number(amountMinor);
  if (!Number.isFinite(value)) return 0;
  return value / 10 ** minorUnit;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function mapStoreProduct(raw: WCStoreProduct): Product {
  const price = parseStorePrice(
    raw.prices.price,
    raw.prices.currency_minor_unit
  );
  const regularPrice = parseStorePrice(
    raw.prices.regular_price,
    raw.prices.currency_minor_unit
  );
  const discount =
    regularPrice > price && regularPrice > 0
      ? Math.round((1 - price / regularPrice) * 100)
      : 0;

  const colorAttribute = raw.attributes?.find((attr) =>
    /colou?r/i.test(attr.name)
  );

  const plainDescription = stripHtml(
    raw.short_description || raw.description || ""
  );

  return {
    _id: raw.id,
    title: raw.name,
    slug: raw.slug,
    image: raw.images?.[0]?.src ?? "",
    relatedImages: raw.images?.slice(1).map((img) => img.src) ?? [],
    price,
    originalPrice: regularPrice || price,
    discount,
    // Store API only reports a numeric remaining count once stock is low;
    // treat "in stock, no count given" as unknown (null) rather than 0 so
    // the UI doesn't show "0 In Stock" for healthy inventory.
    quantity: raw.is_in_stock ? raw.low_stock_remaining ?? null : 0,
    sku: raw.sku ?? "",
    tags: raw.tags?.map((tag) => tag.name) ?? [],
    category: {
      name: raw.categories?.[0]?.name ?? "",
      slug: raw.categories?.[0]?.slug ?? "",
    },
    parent: raw.categories?.[0]?.name ?? "",
    children: raw.categories?.[1]?.name ?? "",
    // WooCommerce core has no brand entity; populated once a brand plugin
    // (guide §1a) is active and exposes brand data on the Store API response.
    brand: { name: "" },
    colors: colorAttribute?.terms.map((term) => term.name) ?? [],
    type: raw.type,
    itemInfo: "",
    description: plainDescription,
  };
}

export function mapStoreCategory(raw: WCStoreCategory): Category {
  return {
    _id: raw.id,
    slug: raw.slug,
    parent: raw.name,
    img: raw.image?.src ?? "",
    children: [],
    description: "",
    status: "Show",
  };
}

export function mapStoreCart(raw: WCStoreCart): Cart {
  const items = raw.items.map((item) => {
    const price = parseStorePrice(
      item.prices.price,
      item.prices.currency_minor_unit
    );
    const regularPrice = parseStorePrice(
      item.prices.regular_price,
      item.prices.currency_minor_unit
    );
    const discount =
      regularPrice > price && regularPrice > 0
        ? Math.round((1 - price / regularPrice) * 100)
        : 0;
    return {
      cartKey: item.key,
      _id: item.id,
      title: item.name,
      image: item.images?.[0]?.src ?? "",
      originalPrice: regularPrice || price,
      price,
      discount,
      orderQuantity: item.quantity,
    };
  });

  const shippingRates = (raw.shipping_rates?.[0]?.shipping_rates ?? []).map(
    (rate) => ({
      rateId: rate.rate_id,
      label: rate.name,
      price: parseStorePrice(rate.price, raw.totals.currency_minor_unit),
      selected: rate.selected,
    })
  );

  return {
    items,
    itemsCount: raw.items_count,
    subtotal: parseStorePrice(
      raw.totals.total_items,
      raw.totals.currency_minor_unit
    ),
    total: parseStorePrice(
      raw.totals.total_price,
      raw.totals.currency_minor_unit
    ),
    discountTotal: parseStorePrice(
      raw.totals.total_discount ?? "0",
      raw.totals.currency_minor_unit
    ),
    couponCodes: raw.coupons?.map((coupon) => coupon.code) ?? [],
    needsShipping: raw.needs_shipping,
    shippingRates,
  };
}
