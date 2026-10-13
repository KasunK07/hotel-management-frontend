import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { Button, Card, Divider, Grid, Group, NumberInput, Select, Stack, Switch, Tabs, Text, TextInput, Textarea, Title } from "@mantine/core";
import { IconBuildingStore, IconClock, IconDeviceFloppy, IconQrcode, IconReceipt, IconSettings } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../../components/shared/PageHeader";
import { useCurrentRestaurant } from "../../restaurants/hooks/useCurrentRestaurant";
import { errorMessage } from "../../shared/api/http";
import { getSettings, listHours, putHours, updateSettings, type OpeningHour, type RestaurantSettings } from "../api/settings-api";

const schema = z.object({
  restaurant_id: z.string(), name: z.string().min(3), email: z.email(), phone: z.string().min(3), address: z.string().min(3),
  accept_orders: z.boolean(), auto_accept: z.boolean(), qr_ordering: z.boolean(),
  prep_minutes: z.number().min(1).max(240), minimum_order: z.number().min(0),
  staff_confirmation: z.boolean(), show_table_name: z.boolean(), welcome_message: z.string(),
  service_charge: z.number().min(0).max(100), currency: z.enum(["LKR", "USD"]),
  timezone: z.string(), language: z.enum(["en", "si", "ta"]),
});
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const displayDays = [1, 2, 3, 4, 5, 6, 0];

export function SettingsPage() {
  const { restaurant, restaurantID, restaurantsQuery } = useCurrentRestaurant();
  const settingsQuery = useQuery({ queryKey: ["settings", restaurantID], queryFn: () => getSettings(restaurantID), enabled: !!restaurantID });
  const hoursQuery = useQuery({ queryKey: ["hours", restaurantID], queryFn: () => listHours(restaurantID), enabled: !!restaurantID });
  return <Stack gap="xl">
    <PageHeader title="Restaurant settings" description={restaurant ? `Configure ${restaurant.name} and its ordering preferences.` : "Choose a restaurant to configure it."}/>
    {restaurantsQuery.isSuccess && !restaurant && <Card withBorder p="xl"><Text>Add a restaurant before configuring settings.</Text><Button component={Link} to="/restaurants" mt="md">Open restaurants</Button></Card>}
    {settingsQuery.isPending && restaurantID && <Text c="dimmed">Loading settings…</Text>}
    {settingsQuery.isError && <Text c="red">{errorMessage(settingsQuery.error)}</Text>}
    {settingsQuery.data && <SettingsEditor key={restaurantID} restaurantID={restaurantID} initial={settingsQuery.data} hours={hoursQuery.data} hoursLoading={hoursQuery.isPending} hoursError={hoursQuery.error}/>} 
  </Stack>;
}

