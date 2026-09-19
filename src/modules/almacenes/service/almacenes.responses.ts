import { EstadoBase } from "../../../shared/enums/_generic/estado-base";

// Un almacen
export interface RES_AlmacenResumen {
  id_almacen: number;
  nombre: string;
  estado: EstadoBase;
  responsables?: string; // nombres completos separados por coma
  // Ubicacion geografica (opcional)
  direccion?: string | null;
  id_departamento?: number | null;
  id_provincia?: number | null;
  id_distrito?: number | null;
  departamento_nombre?: string | null;
  provincia_nombre?: string | null;
  distrito_nombre?: string | null;
}

// Responsable de un almacen
export interface RES_ResponsableAlmacen {
  id_responsable_almacen: number;
  id_empleado: number;
  nombre_completo: string;
  dni?: string;
  url_foto?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: EstadoBase;
}
