import {
  getOrderByIdAndKey,
  getCustomerOrders,
  getCustomerOrderById,
  type OrderSummary,
  type OrderInvoice,
  type OrderStats,
} from "@lib/woocommerce/orders";

export function fetchOrder(id: number, key: string): Promise<OrderSummary | null> {
  return getOrderByIdAndKey(id, key);
}

export function fetchCustomerOrders(
  customerId: number
): Promise<{ orders: OrderSummary[]; stats: OrderStats }> {
  return getCustomerOrders(customerId);
}

export function fetchCustomerOrder(
  customerId: number,
  orderId: number
): Promise<OrderInvoice | null> {
  return getCustomerOrderById(customerId, orderId);
}
