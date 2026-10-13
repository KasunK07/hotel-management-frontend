import { useQuery } from "@tanstack/react-query";
import { Button, Card, Group, SimpleGrid, Stack, Table, Text, Title } from "@mantine/core";
import { IconCash, IconRefresh, IconReceipt, IconBuildingStore } from "@tabler/icons-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "../../../components/shared/PageHeader";
import { errorMessage } from "../../shared/api/http";
import { getAnalytics } from "../api/analytics-api";

const money = (value: number) => `Rs ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

export function AnalyticsPage() {
  const query = useQuery({ queryKey: ["analytics"], queryFn: getAnalytics });
  const data = query.data;
  const daily = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - index));
    const key = date.toLocaleDateString("en-CA");
    const point = data?.daily.find((item) => item.day === key);
    return { day: date.toLocaleDateString(undefined, { weekday: "short" }), revenue: point?.revenue || 0, orders: point?.orders || 0 };
  });
  return <Stack gap="xl">
    <PageHeader title="Analytics" description="Real business-wide order and revenue totals." action={<Button variant="default" leftSection={<IconRefresh size={16}/>} onClick={() => query.refetch()} loading={query.isFetching}>Refresh</Button>} />
    {query.isPending && <Text c="dimmed">Loading analytics…</Text>}
    {query.isError && <Card withBorder p="xl"><Text c="red">{errorMessage(query.error)}</Text></Card>}
    {data && <>
      <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }}>
        <Metric label="Revenue" value={money(data.revenue)} icon={<IconCash size={21}/>}/>
        <Metric label="Orders" value={data.order_count.toLocaleString()} icon={<IconReceipt size={21}/>}/>
        <Metric label="Average order" value={money(data.average_order)} icon={<IconCash size={21}/>}/>
        <Metric label="Restaurants" value={data.restaurant_count.toLocaleString()} icon={<IconBuildingStore size={21}/>}/>
      </SimpleGrid>
      <Card withBorder p="xl"><Group justify="space-between" mb="lg"><Stack gap={2}><Title order={2} fz="lg">Revenue trend</Title><Text size="sm" c="dimmed">Last seven days · completed and active orders</Text></Stack></Group>
        <ResponsiveContainer width="100%" height={280}><AreaChart data={daily} margin={{top:10,right:6,left:-12,bottom:0}}><defs><linearGradient id="sales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#b95337" stopOpacity={0.26}/><stop offset="95%" stopColor="#b95337" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#eeeeea" vertical={false}/><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${Number(value)/1000}k`}/><Tooltip formatter={(value) => [money(Number(value)), "Revenue"]}/><Area type="monotone" dataKey="revenue" stroke="#b95337" strokeWidth={2.5} fill="url(#sales)"/></AreaChart></ResponsiveContainer>
      </Card>
      <Card withBorder p="xl"><Title order={2} fz="lg" mb="lg">Performance by restaurant</Title><Table.ScrollContainer minWidth={500}><Table><Table.Thead><Table.Tr><Table.Th>Restaurant</Table.Th><Table.Th ta="right">Orders</Table.Th><Table.Th ta="right">Revenue</Table.Th></Table.Tr></Table.Thead><Table.Tbody>{data.restaurants.map((restaurant) => <Table.Tr key={restaurant.restaurant_id}><Table.Td fw={650}>{restaurant.name}</Table.Td><Table.Td ta="right">{restaurant.orders}</Table.Td><Table.Td ta="right">{money(restaurant.revenue)}</Table.Td></Table.Tr>)}</Table.Tbody></Table></Table.ScrollContainer>{data.restaurants.length === 0 && <Text c="dimmed" mt="md">No restaurants yet.</Text>}</Card>
    </>}
  </Stack>;
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <Card withBorder p="lg"><Group justify="space-between"><Text size="sm" c="dimmed">{label}</Text>{icon}</Group><Text fz={25} fw={750} mt="xs">{value}</Text></Card>;
}
