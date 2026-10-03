import { Paper } from "@mantine/core";
import { ClockIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { BadgeField } from "../header/badge-field";
import type { RES_RequerimientoAlmacen } from "../../../../../service/responses/requerimientos-almacen/requerimiento-almacen";
import { Estado_Requerimiento } from "../../../../../shared/enums/requerimiento-almacen/requerimiento";

interface InfoStatsProps {
  requerimiento: RES_RequerimientoAlmacen;
}

const estadoColors: Record<string, string> = {
  [Estado_Requerimiento.Generado]: "blue",
  [Estado_Requerimiento.EnDespacho]: "green",
  [Estado_Requerimiento.Anulado]: "red",
  [Estado_Requerimiento.Cerrado]: "gray",
  [Estado_Requerimiento.Completado]: "teal",
};

export const InfoStats = ({ requerimiento }: InfoStatsProps) => {
  const estadoColor =
    requerimiento.estado && estadoColors[requerimiento.estado]
      ? estadoColors[requerimiento.estado]
      : "gray";

  return (
    <Paper
      p="md"
      radius="lg"
      className="bg-transparent border border-zinc-800/50 mx-2"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <BadgeField
          label="Almacén Destino"
          value={requerimiento.almacen_destino}
          color="blue"
        />
        <BadgeField
          label="Estado"
          value={requerimiento.estado}
          color={estadoColor}
        />
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
