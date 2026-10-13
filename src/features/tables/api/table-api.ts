import { apiRequest } from "../../shared/api/http";

export interface DiningTableRecord {
  id: string;
  restaurant_id: string;
  name: string;
  seats: number;
  area: string;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
  qr_token: string;
  qr_updated_at: string;
}

export interface TableInput { name: string; seats: number; area: string }

const path = (restaurantID: string) => `/restaurants/${restaurantID}/tables`;

export const listTables = (restaurantID: string) =>
  apiRequest<DiningTableRecord[]>(path(restaurantID)).then((data) => data || []);

export const createTable = (restaurantID: string, input: TableInput) =>
  apiRequest<DiningTableRecord>(path(restaurantID), { method: "POST", body: JSON.stringify(input) });

export const setTableStatus = (restaurantID: string, tableID: string, status: DiningTableRecord["status"]) =>
  apiRequest<DiningTableRecord>(`${path(restaurantID)}/${tableID}/status`, { method: "PUT", body: JSON.stringify({ status }) });

export const regenerateTableQR = (restaurantID: string, tableID: string) =>
  apiRequest<DiningTableRecord>(`${path(restaurantID)}/${tableID}/regenerate-qr`, { method: "POST" });

export const deleteTable = (restaurantID: string, tableID: string) =>
  apiRequest<void>(`${path(restaurantID)}/${tableID}`, { method: "DELETE" });

export function tableQRUrl(table: DiningTableRecord) {
  return `${window.location.origin}/table/${table.restaurant_id}/${table.id}?token=${table.qr_token}`;
}

export interface PublicTableRecord {
  restaurant_id: string;
  restaurant_name: string;
  table_id: string;
  table_name: string;
}

export const resolveTable = (restaurantID: string, tableID: string, token: string) =>
  apiRequest<PublicTableRecord>(`/public/restaurants/${restaurantID}/tables/${tableID}?token=${encodeURIComponent(token)}`);
