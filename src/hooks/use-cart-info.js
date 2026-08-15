import { useGetCartQuery } from "src/redux/features/cart/cartApi";

const useCartInfo = () => {
  const { data: cart } = useGetCartQuery();
  const quantity = cart?.itemsCount ?? 0;
  const total = cart?.subtotal ?? 0;

  return {
    quantity,
    total,
  };
};

export default useCartInfo;
