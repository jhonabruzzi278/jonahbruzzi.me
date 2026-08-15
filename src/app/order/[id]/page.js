import SingleOrderArea from "@components/order-area";


export const metadata = {
  title: "Detalle del pedido",
};

const OrderPage = async ({ params }) => {
  const { id } = await params;
  return <SingleOrderArea orderId={id} />;
};

export default OrderPage;
