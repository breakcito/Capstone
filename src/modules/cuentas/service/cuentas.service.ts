import { api } from "../../../service/_api";
import type { IRespuesta } from "../../../shared/interfaces/_response";
import type { RES_Cuenta } from "./cuentas.responses";
import type { REQ_CrearCuenta, REQ_ActualizarCuenta } from "./cuentas.requests";

const path = "/cuentas";

// --- API Service ---
export const CuentasService = {
  fetchCuentas: async () => {
    const res = await api.get<IRespuesta<RES_Cuenta[]>>(`${path}`);
    return res.data;
  },

  crearCuenta: async (dto: REQ_CrearCuenta) => {
    const res = await api.post<IRespuesta<RES_Cuenta>>(`${path}`, dto);
    return res.data;
  },

  actualizarCuenta: async (id_usuario: number, dto: REQ_ActualizarCuenta) => {
    const res = await api.put<IRespuesta<null>>(`${path}/${id_usuario}`, dto);
    return res.data;
  },

  actualizarFoto: async (id_empleado: number, file: File) => {
    const formData = new FormData();
    formData.append("foto", file);
    const res = await api.post<IRespuesta<string>>(
      `${path}/foto/${id_empleado}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data;
  },
};
