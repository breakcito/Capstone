import { Group, Text, SimpleGrid } from "@mantine/core";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export const ProfileSection = ({ title, children }: ProfileSectionProps) => {
  return (
    <div className="space-y-6 w-full">
      <Group gap="md" wrap="nowrap" className="w-full">
        <Text
          size="xs"
          fw={800}
          tt="uppercase"
          className="text-zinc-500 tracking-[0.15em] whitespace-nowrap"
        >
          {title}
        </Text>
        <div className="h-px w-[40%] bg-zinc-700/50" />
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={35} className="w-full">
        {children}
      </SimpleGrid>
    </div>
  );
};
