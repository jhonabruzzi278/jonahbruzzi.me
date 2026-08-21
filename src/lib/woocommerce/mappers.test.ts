import { describe, it, expect } from "vitest";
import {
  parseStorePrice,
  mapStoreProduct,
  mapStoreCategory,
  mapStoreCart,
} from "./mappers";
import type {
  WCStoreProduct,
  WCStoreCategory,
  WCStoreCart,
  WCStoreCartItem,
} from "./types";

function makeProduct(overrides: Partial<WCStoreProduct> = {}): WCStoreProduct {
  return {
    id: 1,
    name: "Auriculares Bluetooth",
    slug: "auriculares-bluetooth",
    sku: "SKU-1",
    description: "<p>Descripción <strong>larga</strong></p>",
    short_description: "<p>Resumen corto</p>",
    type: "simple",
    prices: {
      price: "1499000",
      regular_price: "1499000",
      sale_price: "",
      currency_minor_unit: 2,
    },
    images: [],
    categories: [],
    tags: [],
    attributes: [],
    is_in_stock: true,
    low_stock_remaining: null,
    ...overrides,
  };
}

describe("parseStorePrice", () => {
  it("converts a minor-unit string amount to a decimal number", () => {
    expect(parseStorePrice("1499000", 2)).toBe(14990);
  });

  it("handles minorUnit 0 as a passthrough", () => {
    expect(parseStorePrice("19990", 0)).toBe(19990);
  });

  it("returns 0 for a non-numeric amount instead of NaN", () => {
    expect(parseStorePrice("not-a-number", 2)).toBe(0);
  });

  it("returns 0 for an empty string", () => {
    expect(parseStorePrice("", 2)).toBe(0);
  });
});

describe("mapStoreProduct", () => {
  it("maps identity, title and slug straight through", () => {
    const product = mapStoreProduct(makeProduct());
    expect(product._id).toBe(1);
    expect(product.title).toBe("Auriculares Bluetooth");
    expect(product.slug).toBe("auriculares-bluetooth");
  });

  it("computes no discount when price equals regular_price", () => {
    const product = mapStoreProduct(makeProduct());
    expect(product.price).toBe(14990);
    expect(product.originalPrice).toBe(14990);
    expect(product.discount).toBe(0);
  });

  it("computes a rounded percentage discount when price is on sale", () => {
    const raw = makeProduct({
      prices: {
        price: "1000000",
        regular_price: "1499000",
        sale_price: "1000000",
        currency_minor_unit: 2,
      },
    });
    const product = mapStoreProduct(raw);
    expect(product.price).toBe(10000);
    expect(product.originalPrice).toBe(14990);
    // (1 - 10000/14990) * 100 ≈ 33.29 → rounds to 33
    expect(product.discount).toBe(33);
  });

  it("does not report a discount when regular_price is 0 (unknown)", () => {
    const raw = makeProduct({
      prices: {
        price: "0",
        regular_price: "0",
        sale_price: "",
        currency_minor_unit: 2,
      },
    });
    const product = mapStoreProduct(raw);
    expect(product.discount).toBe(0);
    // falls back to price when regularPrice is falsy
    expect(product.originalPrice).toBe(0);
  });

  it("takes the first image as image and the rest as relatedImages", () => {
    const raw = makeProduct({
      images: [
        { id: 1, src: "a.jpg", thumbnail: "a-thumb.jpg", name: "a", alt: "a" },
        { id: 2, src: "b.jpg", thumbnail: "b-thumb.jpg", name: "b", alt: "b" },
        { id: 3, src: "c.jpg", thumbnail: "c-thumb.jpg", name: "c", alt: "c" },
      ],
    });
    const product = mapStoreProduct(raw);
    expect(product.image).toBe("a.jpg");
    expect(product.relatedImages).toEqual(["b.jpg", "c.jpg"]);
  });

  it("defaults image to an empty string when there are no images", () => {
    const product = mapStoreProduct(makeProduct({ images: [] }));
    expect(product.image).toBe("");
    expect(product.relatedImages).toEqual([]);
  });

  it("treats healthy in-stock inventory (no low_stock count) as unknown quantity, not 0", () => {
    const product = mapStoreProduct(
      makeProduct({ is_in_stock: true, low_stock_remaining: null })
    );
    expect(product.quantity).toBeNull();
  });

  it("reports the low stock count when WooCommerce provides one", () => {
    const product = mapStoreProduct(
      makeProduct({ is_in_stock: true, low_stock_remaining: 3 })
    );
    expect(product.quantity).toBe(3);
  });

  it("reports quantity 0 when the product is out of stock", () => {
    const product = mapStoreProduct(
      makeProduct({ is_in_stock: false, low_stock_remaining: null })
    );
    expect(product.quantity).toBe(0);
  });

  it("extracts color terms from a color/colour attribute case-insensitively", () => {
    const raw = makeProduct({
      attributes: [
        {
          id: 10,
          name: "Colour",
          taxonomy: "pa_color",
          has_variations: true,
          terms: [
            { id: 1, name: "Rojo", slug: "rojo" },
            { id: 2, name: "Azul", slug: "azul" },
          ],
        },
        {
          id: 11,
          name: "Material",
          taxonomy: "pa_material",
          has_variations: false,
          terms: [{ id: 3, name: "Algodón", slug: "algodon" }],
        },
      ],
    });
    const product = mapStoreProduct(raw);
    expect(product.colors).toEqual(["Rojo", "Azul"]);
  });

  it("defaults colors to an empty array when there is no color attribute", () => {
    const product = mapStoreProduct(makeProduct({ attributes: [] }));
    expect(product.colors).toEqual([]);
  });

  it("maps tags to their names", () => {
    const raw = makeProduct({
      tags: [
        { id: 1, name: "nuevo", slug: "nuevo" },
        { id: 2, name: "oferta", slug: "oferta" },
      ],
    });
    expect(mapStoreProduct(raw).tags).toEqual(["nuevo", "oferta"]);
  });

  it("defaults tags to an empty array when tags is missing at runtime", () => {
    const raw = makeProduct();
    // @ts-expect-error simulating a runtime response missing tags
    delete raw.tags;
    expect(mapStoreProduct(raw).tags).toEqual([]);
  });

  it("maps the first category as category/parent and the second as children", () => {
    const raw = makeProduct({
      categories: [
        { id: 1, name: "Tecnología", slug: "tecnologia", link: "" },
        { id: 2, name: "Audio", slug: "audio", link: "" },
      ],
    });
    const product = mapStoreProduct(raw);
    expect(product.category).toEqual({ name: "Tecnología", slug: "tecnologia" });
    expect(product.parent).toBe("Tecnología");
    expect(product.children).toBe("Audio");
  });

  it("strips HTML tags and collapses whitespace in the description", () => {
    const raw = makeProduct({
      short_description: "<p>Hola   <strong>mundo</strong>\n\n  bonito</p>",
    });
    const product = mapStoreProduct(raw);
    expect(product.description).toBe("Hola mundo bonito");
  });

  it("falls back to the full description when short_description is empty", () => {
    const raw = makeProduct({
      short_description: "",
      description: "<div>Texto completo</div>",
    });
    const product = mapStoreProduct(raw);
    expect(product.description).toBe("Texto completo");
  });
});

