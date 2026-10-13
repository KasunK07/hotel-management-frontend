import { Box, Group, Stack, Text } from "@mantine/core";
import classes from "./Brand.module.css";

export function Brand({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Group gap="sm" wrap="nowrap">
      <Box className={classes.mark}>M</Box>
      {!compact && (
        <Stack gap={0}>
          <Text fw={800} fz="lg" c={light ? "white" : "#172721"} lh={1.1}>
            Meridian
          </Text>
          <Text
            fz={10}
            fw={700}
            c={light ? "rgba(255,255,255,.5)" : "dimmed"}
            tt="uppercase"
            lts=".11em"
          >
            Restaurant OS
          </Text>
        </Stack>
      )}
    </Group>
  );
}
