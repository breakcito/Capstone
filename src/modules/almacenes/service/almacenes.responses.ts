import { EstadoBase } from "../../../shared/enums/_generic/estado-base";

// Un almacen
export interface RES_AlmacenResumen {
  id_almacen: number;
  nombre: string;
  descripcion?: string;
  es_principal: boolean;
  para_carbon: boolean;
  estado: EstadoBase;
  responsables?: string; // nombres completos separados por coma
  minas_count?: number;
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

// Mina abastecida por un almacen
export interface RES_MinaAbastecida {
  id_almacen_mina: number;
  nombre: string;
  concesion: string;
}

// Posible mina para ser abastecida por un almacen
export interface RES_MinaDisponible {
  id_mina: number;
  nombre: string;
  concesion: string;
}

export interface RES_AlmacenVecinoRel {
  id_almacen_vecino: number;
  id_almacen: number;
  nombre: string;
  descripcion?: string;
}

export interface RES_AlmacenDisponibleVecino {
  id_almacen: number;
  nombre: string;
  descripcion?: string;
}
