import type { ReactNode } from "react";
import { Group, Stack, Text, Title } from "@mantine/core";
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
      <Stack gap={3}>
        <Title order={1} fz={{ base: 26, sm: 30 }} lh={1.2}>
          {title}
        </Title>
        <Text c="dimmed" fz="sm">
          {description}
        </Text>
      </Stack>
      {action}
    </Group>
  );
}
