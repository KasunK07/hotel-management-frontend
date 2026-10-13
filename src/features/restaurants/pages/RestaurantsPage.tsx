import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { notifications } from "@mantine/notifications";
import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBuildingStore,
  IconBook2,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPlus,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "../../../components/shared/PageHeader";
import { createRestaurant, deleteRestaurant, listRestaurants, updateRestaurant, type RestaurantRecord } from "../api/restaurant-api";
import { errorMessage } from "../../shared/api/http";
import { useAppStore } from "../../../stores/app-store";
import {
  restaurantSchema,
  type RestaurantFormValues,
} from "../schemas/restaurant-schema";

export function RestaurantsPage() {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<RestaurantRecord | null>(null);
  const [deleting, setDeleting] = useState<RestaurantRecord | null>(null);
  const queryClient = useQueryClient();
  const restaurantsQuery = useQuery({ queryKey: ["restaurants"], queryFn: listRestaurants });
  const createMutation = useMutation({ mutationFn: createRestaurant, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }) });
  const updateMutation = useMutation({ mutationFn: ({ id, values }: { id: string; values: RestaurantFormValues }) => updateRestaurant(id, values), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }) });
  const deleteMutation = useMutation({ mutationFn: deleteRestaurant, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }) });
  const { restaurantId, setRestaurantId } = useAppStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RestaurantFormValues>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: { name: "", address: "", phone: "", email: "" },
  });
  const submit = handleSubmit(async (values) => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, values });
        notifications.show({ title: "Restaurant updated", message: `${values.name} was saved.`, color: "forest" });
      } else {
        await createMutation.mutateAsync(values);
        notifications.show({ title: "Restaurant created", message: `${values.name} is ready to configure.`, color: "forest" });
      }
      setOpened(false);
      setEditing(null);
      reset();
    } catch (error) {
      notifications.show({ title: "Could not save restaurant", message: errorMessage(error), color: "red" });
    }
  });
  const openCreate = () => { setEditing(null); reset({ name: "", address: "", phone: "", email: "" }); setOpened(true); };
  const openEdit = (restaurant: RestaurantRecord) => {
    setEditing(restaurant);
    reset({ name: restaurant.name, address: restaurant.address || "", phone: restaurant.phone || "", email: restaurant.email });
    setOpened(true);
  };
  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteMutation.mutateAsync(deleting.id);
      if (restaurantId === deleting.id) setRestaurantId("");
      notifications.show({ title: "Restaurant deleted", message: `${deleting.name} was removed.`, color: "forest" });
      setDeleting(null);
    } catch (error) { notifications.show({ title: "Could not delete restaurant", message: errorMessage(error), color: "red" }); }
  };
  return (
    <Stack gap="xl">
      <PageHeader
        title="Restaurants"
        description="Manage every location in your business."
        action={
          <Button
            leftSection={<IconPlus size={17} />}
            onClick={openCreate}
          >
            Add restaurant
          </Button>
        }
      />
      {restaurantsQuery.isPending && <Text c="dimmed">Loading restaurants…</Text>}
      {restaurantsQuery.isError && <Text c="red">{errorMessage(restaurantsQuery.error)}</Text>}
      {restaurantsQuery.isSuccess && restaurantsQuery.data.length === 0 && <Card withBorder p="xl"><Text fw={700}>No restaurants yet</Text><Text c="dimmed" size="sm">Add your first location to start building its menu.</Text></Card>}
      <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
        {(restaurantsQuery.data || []).map((r, i) => (
          <Card
            key={r.id}
            withBorder
            padding="lg"
            style={{
              borderColor: r.id === restaurantId ? "#b95337" : "#e8e8e2",
              boxShadow: r.id === restaurantId ? "0 0 0 1px #b95337" : "none",
            }}
          >
            <Group justify="space-between" align="flex-start">
              <ThemeIcon
                size={48}
                radius="lg"
                color={i === 0 ? "ember" : i === 1 ? "forest" : "orange"}
                variant="light"
              >
                <IconBuildingStore size={24} />
              </ThemeIcon>
              <Group gap="xs">
                {r.id === restaurantId && (
                  <Badge variant="light" color="ember" tt="none">
                    Current
                  </Badge>
                )}
              </Group>
            </Group>
            <Title order={3} fz="lg" mt="lg">
              {r.name}
            </Title>
            <Group gap={7} mt={7} wrap="nowrap">
              <IconMapPin size={15} color="#7a817e" />
              <Text size="sm" c="dimmed" lineClamp={1}>
                {r.address || "Address not provided"}
              </Text>
            </Group>
            <Stack gap="sm" mt="lg">
              <Group gap="sm">
                <IconPhone size={16} color="#7a817e" />
                <Text size="sm">{r.phone || "No phone"}</Text>
              </Group>
              <Group gap="sm">
                <IconMail size={16} color="#7a817e" />
                <Text size="sm">{r.email}</Text>
              </Group>
            </Stack>
            <Divider my="lg" />
            <Group justify="space-between" mt="lg">
              <Badge color="forest" variant="light">Registered</Badge>
              <Button
                variant={r.id === restaurantId ? "light" : "default"}
                color="ember"
                onClick={() => {
                  setRestaurantId(r.id);
                  notifications.show({
                    message: `Switched to ${r.name}`,
                    color: "forest",
                  });
                }}
                disabled={r.id === restaurantId}
              >
                {r.id === restaurantId ? "Selected" : "Manage location"}
              </Button>
            </Group>
            <Button
              fullWidth
              mt="sm"
              variant="light"
              color="ember"
              leftSection={<IconBook2 size={17} />}
              onClick={() => {
                setRestaurantId(r.id);
                navigate("/menu");
                notifications.show({
                  message: `Viewing the menu for ${r.name}`,
                  color: "forest",
                });
              }}
            >
              View Menu
            </Button>
            <Group grow mt="sm">
              <Button variant="default" onClick={() => openEdit(r)}>Edit</Button>
              <Button variant="subtle" color="red" onClick={() => setDeleting(r)}>Delete</Button>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <>
            <Text fw={750} fz="lg">
              {editing ? "Edit restaurant" : "Add a new restaurant"}
            </Text>
            <Text size="sm" c="dimmed" fw={400}>
              {editing ? "Update this location's details." : "Create a location under your business."}
            </Text>
          </>
        }
        size="lg"
      >
        <form onSubmit={submit}>
          <Stack>
            <TextInput
              label="Restaurant name"
              placeholder="e.g. Cinnamon Gardens Branch"
              required
              {...register("name")}
              error={errors.name?.message}
            />
            <TextInput
              label="Street address"
              placeholder="Full restaurant address"
              required
              leftSection={<IconMapPin size={16} />}
              {...register("address")}
              error={errors.address?.message}
            />
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Phone number"
                  required
                  leftSection={<IconPhone size={16} />}
                  {...register("phone")}
                  error={errors.phone?.message}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Contact email"
                  required
                  leftSection={<IconMail size={16} />}
                  {...register("email")}
                  error={errors.email?.message}
                />
              </Grid.Col>
            </Grid>
            <Text size="xs" c="dimmed">
              You can configure menus, opening hours, tables, and QR ordering
              after creating the restaurant.
            </Text>
            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={() => setOpened(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting || createMutation.isPending || updateMutation.isPending}>
                {editing ? "Save changes" : "Create restaurant"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      <Modal opened={!!deleting} onClose={() => setDeleting(null)} title="Delete restaurant?" centered>
        <Stack>
          <Text>This will permanently remove {deleting?.name} and its menu, tables, employees, settings, and order history. This cannot be undone.</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button color="red" loading={deleteMutation.isPending} onClick={confirmDelete}>Delete restaurant</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
