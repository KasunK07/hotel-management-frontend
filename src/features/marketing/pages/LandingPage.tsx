import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconBuildingStore,
  IconChartBar,
  IconCheck,
  IconChefHat,
  IconClock,
  IconMenu2,
  IconQrcode,
  IconReceipt,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Brand } from "../../../components/shared/Brand";
import { StatusBadge } from "../../../components/shared/StatusBadge";
import classes from "./LandingPage.module.css";

const features = [
  {
    icon: IconBuildingStore,
    title: "Every location, one view",
    copy: "Switch restaurants instantly while keeping menus, teams, tables, and performance neatly separated.",
  },
  {
    icon: IconReceipt,
    title: "Orders without the noise",
    copy: "Track every order from table to kitchen with clear statuses and a service flow your team understands.",
  },
  {
    icon: IconQrcode,
    title: "Table-aware QR ordering",
    copy: "Give every table a unique code that identifies the restaurant and exact seat location automatically.",
  },
  {
    icon: IconChefHat,
    title: "A calmer kitchen",
    copy: "Keep cooks focused with a live, high-contrast queue built around prep time, notes, and next actions.",
  },
  {
    icon: IconUsers,
    title: "Teams and permissions",
    copy: "Invite staff, assign practical roles, and give each person only the access they need.",
  },
  {
    icon: IconChartBar,
    title: "Answers, not spreadsheets",
    copy: "Understand revenue, peak hours, popular dishes, and branch performance at a glance.",
  },
];

