import {
  ActionIcon,
  Tooltip,
  Text,
  Group,
  Stack,
  Skeleton,
  Select,
  Button,
  Box,
} from "@mantine/core";
import { BuildingStorefrontIcon, TrashIcon, LinkIcon } from "@heroicons/react/24/outline";
import { useAlmacenesVecinos } from "../hooks/useAlmacenesVecinos";
import type { RES_AlmacenResumen } from "../service/almacenes.responses";

interface AlmacenesVecinosProps {
  almacen: RES_AlmacenResumen;
}

export const AlmacenesVecinos = ({ almacen }: AlmacenesVecinosProps) => {
  const {
    vecinos,
    loading,
    loadingDisponibles,
    selectOptions,
    idVecinoSeleccionado,
    setIdVecinoSeleccionado,
    searchValue,
    setSearchValue,
    formError,
    isLinking,
    loadingIdDesvinculando,
    handleVincular,
    handleDesvincular,
  } = useAlmacenesVecinos(almacen.id_almacen);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleVincular();
  };

  return (
    <Stack gap="md" className="space-y-4">
      {/* Formulario para agregar vecino */}
      <Stack
        gap="md"
        className="animate-fade-in p-4 border border-zinc-800 bg-zinc-900/40 rounded-xl"
      >
        <Group gap="sm" align="center">
          <Box className="size-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <LinkIcon className="size-4 text-indigo-400" />
          </Box>
          <Stack gap={0}>
            <Text size="xs" fw={700} className="text-zinc-300 uppercase tracking-wider">
              Vincular Almacén Vecino
            </Text>
            <Text size="xs" className="text-zinc-500">
              {almacen.nombre}
            </Text>
          </Stack>
        </Group>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Select
            label="Almacén Vecino"
            placeholder={loadingDisponibles ? "Cargando almacenes..." : "Buscar almacén..."}
            data={selectOptions}
            searchable
            nothingFoundMessage="No hay almacenes disponibles"
            leftSection={<BuildingStorefrontIcon className="w-4 h-4 text-zinc-400" />}
            value={idVecinoSeleccionado}
            onChange={(val) => setIdVecinoSeleccionado(val || "")}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            error={formError}
            radius="lg"
            size="sm"
            disabled={loadingDisponibles || isLinking}
            classNames={{
              input:
                "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500",
              dropdown: "bg-zinc-900 border-zinc-800",
              option:
                "hover:bg-zinc-800 text-zinc-300 data-[selected]:bg-zinc-100 data-[selected]:text-zinc-900 rounded-md my-1",
              label: "text-zinc-300 mb-1 font-medium",
            }}
          />
          <Group justify="flex-end">
            <Button
              type="submit"
              loading={isLinking}
              disabled={!idVecinoSeleccionado}
              radius="lg"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 border-0"
            >
              Vincular Vecino
            </Button>
          </Group>
        </form>
      </Stack>

      {/* Separador */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-zinc-800" />
        <Text
          size="xs"
          fw={700}
          className="text-zinc-500 uppercase tracking-widest px-2"
        >
          Almacenes Vecinos Vinculados
        </Text>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* Skeletons */}
      {loading && (
        <Stack gap="sm">
          {[1, 2].map((i) => (
            <Group
              key={`skeleton-vecino-${i}`}
              wrap="nowrap"
              className="p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg"
            >
              <Skeleton height={40} width={40} radius="xl" />
              <Stack gap={6} className="flex-1">
                <Skeleton height={13} width="50%" radius="sm" />
                <Skeleton height={10} width="35%" radius="sm" />
              </Stack>
            </Group>
          ))}
        </Stack>
      )}

      {/* Vacío */}
      {!loading && vecinos.length === 0 && (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl">
          <BuildingStorefrontIcon className="size-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-500 text-sm">
            Este almacén no tiene ningún almacén vecino vinculado.
          </p>
        </div>
      )}

      {/* Lista de vecinos */}
      {!loading && (
        <div className="grid gap-3">
          {vecinos.map((item) => (
            <div
              key={item.id_almacen_vecino}
              className="flex items-center justify-between p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-zinc-800/50 text-zinc-400 flex items-center justify-center border border-zinc-700/50">
                  <BuildingStorefrontIcon className="size-5" />
                </div>
                <div>
                  <Text fw={600} className="text-zinc-200 text-sm">
                    {item.nombre}
                  </Text>
                  {item.descripcion && (
                    <Text size="xs" className="text-zinc-500 mt-0.5">
                      {item.descripcion}
                    </Text>
                  )}
                </div>
              </div>
              <Tooltip label="Desvincular Almacén Vecino">
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  loading={loadingIdDesvinculando === item.id_almacen_vecino}
                  disabled={loadingIdDesvinculando !== null && loadingIdDesvinculando !== item.id_almacen_vecino}
                  onClick={() => handleDesvincular(item.id_almacen_vecino)}
                >
                  <TrashIcon className="size-4" />
                </ActionIcon>
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    </Stack>
  );
};
