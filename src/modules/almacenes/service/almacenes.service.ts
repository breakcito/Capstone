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
  RES_ResponsableAlmacen,
} from "./almacenes.responses";

const PATH = "/almacenes";

export const AlmacenesService = {
  // ALMACENES
  get_almacenes: async (): Promise<IRespuesta<RES_AlmacenResumen[]>> => {
    const { data } = await api.get(PATH);
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
    id_almacen?: number,
  ): Promise<IRespuesta<RES_Empleado[]>> => {
    const { data } = await api.get(`/aux/empleados`, {
      params: { ...(id_almacen && { id_almacen_excluyente: id_almacen }), estado: EstadoBase.Activo },
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
};

