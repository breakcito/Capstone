import { useState, useEffect } from "react";
import { EmpleadosService } from "../service/empleados.service";
import type { RES_CuentaBancariaEmpleado } from "../service/empleados.responses";
import { useNotify } from "../../../hooks/useNotify";
import type { RES_Banco } from "../../../service/responses/banco";

export const useCuentasBancarias = (idEmpleado: number | null) => {
  const [cuentas, setCuentas] = useState<RES_CuentaBancariaEmpleado[]>([]);
  const [bancos, setBancos] = useState<RES_Banco[]>([]);
  const [loadingCuentas, setLoadingCuentas] = useState(false);
  const [loadingBancos, setLoadingBancos] = useState(false);
  const { notifyError } = useNotify();

  const fetchCuentas = async (id: number) => {
    if (!id) return;
    setLoadingCuentas(true);
    try {
      const res = await EmpleadosService.get_cuentas_bancarias(id);
      if (res.success && res.data) {
        setCuentas(res.data);
      } else {
        notifyError(res.message || "Error al cargar cuentas bancarias");
      }
    } catch (e) {
      console.error(e);
      notifyError("Error al cargar cuentas bancarias");
    } finally {
      setLoadingCuentas(false);
    }
  };

  const fetchBancos = async () => {
    if (loadingBancos || bancos.length > 0) return;
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

  useEffect(() => {
    if (idEmpleado) {
      fetchCuentas(idEmpleado);
      fetchBancos();
    } else {
      setCuentas([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idEmpleado]);

  return {
    cuentas,
    bancos,
    setBancos,
    loadingCuentas,
    loadingBancos,
    fetchBancos,
    insertCuenta: (c: RES_CuentaBancariaEmpleado) => {
      setCuentas((prev) => [c, ...prev]);
    },
    updateCuenta: (c: RES_CuentaBancariaEmpleado) => {
      setCuentas((prev) =>
        prev.map((item) =>
          item.id_cuenta_bancaria === c.id_cuenta_bancaria ? c : item,
        ),
      );
    },
    reloadCuentas: () => {
      if (idEmpleado) fetchCuentas(idEmpleado);
    },
  };
};
