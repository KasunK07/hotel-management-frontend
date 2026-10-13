export interface Restaurant {
  id: string;
  name: string;
  location: string;
  phone: string;
  status: "Open" | "Closed";
  hours: string;
  revenue: string;
  orders: number;
}
export interface Order {
  id: string;
  table: string;
  customer: string;
  time: string;
  total: number;
  status: "New" | "Preparing" | "Ready" | "Completed";
  items: { name: string; quantity: number; note?: string }[];
}
export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  status: "Available" | "Unavailable";
  orders: number;
  emoji: string;
  vegetarian?: boolean;
}
export interface DiningTable {
  id: number;
  name: string;
  seats: number;
  area: string;
  status: "Available" | "Occupied" | "Reserved";
  qrUpdated: string;
}
export interface Employee {
  id: number;
  name: string;
  initials: string;
  role: string;
  email: string;
  shift: string;
  status: "Active" | "Off duty";
}
