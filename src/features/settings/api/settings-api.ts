import { apiRequest } from "../../shared/api/http";

export interface RestaurantSettings {
  restaurant_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  accept_orders: boolean;
  auto_accept: boolean;
  qr_ordering: boolean;
  prep_minutes: number;
  minimum_order: number;
  staff_confirmation: boolean;
  show_table_name: boolean;
  welcome_message: string;
  service_charge: number;
  currency: "LKR" | "USD";
  timezone: string;
  language: "en" | "si" | "ta";
}

export interface OpeningHour {
  weekday: number;
  is_closed: boolean;
  open_time: string;
  close_time: string;
}

const path = (restaurantID: string) => `/restaurants/${restaurantID}`;

export const getSettings = (restaurantID: string) => apiRequest<RestaurantSettings>(`${path(restaurantID)}/settings`);
export const updateSettings = (restaurantID: string, input: RestaurantSettings) => apiRequest<RestaurantSettings>(`${path(restaurantID)}/settings`, { method: "PUT", body: JSON.stringify(input) });
export const listHours = (restaurantID: string) => apiRequest<OpeningHour[]>(`${path(restaurantID)}/hours`).then((data) => data || []);
export const putHours = (restaurantID: string, hours: OpeningHour[]) => apiRequest<void>(`${path(restaurantID)}/hours`, { method: "PUT", body: JSON.stringify({ hours }) });
