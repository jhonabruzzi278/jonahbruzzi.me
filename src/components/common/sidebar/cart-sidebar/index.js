import React from "react";
import Link from "next/link";
// internal
import { useGetCartQuery } from "src/redux/features/cart/cartApi";
import SingleCartItem from "./single-cart-item";
import useCartInfo from "@hooks/use-cart-info";
import EmptyCart from "./empty-cart";


const CartSidebar = ({ isCartOpen, setIsCartOpen }) => {
  const { data: cart } = useGetCartQuery();
  const cart_products = cart?.items ?? [];
  const {total} = useCartInfo();

  return (
    <React.Fragment>
      <div className={`cartmini__area ${isCartOpen ? "cartmini-opened" : ""}`}>
        <div className="cartmini__wrapper d-flex justify-content-between flex-column">
          <div className="cartmini__top-wrapper ">
            <div className="cartmini__top p-relative">
              <div className="cartmini__title">
                <h4>Carrito de compras</h4>
              </div>
              <div className="cartmini__close">
                <button
                  onClick={() => setIsCartOpen(false)}
                  type="button"
                  className="cartmini__close-btn cartmini-close-btn"
                >
                  <i className="fal fa-times"></i>
                </button>
              </div>
            </div>
            {cart_products.length > 0 && (
              <div className="cartmini__widget">
                {cart_products.map((item) => (
                  <SingleCartItem key={item.cartKey} item={item} />
                ))}
              </div>
            )}
            {/* <!-- if no item in cart --> */}
            {cart_products.length === 0 && (
              <EmptyCart/>
            )}
          </div>
          <div className="cartmini__checkout">
            <div className="cartmini__checkout-title mb-30">
              <h4>Subtotal:</h4>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="cartmini__checkout-btn">
              <Link href="/cart" className="tp-btn mb-10 w-100">
                <span></span> ver carrito
              </Link>
              <Link href="/checkout" className="tp-btn-border w-100 cursor-pointer">
                <span></span> pagar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* overlay */}
      <div
        onClick={() => setIsCartOpen(false)}
        className={`body-overlay ${isCartOpen ? "opened" : ""}`}
      ></div>
    </React.Fragment>
  );
};

export default CartSidebar;
