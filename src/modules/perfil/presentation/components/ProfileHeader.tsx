import { Avatar, Stack, Text, Group, Badge, Skeleton } from "@mantine/core";
import { UserIcon } from "@heroicons/react/24/outline";

interface ProfileHeaderProps {
  username?: string;
  url_foto?: string | null;
  nombre_rol?: string;
  nombre_cargo?: string | null;
  loading?: boolean;
}

export const ProfileHeader = ({
  username,
  url_foto,
  nombre_rol,
  nombre_cargo,
  loading,
}: ProfileHeaderProps) => {
  return (
    <Group gap="xl" justify="flex-start" align="center" className="w-full">
      {loading ? (
        <Skeleton height={90} width={90} radius="md" />
      ) : (
        <Avatar
          src={url_foto}
          size={90}
          radius="md"
          className="border border-zinc-800 bg-zinc-900 shadow-xl animate-fade-in"
        >
          <UserIcon className="w-10 h-10 text-zinc-700" />
        </Avatar>
      )}
      <Stack gap={6}>
        {loading ? (
          <Skeleton height={24} width={180} radius="sm" className="mb-1" />
        ) : (
          <Text
            fw={800}
            size="lg"
            className="text-white tracking-tight animate-fade-in"
          >
            @{username}
          </Text>
        )}
        <Group gap={8}>
          {loading ? (
            <>
              <Skeleton height={24} width={100} radius="sm" />
              <Skeleton height={24} width={100} radius="sm" />
            </>
          ) : (
            <>
              {nombre_rol && (
                <Badge
                  variant="light"
                  color="indigo"
                  radius="sm"
                  size="sm"
                  className="font-bold border border-indigo-500/20 animate-fade-in"
                >
                  {nombre_rol}
                </Badge>
              )}
              {nombre_cargo && (
                <Badge
                  variant="light"
                  color="pink"
                  radius="sm"
                  size="sm"
                  className="font-bold border border-pink-500/20 animate-fade-in"
                >
                  {nombre_cargo}
                </Badge>
              )}
            </>
          )}
        </Group>
      </Stack>
    </Group>
  );
};
