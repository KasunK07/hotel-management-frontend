import { apiRequest } from "../../shared/api/http";

export type OrderStatus = "NEW" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

export interface OrderLine {
  id: string;
  menu_item_id: string | null;
  name: string;
  unit_price: number;
  quantity: number;
  note: string;
}

export interface RestaurantOrder {
  id: string;
  restaurant_id: string;
  table_id: string;
  table_name: string;
  customer_name: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  items: OrderLine[];
}

export interface CreateOrderInput {
  table_id: string;
  customer_name: string;
  items: { menu_item_id: string; quantity: number; note: string }[];
}

const path = (restaurantID: string) => `/restaurants/${restaurantID}/orders`;

export const listOrders = (restaurantID: string) =>
  apiRequest<RestaurantOrder[]>(path(restaurantID)).then((data) => data || []);

export const createOrder = (restaurantID: string, input: CreateOrderInput) =>
  apiRequest<RestaurantOrder>(path(restaurantID), { method: "POST", body: JSON.stringify(input) });

export const setOrderStatus = (restaurantID: string, orderID: string, status: OrderStatus) =>
  apiRequest<RestaurantOrder>(`${path(restaurantID)}/${orderID}/status`, { method: "PUT", body: JSON.stringify({ status }) });

export const nextOrderStatus = (status: OrderStatus): OrderStatus | null => {
  switch (status) {
    case "NEW": return "PREPARING";
    case "PREPARING": return "READY";
    case "READY": return "COMPLETED";
    default: return null;
  }
};
