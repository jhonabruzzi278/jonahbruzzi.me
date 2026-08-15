import React from "react";
// internal
import { formatPrice } from "@config/site";

const OrderSingleCartItem = ({ title, quantity, price }) => {
  return (
    <tr className="cart_item">
      <td className="product-name">
        {title} <strong className="product-quantity"> × {quantity}</strong>
      </td>
      <td className="product-total text-end">
        <span className="amount">{formatPrice(price * quantity)}</span>
      </td>
    </tr>
  );
};

export default OrderSingleCartItem;
