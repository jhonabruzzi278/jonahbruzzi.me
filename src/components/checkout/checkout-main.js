"use client";
import Link from "next/link";
// internal
import Header from "@layout/header";
import CartBreadcrumb from "@components/cart/cart-breadcrumb";
import Wrapper from "@layout/wrapper";
import CouponArea from "@components/checkout/coupon-area";
import CheckoutArea from "@components/checkout/checkout-area";
import Footer from "@layout/footer";
import ShopCta from "@components/cta";
import useCheckoutSubmit from "@hooks/use-checkout-submit";

export default function CheckoutMainArea() {
  const checkout_data = useCheckoutSubmit();
  const { cartItems } = checkout_data;
  return (
    <Wrapper>
      <Header style_2={true} />
      <CartBreadcrumb title="Pagar" subtitle="Pagar" />
      {cartItems.length === 0 ? (
        <div className="text-center pt-80 pb-80">
          <h3 className="py-2">No hay productos en el carro para pagar</h3>
          <Link href="/shop" className="tp-btn">
            Volver a la tienda
          </Link>
        </div>
      ) : (
        <>
          <CouponArea {...checkout_data} />
          <CheckoutArea {...checkout_data} />
        </>
      )}
      <ShopCta />
      <Footer />
    </Wrapper>
  );
}
