import type { EstadoBase } from "../../../shared/enums/_generic/estado-base";

export interface RES_Cuenta {
  id_usuario: number;
  username: string;
  estado: EstadoBase;
  id_rol: number;
  id_empleado: number;
  nombre_rol: string;
  nombre_empleado: string;
  apellido_empleado: string;
  id_empresa_pertenece: number;
  url_foto: string | null;
  empresa_pertenece: string;
}

export interface RES_EmpleadoUsuario {
  id_empleado: number;
  nombre: string;
  apellido: string;
  nombre_completo: string;
  dni: string | null;
  url_foto: string | null;
  es_contratista: boolean;
  estado: string;
  id_usuario: number | null;
  username: string | null;
  id_rol: number | null;
  nombre_rol: string | null;
  estado_usuario: string | null;
}
