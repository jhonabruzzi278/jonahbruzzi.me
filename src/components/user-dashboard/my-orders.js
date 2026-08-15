import React from "react";
import MyOrderItems from "./my-order-items";

const MyOrders = ({ orderData }) => {
  const order_items = orderData?.orders;
  return (
    <div className="profile__ticket table-responsive">
      {!order_items ||
        (order_items?.length === 0 && (
          <div
            style={{ height: "210px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <i
                style={{ fontSize: "30px" }}
                className="fa-solid fa-cart-circle-xmark"
              ></i>
              <p>Todavía no tienes pedidos</p>
            </div>
          </div>
        ))}
      {order_items && order_items?.length > 0 && (
        <MyOrderItems itemsPerPage={8} items={order_items} />
      )}
    </div>
  );
};

export default MyOrders;
