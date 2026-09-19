import { api } from "../../../service/_api";
import type { IRespuesta } from "../../../shared/interfaces/_response";
import type { RES_Cuenta, RES_EmpleadoUsuario } from "./cuentas.responses";
import type {
  REQ_CrearCuenta,
  REQ_ActualizarCuenta,
  REQ_CrearEmpleado,
} from "./cuentas.requests";

const pathCuentas = "/cuentas";
const pathEmpleados = "/empleados";

// --- API Service ---
export const CuentasService = {
  fetchEmpleados: async () => {
    const res = await api.get<IRespuesta<RES_EmpleadoUsuario[]>>(`${pathEmpleados}`);
    return res.data;
  },

  fetchCuentas: async () => {
    const res = await api.get<IRespuesta<RES_Cuenta[]>>(`${pathCuentas}`);
    return res.data;
  },

  crearEmpleado: async (dto: REQ_CrearEmpleado) => {
    const res = await api.post<IRespuesta<RES_EmpleadoUsuario>>(
      `${pathEmpleados}`,
      dto,
    );
    return res.data;
  },

  crearCuenta: async (dto: REQ_CrearCuenta) => {
    const res = await api.post<IRespuesta<RES_Cuenta>>(`${pathCuentas}`, dto);
    return res.data;
  },

  actualizarCuenta: async (id_usuario: number, dto: REQ_ActualizarCuenta) => {
    const res = await api.put<IRespuesta<null>>(`${pathCuentas}/${id_usuario}`, dto);
    return res.data;
  },

  actualizarFoto: async (id_empleado: number, file: File) => {
    const formData = new FormData();
    formData.append("foto", file);
    const res = await api.post<IRespuesta<string>>(
      `${pathCuentas}/foto/${id_empleado}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data;
  },
};
