import { useState } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { ContratistasService } from "../service/empleados.service";
import {
  Schema_ActualizarContratista,
  type DTO_ActualizarContratista,
} from "../service/empleados.requests";
import type { RES_ContratistaResumen } from "../service/empleados.responses";

/**
 * Hook orquestador para la edición de un contratista.
 *
 *  - Pre-rellena el form con el registro recibido.
 *  - submit: valida con Zod y delega al service. Si el usuario eligió
 *    una foto nueva, hace un `actualizar_foto` adicional después
 *    del PUT exitoso.
 *
 * NO se editan: mina, labores (van por sus endpoints / modales
 * dedicados), ni ruc/carnet_extranjeria/pasaporte.
 */
export const useEdicionContratista = (
  contratista: RES_ContratistaResumen,
  onSuccess: (editado: RES_ContratistaResumen) => void,
) => {
  const { notify } = useNotify();

  const [form, setForm] = useState<DTO_ActualizarContratista>({
    nombre: contratista.nombre ?? "",
    apellido: contratista.apellido ?? "",
    genero: (contratista.genero as DTO_ActualizarContratista["genero"]) ?? null,
    dni: contratista.dni ?? "",
    fecha_nacimiento: contratista.fecha_nacimiento ?? "",
    direccion: contratista.direccion ?? "",
    telefono: contratista.telefono ?? "",
    email: contratista.email ?? "",
  });

  const [loading, setLoading] = useState(false);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const setField = <K extends keyof DTO_ActualizarContratista>(
    field: K,
    value: DTO_ActualizarContratista[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFoto = (file: File | null) => {
    if (file && file.size > 2 * 1024 * 1024) {
      notify({
        type: "error",
        content: `La imagen "${file.name}" supera el límite máximo permitido.`,
      });
      return;
    }
    setFotoFile(file);
  };

  const submit = async () => {
    const validation = Schema_ActualizarContratista.safeParse(form);
    if (!validation.success) {
      notify({ type: "info", content: validation.error.issues[0].message });
      return;
    }

    setLoading(true);
    try {
      const resp = await ContratistasService.actualizar_contratista(
        contratista.id_contratista,
        validation.data,
      );
      console.log("[EDICION_CONTRATISTA] PUT response:", resp);
      if (!resp.success) {
        notify({ type: "error", content: resp.message });
        return;
      }

      let urlFinal = resp.data.url_foto;
      if (fotoFile) {
        const fotoResp = await ContratistasService.actualizar_foto(
          contratista.id_contratista,
          fotoFile,
        );
        if (fotoResp.success) {
          urlFinal = fotoResp.data;
        } else {
          notify({
            type: "info",
            content:
              "Datos actualizados, pero no se pudo actualizar la foto.",
          });
        }
      }

      notify({ type: "success", content: resp.message });
      onSuccess({ ...resp.data, url_foto: urlFinal });
    } catch (err) {
      console.error(err);
      notify({ type: "error", content: "Error inesperado" });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setField,
    loading,
    fotoFile,
    handleFoto,
    submit,
  };
};
