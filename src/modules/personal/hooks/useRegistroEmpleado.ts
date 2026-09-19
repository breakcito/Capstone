import { useState, useCallback, useEffect, useMemo } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { EmpleadosService } from "../service/empleados.service";
import { ContratosEmpleadoService } from "../../contratos-empleado/service/contratos-empleado.service";
import {
  Schema_CrearEmpleado,
  type DTO_CrearEmpleado,
} from "../service/empleados.requests";
import {
  Schema_CrearContratoEmpleado,
  type DTO_CrearContratoEmpleado,
} from "../../contratos-empleado/service/contratos-empleado.requests";
import type { RES_EmpleadoResumen } from "../service/empleados.responses";
import type {
  RES_ContratoEmpleado,
  RES_EmpleadoConContrato,
} from "../../../service/responses/contrato-empleado";
import { AuxService } from "../../../service/auxiliar.service";
import type {
  RES_Area,
  RES_Cargo,
} from "../../../service/responses/organigrama";
import type { RES_Empresa } from "../../../service/responses/empresa";

const INITIAL_FORM: DTO_CrearEmpleado = {
  nombre: "",
  apellido: "",
  genero: null,
  dni: "",
  ruc: "",
  carnet_extranjeria: "",
  pasaporte: "",
  fecha_nacimiento: "",
  con_contrato: false,
  direccion: "",
  telefono: "",
  email: "",
  foto: "",
  id_cargo: null,
  id_empresa: null,
};

/**
 * Hook orquestador.
 *
 *  - submitEmpleadoSinContrato: crea solo empleado (sin contrato).
 *  - submitEmpleadoConContrato: crea empleado + contrato en una sola llamada
 *    (endpoint orquestador backend).
 *  - abrirModalContrato / cerrarModalContrato: controlan el sub-modal.
 */
export const useRegistroEmpleado = (
  onSuccess: (nuevo: RES_EmpleadoResumen) => void,
) => {
  const { notify } = useNotify();
  const [form, setForm] = useState<DTO_CrearEmpleado>(INITIAL_FORM);
  const [areas, setAreas] = useState<RES_Area[]>([]);
  const [todosCargos, setTodosCargos] = useState<RES_Cargo[]>([]);
  const [empresas, setEmpresas] = useState<RES_Empresa[]>([]);

  const [idArea, setIdArea] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingCargos, setLoadingCargos] = useState(false);
  const [loadingEmpresas, setLoadingEmpresas] = useState(false);
  const [modalContratoAbierto, setModalContratoAbierto] = useState(false);

  const cargarCatalogos = useCallback(async () => {
    setLoadingAreas(true);
    setLoadingCargos(true);
    setLoadingEmpresas(true);
    try {
      const [areasRes, cargosRes, empresasRes] = await Promise.all([
        AuxService.get_areas().catch(() => ({ success: false, data: [] })),
        AuxService.get_cargos().catch(() => ({ success: false, data: [] })),
        AuxService.get_empresas().catch(() => ({ success: false, data: [] })),
      ]);
      if (areasRes.success) setAreas(areasRes.data as RES_Area[]);
      if (cargosRes.success) setTodosCargos(cargosRes.data as RES_Cargo[]);
      if (empresasRes.success) setEmpresas(empresasRes.data as RES_Empresa[]);
    } finally {
      setLoadingAreas(false);
      setLoadingCargos(false);
      setLoadingEmpresas(false);
    }
  }, []);

  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]);

  const cargos = useMemo(() => {
    const sinArea = todosCargos.filter((c) => c.id_area === null);
    if (!idArea) return todosCargos;
    const delArea = todosCargos.filter((c) => c.id_area === idArea);
    return [...delArea, ...sinArea];
  }, [todosCargos, idArea]);

  const setField = <K extends keyof DTO_CrearEmpleado>(
    field: K,
    value: DTO_CrearEmpleado[K],
  ) => {
    if (field === "foto" && (value as unknown) instanceof File) {
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      if (value.size > MAX_SIZE) {
        notify({
          type: "error",
          content: `La imagen "${value.name}" supera el límite máximo permitido.`,
        });
        return;
      }
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSetIdArea = (value: number | null, keepCargo = false) => {
    setIdArea(value);
    if (!keepCargo) {
      setForm((prev) => ({ ...prev, id_cargo: null }));
    }
  };

  const handleSetConContrato = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      con_contrato: checked,
      id_cargo: checked ? null : prev.id_cargo,
      id_empresa: checked ? null : prev.id_empresa,
    }));
  };

  const abrirModalContrato = () => setModalContratoAbierto(true);
  const cerrarModalContrato = () => setModalContratoAbierto(false);

  const submitEmpleadoSinContrato = async () => {
    const validation = Schema_CrearEmpleado.safeParse(form);
    if (!validation.success) {
      notify({ type: "info", content: validation.error.issues[0].message });
      return;
    }

    setLoading(true);
    try {
      const resp = await EmpleadosService.crear_empleado(validation.data);
      if (resp.success) {
        notify({ type: "success", content: resp.message });
        onSuccess(resp.data);
        setForm(INITIAL_FORM);
        setIdArea(null);
      } else {
        notify({ type: "error", content: resp.message });
      }
    } catch (err) {
      console.error(err);
      notify({ type: "error", content: "Error inesperado" });
    } finally {
      setLoading(false);
    }
  };

  const submitEmpleadoConContrato = async (
    dtoContrato: DTO_CrearContratoEmpleado,
    evidencias: File[] = [],
  ): Promise<{ ok: boolean; data?: RES_ContratoEmpleado }> => {
    const validationEmpleado = Schema_CrearEmpleado.safeParse(form);
    if (!validationEmpleado.success) {
      notify({
        type: "info",
        content: validationEmpleado.error.issues[0].message,
      });
      return { ok: false };
    }

    const validationContrato = Schema_CrearContratoEmpleado.safeParse(
      dtoContrato,
    );
    if (!validationContrato.success) {
      notify({
        type: "info",
        content: validationContrato.error.issues[0].message,
      });
      return { ok: false };
    }

    setLoading(true);
    try {
      const empleadoPayload: Record<string, unknown> = {
        ...validationEmpleado.data,
      };
      const contratoPayload: Record<string, unknown> = {
        ...validationContrato.data,
      };
      // id_empleado del contrato lo asigna el backend tras crear el empleado.
      delete contratoPayload.id_empleado;

      const fotoFile = form.foto instanceof File ? form.foto : null;

      const resp =
        await ContratosEmpleadoService.crear_empleado_con_contrato(
          empleadoPayload,
          contratoPayload,
          fotoFile,
          evidencias,
        );

      if (!resp.success) {
        notify({ type: "error", content: resp.message || "Error" });
        return { ok: false };
      }

      const payload = resp.data as RES_EmpleadoConContrato;
      notify({ type: "success", content: resp.message });
      onSuccess(payload.empleado);
      setForm(INITIAL_FORM);
      setIdArea(null);
      cerrarModalContrato();
      return { ok: true, data: payload.contrato };
    } catch (err) {
      console.error(err);
      notify({
        type: "error",
        content: "Error inesperado al registrar empleado con contrato",
      });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setField,
    idArea,
    setIdArea: handleSetIdArea,
    setConContrato: handleSetConContrato,
    modalContratoAbierto,
    abrirModalContrato,
    cerrarModalContrato,
    areas,
    setAreas,
    cargos,
    setTodosCargos,
    empresas,
    loading,
    loadingAreas,
    loadingCargos,
    loadingEmpresas,
    submitEmpleadoSinContrato,
    submitEmpleadoConContrato,
  };
};
