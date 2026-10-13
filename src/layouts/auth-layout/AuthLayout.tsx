import type { ReactNode } from "react";
import {
  Anchor,
  Box,
  Container,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Brand } from "../../components/shared/Brand";
import classes from "./AuthLayout.module.css";

export function AuthLayout({
  children,
  activeStep = 1,
}: {
  children: ReactNode;
  activeStep?: number;
}) {
  const steps = ["Business details", "Verify email", "Secure account"];
  return (
    <Box className={classes.page}>
      <Box className={classes.aside}>
        <Brand light />
        <Stack gap="lg" mt={72}>
          <Text className={classes.eyebrow}>WELCOME TO MERIDIAN</Text>
          <Title c="white" order={1} className={classes.title}>
            Set the foundation for smoother service.
          </Title>
          <Text c="rgba(255,255,255,.62)" lh={1.7}>
            Your business account keeps every restaurant, team, and guest
            experience connected in one secure place.
          </Text>
        </Stack>
        <Stack gap="lg" mt={52}>
          {steps.map((step, i) => {
            const number = i + 1;
            const done = number < activeStep;
            const active = number === activeStep;
            return (
              <Group key={step} gap="md" className={classes.step}>
                <ThemeIcon
                  size={34}
                  radius="xl"
                  color={done ? "forest" : active ? "ember" : "gray"}
                  variant={done || active ? "filled" : "outline"}
                >
                  {done ? <IconCheck size={17} /> : number}
                </ThemeIcon>
                <Stack gap={1}>
                  <Text
                    c={active || done ? "white" : "rgba(255,255,255,.45)"}
                    fw={active ? 700 : 500}
                  >
                    {step}
                  </Text>
                  {active && (
                    <Text size="xs" c="rgba(255,255,255,.48)">
                      You’re here
                    </Text>
                  )}
                </Stack>
              </Group>
            );
          })}
        </Stack>
        <Text className={classes.asideFooter}>
          © 2026 Meridian Restaurant OS
        </Text>
      </Box>
      <Box className={classes.content}>
        <Container size={740} w="100%">
          <Group justify="space-between" mb={44}>
            <Box hiddenFrom="md">
              <Brand />
            </Box>
            <Anchor component={Link} to="/" c="dimmed" size="sm">
              ← Back to home
            </Anchor>
          </Group>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
