import { create } from "zustand";
interface AppState {
  restaurantId: string;
  setRestaurantId: (restaurantId: string) => void;
}
export const useAppStore = create<AppState>((set) => ({
  restaurantId: "",
  setRestaurantId: (restaurantId) => set({ restaurantId }),
}));
