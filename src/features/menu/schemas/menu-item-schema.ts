import { z } from "zod";
export const menuItemSchema = z.object({
  name: z.string().min(3, "Item name is required"),
  category: z.string().min(1, "Select a category"),
  price: z.number().min(1, "Price must be greater than zero"),
  description: z.string().min(10, "Add a short description"),
  available: z.boolean(),
});
export type MenuItemFormValues = z.infer<typeof menuItemSchema>;
