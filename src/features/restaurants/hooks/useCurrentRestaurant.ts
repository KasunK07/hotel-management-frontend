import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "../../../stores/app-store";
import { listRestaurants } from "../api/restaurant-api";

export function useCurrentRestaurant() {
  const selectedID = useAppStore((state) => state.restaurantId);
  const restaurantsQuery = useQuery({ queryKey: ["restaurants"], queryFn: listRestaurants });
  const restaurant = restaurantsQuery.data?.find((item) => item.id === selectedID) || restaurantsQuery.data?.[0];
  return { restaurant, restaurantID: restaurant?.id || "", restaurantsQuery };
}
