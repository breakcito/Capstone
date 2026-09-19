import { api } from "./_api";
import type { IRespuesta } from "../shared/interfaces/_response";
import type { RES_UnidadMedida } from "./responses/unidad-medida";
import type { RES_Producto } from "./responses/producto";
import type { RES_Almacen } from "./responses/almacen";
import type { RES_LoteDisponible } from "./responses/lote-producto";
import type { RES_Empleado } from "./responses/empleado";
import type { RES_Contratista } from "./responses/contratista";
import type { EstadoBase } from "../shared/enums/_generic/estado-base";
import type { TipoProducto } from "../shared/enums/_generic/tipo-producto";
import type { RES_Rol } from "./responses/rol";
import type {
  RES_Departamento,
  RES_Distrito,
  RES_Provincia,
} from "./responses/ubicacion";

const path = "/aux";

export const AuxService = {
  /**
   * Obtener almacenes
   */
  get_almacenes: async (filters?: {
    id_almacen?: number;
    id_empleado_responsable?: number;
  }): Promise<IRespuesta<RES_Almacen[]>> => {
    const { data } = await api.get<IRespuesta<RES_Almacen[]>>(
      `${path}/almacenes`,
      { params: filters },
    );
    return data;
  },

  /**
   * Obtener lotes disponibles de un almacén
   */
  get_lotes_disponibles: async (idAlmacen: number, idsProductos: number[]) => {
    const res = await api.get<IRespuesta<RES_LoteDisponible[]>>(
      `${path}/lotes`,
      {
        params: {
          id_almacen: idAlmacen,
          ids_productos: idsProductos,
        },
      },
    );
    return res.data;
  },

  /**
   * Obtener empleados
   */
  get_empleados: async (filters?: {
    id_empleado?: number;
    estado?: EstadoBase;
    id_almacen_excluyente?: number;
    con_cuenta?: boolean;
    es_contratista?: boolean;
  }): Promise<IRespuesta<RES_Empleado[]>> => {
    const { data } = await api.get(`${path}/empleados`, {
      params: filters,
    });
    return data;
  },

  /**
   * Crear empleado
   */
  crear_empleado: async (formData: FormData): Promise<IRespuesta<RES_Empleado>> => {
    const { data } = await api.post(`${path}/empleados`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /**
   * Obtener roles disponibles
   */
  get_roles_disponibles: async (filters?: {
    id_rol?: number;
    estado?: EstadoBase;
  }): Promise<IRespuesta<RES_Rol[]>> => {
    const { data } = await api.get<IRespuesta<RES_Rol[]>>(
      `${path}/roles-disponibles`,
      { params: filters },
    );
    return data;
  },

  /**
   * Obtener unidades de medida
   */
  get_unidades_medida: async (filters?: {
    id_unidad_medida?: number;
    incluir_conversiones?: boolean;
  }): Promise<IRespuesta<RES_UnidadMedida[]>> => {
    const params = filters
      ? {
          ...filters,
          ...(filters.incluir_conversiones !== undefined && {
            incluir_conversiones: filters.incluir_conversiones ? 1 : 0,
          }),
        }
      : undefined;

    const { data } = await api.get<IRespuesta<RES_UnidadMedida[]>>(
      `${path}/unidades-medida`,
      { params },
    );
    return data;
  },

  /**
   * Crear una unidad de medida en el catálogo
   */
  crear_unidad_medida: async (nuevaUnidad: {
    nombre: string;
    abreviatura: string;
  }): Promise<IRespuesta<RES_UnidadMedida>> => {
    const { data } = await api.post<IRespuesta<RES_UnidadMedida>>(
      `${path}/unidades-medida`,
      nuevaUnidad,
    );
    return data;
  },

  /**
   * Obtener catálogo de productos
   */
  get_productos: async (filters?: Record<string, unknown>): Promise<IRespuesta<RES_Producto[]>> => {
    const { data } = await api.get<IRespuesta<RES_Producto[]>>(
      `${path}/productos`,
      { params: filters },
    );
    return data;
  },

  /**
   * Crear un producto
   */
  crear_producto: async (nuevoProducto: {
    id_unidad_medida_base: number;
    nombre: string;
    tipo_producto: TipoProducto;
    es_perecible: boolean;
    stock_minimo_base?: number;
    tiempo_espera_vencimiento?: number;
    periodo_espera_vencimiento?: string;
  }): Promise<IRespuesta<RES_Producto>> => {
    const { data } = await api.post<IRespuesta<RES_Producto>>(
      `${path}/productos`,
      nuevoProducto,
    );
    return data;
  },

  /**
   * Obtener contratistas
   */
  get_contratistas: async (filters?: {
    id_mina?: number;
  }): Promise<IRespuesta<RES_Contratista[]>> => {
    const { data } = await api.get<IRespuesta<RES_Contratista[]>>(
      `${path}/contratistas`,
      { params: filters },
    );
    return data;
  },

  /**
   * Crear contratista
   */
  crear_contratista: async (
    formData: FormData,
  ): Promise<IRespuesta<RES_Contratista>> => {
    const { data } = await api.post<IRespuesta<RES_Contratista>>(
      `${path}/contratistas`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return data;
  },

  /**
   * Obtener departamentos del Perú
   */
  get_departamentos: async (filters?: {
    id_departamento?: number;
  }): Promise<IRespuesta<RES_Departamento[] | RES_Departamento>> => {
    const { data } = await api.get<
      IRespuesta<RES_Departamento[] | RES_Departamento>
    >(`${path}/departamentos`, { params: filters });
    return data;
  },

  /**
   * Obtener provincias
   */
  get_provincias: async (filters?: {
    id_provincia?: number;
    id_departamento?: number;
  }): Promise<IRespuesta<RES_Provincia[] | RES_Provincia>> => {
    const { data } = await api.get<IRespuesta<RES_Provincia[] | RES_Provincia>>(
      `${path}/provincias`,
      { params: filters },
    );
    return data;
  },

  /**
   * Obtener distritos
   */
  get_distritos: async (filters?: {
    id_distrito?: number;
    id_provincia?: number;
    id_departamento?: number;
  }): Promise<IRespuesta<RES_Distrito[] | RES_Distrito>> => {
    const { data } = await api.get<IRespuesta<RES_Distrito[] | RES_Distrito>>(
      `${path}/distritos`,
      { params: filters },
    );
    return data;
  },

  get_minas: async (): Promise<IRespuesta<any[]>> => ({
    success: true,
    data: [],
    message: "",
  }),

  get_areas: async (): Promise<IRespuesta<any[]>> => ({
    success: true,
    data: [],
    message: "",
  }),

  get_cargos: async (): Promise<IRespuesta<any[]>> => ({
    success: true,
    data: [],
    message: "",
  }),

  get_empresas: async (): Promise<IRespuesta<any[]>> => ({
    success: true,
    data: [],
    message: "",
  }),
};
