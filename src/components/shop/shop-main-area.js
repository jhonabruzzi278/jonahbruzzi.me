'use client';
import { useState } from "react";
// internal
import Wrapper from "@layout/wrapper";
import Header from "@layout/header";
import ShopCta from "@components/cta";
import Footer from "@layout/footer";
import ShopBreadcrumb from "@components/common/breadcrumb/shop-breadcrumb";
import ShopArea from "@components/shop/shop-area";
import ErrorMessage from "@components/error-message/error";
import { useGetShowingProductsQuery } from "src/redux/features/productApi";
import ShopLoader from "@components/loader/shop-loader";

export default function ShopMainArea({ category, tag, brand, priceMin, max, priceMax, color }) {
  // category/tag are WooCommerce taxonomy slugs (see @layout/menu-data.js) —
  // filtered server-side via the Store API. Brand/color/price stay
  // client-side for now (no brand taxonomy plugin installed yet, see
  // migration plan Phase 1a).
  const { data: products, isError, isLoading } = useGetShowingProductsQuery({ category, tag });
  const [shortValue,setShortValue] = useState("");

  // selectShortHandler
  const selectShortHandler = (e) => {
    setShortValue(e.value);
  };

  // decide what to render
  let content = null;
  if (isLoading) {
    content = <ShopLoader loading={isLoading} />;
  }

  if (!isLoading && isError) {
    content = <ErrorMessage message="Ocurrió un error" />;
  }

  if (!isLoading && !isError && products?.products?.length === 0) {
    content = <ErrorMessage message="No se encontraron productos" />;
  }

  if (!isLoading && !isError && products?.products?.length > 0) {
    let all_products = products.products;
    let product_items = all_products;

    if (brand) {
      product_items = product_items.filter(
        (product) =>
          product.brand.name.toLowerCase().replace("&", "").split(" ").join("-") ===
          brand
      );
    }
    if (color) {
      product_items = product_items.filter((product) =>
        product.colors.includes(color)
      );
    }
    if (priceMin || max || priceMax) {
      product_items = product_items.filter((product) => {
        const price = Number(product.originalPrice);
        const minPrice = Number(priceMin);
        const maxPrice = Number(max);
        if (!priceMax && priceMin && max) {
          return price >= minPrice && price <= maxPrice;
        }
        if (priceMax) {
          return price >= priceMax;
        }
      });
    }
    // selectShortHandler
    if (shortValue === "Filtro rápido") {
      product_items = all_products
    }
    // Latest Product — WooCommerce product IDs are auto-incrementing, so
    // sorting by _id descending is equivalent to sorting by creation date
    // without needing an extra fetch (no "itemInfo"/date field is mapped
    // from the Store API response, see mapStoreProduct).
    if (shortValue === "Producto más reciente") {
      product_items = all_products.slice().sort((a, b) => b._id - a._id);
    }
    // Price low to high
    if (shortValue === "Precio menor a mayor") {
      product_items = all_products
        .slice()
        .sort((a, b) => Number(a.originalPrice) - Number(b.originalPrice));
    }
    // Price high to low
    if (shortValue === "Precio mayor a menor") {
      product_items = all_products
        .slice()
        .sort((a, b) => Number(b.originalPrice) - Number(a.originalPrice));
    }


    content = (
      <ShopArea
        products={product_items}
        all_products={all_products}
        shortHandler={selectShortHandler}
      />
    );
  }

  return (
    <Wrapper>
      <Header style_2={true} />
      <ShopBreadcrumb />
      {content}
      <ShopCta />
      <Footer />
    </Wrapper>
  );
}
