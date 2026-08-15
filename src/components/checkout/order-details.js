import React from "react";
// internal
import { formatPrice } from "@config/site";

const OrderDetails = ({ subtotal, discountTotal, shippingCost, cartTotal }) => {
  return (
    <React.Fragment>
      <tr className="cart-subtotal">
        <th>Subtotal del carro</th>
        <td className="text-end">
          <span className="amount text-end">{formatPrice(subtotal)}</span>
        </td>
      </tr>

      {discountTotal > 0 && (
        <tr className="shipping">
          <th>Descuento</th>
          <td className="text-end">
            <strong>
              <span className="amount">-{formatPrice(discountTotal)}</span>
            </strong>
          </td>
        </tr>
      )}

      <tr className="shipping">
        <th>Envío</th>
        <td className="text-end">
          <strong>
            <span className="amount">{formatPrice(shippingCost)}</span>
          </strong>
        </td>
      </tr>

      <tr className="order-total">
        <th>Total</th>
        <td className="text-end">
          <strong>
            <span className="amount">{formatPrice(cartTotal)}</span>
          </strong>
        </td>
      </tr>
    </React.Fragment>
  );
};

export default OrderDetails;
