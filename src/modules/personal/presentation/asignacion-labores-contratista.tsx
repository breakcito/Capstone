import { useState } from "react";
import dayjs from "dayjs";
import {
  Stack,
  Group,
  Text,
  Badge,
  Button,
  Checkbox,
  Loader,
  Select,
  TextInput,
} from "@mantine/core";
import {
  MapPinIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { ModalEstandar } from "../../../presentation/utils/modal-estandar";
import type {
  RES_ContratistaResumen,
  RES_LaborContratista,
} from "../service/empleados.responses";
import type { RES_Mina } from "../../../service/responses/mina";
import type { RES_Labor } from "../../../service/responses/labor";
import { EstadoBase } from "../../../shared/enums/_generic/estado-base";

interface AsignacionLaboresContratistaProps {
  contratista: RES_ContratistaResumen;
  minas: RES_Mina[];
  idMina: number | null;
  onMinaChange: (val: number | null) => void;
  laboresDisponibles: RES_Labor[];
  inactiveLaborInfo: Map<
    number,
    { fecha_inicio: string; fecha_fin: string | null }
  >;
  seleccionados: number[];
  loading: boolean;
  loadingMinas: boolean;
  loadingLabores: boolean;
  onToggle: (idLabor: number) => void;
  onAsignar: () => void;
  onCancelar: () => void;
}

export const AsignacionLaboresContratista = ({
  contratista,
  minas,
  idMina,
  onMinaChange,
  laboresDisponibles,
  seleccionados,
  loading,
  loadingMinas,
  loadingLabores,
  onToggle,
  onAsignar,
  onCancelar,
}: AsignacionLaboresContratistaProps) => {
  const [historialAbierto, setHistorialAbierto] = useState(false);

  const fieldClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
    label: "text-zinc-300 mb-1 font-medium",
  };

  const fechaInicioPorLabor = new Map<number, string>();
  const historialAsignaciones: RES_LaborContratista[] = [];
  contratista.labores_asignadas?.forEach((lab) => {
    if (lab.estado === EstadoBase.Activo) {
      fechaInicioPorLabor.set(lab.id_labor, lab.fecha_inicio);
    } else {
      historialAsignaciones.push(lab);
    }
  });

  return (
    <>
      <Stack gap="lg" className="px-1">
        {/* Info del contratista */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
            <UserIcon className="size-5 text-indigo-400" />
          </div>
          <div>
            <Text size="xs" className="text-zinc-500 font-medium">
              Contratista / Minero
            </Text>
            <Text size="sm" fw={700} className="text-white">
              {contratista.apellido}, {contratista.nombre}
            </Text>
          </div>
        </div>

        {/* Selección de Mina */}
        <Select
          label="Mina"
          placeholder="Seleccione mina"
          data={minas.map((m) => ({
            value: m.id_mina.toString(),
            label: m.nombre,
          }))}
          value={idMina?.toString() || null}
          onChange={(val) => onMinaChange(val ? Number(val) : null)}
          leftSection={<MapPinIcon className="size-4 text-zinc-500" />}
          classNames={fieldClasses}
          radius="lg"
          searchable
          required
          withAsterisk
          disabled={loading || loadingMinas}
        />

        {/* Lista de labores */}
        <Stack gap="sm">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Text size="sm" className="text-zinc-300 font-medium">
              Labores disponibles
            </Text>
            {historialAsignaciones.length > 0 && (
              <Button
                variant="subtle"
                size="compact-xs"
                radius="md"
                onClick={() => setHistorialAbierto(true)}
                leftSection={<ClockIcon className="size-3.5" />}
                className="text-zinc-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2"
              >
                Ver historial ({historialAsignaciones.length})
              </Button>
            )}
          </Group>

          {!idMina ? (
            <TextInput
              value="No aplica"
              readOnly
              leftSection={
                <WrenchScrewdriverIcon className="size-4 text-zinc-600" />
              }
              classNames={{
                ...fieldClasses,
                input:
                  "bg-zinc-900/20 border-dashed border-zinc-800 text-zinc-600 italic",
              }}
              radius="lg"
              description="Sin una mina seleccionada no se pueden asignar labores"
            />
          ) : loadingLabores ? (
            <div className="flex items-center justify-center py-10">
              <Loader size="sm" color="indigo" />
            </div>
          ) : laboresDisponibles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
              <WrenchScrewdriverIcon className="size-8 text-zinc-700 mb-2" />
              <Text size="sm" className="text-zinc-500 text-center">
                No hay labores activas en esta mina
              </Text>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {laboresDisponibles.map((labor) => {
                const isChecked = seleccionados.includes(labor.id_labor);
                const fechaInicio = fechaInicioPorLabor.get(labor.id_labor);
                return (
                  <div
                    key={labor.id_labor}
                    role="button"
                    tabIndex={0}
                    onClick={() => onToggle(labor.id_labor)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggle(labor.id_labor);
                      }
                    }}
                    className={`
                      flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40
                      ${
                        isChecked
                          ? "border-indigo-500/50 bg-indigo-500/10 shadow-sm shadow-indigo-500/5"
                          : "border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-800/50"
                      }
                    `}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => onToggle(labor.id_labor)}
                      color="indigo"
                      radius="sm"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <Badge
                          variant="light"
                          color="cyan"
                          radius="xs"
                          size="sm"
                          className="font-mono"
                        >
                          {labor.nombre}
                        </Badge>
                        {fechaInicio && (
                          <Text size="xs" c="dimmed" className="mt-1 italic">
                            Desde {dayjs(fechaInicio).format("DD/MM/YYYY")}
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Stack>

        {/* Footer */}
        <Group justify="flex-end" gap="md" mt="xs">
          <Button
            variant="subtle"
            onClick={onCancelar}
            disabled={loading}
            radius="lg"
            size="sm"
            className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
          >
            Cancelar
          </Button>
          <Button
            loading={loading}
            onClick={onAsignar}
            disabled={loadingLabores}
            radius="lg"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 px-8 transition-all hover:scale-[1.02]"
          >
            Guardar{" "}
            {seleccionados.length > 0 ? `(${seleccionados.length})` : ""}
          </Button>
        </Group>
      </Stack>

      <ModalEstandar
        opened={historialAbierto}
        close={() => setHistorialAbierto(false)}
        title="Historial de Asignaciones"
        size="md"
      >
        <Stack gap="sm">
          <Text size="xs" c="dimmed" className="px-1">
            Asignaciones pasadas (inactivas) del contratista.
          </Text>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {historialAsignaciones.map((lab) => (
              <div
                key={lab.id_labor_contratista}
                className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-3.5"
              >
                <Group justify="space-between" align="center" wrap="nowrap">
                  <div className="flex flex-col gap-1 min-w-0">
                    <Badge
                      variant="light"
                      color="gray"
                      radius="xs"
                      size="sm"
                      className="font-mono w-fit"
                    >
                      {lab.nombre}
                    </Badge>
                    <Text size="xs" c="dimmed">
                      {lab.fecha_inicio
                        ? dayjs(lab.fecha_inicio).format("DD/MM/YYYY")
                        : "—"}
                      {lab.fecha_fin
                        ? ` → ${dayjs(lab.fecha_fin).format("DD/MM/YYYY")}`
                        : ""}
                    </Text>
                  </div>
                  <Badge variant="light" color="red" size="xs" radius="sm">
                    Inactiva
                  </Badge>
                </Group>
              </div>
            ))}
          </div>
          <Group justify="flex-end" mt="xs">
            <Button
              variant="subtle"
              onClick={() => setHistorialAbierto(false)}
              radius="lg"
              size="sm"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            >
              Cerrar
            </Button>
          </Group>
        </Stack>
      </ModalEstandar>
    </>
  );
};
