import { Paper, Group, Text } from "@mantine/core";

interface InfoProgressProps {
  progresoGeneral: number;
}

export const InfoProgress = ({ progresoGeneral }: InfoProgressProps) => {
  return (
    <Paper p="md" radius="xl" className="bg-zinc-900/50 border border-zinc-800">
      <Group justify="space-between" mb={8} px={4}>
        <Text
          size="xs"
          fw={800}
          className="text-zinc-400 tracking-tighter uppercase"
        >
          Progreso General de Atención
        </Text>
        <Text size="sm" fw={900} c="indigo.4">
          {progresoGeneral}%
        </Text>
      </Group>
      <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-linear-to-r from-indigo-500 to-indigo-400 transition-all duration-1000"
          style={{ width: `${progresoGeneral}%` }}
        />
      </div>
    </Paper>
  );
};
