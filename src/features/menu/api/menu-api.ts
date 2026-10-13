import { getSession } from "../../auth/api/auth-api";
import { apiRequest } from "../../shared/api/http";
import type { MenuItemFormValues } from "../schemas/menu-item-schema";

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
}

export interface Cuisine {
  id: string;
  name: string;
}

function businessID() {
  const id = getSession()?.business_id;
  if (!id) throw new Error("Sign in to manage the menu.");
  return id;
}

export async function listCategories(restaurantID: string): Promise<MenuCategory[]> {
  return (await apiRequest<MenuCategory[]>(`/menu/restaurants/${restaurantID}/businesses/${businessID()}/categories`)) || [];
}

export async function listMenuItems(restaurantID: string, categories: MenuCategory[]): Promise<MenuItem[]> {
  const lists = await Promise.all(categories.map((category) =>
    apiRequest<MenuItem[]>(`/menu/categories/${category.id}/restaurants/${restaurantID}/businesses/${businessID()}/items`)
  ));
  return lists.flatMap((items) => items || []);
}

export async function createCategory(restaurantID: string, name: string) {
  await apiRequest<undefined>("/menu/save/category", {
    method: "POST", body: JSON.stringify({ restaurant_id: restaurantID, name }),
  });
}

export const updateCategory = (restaurantID: string, categoryID: string, name: string) =>
  apiRequest<MenuCategory>(`/restaurants/${restaurantID}/categories/${categoryID}`, { method: "PUT", body: JSON.stringify({ name }) });

export const deleteCategory = (restaurantID: string, categoryID: string) =>
  apiRequest<void>(`/restaurants/${restaurantID}/categories/${categoryID}`, { method: "DELETE" });

export async function createMenuItem(restaurantID: string, values: MenuItemFormValues) {
  await apiRequest<undefined>("/menu/save/item", {
    method: "POST",
    body: JSON.stringify({
      restaurant_id: restaurantID,
      category_id: values.category,
      name: values.name,
      description: values.description,
      price: values.price,
      is_available: values.available,
    }),
  });
}

export const updateMenuItem = (restaurantID: string, itemID: string, values: MenuItemFormValues) =>
  apiRequest<MenuItem>(`/restaurants/${restaurantID}/menu-items/${itemID}`, {
    method: "PUT",
    body: JSON.stringify({ category_id: values.category, name: values.name, description: values.description, price: values.price, is_available: values.available }),
  });

export const deleteMenuItem = (restaurantID: string, itemID: string) =>
  apiRequest<void>(`/restaurants/${restaurantID}/menu-items/${itemID}`, { method: "DELETE" });

export const listCuisines = (restaurantID: string) =>
  apiRequest<Cuisine[]>(`/restaurants/${restaurantID}/cuisines`).then((data) => data || []);

export const addCuisine = (restaurantID: string, name: string) =>
  apiRequest<Cuisine>(`/restaurants/${restaurantID}/cuisines`, { method: "POST", body: JSON.stringify({ name }) });

export const removeCuisine = (restaurantID: string, cuisineID: string) =>
  apiRequest<void>(`/restaurants/${restaurantID}/cuisines/${cuisineID}`, { method: "DELETE" });
