import React from "react";

const CouponUpdateCart = () => {
  return (
    <div className="coupon-all">
      <div className="coupon">
        <input
          id="coupon_code"
          className="input-text"
          name="coupon_code"
          placeholder="Código de cupón"
          type="text"
        />
        <button
          className="tp-btn tp-btn-black"
          name="apply_coupon"
          type="submit"
        >
          Aplicar cupón
        </button>
      </div>
      <div className="coupon2">
        <button
          className="tp-btn tp-btn-black"
          name="update_cart"
          type="submit"
        >
          Actualizar carrito
        </button>
      </div>
    </div>
  );
};

export default CouponUpdateCart;
