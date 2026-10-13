import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Badge, Button, Card, Group, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconAlertTriangle, IconCheck, IconClock, IconPlayerPlay, IconRefresh } from "@tabler/icons-react";
import { PageHeader } from "../../../components/shared/PageHeader";
import { useCurrentRestaurant } from "../../restaurants/hooks/useCurrentRestaurant";
import { errorMessage } from "../../shared/api/http";
import { listOrders, setOrderStatus, type OrderStatus } from "../../orders/api/orders-api";

export function KitchenPage() {
  const { restaurant, restaurantID } = useCurrentRestaurant();
  const queryClient = useQueryClient();
  const ordersQuery = useQuery({ queryKey: ["orders", restaurantID], queryFn: () => listOrders(restaurantID), enabled: !!restaurantID, refetchInterval: 10000 });
  const mutation = useMutation({ mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => setOrderStatus(restaurantID, id, status), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders", restaurantID] }) });
  const orders = (ordersQuery.data || []).filter((order) => ["NEW", "PREPARING", "READY"].includes(order.status));

  async function advance(id: string, status: OrderStatus) {
    try { await mutation.mutateAsync({ id, status }); }
    catch (error) { notifications.show({ title: "Could not update order", message: errorMessage(error), color: "red" }); }
  }

  return <Stack gap="xl">
    <PageHeader title="Kitchen display" description={restaurant ? `Live queue · ${restaurant.name}` : "Choose a restaurant to see its kitchen queue."} action={<Button variant="default" leftSection={<IconRefresh size={16}/>} onClick={() => ordersQuery.refetch()} loading={ordersQuery.isFetching}>Refresh</Button>} />
    {ordersQuery.isPending && restaurantID && <Text c="dimmed">Loading kitchen queue…</Text>}
    {ordersQuery.isError && <Text c="red">{errorMessage(ordersQuery.error)}</Text>}
    {!!restaurantID && <Text size="sm">{orders.length} active {orders.length === 1 ? "order" : "orders"} · Updates every 10 seconds</Text>}
    {ordersQuery.isSuccess && orders.length === 0 && <Card withBorder p="xl"><Text fw={700}>No active orders</Text><Text c="dimmed" size="sm">New orders will appear here automatically.</Text></Card>}
    <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
      {orders.map((order) => {
        const minutes = Math.max(0, Math.floor((ordersQuery.dataUpdatedAt - new Date(order.created_at).getTime()) / 60000));
        const urgent = minutes >= 25 && order.status !== "READY";
        return <Card key={order.id} withBorder padding="lg" style={{ borderTop: `4px solid ${order.status === "NEW" ? "#3b82f6" : order.status === "READY" ? "#2f7d58" : urgent ? "#d4553b" : "#e19b45"}` }}>
          <Group justify="space-between" align="flex-start"><Stack gap={2}><Title order={2} fz={24}>#{order.id.slice(0, 8)}</Title><Text fw={650}>{order.table_name}</Text></Stack><Stack gap={6} align="flex-end"><Badge color={order.status === "NEW" ? "blue" : order.status === "READY" ? "forest" : "orange"} variant="light" tt="none">{order.status[0] + order.status.slice(1).toLowerCase()}</Badge><Group gap={4}><IconClock size={15} color={urgent ? "#c2412d" : "#777"}/><Text size="sm" c={urgent ? "red" : "dimmed"}>{minutes} min ago</Text></Group></Stack></Group>
          <Stack gap="sm" mt="lg">{order.items.map((item) => <Group key={item.id} align="flex-start" wrap="nowrap"><ThemeIcon size={28} radius="xl" color="gray" variant="light" fw={800}>{item.quantity}</ThemeIcon><Stack gap={2}><Text fw={650}>{item.name}</Text>{item.note && <Group gap={5} wrap="nowrap"><IconAlertTriangle size={14} color="#b95337"/><Text size="sm" c="ember.7">{item.note}</Text></Group>}</Stack></Group>)}</Stack>
          <Button fullWidth mt="lg" color={order.status === "NEW" ? "blue" : "forest"} leftSection={order.status === "NEW" ? <IconPlayerPlay size={18}/> : <IconCheck size={18}/>} onClick={() => advance(order.id, order.status === "NEW" ? "PREPARING" : "READY")} disabled={order.status === "READY"} loading={mutation.isPending}>
            {order.status === "READY" ? "Ready for service" : order.status === "NEW" ? "Start preparing" : "Mark ready"}
          </Button>
        </Card>;
      })}
    </SimpleGrid>
  </Stack>;
}
