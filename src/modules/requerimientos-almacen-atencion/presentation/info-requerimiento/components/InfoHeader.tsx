import { Paper, Stack, Group, Text, Button, Tooltip } from "@mantine/core";
import {
  UserIcon,
  CheckBadgeIcon,
  MapPinIcon,
  ClockIcon,
  PencilSquareIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { HeaderCard } from "../../../../prestamos-almacen-atencion/presentation/components/detail-elements";
import type { RES_RequerimientoAlmacen } from "../../../../../service/responses/requerimientos-almacen/requerimiento-almacen";

interface InfoHeaderProps {
  requerimiento: RES_RequerimientoAlmacen;
  puedeEditar: boolean;
  onEditar: () => void;
}

export const InfoHeader = ({
  requerimiento,
  puedeEditar,
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
        icon={MapPinIcon}
        label="Labor"
        value={requerimiento.labor ?? "---"}
        color="amber"
      />
      <Paper
        p="md"
        radius="lg"
        className="bg-zinc-500/10 border border-zinc-500/20 relative overflow-hidden group hover:bg-zinc-500/20 transition-all"
      >
        <ClockIcon className="absolute -right-2 -bottom-2 size-16 text-zinc-400/10 rotate-12 group-hover:scale-110 transition-transform" />
        <Stack gap={2} className="relative z-10 w-full h-full">
          <Group gap={6} className="shrink-0">
            <ClockIcon className="size-4 text-zinc-500" />
            <Text
              size="xs"
              c="zinc.5"
              fw={800}
              className="uppercase tracking-widest"
            >
              Fecha Requerida
            </Text>
          </Group>
          <div className="flex-1 flex items-center min-h-6">
            <Text
              size="md"
              fw={800}
              className="text-zinc-100 tracking-tight leading-tight font-mono"
            >
              {requerimiento.fecha_entrega_requerida
                ? dayjs(requerimiento.fecha_entrega_requerida).format(
                    "DD/MM/YYYY",
                  )
                : "No especificada"}
            </Text>
          </div>
        </Stack>
      </Paper>

      <Paper
        p="md"
        radius="lg"
        className="bg-amber-500/10 border border-amber-500/30 relative overflow-hidden"
      >
        <Stack gap={2} className="relative z-10 w-full h-full justify-center">
          <Group gap={6} className="shrink-0">
            {puedeEditar ? (
              <PencilSquareIcon className="size-4 text-amber-400" />
            ) : (
              <LockClosedIcon className="size-4 text-zinc-500" />
            )}
            <Text
              size="xs"
              c={puedeEditar ? "amber.4" : "zinc.5"}
              fw={800}
              className="uppercase tracking-widest"
            >
              {puedeEditar ? "Editable" : "Bloqueado"}
            </Text>
          </Group>
          <div className="flex-1 flex items-center min-h-6">
            {puedeEditar ? (
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
                label="No hay detalles sin entrega iniciada"
                position="top"
                withArrow
                multiline
                w={220}
              >
                <Text size="xs" c="zinc.5" fs="italic">
                  Todos los items tienen entregas iniciadas; ya no se puede
                  editar la cabecera ni los detalles.
                </Text>
              </Tooltip>
            )}
          </div>
        </Stack>
      </Paper>
    </div>
  );
};
