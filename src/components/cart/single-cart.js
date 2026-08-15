import React from "react";
import Image from "next/image";
import Link from "next/link";
// internal
import {Minus,Plus} from "@svg/index";
import {
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "src/redux/features/cart/cartApi";

const SingleCartItem = ({item}) => {
  const {_id,cartKey,image,title,originalPrice,orderQuantity=0} = item || {};
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  // handle increment
  const handleAddProduct = () => {
    updateCartItem({ key: cartKey, quantity: orderQuantity + 1 });
  }

  // handle decrement product
  const handleDecrement = () => {
    if (orderQuantity > 1) {
      updateCartItem({ key: cartKey, quantity: orderQuantity - 1 });
    }
  }

  // handle remove product
  const handleRemovePrd = () => {
    removeCartItem({ key: cartKey });
  }

  // handleChange
  const handleChange = (e) => {}
  return (
    <tr>
      <td className="product-thumbnail">
        <Link href={`product-details/${_id}`}>
          {image ? (
            <Image src={image} alt="cart img" width={125} height={125} />
          ) : (
            <div style={{ width: 125, height: 125, background: "var(--jb-background)" }} />
          )}
        </Link>
      </td>
      <td className="product-name">
        <Link href={`product-details/${_id}`}>{title}</Link>
      </td>
      <td className="product-price">
        <span className="amount">${originalPrice}</span>
      </td>
      <td className="product-quantity">
        <div className="tp-product-quantity mt-10 mb-10">
          <span className="tp-cart-minus" onClick={()=> handleDecrement(item)}>
            <Minus/>
          </span>
          <input className="tp-cart-input" type="text" value={orderQuantity} onChange={handleChange} />
          <span className="tp-cart-plus" onClick={()=> handleAddProduct(item)}>
            <Plus/>
          </span>
        </div>
      </td>
      <td className="product-subtotal">
        <span className="amount">${(originalPrice * orderQuantity).toFixed(2)}</span>
      </td>
      <td className="product-remove">
        <button type="submit" onClick={()=> handleRemovePrd(item)}>
          <i className="fa fa-times"></i>
        </button>
      </td>
    </tr>
  );
};

export default SingleCartItem;
