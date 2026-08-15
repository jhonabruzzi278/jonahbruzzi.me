import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRemoveCartItemMutation } from "src/redux/features/cart/cartApi";

const SingleCartItem = ({ item }) => {
  const { _id, cartKey, image, originalPrice, title, orderQuantity, discount } =
    item || {};
  const [removeCartItem] = useRemoveCartItemMutation();

  // handle remove cart
  const handleRemoveProduct = () => {
    removeCartItem({ key: cartKey });
  };
  return (
    <div className="cartmini__widget-item">
      {image && (
        <div className="cartmini__thumb">
          <Link href={`/product-details/${_id}`}>
            <Image src={image} alt="cart img" width={70} height={90} />
          </Link>
        </div>
      )}
      <div className="cartmini__content">
        <h5>
          <a href={`/product-details/${_id}`}>{title}</a>
        </h5>
        <div className="cartmini__price-wrapper">
          {!discount && (
            <span className="cartmini__price">${originalPrice}</span>
          )}
          {discount > 0 && (
            <span className="cartmini__price">
              $
              {(originalPrice - (originalPrice * discount) / 100) *
                orderQuantity}
            </span>
          )}
          <span className="cartmini__quantity">x{orderQuantity}</span>
        </div>
      </div>
      <button
        className="cartmini__del"
        onClick={() => handleRemoveProduct(item)}
      >
        <i className="fal fa-times"></i>
      </button>
    </div>
  );
};

export default SingleCartItem;
