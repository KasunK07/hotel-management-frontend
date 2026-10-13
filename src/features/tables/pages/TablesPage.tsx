import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QRCodeSVG } from "qrcode.react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Button, Card, Grid, Group, Menu, Modal, NumberInput, Paper, Select, SimpleGrid, Stack, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { IconArmchair, IconDownload, IconDots, IconPlus, IconPrinter, IconQrcode, IconRefresh, IconTrash, IconUsers } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/shared/PageHeader";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { useCurrentRestaurant } from "../../restaurants/hooks/useCurrentRestaurant";
import { errorMessage } from "../../shared/api/http";
import { createTable, deleteTable, listTables, regenerateTableQR, setTableStatus, tableQRUrl, type DiningTableRecord } from "../api/table-api";

const tableSchema = z.object({
  name: z.string().min(2, "Enter a table name"),
  seats: z.number().min(1).max(30),
  area: z.string().min(1, "Select an area"),
});
type TableValues = z.infer<typeof tableSchema>;

export function TablesPage() {
  const { restaurant, restaurantID, restaurantsQuery } = useCurrentRestaurant();
  const queryClient = useQueryClient();
  const tablesQuery = useQuery({ queryKey: ["tables", restaurantID], queryFn: () => listTables(restaurantID), enabled: !!restaurantID });
  const addTable = useMutation({ mutationFn: (values: TableValues) => createTable(restaurantID, values), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables", restaurantID] }) });
  const updateStatus = useMutation({ mutationFn: ({ id, status }: { id: string; status: DiningTableRecord["status"] }) => setTableStatus(restaurantID, id, status), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables", restaurantID] }) });
  const regenerate = useMutation({ mutationFn: (id: string) => regenerateTableQR(restaurantID, id), onSuccess: (table) => { setQRTable(table); queryClient.invalidateQueries({ queryKey: ["tables", restaurantID] }); } });
  const remove = useMutation({ mutationFn: (id: string) => deleteTable(restaurantID, id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables", restaurantID] }) });
  const [formOpen, setFormOpen] = useState(false);
  const [qrTable, setQRTable] = useState<DiningTableRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DiningTableRecord | null>(null);
  const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<TableValues>({ resolver: zodResolver(tableSchema), defaultValues: { name: "", seats: 4, area: "Indoor" } });
  const tables = tablesQuery.data || [];
  const occupied = tables.filter((table) => table.status === "OCCUPIED").length;
  const availableSeats = tables.filter((table) => table.status === "AVAILABLE").reduce((sum, table) => sum + table.seats, 0);

  const submit = handleSubmit(async (values) => {
    try {
      await addTable.mutateAsync(values);
      notifications.show({ title: "Table created", message: `${values.name} has a unique QR code.`, color: "forest" });
      setFormOpen(false); reset();
    } catch (error) { notifications.show({ title: "Could not create table", message: errorMessage(error), color: "red" }); }
  });

  async function changeStatus(table: DiningTableRecord, status: DiningTableRecord["status"]) {
    try { await updateStatus.mutateAsync({ id: table.id, status }); }
    catch (error) { notifications.show({ title: "Could not update table", message: errorMessage(error), color: "red" }); }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try { await remove.mutateAsync(deleteTarget.id); setDeleteTarget(null); notifications.show({ message: "Table removed", color: "forest" }); }
    catch (error) { notifications.show({ title: "Could not remove table", message: errorMessage(error), color: "red" }); }
  }

  function download() {
    if (!qrTable) return;
    const svg = document.getElementById("table-qr")?.outerHTML;
    if (!svg) return;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const link = document.createElement("a"); link.href = url;
    link.download = `${restaurantID}-${qrTable.name.replaceAll(" ", "-").toLowerCase()}-qr.svg`;
    link.click(); URL.revokeObjectURL(url);
  }

  return <Stack gap="xl">
    <PageHeader title="Tables & QR codes" description={restaurant ? `Manage seating and table codes at ${restaurant.name}.` : "Choose a restaurant to manage tables."} action={<Button leftSection={<IconPlus size={17}/>} onClick={() => setFormOpen(true)} disabled={!restaurantID}>Add table</Button>} />
    {restaurantsQuery.isPending && <Text c="dimmed">Loading restaurants…</Text>}
    {restaurantsQuery.isSuccess && !restaurant && <Card withBorder p="xl"><Text>Add a restaurant before creating tables.</Text><Button component={Link} to="/restaurants" mt="md">Open restaurants</Button></Card>}
    {tablesQuery.isPending && restaurantID && <Text c="dimmed">Loading tables…</Text>}
    {tablesQuery.isError && <Text c="red">{errorMessage(tablesQuery.error)}</Text>}
    {tablesQuery.isSuccess && <>
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Card withBorder><Text size="sm" c="dimmed">Total tables</Text><Group mt="xs"><ThemeIcon variant="light" color="ember"><IconArmchair size={18}/></ThemeIcon><Text fz={24} fw={750}>{tables.length}</Text></Group></Card>
        <Card withBorder><Text size="sm" c="dimmed">Seats available</Text><Group mt="xs"><ThemeIcon variant="light" color="forest"><IconUsers size={18}/></ThemeIcon><Text fz={24} fw={750}>{availableSeats}</Text></Group></Card>
        <Card withBorder><Text size="sm" c="dimmed">Currently occupied</Text><Group mt="xs"><ThemeIcon variant="light" color="red"><IconArmchair size={18}/></ThemeIcon><Text fz={24} fw={750}>{occupied}</Text></Group></Card>
      </SimpleGrid>
      {tables.length === 0 && <Card withBorder p="xl"><Text fw={700}>No tables yet</Text><Text c="dimmed" size="sm">Add your first table to generate its QR code.</Text></Card>}
      <SimpleGrid cols={{ base: 1, md: 2, xl: 3 }}>
        {tables.map((table) => <Card key={table.id} withBorder padding="lg">
          <Group justify="space-between"><Group><ThemeIcon size={44} radius="md" variant="light" color={table.status === "AVAILABLE" ? "forest" : table.status === "OCCUPIED" ? "red" : "yellow"}><IconArmchair size={22}/></ThemeIcon><Stack gap={0}><Text fw={700}>{table.name}</Text><Text size="xs" c="dimmed">{table.area} · {table.seats} seats</Text></Stack></Group>
            <Menu position="bottom-end"><Menu.Target><Button variant="subtle" color="gray" px={8} aria-label={`Options for ${table.name}`}><IconDots size={18}/></Button></Menu.Target><Menu.Dropdown>
              {(["AVAILABLE", "OCCUPIED", "RESERVED"] as const).map((status) => <Menu.Item key={status} onClick={() => changeStatus(table, status)} disabled={table.status === status}>Mark {status.toLowerCase()}</Menu.Item>)}
              <Menu.Divider/><Menu.Item color="red" leftSection={<IconTrash size={15}/>} onClick={() => setDeleteTarget(table)}>Remove table</Menu.Item>
            </Menu.Dropdown></Menu>
          </Group>
          <Group justify="space-between" my="lg"><StatusBadge status={table.status === "AVAILABLE" ? "Available" : table.status === "OCCUPIED" ? "Occupied" : "Reserved"}/><Text size="xs" c="dimmed">QR updated {new Date(table.qr_updated_at).toLocaleDateString()}</Text></Group>
          <Button fullWidth variant="light" color="gray" leftSection={<IconQrcode size={17}/>} onClick={() => setQRTable(table)}>View QR code</Button>
        </Card>)}
      </SimpleGrid>
    </>}
    <Modal opened={formOpen} onClose={() => setFormOpen(false)} title="Add a table"><form onSubmit={submit}><Stack>
      <TextInput label="Table name" required {...register("name")} error={errors.name?.message}/>
      <Grid><Grid.Col span={6}><Controller name="seats" control={control} render={({field}) => <NumberInput label="Seats" min={1} max={30} {...field} error={errors.seats?.message}/>} /></Grid.Col><Grid.Col span={6}><Controller name="area" control={control} render={({field}) => <Select label="Area" data={["Indoor", "Garden", "Rooftop", "Private room"]} {...field} error={errors.area?.message}/>} /></Grid.Col></Grid>
      <Text size="xs" c="dimmed">A restaurant-and-table-specific QR code is generated automatically.</Text>
      <Group justify="flex-end"><Button variant="default" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit" loading={isSubmitting || addTable.isPending}>Create table</Button></Group>
    </Stack></form></Modal>
    <Modal opened={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove table?"><Stack><Text>Remove {deleteTarget?.name}? Tables with order history cannot be removed.</Text><Group justify="flex-end"><Button variant="default" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button color="red" loading={remove.isPending} onClick={confirmDelete}>Remove</Button></Group></Stack></Modal>
    <Modal opened={!!qrTable} onClose={() => setQRTable(null)} title="Table QR code" size="md"><Stack align="center">
      <Paper withBorder p="lg" radius="lg">{qrTable && <QRCodeSVG id="table-qr" value={tableQRUrl(qrTable)} size={210} level="H" fgColor="#172721"/>}</Paper>
      <Title order={3} fz="xl">{qrTable?.name}</Title><Text size="sm" c="dimmed">{restaurant?.name} · {qrTable?.seats} seats</Text>
      <Text size="xs" c="dimmed" ta="center">Scanning verifies this restaurant and table. Regenerating invalidates the previous code.</Text>
      <Group grow w="100%"><Button variant="default" leftSection={<IconRefresh size={16}/>} loading={regenerate.isPending} onClick={async () => { if (!qrTable) return; try { await regenerate.mutateAsync(qrTable.id); notifications.show({ message: "QR code regenerated", color: "forest" }); } catch (error) { notifications.show({ message: errorMessage(error), color: "red" }); } }}>Regenerate</Button><Button variant="default" leftSection={<IconPrinter size={16}/>} onClick={() => window.print()}>Print</Button><Button leftSection={<IconDownload size={16}/>} onClick={download}>Download</Button></Group>
    </Stack></Modal>
  </Stack>;
}
