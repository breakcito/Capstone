import { Select, Button, Text, Stack, Group, Box } from "@mantine/core";
import { CubeIcon } from "@heroicons/react/24/outline";
import type { RES_MinaAbastecida } from "../service/almacenes.responses";
import { useAbastecerMina } from "../hooks/useAbastecerMina";

interface AbastecerMinaProps {
  idAlmacen: number;
  nombreAlmacen: string;
  onSuccess: (mina: RES_MinaAbastecida) => void;
}

export const AbastecerMina = ({
  idAlmacen,
  nombreAlmacen,
  onSuccess,
}: AbastecerMinaProps) => {
  const {
    selectOptions,
    loading,
    idMina,
    setIdMina,
    searchValue,
    setSearchValue,
    formError,
    isAssigning,
    handleAsignar,
  } = useAbastecerMina(idAlmacen);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAsignar(onSuccess);
  };

  return (
    <Stack
      gap="md"
      className="animate-fade-in p-4 border border-zinc-800 bg-zinc-900/40 rounded-xl"
    >
      {/* Header igual a NuevoContrato */}
      <Group gap="sm" align="center">
        <Box className="size-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <CubeIcon className="size-4 text-indigo-400" />
        </Box>
        <Stack gap={0}>
          <Text size="xs" fw={700} className="text-zinc-300 uppercase tracking-wider">
            Nueva Mina a Abastecer
          </Text>
          <Text size="xs" className="text-zinc-500">
            {nombreAlmacen}
          </Text>
        </Stack>
      </Group>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Select
          label="Mina"
          placeholder={loading ? "Cargando minas..." : "Buscar mina..."}
          data={selectOptions}
          searchable
          nothingFoundMessage="No hay minas disponibles"
          leftSection={<CubeIcon className="w-4 h-4 text-zinc-400" />}
          value={idMina}
          onChange={(val) => setIdMina(val || "")}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          error={formError}
          radius="lg"
          size="sm"
          disabled={loading || isAssigning}
          classNames={{
            input:
              "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500",
            dropdown: "bg-zinc-900 border-zinc-800",
            option:
              "hover:bg-zinc-800 text-zinc-300 data-[selected]:bg-zinc-100 data-[selected]:text-zinc-900 rounded-md my-1",
            label: "text-zinc-300 mb-1 font-medium",
            groupLabel:
              "text-zinc-500 font-bold text-xs uppercase mt-2 mb-1 pl-2",
          }}
        />
        <Group justify="flex-end">
          <Button
            type="submit"
            loading={isAssigning}
            disabled={!idMina}
            radius="lg"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20"
          >
            Vincular Mina
          </Button>
        </Group>
      </form>
    </Stack>
  );
};
