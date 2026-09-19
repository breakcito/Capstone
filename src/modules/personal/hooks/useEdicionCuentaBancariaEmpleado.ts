import { useState } from "react";
import { EmpleadosService } from "../service/empleados.service";
import { useNotify } from "../../../hooks/useNotify";
import {
  Schema_ActualizarCuentaBancariaEmpleado,
  type DTO_ActualizarCuentaBancariaEmpleado,
} from "../service/empleados.requests";
import type { RES_CuentaBancariaEmpleado } from "../service/empleados.responses";
import type { RES_Banco } from "../../../service/responses/banco";
import { TipoCuentaBank } from "../../../shared/enums/tipo-cuenta-bank";

interface Props {
  onSuccess: (cuenta: RES_CuentaBancariaEmpleado) => void;
  onClose: () => void;
}

export const useEdicionCuentaBancariaEmpleado = ({ onSuccess, onClose }: Props) => {
  const [bancos, setBancos] = useState<RES_Banco[]>([]);
  const [cuentaOriginal, setCuentaOriginal] = useState<RES_CuentaBancariaEmpleado | null>(null);
  const [idBanco, setIdBanco] = useState<string | null>(null);
  const [tipoCuentaBancaria, setTipoCuentaBancaria] = useState<string>(TipoCuentaBank.CuentaSueldo);
  const [moneda, setMoneda] = useState<string>("Soles");
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [cci, setCci] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingBancos, setLoadingBancos] = useState(false);

  const { notifySuccess, notifyError } = useNotify();

  const cargarBancos = async () => {
    if (bancos.length > 0) return;
    setLoadingBancos(true);
    try {
      const res = await EmpleadosService.get_bancos();
      if (res.success && res.data) {
        setBancos(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBancos(false);
    }
  };

  const cargarCuenta = (cuenta: RES_CuentaBancariaEmpleado) => {
    setCuentaOriginal(cuenta);
    setIdBanco(cuenta.id_banco ? String(cuenta.id_banco) : null);
    setTipoCuentaBancaria(cuenta.tipo_cuenta_bancaria || TipoCuentaBank.CuentaSueldo);
    setMoneda(cuenta.moneda || "Soles");
    setNumeroCuenta(cuenta.numero_cuenta || "");
    setCci(cuenta.cci || "");
    setError(null);
  };

  const reset = () => {
    setCuentaOriginal(null);
    setIdBanco(null);
    setTipoCuentaBancaria(TipoCuentaBank.CuentaSueldo);
    setMoneda("Soles");
    setNumeroCuenta("");
    setCci("");
    setError(null);
  };

  const handleGuardar = async () => {
    if (!cuentaOriginal) return;

    const payload: DTO_ActualizarCuentaBancariaEmpleado = {
      id_banco: Number(idBanco),
      tipo_cuenta_bancaria: tipoCuentaBancaria,
      moneda,
      numero_cuenta: numeroCuenta,
      cci: cci || null,
    };

    const validation = Schema_ActualizarCuentaBancariaEmpleado.safeParse(payload);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await EmpleadosService.actualizar_cuenta_bancaria(
        cuentaOriginal.id_cuenta_bancaria,
        validation.data,
      );

      if (res.success && res.data) {
        notifySuccess("Cuenta bancaria actualizada");
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || "Error al actualizar la cuenta bancaria");
      }
    } catch (e) {
      console.error(e);
      notifyError("Error al actualizar la cuenta bancaria");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    bancos,
    loadingBancos,
    cargarBancos,
    cargarCuenta,
    idBanco,
    setIdBanco,
    tipoCuentaBancaria,
    setTipoCuentaBancaria,
    moneda,
    setMoneda,
    numeroCuenta,
    setNumeroCuenta,
    cci,
    setCci,
    error,
    isSubmitting,
    handleGuardar,
    reset,
  };
};
