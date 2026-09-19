import { useState, useEffect } from "react";
import { EmpleadosService } from "../service/empleados.service";
import { useNotify } from "../../../hooks/useNotify";
import {
  Schema_CrearCuentaBancariaEmpleado,
  type DTO_CrearCuentaBancariaEmpleado,
} from "../service/empleados.requests";
import type { RES_CuentaBancariaEmpleado } from "../service/empleados.responses";
import type { RES_Banco } from "../../../service/responses/banco";
import { TipoCuentaBank } from "../../../shared/enums/tipo-cuenta-bank";

export const useRegistroCuentaBancaria = (
  idEmpleado: number | null,
  bancos: RES_Banco[],
  onAccountAdded: (account: RES_CuentaBancariaEmpleado) => void,
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notifySuccess, notifyError } = useNotify();

  const [payload, setPayload] = useState<Omit<DTO_CrearCuentaBancariaEmpleado, "id_empleado">>({
    id_banco: 0,
    tipo_cuenta_bancaria: TipoCuentaBank.CuentaSueldo,
    moneda: "Soles",
    numero_cuenta: "",
    cci: "",
  });

  // Auto-selección del primer banco al cargar
  useEffect(() => {
    if (payload.id_banco === 0 && bancos.length > 0) {
      handleSelectBanco(bancos[0].id_banco.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bancos]);

  const handleChangeStr = (
    field: keyof Omit<DTO_CrearCuentaBancariaEmpleado, "id_empleado">,
    value: string,
  ) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSelectBanco = (val: string | null) => {
    const idBanco = val ? Number(val) : 0;
    setPayload((prev) => ({ ...prev, id_banco: idBanco }));
    if (error) setError(null);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!idEmpleado) {
      setError("Falta enlazar el registro a un empleado");
      return;
    }
    setError(null);

    const validation = Schema_CrearCuentaBancariaEmpleado.safeParse({
      ...payload,
      id_empleado: idEmpleado,
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await EmpleadosService.crear_cuenta_bancaria(validation.data);
      if (res.success && res.data) {
        notifySuccess("Cuenta bancaria añadida");
        setPayload({
          id_banco: bancos.length > 0 ? bancos[0].id_banco : 0,
          tipo_cuenta_bancaria: TipoCuentaBank.CuentaSueldo,
          moneda: "Soles",
          numero_cuenta: "",
          cci: "",
        });
        onAccountAdded(res.data);
      } else {
        setError(res.message || "Error al añadir la cuenta bancaria");
      }
    } catch (e) {
      console.error(e);
      notifyError("Error al añadir la cuenta bancaria");
    } finally {
      setIsSubmitting(false);
    }
  };

  const autoSelectBanco = (idBanco: number) => {
    setPayload((prev) => ({ ...prev, id_banco: idBanco }));
  };

  return {
    payload,
    handleChangeStr,
    handleSelectBanco,
    submit,
    isSubmitting,
    error,
    autoSelectBanco,
  };
};
