import { forwardRef, useImperativeHandle } from "react";
import { Button, Select, Text, Stack, Group, Box } from "@mantine/core";
import { UserIcon } from "@heroicons/react/24/outline";
import type { RES_ResponsableAlmacen } from "../service/almacenes.responses";
import { useNuevoResponsable } from "../hooks/useNuevoResponsable";
import { CustomDatePicker } from "../../../presentation/utils/date-picker-input";
import type { RES_Empleado } from "../../../service/responses/empleado";

interface NuevoResponsableProps {
  idAlmacen: number;
  nombreAlmacen?: string;
  onSuccess: (responsable: RES_ResponsableAlmacen) => void;
}

export interface NuevoResponsableRef {
  agregarDisponible: (emp: RES_Empleado) => void;
}

export const NuevoResponsable = forwardRef<
  NuevoResponsableRef,
  NuevoResponsableProps
>(({ idAlmacen, nombreAlmacen, onSuccess }, ref) => {
  const {
    loading,
    isAssigning,
    empleadosOptions,
    empleadoSeleccionado,
    setEmpleadoSeleccionado,
    fechaInicio,
    setFechaInicio,
    formError,
    handleAsignar,
    agregarDisponible,
  } = useNuevoResponsable(idAlmacen);

  useImperativeHandle(ref, () => ({
    agregarDisponible,
  }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleAsignar(onSuccess);
  };

  return (
    <Stack
      gap="md"
      className="animate-fade-in p-4 border border-zinc-800 bg-zinc-900/40 rounded-xl"
    >
      {/* Header igual a AbastecerMina */}
      <Group gap="sm" align="center">
        <Box className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
          <UserIcon className="w-4 h-4 text-indigo-400" />
        </Box>
        <Stack gap={0}>
          <Text
            size="xs"
            fw={700}
            className="text-zinc-300 uppercase tracking-wider"
          >
            Nueva Asignación
          </Text>
          <Text size="xs" className="text-zinc-500">
            {nombreAlmacen}
          </Text>
        </Stack>
      </Group>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Select
          label="Responsable / Jefe"
          placeholder="Buscar empleado..."
          leftSection={<UserIcon className="w-4 h-4 text-zinc-400" />}
          data={empleadosOptions}
          value={empleadoSeleccionado}
          onChange={setEmpleadoSeleccionado}
          disabled={loading || isAssigning}
          withAsterisk
          error={formError && !empleadoSeleccionado ? "Requerido" : undefined}
          searchable
          clearable
          nothingFoundMessage="No se encontraron empleados disponibles"
          radius="lg"
          size="sm"
          maxDropdownHeight={300}
          classNames={{
            input:
              "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500",
            dropdown: "bg-zinc-900 border-zinc-800",
            option:
              "hover:bg-zinc-800 text-zinc-300 data-[selected]:bg-zinc-100 data-[selected]:text-zinc-900 rounded-md my-1",
            label: "text-zinc-300 mb-1 font-medium",
          }}
        />

        <CustomDatePicker
          label="Fecha de Inicio"
          value={fechaInicio}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(val: any) => setFechaInicio(val)}
          error={formError && !fechaInicio ? "Requerido" : undefined}
          withAsterisk
          disabled={loading || isAssigning}
        />

        {formError && (
          <Text size="xs" className="text-red-500">
            {formError}
          </Text>
        )}

        <Group justify="flex-end">
          <Button
            type="submit"
            loading={isAssigning}
            disabled={!empleadoSeleccionado || !fechaInicio}
            radius="lg"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20"
          >
            Asignar Responsable
          </Button>
        </Group>
      </form>
    </Stack>
  );
});
