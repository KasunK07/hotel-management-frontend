import { useState } from "react";
import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Divider,
  Group,
  Menu,
  NavLink,
  ScrollArea,
  Select,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  IconBell,
  IconBuildingStore,
  IconChartBar,
  IconChevronDown,
  IconClipboardList,
  IconLayoutDashboard,
  IconLogout,
  IconReceipt,
  IconSettings,
  IconToolsKitchen2,
  IconUsers,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";
import {
  NavLink as RouterNavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { clearSession, getSession, logout } from "../../features/auth/api/auth-api";
import { listRestaurants } from "../../features/restaurants/api/restaurant-api";
import { useAppStore } from "../../stores/app-store";
import classes from "./AdminLayout.module.css";

const nav = [
  { label: "Dashboard", to: "/dashboard", icon: IconLayoutDashboard },
  { label: "Restaurants", to: "/restaurants", icon: IconBuildingStore },
  { label: "Menu", to: "/menu", icon: IconReceipt },
  { label: "Tables & QR", to: "/tables", icon: IconUsersGroup },
  { label: "Orders", to: "/orders", icon: IconClipboardList },
  { label: "Kitchen display", to: "/kitchen", icon: IconToolsKitchen2 },
  { label: "Employees", to: "/employees", icon: IconUsers },
  { label: "Analytics", to: "/analytics", icon: IconChartBar },
  { label: "Settings", to: "/settings", icon: IconSettings },
];

export function AdminLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { restaurantId, setRestaurantId } = useAppStore();
  const [notices, setNotices] = useState(0);
  const session = getSession();
  const restaurantsQuery = useQuery({ queryKey: ["restaurants"], queryFn: listRestaurants });
  const restaurants = restaurantsQuery.data || [];
  const current = restaurants.find((r) => r.id === restaurantId) ?? restaurants[0];
  return (
    <AppShell
      header={{ height: 72 }}
      navbar={{ width: 264, breakpoint: "md", collapsed: { mobile: !opened } }}
      padding={{ base: "md", sm: "xl" }}
      className={classes.shell}
    >
      <AppShell.Header className={classes.header}>
        <Group h="100%" px={{ base: "md", sm: "xl" }} justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="md"
              size="sm"
            />
            <Box className={classes.mobileBrand}>M</Box>
            <Box visibleFrom="md">
              <Text fw={750} size="sm">
                Your business
              </Text>
              <Text size="xs" c="dimmed">
                Business account
              </Text>
            </Box>
          </Group>
          <Group gap="sm">
            <Tooltip label="Notifications">
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                pos="relative"
                onClick={() => setNotices(0)}
                aria-label="Notifications"
              >
                <IconBell size={20} />
                {notices > 0 && <span className={classes.dot} />}
              </ActionIcon>
            </Tooltip>
            <Divider orientation="vertical" h={28} />
            <Menu position="bottom-end" width={190}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="sm">
                    <Avatar color="ember" radius="xl" size={38}>
                      {session?.owner_name?.slice(0, 2).toUpperCase() || "OW"}
                    </Avatar>
                    <Box visibleFrom="sm">
                      <Text size="sm" fw={650}>
                        {session?.owner_name || "Owner"}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Owner
                      </Text>
                    </Box>
                    <IconChevronDown size={15} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item color="red" leftSection={<IconLogout size={15} />} onClick={async () => { await logout().catch(() => undefined); clearSession(); queryClient.clear(); navigate("/login", { replace: true }); }}>
                  Sign out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className={classes.navbar}>
        <AppShell.Section p="lg">
          <Group gap="sm">
            <Box className={classes.brandMark}>M</Box>
            <Box>
              <Text fw={800} c="white" fz="lg">
                Meridian
              </Text>
              <Text size="xs" c="rgba(255,255,255,.55)">
                Restaurant OS
              </Text>
            </Box>
            <ActionIcon
              hiddenFrom="md"
              ml="auto"
              variant="transparent"
              color="gray"
              onClick={close}
            >
              <IconX />
            </ActionIcon>
          </Group>
        </AppShell.Section>
        <AppShell.Section px="lg" pb="md">
          <Text className={classes.navLabel}>CURRENT RESTAURANT</Text>
          <Select
            value={current?.id || null}
            onChange={(v) => v && setRestaurantId(v)}
            data={restaurants.map((r) => ({ value: r.id, label: r.name }))}
            placeholder={restaurantsQuery.isPending ? "Loading restaurants" : "No restaurant yet"}
            leftSection={<IconBuildingStore size={16} />}
            classNames={{ input: classes.restaurantSelect }}
            allowDeselect={false}
          />
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea} px="md">
          <Stack gap={3}>
            {nav.map((item) => (
              <NavLink
                key={item.to}
                component={RouterNavLink}
                to={item.to}
                label={item.label}
                leftSection={<item.icon size={19} />}
                active={location.pathname.startsWith(item.to)}
                onClick={close}
                className={classes.navLink}
              />
            ))}
          </Stack>
        </AppShell.Section>
        <AppShell.Section p="md">
          <Box className={classes.help}>
            <Text size="sm" fw={650} c="white">
              Need a hand?
            </Text>
            <Text size="xs" c="rgba(255,255,255,.6)" mt={3}>
              Visit our help center
            </Text>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main>
        <Box maw={1480} mx="auto">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