export function LandingPage() {
  return (
    <Box className={classes.page}>
      <Box component="header" className={classes.header}>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            <Brand />
            <Group gap="xl" visibleFrom="md" className={classes.navLinks}>
              <Anchor href="#features">Features</Anchor>
              <Anchor href="#how-it-works">How it works</Anchor>
              <Anchor href="#teams">For your team</Anchor>
            </Group>
            <Group gap="sm">
              <Button
                component={Link}
                to="/login"
                variant="subtle"
                color="dark"
                visibleFrom="sm"
              >
                Sign in
              </Button>
              <Button
                component={Link}
                to="/register"
                rightSection={<IconArrowRight size={16} />}
              >
                Start free
              </Button>
              <Menu position="bottom-end" width={190}>
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    color="dark"
                    hiddenFrom="md"
                    size="lg"
                    aria-label="Open menu"
                  >
                    <IconMenu2 />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component="a" href="#features">
                    Features
                  </Menu.Item>
                  <Menu.Item component="a" href="#how-it-works">
                    How it works
                  </Menu.Item>
                  <Menu.Item component="a" href="#teams">
                    For your team
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item component={Link} to="/login">
                    Sign in
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Container>
      </Box>

      <Box component="main">
        <section className={classes.hero}>
          <Container size="xl">
            <Grid align="center" gap={{ base: 48, lg: 72 }}>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <Stack gap="xl" align="flex-start">
                  <Badge
                    size="lg"
                    variant="light"
                    color="ember"
                    leftSection={<IconSparkles size={14} />}
                    tt="none"
                  >
                    Built for modern hospitality
                  </Badge>
                  <Stack gap="lg">
                    <Title className={classes.heroTitle}>
                      Run every restaurant from one{" "}
                      <span>calm command center.</span>
                    </Title>
                    <Text
                      fz={{ base: 18, sm: 20 }}
                      c="dimmed"
                      lh={1.65}
                      maw={610}
                    >
                      Meridian brings orders, menus, tables, kitchen operations,
                      teams, and insights together—so you can spend less time
                      managing software and more time creating memorable
                      service.
                    </Text>
                  </Stack>
                  <Group gap="md">
                    <Button
                      component={Link}
                      to="/register"
                      size="lg"
                      rightSection={<IconArrowRight size={18} />}
                    >
                      Register your business
                    </Button>
                    <Button
                      component="a"
                      href="#features"
                      size="lg"
                      variant="default"
                    >
                      Explore features
                    </Button>
                  </Group>
                  <Group gap="xl">
                    {[
                      "No credit card",
                      "Setup in minutes",
                      "Cancel anytime",
                    ].map((item) => (
                      <Group key={item} gap={6}>
                        <ThemeIcon
                          size={20}
                          radius="xl"
                          variant="light"
                          color="forest"
                        >
                          <IconCheck size={12} stroke={3} />
                        </ThemeIcon>
                        <Text size="sm" fw={600} c="dimmed">
                          {item}
                        </Text>
                      </Group>
                    ))}
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, lg: 6 }}>
                <HeroProductPreview />
              </Grid.Col>
            </Grid>
          </Container>
        </section>

        <section className={classes.trustStrip}>
          <Container size="xl">
            <Group justify="space-between" gap="xl">
              <Text fw={700} c="dimmed" size="sm">
                DESIGNED FOR EVERY SERVICE STYLE
              </Text>
              {[
                "Fine dining",
                "Quick service",
                "Cafés",
                "Restaurant groups",
              ].map((x) => (
                <Text key={x} className={classes.trustName}>
                  {x}
                </Text>
              ))}
            </Group>
          </Container>
        </section>

        <section id="features" className={classes.section}>
          <Container size="xl">
            <Stack align="center" ta="center" gap="sm" mb={52}>
              <Text className={classes.eyebrow}>EVERYTHING IN ITS PLACE</Text>
              <Title order={2} className={classes.sectionTitle}>
                One system. Every part of service.
              </Title>
              <Text c="dimmed" fz="lg" maw={640}>
                Purpose-built tools that feel connected, stay out of the way,
                and give your team clarity from opening to close.
              </Text>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className={classes.featureCard}
                  padding="xl"
                >
                  <ThemeIcon
                    size={48}
                    radius="lg"
                    variant="light"
                    color="ember"
                  >
                    <feature.icon size={23} />
                  </ThemeIcon>
                  <Title order={3} fz="lg" mt="xl">
                    {feature.title}
                  </Title>
                  <Text size="sm" c="dimmed" lh={1.65} mt="xs">
                    {feature.copy}
                  </Text>
                  <Anchor
                    component={Link}
                    to="/register"
                    mt="lg"
                    size="sm"
                    fw={700}
                  >
                    Learn more{" "}
                    <IconArrowRight size={14} style={{ verticalAlign: -2 }} />
                  </Anchor>
                </Card>
              ))}
            </SimpleGrid>
          </Container>
        </section>

        <section id="teams" className={classes.darkSection}>
          <Container size="xl">
            <Grid align="center" gap={64}>
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack align="flex-start" gap="lg">
                  <Text className={classes.eyebrow} c="ember.3">
                    BUILT AROUND THE SHIFT
                  </Text>
                  <Title order={2} c="white" className={classes.sectionTitle}>
                    Front of house and kitchen, finally in sync.
                  </Title>
                  <Text c="rgba(255,255,255,.66)" fz="lg" lh={1.7}>
                    New orders arrive clearly, special instructions stand out,
                    and every status update reaches the right people—without
                    shouting across the pass.
                  </Text>
                  <Stack gap="md">
                    {[
                      "Live kitchen order queue",
                      "Clear prep-time indicators",
                      "Role-based staff access",
                    ].map((x) => (
                      <Group key={x}>
                        <ThemeIcon
                          color="forest"
                          variant="filled"
                          radius="xl"
                          size={24}
                        >
                          <IconCheck size={14} />
                        </ThemeIcon>
                        <Text c="white" fw={600}>
                          {x}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                  <Button
                    component={Link}
                    to="/register"
                    color="ember"
                    variant="white"
                    mt="md"
                  >
                    Build your workspace
                  </Button>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 7 }}>
                <KitchenPreview />
              </Grid.Col>
            </Grid>
          </Container>
        </section>

        <section id="how-it-works" className={classes.section}>
          <Container size="lg">
            <Stack align="center" ta="center" mb={48}>
              <Text className={classes.eyebrow}>A SIMPLE START</Text>
              <Title order={2} className={classes.sectionTitle}>
                From registration to service in three steps.
              </Title>
            </Stack>
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing={42}>
              {[
                [
                  "01",
                  "Register your business",
                  "Tell us about the business and owner. We’ll send a secure verification link to the right inbox.",
                ],
                [
                  "02",
                  "Verify your account",
                  "Open the email, choose your secure account password, and confirm your owner access.",
                ],
                [
                  "03",
                  "Open your dashboard",
                  "Add restaurants, create menus and tables, invite the team, and get ready for service.",
                ],
              ].map((s, i) => (
                <Stack key={s[0]} align="center" pos="relative">
                  <Box className={classes.stepNumber}>{s[0]}</Box>
                  <Title order={3} fz="lg">
                    {s[1]}
                  </Title>
                  <Text c="dimmed" ta="center" size="sm" lh={1.7}>
                    {s[2]}
                  </Text>
                  {i < 2 && <IconArrowRight className={classes.stepArrow} />}
                </Stack>
              ))}
            </SimpleGrid>
          </Container>
        </section>

        <Container size="xl" pb={96}>
          <Box className={classes.cta}>
            <Stack align="center" ta="center" gap="lg">
              <Badge variant="light" color="ember" tt="none">
                Your next service starts here
              </Badge>
              <Title order={2} c="white" className={classes.sectionTitle}>
                Give your restaurant room to thrive.
              </Title>
              <Text c="rgba(255,255,255,.65)" fz="lg" maw={560}>
                Create your business account today and bring calm, connected
                operations to every location.
              </Text>
              <Button
                component={Link}
                to="/register"
                size="lg"
                color="ember"
                variant="white"
                rightSection={<IconArrowRight size={18} />}
              >
                Register your business
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box component="footer" className={classes.footer}>
        <Container size="xl">
          <Group justify="space-between" align="flex-start">
            <Brand light />
            <Group gap="xl">
              <Anchor c="rgba(255,255,255,.6)" href="#features">
                Product
              </Anchor>
              <Anchor c="rgba(255,255,255,.6)" href="#how-it-works">
                Getting started
              </Anchor>
              <Anchor c="rgba(255,255,255,.6)" component={Link} to="/login">
                Sign in
              </Anchor>
            </Group>
          </Group>
          <Divider my="xl" color="rgba(255,255,255,.1)" />
          <Group justify="space-between">
            <Text c="rgba(255,255,255,.42)" size="sm">
              © 2026 Meridian Restaurant OS
            </Text>
            <Text c="rgba(255,255,255,.42)" size="sm">
              Made for hospitality teams everywhere.
            </Text>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}

