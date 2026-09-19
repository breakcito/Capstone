import { Stack, Text, Box, Skeleton } from "@mantine/core";

interface ProfileDataFieldProps {
  label: string;
  value: string | null | undefined;
  loading?: boolean;
}

export const ProfileDataField = ({ label, value, loading }: ProfileDataFieldProps) => {
  return (
    <Stack gap={6} className="group">
      <Text
        size="13px"
        fw={700}
        className="text-zinc-500 transition-colors group-hover:text-indigo-400"
      >
        {label}
      </Text>
      <Box className="ml-6 min-h-[19px]">
        {loading ? (
          <Skeleton height={15} width="80%" radius="xs" className="mt-1" animate />
        ) : (
          <Text size="12.5px" fw={400} className="text-zinc-400 leading-relaxed font-secondary animate-fade-in">
            {value || "No registrado"}
          </Text>
        )}
      </Box>
    </Stack>
  );
};
