import { Paper } from "@mantine/core";
import { ClockIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { BadgeField } from "../header/badge-field";
import type { RES_RequerimientoAlmacen } from "../../../../../service/responses/requerimientos-almacen/requerimiento-almacen";

interface InfoStatsProps {
  requerimiento: RES_RequerimientoAlmacen;
}

export const InfoStats = ({ requerimiento }: InfoStatsProps) => {
  return (
    <Paper
      p="md"
      radius="lg"
      className="bg-transparent border border-zinc-800/50 mx-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <BadgeField
          label="Prioridad"
          value={requerimiento.premura}
          color="orange"
        />
        <BadgeField label="Estado" value={requerimiento.estado} color="green" />
        <BadgeField
          label="Fecha Solicitada"
          value={
            requerimiento.fecha_solicitud
              ? dayjs(requerimiento.fecha_solicitud).format("DD/MM/YYYY")
              : "No especificada"
          }
          icon={ClockIcon}
          isMono
        />
        <BadgeField
          label="Fecha de Registro"
          value={dayjs(requerimiento.created_at).format("DD/MM/YYYY HH:mm")}
          icon={ClockIcon}
          isMono
        />
      </div>
    </Paper>
  );
};
