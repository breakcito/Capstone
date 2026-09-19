import { api } from "../../../service/_api";
import type { RES_Empleado } from "../../../service/responses/empleado";
import { EstadoBase } from "../../../shared/enums/_generic/estado-base";
import type { IRespuesta } from "../../../shared/interfaces/_response";
import type {
  DTO_CrearAlmacen,
  DTO_NuevoResponsable,
} from "./almacenes.requests";
import type {
  RES_AlmacenResumen,
  RES_MinaDisponible,
  RES_MinaAbastecida,
  RES_ResponsableAlmacen,
  RES_AlmacenVecinoRel,
  RES_AlmacenDisponibleVecino,
} from "./almacenes.responses";

const PATH = "/almacenes";

export const AlmacenesService = {
  // ALMACENES
  /**
   * Listar almacenes del modulo. Acepta `para_carbon` para filtrar.
   * Si no se envia, el backend NO filtra y devuelve ambos tipos (la
   * vista pagina con tabs y siempre pasa el flag explicito).
   */
  get_almacenes: async (filters?: {
    para_carbon?: boolean;
  }): Promise<IRespuesta<RES_AlmacenResumen[]>> => {
    const params = filters
      ? {
          ...filters,
          ...(filters.para_carbon !== undefined && {
            para_carbon: filters.para_carbon ? 1 : 0,
          }),
        }
      : undefined;
    const { data } = await api.get(PATH, { params });
    return data;
  },

  crear_almacen: async (
    dto: DTO_CrearAlmacen,
  ): Promise<IRespuesta<RES_AlmacenResumen>> => {
    const { data } = await api.post(PATH, dto);
    return data;
  },

  // RESPONSABLES
  get_historial_responsables: async (
    id_almacen: number,
  ): Promise<IRespuesta<RES_ResponsableAlmacen[]>> => {
    const { data } = await api.get(`${PATH}/responsables/${id_almacen}`);
    return data;
  },

  get_empleados_disponibles: async (
    id_almacen: number,
  ): Promise<IRespuesta<RES_Empleado[]>> => {
    const { data } = await api.get(`/aux/empleados`, {
      params: { id_almacen_excluyente: id_almacen, estado: EstadoBase.Activo },
    });
    return data;
  },

  nuevo_responsable: async (
    dto: DTO_NuevoResponsable,
  ): Promise<IRespuesta<RES_ResponsableAlmacen>> => {
    const { data } = await api.post(`${PATH}/responsables`, dto);
    return data;
  },

  inactivar_responsable: async (dto: {
    id_responsable_almacen: number;
    fecha_fin: string;
  }): Promise<IRespuesta<null>> => {
    const { data } = await api.post(`${PATH}/responsables/inactivar`, dto);
    return data;
  },

  // ABASTECIMIENTO DE MINAS
  get_minas_abastecidas: async (
    id_almacen: number,
  ): Promise<IRespuesta<RES_MinaAbastecida[]>> => {
    const { data } = await api.get(
      `${PATH}/abastecimiento-minas/${id_almacen}`,
    );
    return data;
  },

  nueva_mina_por_abastecer: async (
    id_almacen: number,
    id_mina: number,
  ): Promise<IRespuesta<RES_MinaAbastecida>> => {
    const { data } = await api.post(`${PATH}/abastecimiento-minas`, {
      id_almacen,
      id_mina,
    });
    return data;
  },

  eliminar_abastecimiento_mina: async (
    id_almacen_mina: number,
  ): Promise<IRespuesta<null>> => {
    const { data } = await api.delete(
      `${PATH}/abastecimiento-minas/${id_almacen_mina}`,
    );
    return data;
  },

  get_minas: async (
    id_almacen: number,
  ): Promise<IRespuesta<RES_MinaDisponible[]>> => {
    const { data } = await api.get(
      `${PATH}/abastecimiento-minas/minas/${id_almacen}`,
    );
    return data;
  },

  // ALMACENES VECINOS
  get_vecinos: async (
    id_almacen: number,
  ): Promise<IRespuesta<RES_AlmacenVecinoRel[]>> => {
    const { data } = await api.get(`${PATH}/vecinos/${id_almacen}`);
    return data;
  },

  get_almacenes_disponibles_vecinos: async (
    id_almacen: number,
  ): Promise<IRespuesta<RES_AlmacenDisponibleVecino[]>> => {
    const { data } = await api.get(`${PATH}/vecinos/disponibles/${id_almacen}`);
    return data;
  },

  agregar_vecino: async (
    id_almacen_a: number,
    id_almacen_b: number,
  ): Promise<IRespuesta<unknown>> => {
    const { data } = await api.post(`${PATH}/vecinos`, {
      id_almacen_a,
      id_almacen_b,
    });
    return data;
  },

  eliminar_vecino: async (
    id_almacen_vecino: number,
  ): Promise<IRespuesta<null>> => {
    const { data } = await api.delete(`${PATH}/vecinos/${id_almacen_vecino}`);
    return data;
  },
};
