import { useState } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { LotesService } from "../service/lotes.service";
import { Schema_AjustarStock } from "../service/lotes.requests";
import type { RES_Lote } from "../service/lotes.responses";

interface UseAjusteStockProps {
  lote: RES_Lote;
  onSuccess: (lote: RES_Lote) => void;
}

export const useAjusteStock = ({ lote, onSuccess }: UseAjusteStockProps) => {
  const { notifySuccess } = useNotify();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [nuevoStock, setNuevoStock] = useState<number>(
    Number(lote.stock_actual),
  );
  const [nuevoStockBase, setNuevoStockBase] = useState<number>(
    Number(lote.stock_actual_base),
  );
  const [motivo, setMotivo] = useState("");

  const handleStockChange = (val: number | string) => {
    const num = typeof val === "number" ? val : parseFloat(String(val)) || 0;
    setNuevoStock(num);
    const base = Number(
      (num * Number(lote.contenido_por_presentacion)).toFixed(4),
    );
    setNuevoStockBase(base);
  };

  const handleBaseStockChange = (val: number | string) => {
    const num = typeof val === "number" ? val : parseFloat(String(val)) || 0;
    setNuevoStockBase(num);
    const pres = Number(
      (num / Number(lote.contenido_por_presentacion)).toFixed(4),
    );
    setNuevoStock(pres);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    setSubmitting(true);
    setError(null);

    const values = {
      id_lote: lote.id_lote,
      nuevo_stock: nuevoStock,
      nuevo_stock_base: nuevoStockBase,
      motivo,
    };

    // Simple validation using Zod
    const validation = Schema_AjustarStock.safeParse(values);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setSubmitting(false);
      return;
    }

    try {
      const result = await LotesService.ajustarStock(values);
      if (result.success) {
        notifySuccess(`El lote ${lote.correlativo} ha sido corregido exitosamente.`);
        onSuccess(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const isSame =
    Number(nuevoStockBase.toFixed(4)) === Number(lote.stock_actual_base);
  const diff = nuevoStockBase - Number(lote.stock_actual_base);

  return {
    nuevoStock,
    nuevoStockBase,
    motivo,
    setMotivo,
    submitting,
    error,
    isSame,
    diff,
    handleStockChange,
    handleBaseStockChange,
    handleSubmit,
  };
};
