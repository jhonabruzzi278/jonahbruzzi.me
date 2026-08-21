import React from "react";
// internal
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import HeroBanner from "@components/hero-banner";
import ShopCategoryArea from "@components/shop-category/shop-category";
import ShopProducts from "@components/products";
import OfferPopularProduct from "@components/offer-product";
import ShopBanner from "@components/shop-banner";
import ShopFeature from "@components/shop-feature";
import ShopCta from "@components/cta";
import Footer from "@layout/footer";
import { siteConfig } from "@config/site";

export const metadata = {
  title: "Jonahbruzzi | Cosas que vale la pena descubrir."
};

function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    email: "contacto@jonahbruzzi.me",
    areaServed: "CL",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const HomeShop = () => {
  return (
    <Wrapper>
      <OrganizationJsonLd />
      <Header />
      <HeroBanner />
      <ShopCategoryArea />
      <ShopProducts />
      <OfferPopularProduct />
      <ShopBanner />
      <ShopFeature />
      <ShopCta />
      <Footer />
    </Wrapper>
  );
};

export default HomeShop;
