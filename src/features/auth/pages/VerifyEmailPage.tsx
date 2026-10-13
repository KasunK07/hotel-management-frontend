import {
  Anchor,
  Button,
  Card,
  Center,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconArrowRight,
  IconCheck,
  IconMail,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import { AuthLayout } from "../../../layouts/auth-layout/AuthLayout";

interface VerificationState {
  email?: string;
  businessName?: string;
  verificationUrl?: string;
}
export function VerifyEmailPage() {
  const location = useLocation();
  const state = (location.state ?? {}) as VerificationState;
  const email = state.email ?? "your email address";
  return (
    <AuthLayout activeStep={2}>
      <Center py={{ base: 20, sm: 70 }}>
        <Card withBorder p={{ base: "xl", sm: 44 }} maw={560} w="100%">
          <Stack align="center" ta="center" gap="lg">
            <ThemeIcon size={72} radius="xl" color="ember" variant="light">
              <IconMail size={34} />
            </ThemeIcon>
            <Stack gap="xs">
              <Text size="sm" fw={750} c="ember.7">
                CHECK YOUR INBOX
              </Text>
              <Title order={1} fz={{ base: 28, sm: 34 }}>
                Verify your email address
              </Title>
              <Text c="dimmed" lh={1.65}>
                We sent a verification link to{" "}
                <Text span fw={700} c="dark">
                  {email}
                </Text>
                . Open it to confirm that this inbox belongs to you.
              </Text>
            </Stack>
            <Stack gap="sm" w="100%" mt="sm">
              {state.verificationUrl && (
                <Button component="a" href={state.verificationUrl} size="md" rightSection={<IconArrowRight size={17} />}>
                  Open development verification link
                </Button>
              )}
            </Stack>
            <Group gap={7}>
              <ThemeIcon color="forest" variant="light" size={22} radius="xl">
                <IconCheck size={13} />
              </ThemeIcon>
              <Text size="xs" c="dimmed">
                The link will expire in 30 minutes
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              Wrong email?{" "}
              <Anchor component={Link} to="/register" fw={650}>
                Go back and edit details
              </Anchor>
            </Text>
          </Stack>
        </Card>
      </Center>
    </AuthLayout>
  );
}
