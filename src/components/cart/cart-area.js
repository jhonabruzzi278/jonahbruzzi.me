'use client';
import React from "react";
import Link from "next/link";
// internal
import { useGetCartQuery } from "src/redux/features/cart/cartApi";
import CartTotal from "./cart-total";
import SingleCartItem from "./single-cart";
import EmptyCart from "@components/common/sidebar/cart-sidebar/empty-cart";

// cart items

const CartArea = () => {
  const { data: cart } = useGetCartQuery();
  const cart_products = cart?.items ?? [];
  return (
    <section className="cart-area pt-100 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {cart_products.length > 0 && (
              <form onSubmit={e => e.preventDefault()}>
                <div className="table-content table-responsive">
                  <div className="tp-continue-shopping">
                    <p>
                      <Link href="/shop">
                        Seguir comprando <i className="fal fa-reply"></i>
                      </Link>
                    </p>
                  </div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="product-thumbnail">Imagen</th>
                        <th className="cart-product-name">Producto</th>
                        <th className="product-price">Precio unitario</th>
                        <th className="product-quantity">Cantidad</th>
                        <th className="product-subtotal">Total</th>
                        <th className="product-remove">Quitar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart_products.map((item) => (
                        <SingleCartItem key={item.cartKey} item={item} />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="row justify-content-end">
                  <div className="col-md-5 mr-auto">
                    {/* cart total */}
                    <CartTotal />
                    {/* cart total */}
                  </div>
                </div>
              </form>
            )}
            {cart_products.length === 0 && <EmptyCart />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartArea;
