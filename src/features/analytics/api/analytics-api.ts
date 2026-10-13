import { apiRequest } from "../../shared/api/http";

export interface AnalyticsOverview {
  restaurant_count: number;
  order_count: number;
  revenue: number;
  average_order: number;
  restaurants: { restaurant_id: string; name: string; orders: number; revenue: number }[];
  daily: { day: string; orders: number; revenue: number }[];
}

export const getAnalytics = () => apiRequest<AnalyticsOverview>("/analytics/overview");
