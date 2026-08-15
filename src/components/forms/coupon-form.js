import React, { useRef } from "react";

const CouponForm = ({ handleCouponCode, couponCodes = [], handleRemoveCoupon }) => {
  const couponRef = useRef(null);
  return (
    <form onSubmit={(e) => handleCouponCode(e, couponRef)}>
      {couponCodes.length > 0 ? (
        <div>
          {couponCodes.map((code) => (
            <p key={code}>
              Cupón <strong>{code}</strong> aplicado{" "}
              <button
                type="button"
                className="tp-btn tp-btn-2"
                onClick={() => handleRemoveCoupon(code)}
              >
                Quitar
              </button>
            </p>
          ))}
        </div>
      ) : (
        <p className="checkout-coupon">
          <input ref={couponRef} type="text" placeholder="Código del cupón" />
          <button className="tp-btn" type="submit">
            Aplicar Cupón
          </button>
        </p>
      )}
    </form>
  );
};

export default CouponForm;
