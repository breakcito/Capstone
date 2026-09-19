import { useState, useEffect } from "react";
import { CuentasService } from "../service/cuentas.service";
import { useNotify } from "../../../hooks/useNotify";
import type { RES_Cuenta } from "../service/cuentas.responses";

export const useRegistroCuenta = (
  cuentaEdit: RES_Cuenta | null,
  onClose: () => void,
  onSuccess: (nueva: RES_Cuenta) => void,
  refresh: () => void,
) => {
  const [form, setForm] = useState({
    id_empleado: 0,
    id_rol: 0,
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { notifyError, notifySuccess, notifyInfo } = useNotify();

  useEffect(() => {
    if (cuentaEdit) {
      setForm({
        id_empleado: cuentaEdit.id_empleado,
        id_rol: cuentaEdit.id_rol,
        username: cuentaEdit.username,
        password: "", // Vacío por defecto al editar
      });
    } else {
      setForm({
        id_empleado: 0,
        id_rol: 0,
        username: "",
        password: "",
      });
    }
  }, [cuentaEdit]);

  const updateForm = (updates: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const handleGuardar = async () => {
    // Validaciones básicas
    if (
      !form.username ||
      !form.id_rol ||
      (!cuentaEdit && !form.password) ||
      (!cuentaEdit && !form.id_empleado)
    ) {
      notifyInfo("Por favor, completa todos los campos requeridos.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (cuentaEdit) {
        res = await CuentasService.actualizarCuenta(cuentaEdit.id_usuario, {
          id_rol: form.id_rol,
          username: form.username,
          password: form.password,
        });
      } else {
        res = await CuentasService.crearCuenta({
          id_rol: form.id_rol,
          id_empleado: form.id_empleado,
          username: form.username,
          password: form.password as string,
        });
      }

      if (res.success) {
        notifySuccess(res.message);
        if (cuentaEdit) {
          refresh();
        } else {
          onSuccess(res.data!);
        }
        onClose();
      } else {
        notifyError(res.message);
      }
    } catch {
      notifyError("No se pudo comunicar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    updateForm,
    loading,
    handleGuardar,
    isEdit: !!cuentaEdit,
  };
};
