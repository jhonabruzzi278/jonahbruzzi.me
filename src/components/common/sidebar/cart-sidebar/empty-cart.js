import Image from "next/image";
import React from "react";
import Link from "next/link";
// internal
import empty_img from "@assets/img/product/cartmini/empty-cart.png";

const EmptyCart = ({ search_prd = false }) => {
  return (
    <div className="cartmini__empty text-center">
      <Image src={empty_img} alt="empty img" />
      <p>{search_prd ? `Lo sentimos 😥, no pudimos encontrar este producto` : `Tu carrito está vacío`}</p>
      {!search_prd && (
        <Link href="/shop" className="tp-btn">
          Ir a la tienda
        </Link>
      )}
    </div>
  );
};

export default EmptyCart;