function SettingsEditor({ restaurantID, initial, hours, hoursLoading, hoursError }: { restaurantID: string; initial: RestaurantSettings; hours?: OpeningHour[]; hoursLoading: boolean; hoursError: Error | null }) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string | null>("info");
  const mutation = useMutation({ mutationFn: (values: RestaurantSettings) => updateSettings(restaurantID, values), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["settings", restaurantID] }); queryClient.invalidateQueries({ queryKey: ["restaurants"] }); } });
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<RestaurantSettings>({ resolver: zodResolver(schema), defaultValues: initial });
  const save = handleSubmit(async (values) => {
    try { await mutation.mutateAsync(values); notifications.show({ title: "Settings saved", message: "Restaurant settings are up to date.", color: "forest" }); }
    catch (error) { notifications.show({ title: "Could not save settings", message: errorMessage(error), color: "red" }); }
  });
  const saveButton = <Group justify="flex-end" mt="xl"><Button type="submit" loading={isSubmitting || mutation.isPending} leftSection={<IconDeviceFloppy size={17}/>}>Save changes</Button></Group>;
  return <form onSubmit={save}><Stack hiddenFrom="md" mb="lg"><Select value={activeTab} onChange={setActiveTab} data={[{value:"info",label:"Restaurant information"},{value:"hours",label:"Opening hours"},{value:"ordering",label:"Ordering"},{value:"qr",label:"QR ordering"},{value:"general",label:"General"}]}/></Stack>
    <Tabs value={activeTab} onChange={setActiveTab} orientation="vertical" variant="pills" styles={{root:{alignItems:"flex-start"},list:{minWidth:210},panel:{flex:1,minWidth:0}}}>
      <Tabs.List visibleFrom="md"><Tabs.Tab value="info" leftSection={<IconBuildingStore size={17}/>}>Restaurant info</Tabs.Tab><Tabs.Tab value="hours" leftSection={<IconClock size={17}/>}>Opening hours</Tabs.Tab><Tabs.Tab value="ordering" leftSection={<IconReceipt size={17}/>}>Ordering</Tabs.Tab><Tabs.Tab value="qr" leftSection={<IconQrcode size={17}/>}>QR ordering</Tabs.Tab><Tabs.Tab value="general" leftSection={<IconSettings size={17}/>}>General</Tabs.Tab></Tabs.List>
      <Tabs.Panel value="info" className="settings-panel"><SettingCard title="Restaurant information" description="Details used for this restaurant’s menu and receipts"><Grid><Grid.Col span={12}><TextInput label="Restaurant name" required {...register("name")} error={errors.name?.message}/></Grid.Col><Grid.Col span={{base:12,sm:6}}><TextInput label="Contact email" type="email" required {...register("email")} error={errors.email?.message}/></Grid.Col><Grid.Col span={{base:12,sm:6}}><TextInput label="Phone number" required {...register("phone")} error={errors.phone?.message}/></Grid.Col><Grid.Col span={12}><Textarea label="Address" required {...register("address")} error={errors.address?.message}/></Grid.Col></Grid>{saveButton}</SettingCard></Tabs.Panel>
      <Tabs.Panel value="hours" className="settings-panel"><SettingCard title="Opening hours" description="Set when guests can place table orders">{hoursLoading && <Text c="dimmed">Loading opening hours…</Text>}{hoursError && <Text c="red">{errorMessage(hoursError)}</Text>}{hours && <HoursEditor key={restaurantID} restaurantID={restaurantID} initial={hours}/>}</SettingCard></Tabs.Panel>
      <Tabs.Panel value="ordering" className="settings-panel"><SettingCard title="Ordering preferences" description="Control how digital orders enter your service flow"><Stack gap="lg"><Controller name="accept_orders" control={control} render={({field}) => <Switch label="Accept online orders" description="Allow orders for this restaurant" checked={field.value} onChange={(event) => field.onChange(event.currentTarget.checked)}/>}/><Divider/><Controller name="auto_accept" control={control} render={({field}) => <Switch label="Automatically accept new orders" description="Send new orders directly to the kitchen queue" checked={field.value} onChange={(event) => field.onChange(event.currentTarget.checked)}/>}/><Controller name="prep_minutes" control={control} render={({field}) => <NumberInput label="Estimated preparation time" suffix=" minutes" min={1} max={240} value={field.value} onChange={(value) => field.onChange(Number(value))} error={errors.prep_minutes?.message} maw={280}/>}/><Controller name="minimum_order" control={control} render={({field}) => <NumberInput label="Minimum order value" prefix="Rs " min={0} value={field.value} onChange={(value) => field.onChange(Number(value))} error={errors.minimum_order?.message} maw={280}/>}/></Stack>{saveButton}</SettingCard></Tabs.Panel>
      <Tabs.Panel value="qr" className="settings-panel"><SettingCard title="QR ordering" description="Manage the guest experience after a table code is scanned"><Stack gap="lg"><Controller name="qr_ordering" control={control} render={({field}) => <Switch label="Enable table QR ordering" checked={field.value} onChange={(event) => field.onChange(event.currentTarget.checked)}/>}/><Controller name="staff_confirmation" control={control} render={({field}) => <Switch label="Require staff confirmation" checked={field.value} onChange={(event) => field.onChange(event.currentTarget.checked)}/>}/><Controller name="show_table_name" control={control} render={({field}) => <Switch label="Show table name to guest" checked={field.value} onChange={(event) => field.onChange(event.currentTarget.checked)}/>}/><TextInput label="Welcome message" {...register("welcome_message")}/></Stack>{saveButton}</SettingCard></Tabs.Panel>
      <Tabs.Panel value="general" className="settings-panel"><SettingCard title="General settings" description="Configure regional and service-charge preferences"><Grid><Grid.Col span={{base:12,sm:6}}><Controller name="currency" control={control} render={({field}) => <Select label="Currency" data={[{value:"LKR",label:"LKR — Sri Lankan Rupee"},{value:"USD",label:"USD — US Dollar"}]} {...field}/>} /></Grid.Col><Grid.Col span={{base:12,sm:6}}><Controller name="service_charge" control={control} render={({field}) => <NumberInput label="Service charge" suffix="%" min={0} max={100} value={field.value} onChange={(value) => field.onChange(Number(value))} error={errors.service_charge?.message}/>} /></Grid.Col><Grid.Col span={{base:12,sm:6}}><Controller name="timezone" control={control} render={({field}) => <Select label="Time zone" data={[{value:"Asia/Colombo",label:"Asia/Colombo (GMT+5:30)"}]} {...field}/>} /></Grid.Col><Grid.Col span={{base:12,sm:6}}><Controller name="language" control={control} render={({field}) => <Select label="Language" data={[{value:"en",label:"English"},{value:"si",label:"Sinhala"},{value:"ta",label:"Tamil"}]} {...field}/>} /></Grid.Col></Grid>{saveButton}</SettingCard></Tabs.Panel>
    </Tabs>
  </form>;
}

