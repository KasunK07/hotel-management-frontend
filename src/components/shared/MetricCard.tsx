import type { ReactNode } from "react";
import { Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
export function MetricCard({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  icon: ReactNode;
}) {
  return (
    <Card withBorder padding="lg" className="metric-card">
      <Group justify="space-between" align="flex-start">
        <ThemeIcon variant="light" color="ember" size={42} radius="md">
          {icon}
        </ThemeIcon>
        <Group gap={3}>
          <IconArrowUpRight size={14} color="#348f5d" />
          <Text size="xs" fw={700} c="forest.7">
            {change}
          </Text>
        </Group>
      </Group>
      <Stack gap={2} mt="lg">
        <Text fz={26} fw={750} lh={1.1}>
          {value}
        </Text>
        <Text size="sm" c="dimmed">
          {label}
        </Text>
      </Stack>
    </Card>
  );
}
