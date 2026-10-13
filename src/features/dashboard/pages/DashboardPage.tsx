import { useQuery } from "@tanstack/react-query";
import { Button, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconArrowRight, IconBuildingStore, IconBook2, IconCash, IconReceipt } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/shared/PageHeader";
import { getSession } from "../../auth/api/auth-api";
import { listRestaurants } from "../../restaurants/api/restaurant-api";
import { errorMessage } from "../../shared/api/http";
import { useAppStore } from "../../../stores/app-store";
import { getAnalytics } from "../../analytics/api/analytics-api";

export function DashboardPage() {
  const restaurants = useQuery({ queryKey: ["restaurants"], queryFn: listRestaurants });
  const analytics = useQuery({ queryKey: ["analytics"], queryFn: getAnalytics });
  const selectedID = useAppStore((state) => state.restaurantId);
  const current = restaurants.data?.find((restaurant) => restaurant.id === selectedID) || restaurants.data?.[0];
  const ownerName = getSession()?.owner_name?.split(" ")[0] || "there";
  return <Stack gap="xl">
    <PageHeader title={`Welcome, ${ownerName}`} description="Your business workspace is ready." action={<Button component={Link} to="/restaurants" rightSection={<IconArrowRight size={16}/>}>Manage restaurants</Button>} />
    {restaurants.isPending && <Text c="dimmed">Loading your business…</Text>}
    {restaurants.isError && <Card withBorder p="xl"><Text c="red">{errorMessage(restaurants.error)}</Text></Card>}
    {restaurants.isSuccess && <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
      <Card withBorder p="xl"><Group><IconBuildingStore size={24}/><Text fw={700}>Restaurants</Text></Group><Title order={2} mt="md">{restaurants.data.length}</Title><Text c="dimmed" size="sm">Locations registered to your business</Text></Card>
      <Card withBorder p="xl"><Group><IconBook2 size={24}/><Text fw={700}>Current restaurant</Text></Group><Title order={2} mt="md" size="h3">{current?.name || "No restaurant selected"}</Title><Text c="dimmed" size="sm">{current?.address || "Add a restaurant to begin."}</Text></Card>
      <Card withBorder p="xl"><Group><IconReceipt size={24}/><Text fw={700}>Orders</Text></Group><Title order={2} mt="md">{analytics.data?.order_count ?? "—"}</Title><Text c="dimmed" size="sm">Across your business</Text></Card>
      <Card withBorder p="xl"><Group><IconCash size={24}/><Text fw={700}>Revenue</Text></Group><Title order={2} mt="md" size="h3">{analytics.data ? `Rs ${analytics.data.revenue.toLocaleString()}` : "—"}</Title><Text c="dimmed" size="sm">Across your business</Text></Card>
    </SimpleGrid>}
    {analytics.isError && <Text c="red">Analytics unavailable: {errorMessage(analytics.error)}</Text>}
    {restaurants.isSuccess && restaurants.data.length === 0 && <Card withBorder p="xl"><Title order={3}>Set up your first restaurant</Title><Text c="dimmed" mt="sm">Create a location, add categories, then build its menu.</Text><Button component={Link} to="/restaurants" mt="lg">Add restaurant</Button></Card>}
    {current && <Card withBorder p="xl"><Title order={3}>Build {current.name}’s menu</Title><Text c="dimmed" mt="sm">Organize categories and add dishes for this location.</Text><Button component={Link} to="/menu" mt="lg" variant="light">Open menu</Button></Card>}
  </Stack>;
}
