"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
// internal
import { notifyError, notifySuccess } from "@utils/toast";
import { set_shipping } from "src/redux/features/order/orderSlice";
import {
  useGetCartQuery,
  useSelectShippingRateMutation,
  useSubmitCheckoutMutation,
  useApplyCartCouponMutation,
  useRemoveCartCouponMutation,
} from "src/redux/features/cart/cartApi";

export const CHILE_REGIONS = [
  { code: "CL-AP", name: "Arica y Parinacota" },
  { code: "CL-TA", name: "Tarapacá" },
  { code: "CL-AN", name: "Antofagasta" },
  { code: "CL-AT", name: "Atacama" },
  { code: "CL-CO", name: "Coquimbo" },
  { code: "CL-VS", name: "Valparaíso" },
  { code: "CL-RM", name: "Región Metropolitana de Santiago" },
  { code: "CL-LI", name: "Libertador General Bernardo O'Higgins" },
  { code: "CL-ML", name: "Maule" },
  { code: "CL-NB", name: "Ñuble" },
  { code: "CL-BI", name: "Biobío" },
  { code: "CL-AR", name: "La Araucanía" },
  { code: "CL-LR", name: "Los Ríos" },
  { code: "CL-LL", name: "Los Lagos" },
  { code: "CL-AI", name: "Aysén del General Carlos Ibáñez del Campo" },
  { code: "CL-MA", name: "Magallanes" },
];

const PAYMENT_METHOD = "woo-mercado-pago-basic";

const useCheckoutSubmit = () => {
  const { data: cart } = useGetCartQuery();
  const [selectShippingRate] = useSelectShippingRateMutation();
  const [submitCheckout] = useSubmitCheckoutMutation();
  const [applyCartCoupon] = useApplyCartCouponMutation();
  const [removeCartCoupon] = useRemoveCartCouponMutation();
  const { shipping_info } = useSelector((state) => state.order);
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const cartItems = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shippingRates = cart?.shippingRates ?? [];
  const selectedRate = shippingRates.find((rate) => rate.selected);
  const shippingCost = cart?.needsShipping ? selectedRate?.price ?? 0 : 0;
  // cart.total (Store API totals.total_price) already includes shipping
  // once a rate is selected — don't add shippingCost again on top of it.
  const cartTotal = cart?.total ?? subtotal;

  // WooCommerce requires a shipping rate selected before checkout when the
  // cart needs shipping — there's currently only one rate configured
  // (flat_rate), so auto-select it instead of showing a picker.
  useEffect(() => {
    if (cart?.needsShipping && shippingRates.length > 0 && !selectedRate) {
      selectShippingRate({ rateId: shippingRates[0].rateId });
    }
  }, [cart?.needsShipping, shippingRates, selectedRate, selectShippingRate]);

  useEffect(() => {
    setValue("firstName", shipping_info.firstName);
    setValue("lastName", shipping_info.lastName);
    setValue("address", shipping_info.address);
    setValue("city", shipping_info.city);
    setValue("region", shipping_info.region);
    setValue("zipCode", shipping_info.zipCode);
    setValue("email", shipping_info.email);
    setValue("contact", shipping_info.contact);
  }, [setValue, shipping_info]);

  const handleCouponCode = async (e, couponRef) => {
    e.preventDefault();
    const code = couponRef.current?.value;
    if (!code) {
      notifyError("Ingresa un código de cupón");
      return;
    }
    try {
      await applyCartCoupon({ code }).unwrap();
      notifySuccess(`Cupón ${code} aplicado`);
    } catch (err) {
      notifyError(err.message || "Cupón inválido");
    }
  };

  const handleRemoveCoupon = async (code) => {
    try {
      await removeCartCoupon({ code }).unwrap();
    } catch (err) {
      notifyError(err.message || "No se pudo quitar el cupón");
    }
  };

  const submitHandler = async (data) => {
    dispatch(set_shipping(data));
    setCheckoutError("");
    setIsCheckoutSubmit(true);

    const address = {
      first_name: data.firstName,
      last_name: data.lastName,
      address_1: data.address,
      city: data.city,
      state: data.region,
      postcode: data.zipCode,
      country: "CL",
      email: data.email,
      phone: data.contact,
    };

    try {
      const result = await submitCheckout({
        billingAddress: address,
        shippingAddress: address,
        paymentMethod: PAYMENT_METHOD,
        customerNote: data.orderNotes ?? "",
      }).unwrap();

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
        return;
      }
      router.push(
        `/checkout/success?order_id=${result.orderId}&key=${result.orderKey}`
      );
    } catch (err) {
      setCheckoutError(err.message || "No se pudo procesar el pedido");
      notifyError(err.message || "No se pudo procesar el pedido");
      setIsCheckoutSubmit(false);
    }
  };

  return {
    cartItems,
    subtotal,
    discountTotal: cart?.discountTotal ?? 0,
    shippingCost,
    cartTotal,
    couponCodes: cart?.couponCodes ?? [],
    handleCouponCode,
    handleRemoveCoupon,
    isCheckoutSubmit,
    checkoutError,
    register,
    errors,
    handleSubmit,
    submitHandler,
  };
};

export default useCheckoutSubmit;
