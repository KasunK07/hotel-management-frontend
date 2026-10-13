import { getSession } from "../../auth/api/auth-api";
import { apiRequest } from "../../shared/api/http";
import type { RestaurantFormValues } from "../schemas/restaurant-schema";

export interface RestaurantRecord {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string;
  created_at: string;
}

export function listRestaurants(): Promise<RestaurantRecord[]> {
  const businessID = getSession()?.business_id;
  if (!businessID) return Promise.reject(new Error("Sign in to view restaurants."));
  return apiRequest<RestaurantRecord[]>(`/restaurant/all/${businessID}`).then((records) => records || []);
}

export function createRestaurant(values: RestaurantFormValues): Promise<RestaurantRecord> {
  return apiRequest<RestaurantRecord>("/restaurant/save", { method: "POST", body: JSON.stringify(values) });
}

export function updateRestaurant(id: string, values: RestaurantFormValues): Promise<RestaurantRecord> {
  return apiRequest<RestaurantRecord>(`/restaurants/${id}`, { method: "PUT", body: JSON.stringify(values) });
}

export function deleteRestaurant(id: string): Promise<void> {
  return apiRequest<void>(`/restaurants/${id}`, { method: "DELETE" });
}
