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

  if (!isLoading && !isError && categories?.categories?.length === 0) {
    content = <ErrorMessage message="¡No se encontraron categorías!" />;
  }

  if (!isLoading && !isError && categories?.categories?.length > 0) {
    const category_items = categories.categories;
    // WooCommerce categories are a flat list (no parent/child nesting from
    // the Store API), unlike the old Mongo schema — each category links
    // straight to its filtered shop view via its real slug.
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
