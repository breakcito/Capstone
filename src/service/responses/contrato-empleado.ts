import type { EstadoContrato } from "../../shared/enums/contrato/estado-contrato";
import type { IArchivo } from "../../shared/interfaces/archivo";
import type { RES_EmpleadoResumen } from "../../modules/personal/service/empleados.responses";
import type { RES_CambiosLog } from "./_generic/cambios-log";

export interface RES_ContratoEmpleado {
  id_contrato: number;
  id_empleado: number;
  empleado?: string;
  id_cargo: number;
  cargo?: string;
  id_empresa: number | null;
  empresa?: string | null;
  id_almacen: number | null;
  almacen?: string | null;
  id_labor: number | null;
  labor?: string | null;
  id_mina_labor?: number | null;
  mina_nombre?: string | null;
  id_oficina: number | null;
  oficina?: string | null;
  tipo_contrato: "Planilla" | "JornadaDiaria" | string;
  sueldo_base: string | number | null;
  sueldo_real: string | number | null;
  salario_diario: string | number | null;
  fecha_inicio: string;
  por_tiempo_indefinido: boolean;
  evidencias: IArchivo[] | string | null;
  fecha_fin: string | null;
  duracion: number | null;
  periodo_duracion: "diario" | "semanal" | "mensual" | "anual" | string | null;
  duracion_dias: number | null;
  fecha_fin_anticipada: string | null;
  motivo_cierre?: string | null;
  cambios_log?: RES_CambiosLog[] | null;
  created_at: string | null;
  estado: EstadoContrato | string;
}

export interface RES_EmpleadoConContrato {
  empleado: RES_EmpleadoResumen;
  contrato: RES_ContratoEmpleado;
}
