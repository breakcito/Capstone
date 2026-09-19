import { useEffect, useState } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { LotesService } from "../service/lotes.service";
import { Schema_ActualizarLote, type DTO_ActualizarLote } from "../service/lotes.requests";
import type { RES_Lote } from "../service/lotes.responses";

interface UseLoteEdicionProps {
  lote: RES_Lote | null;
  onSuccess: (lote: RES_Lote) => void;
}

/**
 * Hook para el modal de edicion administrativa de un lote.
 * Maneja el formulario, validacion con Zod y envio al backend.
 * NO expone stock, contenido_por_presentacion, estado ni fecha_vencimiento:
 *  - stock/contenido: por Correccion de Inventario (Kardex inmutable).
 *  - estado: por eliminar_lote (soft-delete).
 *  - fecha_vencimiento: solo se setea al registrar el lote.
 *  - fecha_hora_ingreso: editable aqui (corrección de fechas mal cargadas).
 */
export const useLoteEdicion = ({ lote, onSuccess }: UseLoteEdicionProps) => {
  const { notifySuccess } = useNotify();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [comprobanteCompra, setComprobanteCompra] = useState("");
  const [costoPorUnidad, setCostoPorUnidad] = useState<number | null>(null);
  const [fechaHoraIngreso, setFechaHoraIngreso] = useState<Date | null>(null);

  // Sincronizar el formulario cuando cambia el lote a editar.
  useEffect(() => {
    if (!lote) return;
    setComprobanteCompra(lote.comprobante_compra ?? "");
    setCostoPorUnidad(lote.costo_por_unidad !== null && lote.costo_por_unidad !== undefined ? Number(lote.costo_por_unidad) : null);
    setFechaHoraIngreso(
      lote.fecha_hora_ingreso ? new Date(lote.fecha_hora_ingreso) : null,
    );
    setError(null);
  }, [lote]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!lote) return;

    setSubmitting(true);
    setError(null);

    const values: DTO_ActualizarLote = {
      comprobante_compra: comprobanteCompra || null,
      costo_por_unidad: costoPorUnidad,
      fecha_hora_ingreso: fechaHoraIngreso,
    };

    const validation = Schema_ActualizarLote.safeParse(values);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setSubmitting(false);
      return;
    }

    try {
      const result = await LotesService.actualizar(lote.id_lote, validation.data);
      if (result.success) {
        notifySuccess(
          `El lote ${lote.correlativo} ha sido actualizado correctamente.`,
        );
        onSuccess(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Error inesperado al actualizar el lote.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    comprobanteCompra,
    setComprobanteCompra,
    costoPorUnidad,
    setCostoPorUnidad,
    fechaHoraIngreso,
    setFechaHoraIngreso,
    submitting,
    error,
    handleSubmit,
  };
};
