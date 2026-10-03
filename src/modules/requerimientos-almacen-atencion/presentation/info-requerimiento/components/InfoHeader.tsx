import { Paper, Stack, Group, Text, Button, Tooltip } from "@mantine/core";
import {
  UserIcon,
  CheckBadgeIcon,
  BuildingStorefrontIcon,
  CalendarDaysIcon,
  PencilSquareIcon,
  LockClosedIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import type { RES_RequerimientoAlmacen } from "../../../../../service/responses/requerimientos-almacen/requerimiento-almacen";

interface HeaderCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  color?: string;
}

const HeaderCard = ({ icon: Icon, label, value }: HeaderCardProps) => (
  <Paper
    p="md"
    radius="lg"
    className="bg-zinc-500/10 border border-zinc-500/20 relative overflow-hidden group hover:bg-zinc-500/20 transition-all"
  >
    <Icon className="absolute -right-2 -bottom-2 size-16 text-zinc-400/10 rotate-12 group-hover:scale-110 transition-transform" />
    <Stack gap={2} className="relative z-10 w-full h-full">
      <Group gap={6} className="shrink-0">
        <Icon className="size-4 text-zinc-500" />
        <Text
          size="xs"
          c="zinc.5"
          fw={800}
          className="uppercase tracking-widest"
        >
          {label}
        </Text>
      </Group>
      <div className="flex-1 flex items-center min-h-6">
        <Text
          size="md"
          fw={800}
          className="text-zinc-100 tracking-tight leading-tight"
        >
          {value}
        </Text>
      </div>
    </Stack>
  </Paper>
);

interface InfoHeaderProps {
  requerimiento: RES_RequerimientoAlmacen;
  puedeEditar: boolean;
  isAnulado?: boolean;
  onEditar: () => void;
}

export const InfoHeader = ({
  requerimiento,
  puedeEditar,
  isAnulado = false,
  onEditar,
}: InfoHeaderProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-2">
      <HeaderCard
        icon={UserIcon}
        label="Solicitante"
        value={requerimiento.solicitante ?? "---"}
        color="indigo"
      />
      <HeaderCard
        icon={CheckBadgeIcon}
        label="Cód. Requerimiento"
        value={requerimiento.correlativo}
        color="violet"
      />
      <HeaderCard
        icon={BuildingStorefrontIcon}
        label="Almacén Destino"
        value={requerimiento.almacen_destino ?? "---"}
        color="amber"
      />
      <HeaderCard
        icon={CalendarDaysIcon}
        label="Fecha Solicitud"
        value={
          requerimiento.fecha_solicitud
            ? dayjs(requerimiento.fecha_solicitud).format("DD/MM/YYYY")
            : "No especificada"
        }
        color="zinc"
      />

      <Paper
        p="md"
        radius="lg"
        className={
          isAnulado
            ? "bg-red-500/10 border border-red-500/30 relative overflow-hidden"
            : "bg-amber-500/10 border border-amber-500/30 relative overflow-hidden"
        }
      >
        <Stack gap={2} className="relative z-10 w-full h-full justify-center">
          <Group gap={6} className="shrink-0">
            {isAnulado ? (
              <NoSymbolIcon className="size-4 text-red-400" />
            ) : puedeEditar ? (
              <PencilSquareIcon className="size-4 text-amber-400" />
            ) : (
              <LockClosedIcon className="size-4 text-zinc-500" />
            )}
            <Text
              size="xs"
              c={isAnulado ? "red.4" : puedeEditar ? "amber.4" : "zinc.5"}
              fw={800}
              className="uppercase tracking-widest"
            >
              {isAnulado ? "Anulado" : puedeEditar ? "Editable" : "Bloqueado"}
            </Text>
          </Group>
          <div className="flex-1 flex items-center min-h-6">
            {isAnulado ? (
              <Tooltip
                label="Este requerimiento ha sido anulado. No se permiten ediciones ni alteraciones de ningún tipo."
                position="top"
                withArrow
                multiline
                w={280}
              >
                <Text size="xs" c="red.3" fs="italic">
                  Requerimiento anulado · Solo lectura
                </Text>
              </Tooltip>
            ) : puedeEditar ? (
              <Button
                leftSection={<PencilSquareIcon className="size-4" />}
                color="amber"
                size="xs"
                radius="lg"
                onClick={onEditar}
                fullWidth
              >
                Editar Requerimiento
              </Button>
            ) : (
              <Tooltip
                label="Todos los detalles tienen entregas iniciadas. Para editar la cabecera o los detalles, primero anula las entregas asociadas."
                position="top"
                withArrow
                multiline
                w={280}
              >
                <Text size="xs" c="zinc.5" fs="italic">
                  Hay entregas iniciadas; no se puede editar la cabecera
                  ni los detalles hasta anular las entregas.
                </Text>
              </Tooltip>
            )}
          </div>
        </Stack>
      </Paper>
    </div>
  );
};