function HoursEditor({ restaurantID, initial }: { restaurantID: string; initial: OpeningHour[] }) {
  const queryClient = useQueryClient();
  const defaultHours = displayDays.map((weekday) => initial.find((hour) => hour.weekday === weekday) || { weekday, is_closed: weekday === 0, open_time: "10:00", close_time: "23:00" });
  const [hours, setHours] = useState<OpeningHour[]>(defaultHours);
  const mutation = useMutation({ mutationFn: () => putHours(restaurantID, hours), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["hours", restaurantID] }) });
  function update(weekday: number, patch: Partial<OpeningHour>) { setHours((current) => current.map((hour) => hour.weekday === weekday ? { ...hour, ...patch } : hour)); }
  async function save() {
    try { await mutation.mutateAsync(); notifications.show({ title: "Opening hours saved", message: "Weekly schedule updated.", color: "forest" }); }
    catch (error) { notifications.show({ title: "Could not save hours", message: errorMessage(error), color: "red" }); }
  }
  return <Stack>{hours.map((hour) => <Group key={hour.weekday} justify="space-between" wrap="nowrap"><Switch checked={!hour.is_closed} onChange={(event) => update(hour.weekday, { is_closed: !event.currentTarget.checked })} label={weekdays[hour.weekday]} w={140}/><Group grow style={{flex:1}}><TextInput type="time" value={hour.open_time} disabled={hour.is_closed} onChange={(event) => update(hour.weekday, { open_time: event.currentTarget.value })} aria-label={`${weekdays[hour.weekday]} opening time`}/><Text c="dimmed">to</Text><TextInput type="time" value={hour.close_time} disabled={hour.is_closed} onChange={(event) => update(hour.weekday, { close_time: event.currentTarget.value })} aria-label={`${weekdays[hour.weekday]} closing time`}/></Group></Group>)}<Group justify="flex-end" mt="lg"><Button type="button" loading={mutation.isPending} leftSection={<IconDeviceFloppy size={17}/>} onClick={save}>Save opening hours</Button></Group></Stack>;
}

function SettingCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <Card withBorder p={{base:"lg",sm:"xl"}}><Title order={2} fz="xl">{title}</Title><Text size="sm" c="dimmed" mt={3} mb="xl">{description}</Text>{children}</Card>;
}
