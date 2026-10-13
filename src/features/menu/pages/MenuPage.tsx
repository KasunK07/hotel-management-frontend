import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Badge, Button, Card, Grid, Group, Modal, NumberInput, Select, SimpleGrid, Stack, Switch, Text, TextInput, Textarea, Title } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { PageHeader } from "../../../components/shared/PageHeader";
import { useAppStore } from "../../../stores/app-store";
import { listRestaurants } from "../../restaurants/api/restaurant-api";
import { errorMessage } from "../../shared/api/http";
import { addCuisine, createCategory, createMenuItem, deleteCategory, deleteMenuItem, listCategories, listCuisines, listMenuItems, removeCuisine, updateCategory, updateMenuItem, type MenuCategory, type MenuItem } from "../api/menu-api";
import { menuItemSchema, type MenuItemFormValues } from "../schemas/menu-item-schema";

export function MenuPage() {
  const { restaurantId, setRestaurantId } = useAppStore();
  const queryClient = useQueryClient();
  const restaurantsQuery = useQuery({ queryKey: ["restaurants"], queryFn: listRestaurants });
  const activeRestaurantID = restaurantsQuery.data?.some((restaurant) => restaurant.id === restaurantId) ? restaurantId : restaurantsQuery.data?.[0]?.id || "";
  const activeRestaurant = restaurantsQuery.data?.find((restaurant) => restaurant.id === activeRestaurantID);
  const categoriesQuery = useQuery({ queryKey: ["categories", activeRestaurantID], queryFn: () => listCategories(activeRestaurantID), enabled: !!activeRestaurantID });
  const itemsQuery = useQuery({ queryKey: ["menu-items", activeRestaurantID], queryFn: () => listMenuItems(activeRestaurantID, categoriesQuery.data || []), enabled: !!activeRestaurantID && categoriesQuery.isSuccess });
  const cuisinesQuery = useQuery({ queryKey: ["cuisines", activeRestaurantID], queryFn: () => listCuisines(activeRestaurantID), enabled: !!activeRestaurantID });
  const addItem = useMutation({ mutationFn: (values: MenuItemFormValues) => createMenuItem(activeRestaurantID, values), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu-items", activeRestaurantID] }) });
  const addCategory = useMutation({ mutationFn: (name: string) => createCategory(activeRestaurantID, name), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories", activeRestaurantID] }) });
  const editItem = useMutation({ mutationFn: ({ id, values }: { id: string; values: MenuItemFormValues }) => updateMenuItem(activeRestaurantID, id, values), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu-items", activeRestaurantID] }) });
  const removeItem = useMutation({ mutationFn: (id: string) => deleteMenuItem(activeRestaurantID, id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu-items", activeRestaurantID] }) });
  const editCategory = useMutation({ mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory(activeRestaurantID, id, name), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories", activeRestaurantID] }) });
  const removeCategory = useMutation({ mutationFn: (id: string) => deleteCategory(activeRestaurantID, id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["categories", activeRestaurantID] }); queryClient.invalidateQueries({ queryKey: ["menu-items", activeRestaurantID] }); } });
  const saveCuisine = useMutation({ mutationFn: (name: string) => addCuisine(activeRestaurantID, name), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuisines", activeRestaurantID] }) });
  const deleteCuisine = useMutation({ mutationFn: (id: string) => removeCuisine(activeRestaurantID, id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuisines", activeRestaurantID] }) });
  const [itemModal, setItemModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ kind: "category" | "item"; id: string; name: string } | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [cuisineName, setCuisineName] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema), defaultValues: { name: "", category: "", description: "", price: 0, available: true },
  });
  const categories = categoriesQuery.data || [];
  const filtered = useMemo(() => (itemsQuery.data || []).filter((item) =>
    (categoryFilter === "all" || item.category_id === categoryFilter) && item.name.toLowerCase().includes(search.toLowerCase())
  ), [itemsQuery.data, categoryFilter, search]);

  const openNewItem = () => { setEditingItem(null); reset({ name: "", category: categories[0]?.id || "", description: "", price: 0, available: true }); setItemModal(true); };
  const openEditItem = (item: MenuItem) => { setEditingItem(item); reset({ name: item.name, category: item.category_id, description: item.description, price: item.price, available: item.is_available }); setItemModal(true); };
  const openNewCategory = () => { setEditingCategory(null); setCategoryName(""); setCategoryModal(true); };
  const openEditCategory = (category: MenuCategory) => { setEditingCategory(category); setCategoryName(category.name); setCategoryModal(true); };

  const submitItem = handleSubmit(async (values) => {
    try {
      if (editingItem) await editItem.mutateAsync({ id: editingItem.id, values });
      else await addItem.mutateAsync(values);
      notifications.show({ title: editingItem ? "Menu item updated" : "Menu item added", message: `${values.name} is on the menu.`, color: "forest" });
      setItemModal(false);
      setEditingItem(null);
      reset();
    } catch (error) { notifications.show({ title: "Could not save item", message: errorMessage(error), color: "red" }); }
  });

  async function submitCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (editingCategory) await editCategory.mutateAsync({ id: editingCategory.id, name: categoryName.trim() });
      else await addCategory.mutateAsync(categoryName.trim());
      setCategoryName(""); setCategoryModal(false); setEditingCategory(null);
      notifications.show({ message: "Category saved", color: "forest" });
    } catch (error) { notifications.show({ title: "Could not save category", message: errorMessage(error), color: "red" }); }
  }

  async function submitCuisine(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await saveCuisine.mutateAsync(cuisineName.trim()); setCuisineName("");
      notifications.show({ message: "Cuisine added", color: "forest" });
    } catch (error) { notifications.show({ title: "Could not add cuisine", message: errorMessage(error), color: "red" }); }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.kind === "category") {
        await removeCategory.mutateAsync(deleteTarget.id);
        if (categoryFilter === deleteTarget.id) setCategoryFilter("all");
      } else await removeItem.mutateAsync(deleteTarget.id);
      notifications.show({ message: `${deleteTarget.kind === "category" ? "Category" : "Item"} deleted`, color: "forest" });
      setDeleteTarget(null);
    } catch (error) { notifications.show({ title: "Could not delete", message: errorMessage(error), color: "red" }); }
  }

  return <Stack gap="xl">
    <PageHeader title="Menu management" description={activeRestaurant ? `Manage the menu for ${activeRestaurant.name}.` : "Choose a restaurant to manage its menu."} action={<Button leftSection={<IconPlus size={17}/>} onClick={openNewItem} disabled={!activeRestaurantID || !categories.length}>Add menu item</Button>} />
    {restaurantsQuery.isPending && <Text c="dimmed">Loading restaurants…</Text>}
    {restaurantsQuery.isError && <Text c="red">{errorMessage(restaurantsQuery.error)}</Text>}
    {restaurantsQuery.isSuccess && restaurantsQuery.data.length === 0 && <Card withBorder p="xl"><Text>No restaurants yet. Add one on the Restaurants page.</Text></Card>}
    {!!restaurantsQuery.data?.length && <>
      <Select label="Restaurant" data={restaurantsQuery.data.map((restaurant) => ({ value: restaurant.id, label: restaurant.name }))} value={activeRestaurantID} onChange={(value) => { if (value) { setRestaurantId(value); setCategoryFilter("all"); } }} maw={350} />
      <Group justify="space-between" align="end">
        <Title order={2} size="h3">Categories</Title>
        <Button variant="light" leftSection={<IconPlus size={16}/>} onClick={openNewCategory}>New category</Button>
      </Group>
      {categoriesQuery.isPending && <Text c="dimmed">Loading categories…</Text>}
      {categoriesQuery.isError && <Text c="red">{errorMessage(categoriesQuery.error)}</Text>}
      {categoriesQuery.isSuccess && categories.length === 0 && <Card withBorder p="xl"><Text>Create a category before adding menu items.</Text></Card>}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {categories.map((category) => <Card key={category.id} withBorder p="lg"><Group justify="space-between"><Text fw={700}>{category.name}</Text><Group gap="xs"><Button size="xs" variant="subtle" onClick={() => openEditCategory(category)}>Edit</Button><Button size="xs" variant="subtle" color="red" onClick={() => setDeleteTarget({ kind: "category", id: category.id, name: category.name })}>Delete</Button></Group></Group></Card>)}
      </SimpleGrid>
      <Title order={2} size="h3">Cuisines</Title>
      <form onSubmit={submitCuisine}><Group align="end"><TextInput label="Add cuisine" placeholder="e.g. Sri Lankan" required minLength={2} maxLength={100} value={cuisineName} onChange={(event) => setCuisineName(event.currentTarget.value)} /><Button type="submit" loading={saveCuisine.isPending}>Add</Button></Group></form>
      {cuisinesQuery.isPending && <Text c="dimmed">Loading cuisines…</Text>}
      {cuisinesQuery.isError && <Text c="red">{errorMessage(cuisinesQuery.error)}</Text>}
      {cuisinesQuery.isSuccess && cuisinesQuery.data.length === 0 && <Text size="sm" c="dimmed">No cuisines added yet.</Text>}
      <Group gap="xs">{cuisinesQuery.data?.map((cuisine) => <Badge key={cuisine.id} size="lg" variant="light" rightSection={<Button size="compact-xs" variant="subtle" color="red" aria-label={`Remove ${cuisine.name}`} loading={deleteCuisine.isPending} onClick={async () => { try { await deleteCuisine.mutateAsync(cuisine.id); } catch (error) { notifications.show({ title: "Could not remove cuisine", message: errorMessage(error), color: "red" }); } }}>×</Button>}>{cuisine.name}</Badge>)}</Group>
      <Title order={2} size="h3">Menu items</Title>
      <Group align="end">
        <TextInput label="Search" placeholder="Search menu items" leftSection={<IconSearch size={16}/>} value={search} onChange={(event) => setSearch(event.currentTarget.value)} />
        <Select label="Category" data={[{ value: "all", label: "All categories" }, ...categories.map((category) => ({ value: category.id, label: category.name }))]} value={categoryFilter} onChange={(value) => setCategoryFilter(value || "all")} />
      </Group>
      {itemsQuery.isPending && !!categories.length && <Text c="dimmed">Loading menu items…</Text>}
      {itemsQuery.isError && <Text c="red">{errorMessage(itemsQuery.error)}</Text>}
      {itemsQuery.isSuccess && filtered.length === 0 && <Card withBorder p="xl"><Text>No menu items match this view.</Text></Card>}
      <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
        {filtered.map((item) => <Card key={item.id} withBorder p="lg">
          <Group justify="space-between"><Text fw={700}>{item.name}</Text><Badge color={item.is_available ? "forest" : "gray"}>{item.is_available ? "Available" : "Unavailable"}</Badge></Group>
          <Text size="sm" c="dimmed" mt="xs">{categories.find((category) => category.id === item.category_id)?.name}</Text>
          <Text size="sm" mt="sm">{item.description}</Text>
          <Text fw={750} mt="md">Rs {item.price.toLocaleString()}</Text>
          <Group mt="sm" gap="xs"><Button size="xs" variant="light" onClick={() => openEditItem(item)}>Edit</Button><Button size="xs" variant="subtle" color="red" onClick={() => setDeleteTarget({ kind: "item", id: item.id, name: item.name })}>Delete</Button></Group>
        </Card>)}
      </SimpleGrid>
    </>}
    <Modal opened={categoryModal} onClose={() => setCategoryModal(false)} title={editingCategory ? "Edit category" : "New category"}>
      <form onSubmit={submitCategory}><Stack><TextInput label="Category name" required minLength={2} maxLength={100} value={categoryName} onChange={(event) => setCategoryName(event.currentTarget.value)} /><Button type="submit" loading={addCategory.isPending || editCategory.isPending}>{editingCategory ? "Save changes" : "Create category"}</Button></Stack></form>
    </Modal>
    <Modal opened={itemModal} onClose={() => setItemModal(false)} title={editingItem ? "Edit menu item" : "Add menu item"} size="lg">
      <form onSubmit={submitItem}><Stack>
        <TextInput label="Item name" required {...register("name")} error={errors.name?.message} />
        <Grid><Grid.Col span={7}><Controller name="category" control={control} render={({ field }) => <Select label="Category" required data={categories.map((category) => ({ value: category.id, label: category.name }))} {...field} error={errors.category?.message} />} /></Grid.Col>
        <Grid.Col span={5}><Controller name="price" control={control} render={({ field }) => <NumberInput label="Price (Rs)" required min={1} {...field} error={errors.price?.message} />} /></Grid.Col></Grid>
        <Textarea label="Description" required {...register("description")} error={errors.description?.message} />
        <Controller name="available" control={control} render={({ field }) => <Switch label="Available to order" checked={field.value} onChange={(event) => field.onChange(event.currentTarget.checked)} />} />
        <Group justify="flex-end"><Button variant="default" onClick={() => setItemModal(false)}>Cancel</Button><Button type="submit" loading={isSubmitting || addItem.isPending || editItem.isPending}>{editingItem ? "Save changes" : "Add item"}</Button></Group>
      </Stack></form>
    </Modal>
    <Modal opened={!!deleteTarget} onClose={() => setDeleteTarget(null)} title={`Delete ${deleteTarget?.kind}?`} centered><Stack><Text>Delete {deleteTarget?.name}? This cannot be undone{deleteTarget?.kind === "category" ? ", and its menu items may also be removed" : ""}.</Text><Group justify="flex-end"><Button variant="default" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button color="red" loading={removeCategory.isPending || removeItem.isPending} onClick={confirmDelete}>Delete</Button></Group></Stack></Modal>
  </Stack>;
}