function HeroProductPreview() {
  return (
    <Box className={classes.previewWrap}>
      <Box className={classes.glow} />
      <Card className={classes.productPreview} padding={0}>
        <Group className={classes.previewTop} justify="space-between">
          <Group>
            <Box className={classes.miniMark}>M</Box>
            <Stack gap={0}>
              <Text fw={750} c="white" size="sm">
                Downtown Branch
              </Text>
              <Text fz={10} c="rgba(255,255,255,.45)">
                Live operations
              </Text>
            </Stack>
          </Group>
          <Badge color="forest" variant="filled" tt="none">
            Open
          </Badge>
        </Group>
        <Box p="lg">
          <SimpleGrid cols={3} spacing="sm">
            {[
              ["Rs 148k", "Revenue"],
              ["96", "Orders"],
              ["14 min", "Avg. prep"],
            ].map((x) => (
              <Paper key={x[1]} p="md" radius="md" bg="#f8f8f4">
                <Text fw={800} fz="lg">
                  {x[0]}
                </Text>
                <Text size="xs" c="dimmed">
                  {x[1]}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
          <Paper withBorder p="lg" mt="md" radius="lg">
            <Group justify="space-between">
              <Text fw={700}>Live orders</Text>
              <Text size="xs" c="forest.7" fw={700}>
                4 active
              </Text>
            </Group>
            <Stack gap="md" mt="lg">
              {[
                ["#1048", "Table 08", "New"],
                ["#1047", "VIP 01", "Preparing"],
                ["#1046", "Table 03", "Ready"],
              ].map((o) => (
                <Group key={o[0]} justify="space-between">
                  <Group gap="sm">
                    <ThemeIcon
                      color="ember"
                      variant="light"
                      size={34}
                      radius="md"
                    >
                      <IconReceipt size={16} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text size="sm" fw={700}>
                        {o[0]}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {o[1]}
                      </Text>
                    </Stack>
                  </Group>
                  <StatusBadge status={o[2]} />
                </Group>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Card>
      <Paper className={classes.floatingCard} shadow="md" radius="lg" p="md">
        <Group gap="sm">
          <ThemeIcon color="forest" variant="light" radius="xl">
            <IconChartBar size={18} />
          </ThemeIcon>
          <Stack gap={1}>
            <Text size="xs" c="dimmed">
              This week
            </Text>
            <Text fw={800}>+18.2% revenue</Text>
          </Stack>
        </Group>
      </Paper>
    </Box>
  );
}

function KitchenPreview() {
  return (
    <Box className={classes.kitchenBoard}>
      <Group justify="space-between" mb="lg">
        <Group>
          <ThemeIcon color="ember" variant="light">
            <IconChefHat />
          </ThemeIcon>
          <Text c="white" fw={750}>
            Kitchen display
          </Text>
        </Group>
        <Group gap={6}>
          <span className={classes.liveDot} />
          <Text c="rgba(255,255,255,.6)" size="sm">
            Live
          </Text>
        </Group>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        {[
          ["#1048", "Table 08", "2 min", "Start preparing"],
          ["#1047", "VIP 01", "8 min", "Mark ready"],
        ].map((o, i) => (
          <Paper key={o[0]} p="lg" radius="lg" bg="white">
            <Group justify="space-between">
              <Title order={3}>{o[0]}</Title>
              <Group gap={4}>
                <IconClock size={14} />
                <Text size="xs" c="dimmed">
                  {o[2]}
                </Text>
              </Group>
            </Group>
            <Text size="sm" fw={650} mt={2}>
              {o[1]}
            </Text>
            <Divider my="md" />
            <Stack gap="xs">
              <Text size="sm">
                <b>1 ×</b> Truffle Mushroom Pizza
              </Text>
              <Text size="sm">
                <b>2 ×</b> Classic Beef Burger
              </Text>
              {i === 0 && (
                <Text size="xs" c="ember.7">
                  No onions on one
                </Text>
              )}
            </Stack>
            <Button fullWidth mt="lg" color={i ? "forest" : "blue"}>
              {o[3]}
            </Button>
          </Paper>
        ))}
      </SimpleGrid>
    </Box>
  );
}
