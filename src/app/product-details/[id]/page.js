import { cache } from "react";
import ShopDetailsMainArea from "@components/product-details/product-details-area-main";
import { getProduct } from "@services/productService";
import { formatPrice, siteConfig } from "@config/site";

// generateMetadata and the page body both need the same product — cache()
// dedupes the fetch to one network call per request instead of two.
const getCachedProduct = cache((id) => getProduct(id));

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const product = await getCachedProduct(id);
    const description =
      product.description ||
      `${product.title} — ${formatPrice(product.price)} en ${siteConfig.name}.`;
    return {
      title: product.title,
      description,
      alternates: { canonical: `/product-details/${id}` },
      openGraph: {
        type: "website",
        title: product.title,
        description,
        images: product.image ? [{ url: product.image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description,
        images: product.image ? [product.image] : undefined,
      },
    };
  } catch {
    return { title: "Producto" };
  }
}

async function ProductJsonLd({ id }) {
  let product;
  try {
    product = await getCachedProduct(id);
  } catch {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || undefined,
    image: product.image || undefined,
    sku: product.sku || undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: siteConfig.currency,
      price: product.price,
      availability:
        product.quantity === 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `${siteConfig.url}/product-details/${id}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      // Product title/description come from our own WooCommerce catalog
      // (not raw user input), but escape "<" anyway so a stray "</script>"
      // in a product name can't break out of this tag.
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const ProductDetailsPage = async ({ params }) => {
  const { id } = await params;
  return (
    <>
      <ProductJsonLd id={id} />
      <ShopDetailsMainArea id={id} />
    </>
  );
};

export default ProductDetailsPage;
