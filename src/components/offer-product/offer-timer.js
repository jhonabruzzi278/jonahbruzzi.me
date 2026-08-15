import React from "react";
import { useTimer } from "react-timer-hook";

const OfferTimer = ({expiryTimestamp}) => {
  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp });
  return (
    <div
      className="product__coupon-countdown"
      data-countdown=""
    >
      <div className="product__coupon-countdown-inner">
        <ul>
          <li>
            <span data-days="">{days}</span> Día
          </li>
          <li>
            <span data-hours="">{hours}</span> Hrs
          </li>
          <li>
            <span data-minutes="">{minutes}</span> Min
          </li>
          <li>
            <span data-seconds="">{seconds}</span> Seg
          </li>
        </ul>
      </div>
    </div>
  );
};

export default OfferTimer;
