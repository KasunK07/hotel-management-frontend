import { z } from "zod";
export const restaurantSchema = z.object({
  name: z.string().min(3, "Enter at least 3 characters"),
  address: z.string().min(8, "Enter a full address"),
  phone: z.string().min(9, "Enter a valid phone number"),
  email: z.email("Enter a valid email"),
});
export type RestaurantFormValues = z.infer<typeof restaurantSchema>;
