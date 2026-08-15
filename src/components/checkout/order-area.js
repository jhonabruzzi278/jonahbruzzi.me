import React from "react";
// internal
import { formatPrice } from "@config/site";
import OrderDetails from "./order-details";
import OrderSingleCartItem from "./order-single-cart-item";

const OrderArea = ({
  cartItems,
  subtotal,
  discountTotal,
  shippingCost,
  cartTotal,
  isCheckoutSubmit,
  checkoutError,
}) => {
  return (
    <div className="your-order mb-30 ">
      <h3>Tu pedido</h3>
      <div className="your-order-table table-responsive">
        <table>
          <thead>
            <tr>
              <th className="product-name">Producto</th>
              <th className="product-total text-end">Total</th>
            </tr>
          </thead>
          <tbody>
            {cartItems?.map((item) => (
              <OrderSingleCartItem
                key={item.cartKey}
                title={item.title}
                quantity={item.orderQuantity}
                price={item.price}
              />
            ))}
          </tbody>
          <tfoot>
            <OrderDetails
              subtotal={subtotal}
              discountTotal={discountTotal}
              shippingCost={shippingCost}
              cartTotal={cartTotal}
            />
          </tfoot>
        </table>
      </div>

      <div className="payment-method faq__wrapper tp-accordion">
        <div className="accordion" id="checkoutAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header" id="checkoutOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#bankOne"
                aria-expanded="true"
                aria-controls="bankOne"
              >
                Mercado Pago
                <span className="accordion-btn"></span>
              </button>
            </h2>
            <div
              id="bankOne"
              className="accordion-collapse collapse show"
              aria-labelledby="checkoutOne"
              data-bs-parent="#checkoutAccordion"
            >
              <div className="accordion-body">
                <p>
                  Serás redirigido a Mercado Pago para completar tu pago de
                  forma segura ({formatPrice(cartTotal)}).
                </p>
                <div className="order-button-payment mt-25">
                  <button
                    type="submit"
                    className="tp-btn"
                    disabled={cartItems.length === 0 || isCheckoutSubmit}
                  >
                    {isCheckoutSubmit ? "Procesando..." : "Realizar pedido"}
                  </button>
                </div>
                {checkoutError && (
                  <p className="mt-15" style={{ color: "red" }}>
                    {checkoutError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderArea;
