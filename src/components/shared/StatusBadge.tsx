import { Badge } from "@mantine/core";
const statusColors: Record<string, string> = {
  Open: "forest",
  Available: "forest",
  Active: "forest",
  Completed: "gray",
  New: "blue",
  Preparing: "orange",
  Ready: "teal",
  Occupied: "red",
  Reserved: "yellow",
  Closed: "gray",
  "Off duty": "gray",
  Unavailable: "gray",
};
export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      color={statusColors[status] ?? "gray"}
      variant="light"
      size="sm"
      radius="xl"
      tt="none"
    >
      {status}
    </Badge>
  );
}
