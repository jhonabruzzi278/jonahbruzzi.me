// Raw WooCommerce Store API shapes (subset — only the fields the mappers use)

export interface WCStoreImage {
  id: number;
  src: string;
  thumbnail: string;
  name: string;
  alt: string;
}

export interface WCStorePrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_minor_unit: number;
}

export interface WCStoreCategoryRef {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export interface WCStoreTag {
  id: number;
  name: string;
  slug: string;
}

export interface WCStoreAttributeTerm {
  id: number;
  name: string;
  slug: string;
}

export interface WCStoreAttribute {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: WCStoreAttributeTerm[];
}

export interface WCStoreProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  type: string;
  prices: WCStorePrices;
  images: WCStoreImage[];
  categories: WCStoreCategoryRef[];
  tags: WCStoreTag[];
  attributes: WCStoreAttribute[];
  is_in_stock: boolean;
  low_stock_remaining: number | null;
}

export interface WCStoreCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  image: { src: string } | null;
}

// Normalized shape the existing frontend components already consume
// (see src/components/products/single-product.js and
// product-details/product-details-area.js) — mappers.ts converts raw
// WooCommerce responses into this shape so UI components don't need to
// change during the migration.
export interface Product {
  _id: number;
  title: string;
  slug: string;
  image: string;
  relatedImages: string[];
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number | null;
  sku: string;
  tags: string[];
  category: { name: string; slug: string };
  parent: string;
  children: string;
  brand: { name: string };
  colors: string[];
  type: string;
  // Plain-text (HTML-stripped) short description — used for SEO meta
  // description and Product JSON-LD, not currently rendered in the UI.
  description: string;
}

export interface Category {
  _id: number;
  slug: string;
  parent: string;
  img: string;
  children: string[];
  description: string;
  status: "Show" | "Hide";
  count: number;
}

// Raw WooCommerce Store API cart shapes (subset)

export interface WCStoreCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  images: WCStoreImage[];
  prices: WCStorePrices;
}

export interface WCStoreCartCoupon {
  code: string;
}

export interface WCStoreCartTotals {
  total_items: string;
  total_price: string;
  total_discount: string;
  currency_minor_unit: number;
}

export interface WCStoreShippingRate {
  rate_id: string;
  name: string;
  price: string;
  selected: boolean;
}

export interface WCStoreShippingPackage {
  package_id: number | string;
  shipping_rates: WCStoreShippingRate[];
}

export interface WCStoreCart {
  items: WCStoreCartItem[];
  items_count: number;
  coupons: WCStoreCartCoupon[];
  totals: WCStoreCartTotals;
  needs_shipping: boolean;
  shipping_rates: WCStoreShippingPackage[];
}

// Normalized cart shape — mirrors the product shape's field names
// (_id/title/image/originalPrice/discount) so cart UI components stay
// close to how they read products elsewhere in the app.
export interface CartItem {
  cartKey: string;
  _id: number;
  title: string;
  image: string;
  originalPrice: number;
  price: number;
  discount: number;
  orderQuantity: number;
}

export interface ShippingRate {
  rateId: string;
  label: string;
  price: number;
  selected: boolean;
}

export interface Cart {
  items: CartItem[];
  itemsCount: number;
  // Items subtotal, before shipping/tax (Store API totals.total_items).
  subtotal: number;
  // Grand total, includes shipping/tax/discount once a shipping rate is
  // selected (Store API totals.total_price) — what checkout actually charges.
  total: number;
  discountTotal: number;
  couponCodes: string[];
  needsShipping: boolean;
  shippingRates: ShippingRate[];
}

// WooCommerce Store API address shape (used for both billing and shipping)
export interface WCStoreAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface WCStoreCheckoutResponse {
  order_id: number;
  status: string;
  order_key: string;
  payment_result: {
    payment_status: string;
    payment_details: { key: string; value: string }[];
    redirect_url: string;
  };
}

// WooCommerce REST API v3 order shape (subset)
export interface WCOrderBilling {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export interface WCOrderLineItem {
  name: string;
  quantity: number;
  price: number;
  total: string;
}

export interface WCOrder {
  id: number;
  customer_id: number;
  order_key: string;
  status: string;
  total: string;
  shipping_total: string;
  discount_total: string;
  currency: string;
  date_created: string;
  payment_method_title: string;
  billing: WCOrderBilling;
  line_items: WCOrderLineItem[];
}

// WooCommerce REST API v3 coupon shape (subset)
export interface WCCoupon {
  id: number;
  code: string;
  amount: string;
  discount_type: string;
  description: string;
  date_expires: string | null;
  minimum_amount: string;
}

// Normalized shape for the "Deal of the Day" promo cards — WooCommerce
// coupons have no built-in title/logo (that's a marketing concept the old
// Mongo schema had, not a native WC coupon field), so only percent-type
// coupons with an expiry date are shown, using the coupon code as the title.
export interface Coupon {
  _id: number;
  title: string;
  discountPercentage: number;
  endTime: string;
  minimumAmount: number;
  couponCode: string;
}
