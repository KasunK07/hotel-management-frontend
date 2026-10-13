import { useQuery } from "@tanstack/react-query";
import { menuItems, orders, salesTrend } from "../../../mocks/data";
import { fetchMock } from "../../shared/api/mock-api";
export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchMock({ orders, menuItems, salesTrend }),
  });
}
