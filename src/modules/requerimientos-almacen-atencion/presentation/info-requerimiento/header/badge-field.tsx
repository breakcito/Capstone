import { Badge, Stack, Text } from "@mantine/core";
import React from "react";

interface BadgeFieldProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ElementType;
  iconColor?: string; // Tailwind class name
  isMono?: boolean;
}

export const BadgeField = ({
  label,
  value,
  color,
  icon: Icon,
  iconColor,
  isMono,
}: BadgeFieldProps) => (
  <Stack gap={4}>
    <div className="flex items-center gap-1.5 font-bold">
      {Icon && (
        <Icon className={`w-3.5 h-3.5 ${iconColor || "text-zinc-500"}`} />
      )}
      <Text size="xs" c="zinc.5" fw={800} className="uppercase tracking-widest">
        {label}
      </Text>
    </div>
    {color ? (
      <Badge
        color={color}
        variant="light"
        size="sm"
        radius="sm"
        className="font-bold"
      >
        {value}
      </Badge>
    ) : (
      <Text
        size="sm"
        fw={isMono ? 400 : 800}
        className={`${isMono ? "font-mono text-zinc-400" : "text-zinc-100 italic"}`}
      >
        {value}
      </Text>
    )}
  </Stack>
);
