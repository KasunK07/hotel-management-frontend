import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Button, Card, Divider, Drawer, Group, Modal, NumberInput, SegmentedControl, Select, Stack, Table, Text, TextInput, Title } from "@mantine/core";
import { IconPlus, IconReceipt, IconSearch, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/shared/PageHeader";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { useCurrentRestaurant } from "../../restaurants/hooks/useCurrentRestaurant";
import { listTables } from "../../tables/api/table-api";
import { listCategories, listMenuItems } from "../../menu/api/menu-api";
import { errorMessage } from "../../shared/api/http";
import { getSettings } from "../../settings/api/settings-api";
import { createOrder, listOrders, nextOrderStatus, setOrderStatus, type CreateOrderInput, type OrderStatus } from "../api/orders-api";

type DraftLine = CreateOrderInput["items"][number];
const emptyLine = (): DraftLine => ({ menu_item_id: "", quantity: 1, note: "" });
const label = (status: OrderStatus) => status[0] + status.slice(1).toLowerCase();

export function OrdersPage() {
  const { restaurant, restaurantID, restaurantsQuery } = useCurrentRestaurant();
  const queryClient = useQueryClient();
  const ordersQuery = useQuery({ queryKey: ["orders", restaurantID], queryFn: () => listOrders(restaurantID), enabled: !!restaurantID, refetchInterval: 15000 });
  const tablesQuery = useQuery({ queryKey: ["tables", restaurantID], queryFn: () => listTables(restaurantID), enabled: !!restaurantID });
  const categoriesQuery = useQuery({ queryKey: ["categories", restaurantID], queryFn: () => listCategories(restaurantID), enabled: !!restaurantID });
  const itemsQuery = useQuery({ queryKey: ["menu-items", restaurantID], queryFn: () => listMenuItems(restaurantID, categoriesQuery.data || []), enabled: !!restaurantID && categoriesQuery.isSuccess });
  const settingsQuery = useQuery({ queryKey: ["settings", restaurantID], queryFn: () => getSettings(restaurantID), enabled: !!restaurantID });
  const createMutation = useMutation({ mutationFn: (input: CreateOrderInput) => createOrder(restaurantID, input), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["orders", restaurantID] }); queryClient.invalidateQueries({ queryKey: ["tables", restaurantID] }); queryClient.invalidateQueries({ queryKey: ["analytics"] }); } });
  const statusMutation = useMutation({ mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => setOrderStatus(restaurantID, id, status), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["orders", restaurantID] }); queryClient.invalidateQueries({ queryKey: ["tables", restaurantID] }); queryClient.invalidateQueries({ queryKey: ["analytics"] }); } });
  const [view, setView] = useState("Live orders");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedID, setSelectedID] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [tableID, setTableID] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [lines, setLines] = useState<DraftLine[]>([emptyLine()]);
  const orders = ordersQuery.data || [];
  const selected = orders.find((order) => order.id === selectedID);
  const menuItems = itemsQuery.data || [];
  const filtered = orders.filter((order) => {
    const history = order.status === "COMPLETED" || order.status === "CANCELLED";
    return (view === "Order history" ? history : !history) &&
      (!statusFilter || order.status === statusFilter) &&
      `${order.id} ${order.table_name} ${order.customer_name}`.toLowerCase().includes(search.toLowerCase());
  });
  const draftSubtotal = lines.reduce((sum, line) => sum + (menuItems.find((item) => item.id === line.menu_item_id)?.price || 0) * line.quantity, 0);
  const draftTotal = Math.round(draftSubtotal * (1 + (settingsQuery.data?.service_charge || 0) / 100) * 100) / 100;

  function updateLine(index: number, patch: Partial<DraftLine>) {
    setLines((current) => current.map((line, position) => position === index ? { ...line, ...patch } : line));
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tableID || lines.some((line) => !line.menu_item_id || line.quantity < 1)) {
      notifications.show({ message: "Choose a table and valid menu items.", color: "red" }); return;
    }
    try {
      await createMutation.mutateAsync({ table_id: tableID, customer_name: customerName, items: lines });
      setCreateOpen(false); setTableID(null); setCustomerName(""); setLines([emptyLine()]);
      notifications.show({ title: "Order created", message: "The kitchen queue is updated.", color: "forest" });
    } catch (error) { notifications.show({ title: "Could not create order", message: errorMessage(error), color: "red" }); }
  }

  async function changeStatus(id: string, status: OrderStatus) {
    try { await statusMutation.mutateAsync({ id, status }); notifications.show({ message: `Order marked ${label(status).toLowerCase()}.`, color: "forest" }); }
    catch (error) { notifications.show({ title: "Could not update order", message: errorMessage(error), color: "red" }); }
  }

  function exportOrders() {
    const escape = (value: string | number) => `"${String(value).replace(/^[=+\-@]/, "'$&").replaceAll('"', '""')}"`;
    const csv = ["Order ID,Table,Customer,Status,Total,Created at", ...orders.map((order) => [order.id, order.table_name, order.customer_name, order.status, order.total, order.created_at].map(escape).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = `orders-${restaurantID}.csv`; link.click(); URL.revokeObjectURL(url);
  }

  return <Stack gap="xl">
    <PageHeader title="Orders" description={restaurant ? `Track live service at ${restaurant.name} and review order history.` : "Choose a restaurant to view orders."} action={<Group><Button variant="default" leftSection={<IconReceipt size={16}/>} onClick={exportOrders} disabled={!orders.length}>Export orders</Button><Button leftSection={<IconPlus size={16}/>} onClick={() => setCreateOpen(true)} disabled={!restaurantID}>New order</Button></Group>} />
    {restaurantsQuery.isSuccess && !restaurant && <Card withBorder p="xl"><Text>Add a restaurant before creating orders.</Text><Button component={Link} to="/restaurants" mt="md">Open restaurants</Button></Card>}
    {ordersQuery.isPending && restaurantID && <Text c="dimmed">Loading orders…</Text>}
    {ordersQuery.isError && <Text c="red">{errorMessage(ordersQuery.error)}</Text>}
    {!!restaurantID && <>
      <SegmentedControl value={view} onChange={setView} data={["Live orders", "Order history"]} w={{ base: "100%", sm: 320 }}/>
      <Card withBorder padding={0}>
        <Group p="lg"><TextInput placeholder="Search order or table..." leftSection={<IconSearch size={17}/>} value={search} onChange={(event) => setSearch(event.currentTarget.value)} w={{ base: "100%", sm: 300 }}/><Select placeholder="All statuses" data={["NEW", "PREPARING", "READY", "COMPLETED", "CANCELLED"].map((status) => ({ value: status, label: label(status as OrderStatus) }))} value={statusFilter} onChange={setStatusFilter} clearable w={170}/></Group>
        <Table.ScrollContainer minWidth={760}><Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover><Table.Thead><Table.Tr><Table.Th>Order</Table.Th><Table.Th>Table</Table.Th><Table.Th>Items</Table.Th><Table.Th>Received</Table.Th><Table.Th>Status</Table.Th><Table.Th ta="right">Total</Table.Th></Table.Tr></Table.Thead><Table.Tbody>
          {filtered.map((order) => <Table.Tr key={order.id} onClick={() => setSelectedID(order.id)} style={{ cursor: "pointer" }}><Table.Td fw={750}>#{order.id.slice(0, 8)}</Table.Td><Table.Td>{order.table_name}</Table.Td><Table.Td c="dimmed">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</Table.Td><Table.Td>{new Date(order.created_at).toLocaleString()}</Table.Td><Table.Td><StatusBadge status={label(order.status)}/></Table.Td><Table.Td ta="right" fw={650}>Rs {order.total.toLocaleString()}</Table.Td></Table.Tr>)}
        </Table.Tbody></Table></Table.ScrollContainer>
        <Text size="sm" c="dimmed" p="lg">Showing {filtered.length} of {orders.length} recent orders</Text>
      </Card>
      {ordersQuery.isSuccess && filtered.length === 0 && <Text c="dimmed">No orders match this view.</Text>}
    </>}
    <Drawer opened={!!selected} onClose={() => setSelectedID(null)} position="right" size="md" title={<Title order={2} fz="xl">Order #{selected?.id.slice(0, 8)}</Title>}><Stack>
      <Group justify="space-between"><Stack gap={1}><Text size="xs" c="dimmed">TABLE</Text><Text fw={700}>{selected?.table_name}</Text>{selected?.customer_name && <Text size="sm">{selected.customer_name}</Text>}</Stack>{selected && <StatusBadge status={label(selected.status)}/>}</Group><Divider/>
      {selected?.items.map((item) => <Group key={item.id} justify="space-between"><Stack gap={2}><Text fw={650}>{item.quantity} × {item.name}</Text>{item.note && <Text size="sm" c="ember.7">Note: {item.note}</Text>}</Stack><Text>Rs {(item.unit_price * item.quantity).toLocaleString()}</Text></Group>)}<Divider/>
      <Group justify="space-between"><Text fw={700}>Order total</Text><Text fz="xl" fw={800}>Rs {selected?.total.toLocaleString()}</Text></Group>
      {selected && nextOrderStatus(selected.status) && <Button loading={statusMutation.isPending} onClick={() => changeStatus(selected.id, nextOrderStatus(selected.status)!)}>Mark {label(nextOrderStatus(selected.status)!).toLowerCase()}</Button>}
      {selected && ["NEW", "PREPARING"].includes(selected.status) && <Button color="red" variant="light" loading={statusMutation.isPending} onClick={() => changeStatus(selected.id, "CANCELLED")}>Cancel order</Button>}
      <Button variant="default" onClick={() => window.print()}>Print receipt</Button>
    </Stack></Drawer>
    <Modal opened={createOpen} onClose={() => setCreateOpen(false)} title="New order" size="lg"><form onSubmit={submitOrder}><Stack>
      <Select label="Table" required data={(tablesQuery.data || []).map((table) => ({ value: table.id, label: table.name }))} value={tableID} onChange={setTableID}/>
      <TextInput label="Customer name" description="Optional" value={customerName} onChange={(event) => setCustomerName(event.currentTarget.value)}/>
      {lines.map((line, index) => <Card withBorder key={index} p="md"><Stack><Group align="end"><Select label={`Item ${index + 1}`} required data={menuItems.filter((item) => item.is_available).map((item) => ({ value: item.id, label: `${item.name} · Rs ${item.price.toLocaleString()}` }))} value={line.menu_item_id || null} onChange={(value) => updateLine(index, { menu_item_id: value || "" })} style={{ flex: 1 }}/><NumberInput label="Qty" min={1} max={99} value={line.quantity} onChange={(value) => updateLine(index, { quantity: Number(value) || 1 })} w={85}/><Button variant="subtle" color="red" onClick={() => setLines((current) => current.filter((_, position) => position !== index))} disabled={lines.length === 1}><IconTrash size={16}/></Button></Group><TextInput label="Note" value={line.note} onChange={(event) => updateLine(index, { note: event.currentTarget.value })}/></Stack></Card>)}
      <Button variant="light" leftSection={<IconPlus size={16}/>} onClick={() => setLines((current) => [...current, emptyLine()])}>Add another item</Button>
      <Group justify="space-between"><Text fw={700}>Estimated total: Rs {draftTotal.toLocaleString()}</Text><Button type="submit" loading={createMutation.isPending} disabled={!tableID || !menuItems.length || settingsQuery.data?.accept_orders === false}>Create order</Button></Group>
      {!!settingsQuery.data?.service_charge && <Text size="xs" c="dimmed">Includes {settingsQuery.data.service_charge}% service charge.</Text>}
      {settingsQuery.data?.accept_orders === false && <Text size="sm" c="red">Ordering is disabled in restaurant settings.</Text>}
      {!menuItems.length && <Text size="sm" c="dimmed">Add menu items before creating an order.</Text>}
    </Stack></form></Modal>
  </Stack>;
}
