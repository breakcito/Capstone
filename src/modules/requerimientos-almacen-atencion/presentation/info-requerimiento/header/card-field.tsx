import { Group, Paper, Stack, Text } from "@mantine/core";
import React from "react";

interface CardFieldProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: "indigo" | "violet" | "amber" | "emerald";
}

const colorMap: Record<
  CardFieldProps["color"],
  {
    bg: string;
    border: string;
    hover: string;
    icon: string;
    text: string;
    subText: string;
  }
> = {
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    hover: "hover:bg-indigo-500/20",
    icon: "text-indigo-400",
    text: "text-indigo-400/20",
    subText: "indigo.3",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    hover: "hover:bg-violet-500/20",
    icon: "text-violet-400",
    text: "text-violet-400/20",
    subText: "violet.3",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    hover: "hover:bg-amber-500/20",
    icon: "text-amber-400",
    text: "text-amber-400/20",
    subText: "amber.5",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    hover: "hover:bg-emerald-500/20",
    icon: "text-emerald-400",
    text: "text-emerald-400/20",
    subText: "emerald.5",
  },
};

export const CardField = ({
  icon: Icon,
  label,
  value,
  color,
}: CardFieldProps) => {
  const styles = colorMap[color];
  return (
    <Paper
      p="md"
      radius="lg"
      className={`${styles.bg} ${styles.border} relative overflow-hidden group ${styles.hover} transition-all`}
    >
      <Icon
        className={`absolute -right-2 -bottom-2 w-16 h-16 ${styles.text} rotate-12 group-hover:scale-110 transition-transform`}
      />
      <Stack gap={2} className="relative z-10">
        <Group gap={6}>
          <Icon className={`w-4 h-4 ${styles.icon}`} />
          <Text
            size="xs"
            c={styles.subText}
            fw={800}
            className="uppercase tracking-widest"
          >
            {label}
          </Text>
        </Group>
        <Text size="md" fw={900} className="text-white tracking-tight">
          {value}
        </Text>
      </Stack>
    </Paper>
  );
};
