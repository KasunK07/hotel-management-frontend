import { useQuery } from "@tanstack/react-query";
import { Button, Card, Center, Loader, Stack, Text, Title } from "@mantine/core";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { resolveTable } from "../api/table-api";
import { errorMessage } from "../../shared/api/http";

export function PublicTablePage() {
  const { restaurantID = "", tableID = "" } = useParams();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const query = useQuery({ queryKey: ["public-table", restaurantID, tableID, token], queryFn: () => resolveTable(restaurantID, tableID, token), enabled: !!restaurantID && !!tableID && !!token, retry: false });
  return <Center mih="100vh" p="lg"><Card withBorder p="xl" maw={520} w="100%"><Stack>
    {query.isPending && token && <Loader />}
    {query.isError && <><Title order={1}>This table code is unavailable</Title><Text c="dimmed">{errorMessage(query.error)}</Text></>}
    {!token && <><Title order={1}>Invalid table code</Title><Text c="dimmed">The QR link is missing its verification token.</Text></>}
    {query.data && <><Text size="sm" fw={700} c="ember.7">TABLE VERIFIED</Text><Title order={1}>{query.data.restaurant_name}</Title><Text fz="xl" fw={700}>{query.data.table_name}</Text><Text c="dimmed">This code identifies your restaurant and table. Guest ordering is managed separately from this administration system.</Text></>}
    <Button component={Link} to="/" variant="light">Back to Meridian</Button>
  </Stack></Card></Center>;
}
