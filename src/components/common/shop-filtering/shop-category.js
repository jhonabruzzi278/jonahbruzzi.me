import React from "react";
import { useRouter } from "next/navigation";
// internal
import ErrorMessage from "@components/error-message/error";
import { useGetCategoriesQuery } from "src/redux/features/categoryApi";
import ShopCategoryLoader from "@components/loader/shop-category-loader";

const ShopCategory = () => {
  const router = useRouter();
  const { data: categories, isLoading, isError } = useGetCategoriesQuery();
  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <ShopCategoryLoader loading={isLoading}/>
    );
  }

  if (!isLoading && isError) {
    content = <ErrorMessage message="Ocurrió un error" />;
  }

  // Only show categories that actually have products — WooCommerce always
  // includes its "uncategorized" fallback bucket, and any category with 0
  // products is a dead filter link (leads to an empty shop view).
  const category_items = (categories?.categories ?? []).filter(
    (category) => category.slug !== "uncategorized" && category.count > 0
  );

  if (!isLoading && !isError && category_items.length === 0) {
    content = <ErrorMessage message="¡No se encontraron categorías!" />;
  }

  if (!isLoading && !isError && category_items.length > 0) {
    content = category_items.map((category) => (
      <div key={category._id} className="card">
        <div className="card-header white-bg">
          <h5 className="mb-0">
            <a
              onClick={() => router.push(`/shop?category=${category.slug}`)}
              style={{ cursor: "pointer" }}
              className="shop-accordion-btn"
            >
              {category.parent}
            </a>
          </h5>
        </div>
      </div>
    ));
  }

  return (
    <div className="accordion-item">
      <div className="sidebar__widget-content">
        <div className="categories">
          <div id="accordion-items">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default ShopCategory;
