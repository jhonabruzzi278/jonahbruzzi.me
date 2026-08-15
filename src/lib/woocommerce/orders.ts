import { restApiFetch } from "./client";
import type { WCOrder } from "./types";

export interface OrderSummary {
  id: number;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  customerName: string;
  items: { name: string; quantity: number; total: number }[];
}

export interface OrderInvoice {
  id: number;
  status: string;
  createdAt: string;
  customerName: string;
  city: string;
  country: string;
  phone: string;
  paymentMethod: string;
  shippingCost: number;
  discount: number;
  total: number;
  items: { title: string; orderQuantity: number; price: number }[];
}

export interface OrderStats {
  totalDoc: number;
  pending: number;
  processing: number;
  delivered: number;
}

function toSummary(order: WCOrder): OrderSummary {
  return {
    id: order.id,
    status: order.status,
    total: Number(order.total),
    currency: order.currency,
    createdAt: order.date_created,
    customerName: `${order.billing.first_name} ${order.billing.last_name}`.trim(),
    items: order.line_items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      total: Number(item.total),
    })),
  };
}

function toInvoice(order: WCOrder): OrderInvoice {
  return {
    id: order.id,
    status: order.status,
    createdAt: order.date_created,
    customerName: `${order.billing.first_name} ${order.billing.last_name}`.trim(),
    city: order.billing.city,
    country: order.billing.country,
    phone: order.billing.phone,
    paymentMethod: order.payment_method_title,
    shippingCost: Number(order.shipping_total),
    discount: Number(order.discount_total),
    total: Number(order.total),
    items: order.line_items.map((item) => ({
      title: item.name,
      orderQuantity: item.quantity,
      price: Number(item.price),
    })),
  };
}

// WooCommerce's own statuses (pending, processing, on-hold, completed,
// cancelled, refunded, failed) don't map 1:1 onto the dashboard's three
// buckets — group them the way the UI expects.
function toStats(orders: WCOrder[]): OrderStats {
  return orders.reduce(
    (stats, order) => {
      stats.totalDoc += 1;
      if (order.status === "pending") stats.pending += 1;
      else if (order.status === "processing" || order.status === "on-hold")
        stats.processing += 1;
      else if (order.status === "completed") stats.delivered += 1;
      return stats;
    },
    { totalDoc: 0, pending: 0, processing: 0, delivered: 0 }
  );
}

/**
 * Order confirmation pages are reached via an unauthenticated payment
 * redirect, so the order_key (a random token WooCommerce generates per
 * order) is the only proof of ownership available — verify it matches
 * before returning any order data.
 */
export async function getOrderByIdAndKey(
  id: number,
  key: string
): Promise<OrderSummary | null> {
  try {
    const order = await restApiFetch<WCOrder>(`/orders/${id}`);
    if (!order || order.order_key !== key) return null;
    return toSummary(order);
  } catch {
    return null;
  }
}

export async function getCustomerOrders(
  customerId: number
): Promise<{ orders: OrderSummary[]; stats: OrderStats }> {
  const orders = await restApiFetch<WCOrder[]>(
    `/orders?customer=${customerId}&orderby=date&order=desc&per_page=100`
  );
  return { orders: orders.map(toSummary), stats: toStats(orders) };
}

/**
 * Order history detail views are reached from an authenticated dashboard,
 * so ownership is proven by the logged-in customer id rather than a key —
 * verify it matches before returning any order data.
 */
export async function getCustomerOrderById(
  customerId: number,
  orderId: number
): Promise<OrderInvoice | null> {
  try {
    const order = await restApiFetch<WCOrder>(`/orders/${orderId}`);
    if (!order || order.customer_id !== customerId) return null;
    return toInvoice(order);
  } catch {
    return null;
  }
}