describe("mapStoreCategory", () => {
  it("maps id, slug and uses name as parent", () => {
    const raw: WCStoreCategory = {
      id: 5,
      name: "Hogar",
      slug: "hogar",
      parent: 0,
      count: 12,
      image: { src: "hogar.jpg" },
    };
    const category = mapStoreCategory(raw);
    expect(category._id).toBe(5);
    expect(category.slug).toBe("hogar");
    expect(category.parent).toBe("Hogar");
    expect(category.img).toBe("hogar.jpg");
    expect(category.status).toBe("Show");
    expect(category.count).toBe(12);
  });

  it("defaults img to an empty string when there is no image", () => {
    const raw: WCStoreCategory = {
      id: 6,
      name: "Moda",
      slug: "moda",
      parent: 0,
      count: 0,
      image: null,
    };
    expect(mapStoreCategory(raw).img).toBe("");
  });
});

function makeCartItem(overrides: Partial<WCStoreCartItem> = {}): WCStoreCartItem {
  return {
    key: "item-key-1",
    id: 42,
    quantity: 2,
    name: "Mochila",
    images: [{ id: 1, src: "mochila.jpg", thumbnail: "", name: "", alt: "" }],
    prices: {
      price: "2500000",
      regular_price: "3000000",
      sale_price: "2500000",
      currency_minor_unit: 2,
    },
    ...overrides,
  };
}

function makeCart(overrides: Partial<WCStoreCart> = {}): WCStoreCart {
  return {
    items: [makeCartItem()],
    items_count: 2,
    coupons: [{ code: "DESCUENTO10" }],
    totals: {
      total_items: "2500000",
      total_price: "2500000",
      total_discount: "500000",
      currency_minor_unit: 2,
    },
    needs_shipping: true,
    shipping_rates: [
      {
        package_id: 0,
        shipping_rates: [
          { rate_id: "flat_rate:1", name: "Envío estándar", price: "300000", selected: true },
        ],
      },
    ],
    ...overrides,
  };
}

describe("mapStoreCart", () => {
  it("maps items, totals and shipping rates", () => {
    const cart = mapStoreCart(makeCart());

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]).toMatchObject({
      cartKey: "item-key-1",
      _id: 42,
      title: "Mochila",
      image: "mochila.jpg",
      price: 25000,
      originalPrice: 30000,
      discount: 17,
      orderQuantity: 2,
    });

    expect(cart.itemsCount).toBe(2);
    expect(cart.subtotal).toBe(25000);
    expect(cart.total).toBe(25000);
    expect(cart.discountTotal).toBe(5000);
    expect(cart.couponCodes).toEqual(["DESCUENTO10"]);
    expect(cart.needsShipping).toBe(true);
    expect(cart.shippingRates).toEqual([
      { rateId: "flat_rate:1", label: "Envío estándar", price: 3000, selected: true },
    ]);
  });

  it("defaults discountTotal to 0 when total_discount is missing at runtime", () => {
    const raw = makeCart();
    // @ts-expect-error simulating a runtime response missing an optional-in-practice field
    delete raw.totals.total_discount;
    expect(mapStoreCart(raw).discountTotal).toBe(0);
  });

  it("defaults couponCodes to an empty array when coupons is missing at runtime", () => {
    const raw = makeCart();
    // @ts-expect-error simulating a runtime response missing coupons
    delete raw.coupons;
    expect(mapStoreCart(raw).couponCodes).toEqual([]);
  });

  it("defaults shippingRates to an empty array when there are no shipping packages", () => {
    const cart = mapStoreCart(makeCart({ shipping_rates: [] }));
    expect(cart.shippingRates).toEqual([]);
  });

  it("maps an empty cart without throwing", () => {
    const cart = mapStoreCart(
      makeCart({
        items: [],
        items_count: 0,
        totals: {
          total_items: "0",
          total_price: "0",
          total_discount: "0",
          currency_minor_unit: 2,
        },
      })
    );
    expect(cart.items).toEqual([]);
    expect(cart.total).toBe(0);
  });
});
