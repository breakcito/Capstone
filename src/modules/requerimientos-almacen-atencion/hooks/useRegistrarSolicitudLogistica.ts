import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { AtencionService } from "../service/atencion.service";
import { Premura } from "../../../shared/enums/_generic/premura";
import { Estado_RequerimientoDetalle } from "../../../shared/enums/requerimiento-almacen/requerimiento";
import type { DTO_CrearSolicitudLogistica } from "../service/atencion.requests";
import type { DetalleRequerimientoExtendido } from "../service/atencion.responses";
import type { RES_RequerimientoAlmacen } from "../../../service/responses/requerimientos-almacen/requerimiento-almacen";

interface UseRegistrarSolicitudLogisticaProps {
  requerimiento: RES_RequerimientoAlmacen;
  detalles: DetalleRequerimientoExtendido[];
  onSuccess: (ids?: number[]) => void;
}

export const useRegistrarSolicitudLogistica = ({
  requerimiento,
  detalles,
  onSuccess,
}: UseRegistrarSolicitudLogisticaProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [localSelectedIds, setLocalSelectedIds] = useState<number[]>([]);

  // Campos generales - Heredados del requerimiento
  const [observacion, setObservacion] = useState("");
  const [premura, setPremura] = useState<string>(
    requerimiento.premura || Premura.Normal,
  );
  const [fechaEntrega, setFechaEntrega] = useState<Date | null>(
    requerimiento.fecha_entrega_requerida
      ? dayjs(requerimiento.fecha_entrega_requerida).toDate()
      : new Date(),
  );

  // Campos por ítem
  const [comentarios, setComentarios] = useState<Record<number, string>>({});
  const [cantidades, setCantidades] = useState<Record<number, number>>({});
  const [factores, setFactores] = useState<Record<number, number>>({});
  const [cantidadesBase, setCantidadesBase] = useState<Record<number, number>>(
    {},
  );

  const itemsPendientes = detalles.filter(
    (d) =>
      d.estado === Estado_RequerimientoDetalle.EsperandoAprobacion.toString(),
  );

  const itemsSeleccionados = itemsPendientes.filter((d) =>
    localSelectedIds.includes(d.id_requerimiento_almacen_detalle),
  );

  useEffect(() => {
    const initCants: Record<number, number> = {};
    const initFactores: Record<number, number> = {};
    const initCantsBase: Record<number, number> = {};

    itemsPendientes.forEach((d) => {
      // Si la unidad es diferente, la "cantidad" es la de la presentación (cajas)
      // Si son iguales, es la base.
      initCants[d.id_requerimiento_almacen_detalle] = Number(
        d.cantidad_solicitada,
      );
      initFactores[d.id_requerimiento_almacen_detalle] =
        d.contenido_por_presentacion || 1;
      initCantsBase[d.id_requerimiento_almacen_detalle] = Number(
        d.cantidad_solicitada_base,
      );
    });

    setCantidades(initCants);
    setFactores(initFactores);
    setCantidadesBase(initCantsBase);

    // Seleccionamos todos por defecto
    setLocalSelectedIds(
      itemsPendientes.map((i) => i.id_requerimiento_almacen_detalle),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detalles]);

  const toggleSelection = (id: number) => {
    setLocalSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (localSelectedIds.length === itemsPendientes.length) {
      setLocalSelectedIds([]);
    } else {
      setLocalSelectedIds(
        itemsPendientes.map((i) => i.id_requerimiento_almacen_detalle),
      );
    }
  };

  const handleConsultar = async () => {
    setSubmitting(true);
    try {
      const esAuditable = itemsSeleccionados.some((item) => item.es_auditable);

      const dto: DTO_CrearSolicitudLogistica = {
        id_requerimiento: requerimiento.id_requerimiento,
        observacion,
        premura,
        es_auditable: esAuditable,
        fecha_entrega_requerida: fechaEntrega
          ? dayjs(fechaEntrega).format("YYYY-MM-DD")
          : "",
        detalles: itemsSeleccionados.map((item) => {
          const idDetalle = item.id_requerimiento_almacen_detalle;
          const cantS = cantidades[idDetalle] || 0;
          const factor = factores[idDetalle] || 1;
          const cantB = cantidadesBase[idDetalle] || 0;

          return {
            id_requerimiento_almacen_detalle: idDetalle,
            id_producto: item.id_producto,
            id_unidad_medida: item.id_unidad_medida_req,
            cantidad_solicitada: cantS,
            contenido_por_presentacion: factor,
            cantidad_solicitada_base: cantB,
            comentario: comentarios[idDetalle] || "",
          };
        }),
      };

      const res = await AtencionService.registrarSolicitudLogistica(dto);
      if (res.success) {
        onSuccess(localSelectedIds);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    state: {
      submitting,
      localSelectedIds,
      observacion,
      premura,
      fechaEntrega,
      comentarios,
      cantidades,
      factores,
      cantidadesBase,
      itemsPendientes,
      itemsSeleccionados,
    },
    actions: {
      setObservacion,
      setPremura,
      setFechaEntrega,
      setComentarios,
      setCantidades,
      setFactores,
      setCantidadesBase,
      toggleSelection,
      toggleAll,
      handleConsultar,
    },
  };
};
