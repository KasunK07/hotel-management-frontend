import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Avatar, Button, Card, Group, Modal, Select, SimpleGrid, Stack, Table, Text, TextInput } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/shared/PageHeader";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import { useCurrentRestaurant } from "../../restaurants/hooks/useCurrentRestaurant";
import { errorMessage } from "../../shared/api/http";
import { createEmployee, deleteEmployee, listEmployees, updateEmployee, type EmployeeInput, type EmployeeRecord } from "../api/employees-api";

const schema = z.object({
  full_name: z.string().min(3, "Enter the employee’s full name"),
  email: z.email("Enter a valid email"),
  role: z.string().min(1, "Choose a role"),
  shift: z.string(),
  status: z.enum(["ACTIVE", "OFF_DUTY"]),
});
const roles = ["Restaurant Manager", "Head Chef", "Cashier", "Waiter", "Kitchen Staff"];

export function EmployeesPage() {
  const { restaurant, restaurantID, restaurantsQuery } = useCurrentRestaurant();
  const queryClient = useQueryClient();
  const employeesQuery = useQuery({ queryKey: ["employees", restaurantID], queryFn: () => listEmployees(restaurantID), enabled: !!restaurantID });
  const createMutation = useMutation({ mutationFn: (input: EmployeeInput) => createEmployee(restaurantID, input), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees", restaurantID] }) });
  const updateMutation = useMutation({ mutationFn: ({ id, input }: { id: string; input: EmployeeInput }) => updateEmployee(restaurantID, id, input), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees", restaurantID] }) });
  const removeMutation = useMutation({ mutationFn: (id: string) => deleteEmployee(restaurantID, id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees", restaurantID] }) });
  const [opened, setOpened] = useState(false);
  const [editing, setEditing] = useState<EmployeeRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmployeeRecord | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const { register, control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EmployeeInput>({ resolver: zodResolver(schema), defaultValues: { full_name: "", email: "", role: "", shift: "", status: "ACTIVE" } });
  const employees = employeesQuery.data || [];
  const filtered = employees.filter((employee) => `${employee.full_name} ${employee.email}`.toLowerCase().includes(search.toLowerCase()) && (!roleFilter || employee.role === roleFilter));
  const onShift = employees.filter((employee) => employee.status === "ACTIVE").length;
  const roleCount = new Set(employees.map((employee) => employee.role)).size;

  function openCreate() {
    setEditing(null); reset({ full_name: "", email: "", role: "", shift: "", status: "ACTIVE" }); setOpened(true);
  }
  function openEdit(employee: EmployeeRecord) {
    setEditing(employee); reset({ full_name: employee.full_name, email: employee.email, role: employee.role, shift: employee.shift, status: employee.status }); setOpened(true);
  }
  const submit = handleSubmit(async (values) => {
    try {
      if (editing) await updateMutation.mutateAsync({ id: editing.id, input: values });
      else await createMutation.mutateAsync(values);
      notifications.show({ title: editing ? "Employee updated" : "Employee added", message: `${values.full_name} is in the team directory.`, color: "forest" });
      setOpened(false); setEditing(null);
    } catch (error) { notifications.show({ title: "Could not save employee", message: errorMessage(error), color: "red" }); }
  });
  async function confirmDelete() {
    if (!deleteTarget) return;
    try { await removeMutation.mutateAsync(deleteTarget.id); setDeleteTarget(null); notifications.show({ message: "Employee removed", color: "forest" }); }
    catch (error) { notifications.show({ title: "Could not remove employee", message: errorMessage(error), color: "red" }); }
  }

  return <Stack gap="xl">
    <PageHeader title="Employees" description={restaurant ? `Manage the team directory for ${restaurant.name}.` : "Choose a restaurant to manage employees."} action={<Button leftSection={<IconPlus size={17}/>} onClick={openCreate} disabled={!restaurantID}>Add employee</Button>} />
    {restaurantsQuery.isSuccess && !restaurant && <Card withBorder p="xl"><Text>Add a restaurant before creating employees.</Text><Button component={Link} to="/restaurants" mt="md">Open restaurants</Button></Card>}
    {employeesQuery.isPending && restaurantID && <Text c="dimmed">Loading team…</Text>}
    {employeesQuery.isError && <Text c="red">{errorMessage(employeesQuery.error)}</Text>}
    {employeesQuery.isSuccess && <>
      <SimpleGrid cols={{ base: 1, sm: 3 }}><Card withBorder><Text c="dimmed" size="sm">Team members</Text><Text fz={25} fw={750}>{employees.length}</Text></Card><Card withBorder><Text c="dimmed" size="sm">Active</Text><Text fz={25} fw={750}>{onShift}</Text></Card><Card withBorder><Text c="dimmed" size="sm">Roles in use</Text><Text fz={25} fw={750}>{roleCount}</Text></Card></SimpleGrid>
      <Card withBorder padding={0}><Group p="lg"><TextInput placeholder="Search employees..." leftSection={<IconSearch size={17}/>} value={search} onChange={(event) => setSearch(event.currentTarget.value)} w={{ base: "100%", sm: 320 }}/><Select placeholder="All roles" data={roles} clearable value={roleFilter} onChange={setRoleFilter} w={190}/></Group>
        <Table.ScrollContainer minWidth={700}><Table verticalSpacing="md" horizontalSpacing="lg"><Table.Thead><Table.Tr><Table.Th>Employee</Table.Th><Table.Th>Role</Table.Th><Table.Th>Shift</Table.Th><Table.Th>Status</Table.Th><Table.Th/></Table.Tr></Table.Thead><Table.Tbody>
          {filtered.map((employee, index) => <Table.Tr key={employee.id}><Table.Td><Group wrap="nowrap"><Avatar color={index % 2 ? "forest" : "ember"} variant="light">{employee.full_name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</Avatar><Stack gap={1}><Text fw={650} size="sm">{employee.full_name}</Text><Text size="xs" c="dimmed">{employee.email}</Text></Stack></Group></Table.Td><Table.Td>{employee.role}</Table.Td><Table.Td c="dimmed">{employee.shift || "Not set"}</Table.Td><Table.Td><StatusBadge status={employee.status === "ACTIVE" ? "Active" : "Off duty"}/></Table.Td><Table.Td><Group gap="xs"><Button variant="subtle" size="xs" onClick={() => openEdit(employee)}>Edit</Button><Button variant="subtle" color="red" size="xs" onClick={() => setDeleteTarget(employee)}>Remove</Button></Group></Table.Td></Table.Tr>)}
        </Table.Tbody></Table></Table.ScrollContainer>
        {filtered.length === 0 && <Text c="dimmed" p="lg">No employees match this view.</Text>}
      </Card>
      <Text size="xs" c="dimmed">The directory stores employee details and roles. Staff sign-in and invitations are not enabled.</Text>
    </>}
    <Modal opened={opened} onClose={() => setOpened(false)} title={editing ? "Edit employee" : "Add employee"}><form onSubmit={submit}><Stack>
      <TextInput label="Full name" required {...register("full_name")} error={errors.full_name?.message}/>
      <TextInput label="Work email" type="email" required {...register("email")} error={errors.email?.message}/>
      <Controller name="role" control={control} render={({field}) => <Select label="Role" required data={roles} {...field} error={errors.role?.message}/>} />
      <TextInput label="Shift" placeholder="e.g. 9:00 AM – 5:00 PM" {...register("shift")} error={errors.shift?.message}/>
      <Controller name="status" control={control} render={({field}) => <Select label="Status" data={[{value:"ACTIVE",label:"Active"},{value:"OFF_DUTY",label:"Off duty"}]} {...field} error={errors.status?.message}/>} />
      <Group justify="flex-end"><Button variant="default" onClick={() => setOpened(false)}>Cancel</Button><Button type="submit" loading={isSubmitting || createMutation.isPending || updateMutation.isPending}>Save employee</Button></Group>
    </Stack></form></Modal>
    <Modal opened={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove employee?"><Stack><Text>Remove {deleteTarget?.full_name} from this restaurant?</Text><Group justify="flex-end"><Button variant="default" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button color="red" loading={removeMutation.isPending} onClick={confirmDelete}>Remove</Button></Group></Stack></Modal>
  </Stack>;
}
