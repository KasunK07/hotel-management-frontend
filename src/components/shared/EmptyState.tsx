import type { ReactNode } from "react";
import { Button, Center, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconInbox } from "@tabler/icons-react";
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Center py={60}>
      <Stack align="center" gap="sm">
        <ThemeIcon size={52} radius="xl" variant="light" color="gray">
          <IconInbox size={24} />
        </ThemeIcon>
        <Title order={3} fz="lg">
          {title}
        </Title>
        <Text c="dimmed" ta="center" maw={360}>
          {description}
        </Text>
        {action ?? <Button variant="light">Get started</Button>}
      </Stack>
    </Center>
  );
}
