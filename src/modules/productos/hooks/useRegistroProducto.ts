import { useState, useCallback, useEffect } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { ProductosService } from "../service/productos.service";
import {
  Schema_CrearProducto,
  Schema_ActualizarProducto,
  type DTO_CrearProducto,
  type DTO_ActualizarProducto,
} from "../service/productos.requests";
import type { RES_ProductoResumen } from "../service/productos.responses";
import { TipoProducto } from "../../../shared/enums/_generic/tipo-producto";
import { Periodo } from "../../../shared/enums/_generic/periodo";
import type { RES_UnidadMedida } from "../../../service/responses/unidad-medida";
import {
  getCoincidencias,
  type SearchResult,
} from "../../../shared/functions/get-coincidencias";
import { AuxService } from "../../../service/auxiliar.service";

const INITIAL_FORM: DTO_CrearProducto = {
  id_unidad_medida_base: 0,
  nombre: "",
  tipo_producto: TipoProducto.Otros,
  es_perecible: false,
  stock_minimo_base: 0,
  tiempo_espera_vencimiento: null,
  periodo_espera_vencimiento: null,
};

const productoToForm = (
  producto: RES_ProductoResumen,
): DTO_ActualizarProducto => ({
  id_unidad_medida_base: producto.id_unidad_medida_base,
  nombre: producto.nombre,
  tipo_producto: (producto.tipo_producto as TipoProducto) || TipoProducto.Otros,
  es_perecible: !!producto.es_perecible,
  stock_minimo_base: Number(producto.stock_minimo_base ?? 0),
  tiempo_espera_vencimiento: producto.tiempo_espera_vencimiento,
  periodo_espera_vencimiento: producto.periodo_espera_vencimiento,
});

interface UseRegistroProductoProps {
  productosExistentes: RES_ProductoResumen[];
  onSuccess: (nuevo: RES_ProductoResumen) => void;
  onEditSuccess?: (editado: RES_ProductoResumen) => void;
  productoEdicion?: RES_ProductoResumen | null;
}

export const useRegistroProducto = ({
  productosExistentes,
  onSuccess,
  onEditSuccess,
  productoEdicion,
}: UseRegistroProductoProps) => {
  const { notify } = useNotify();
  const [form, setForm] = useState<DTO_CrearProducto>(INITIAL_FORM);
  const [unidades, setUnidades] = useState<RES_UnidadMedida[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingUnidades, setLoadingUnidades] = useState(false);

  // Estado para coincidencias de nombres
  const [coincidencias, setCoincidencias] = useState<
    SearchResult<RES_ProductoResumen>[]
  >([]);

  const cargarUnidades = useCallback(async () => {
    setLoadingUnidades(true);
    try {
      const resp = await AuxService.get_unidades_medida();
      if (resp.success) setUnidades(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUnidades(false);
    }
  }, []);

  useEffect(() => {
    cargarUnidades();
  }, [cargarUnidades]);

  // Hidratar el formulario cuando se recibe un producto para editar
  useEffect(() => {
    if (productoEdicion) {
      setForm(productoToForm(productoEdicion));
      setCoincidencias([]);
    }
  }, [productoEdicion]);

  const setField = <K extends keyof DTO_CrearProducto>(
    field: K,
    value: DTO_CrearProducto[K],
  ) => {
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };

      // Lógica específica para productos perecibles
      if (field === "es_perecible" && value === true) {
        newForm.periodo_espera_vencimiento = Periodo.Semanal;
        newForm.tiempo_espera_vencimiento = 1;
      }


      return newForm;
    });

    // Buscar coincidencias si el campo es el nombre (excluyendo el producto en edición)
    if (field === "nombre") {
      const query = String(value);
      if (query.length >= 3) {
        const baseParaBuscar = productoEdicion
          ? productosExistentes.filter(
              (p) => p.id_producto !== productoEdicion.id_producto,
            )
          : productosExistentes;
        const results = getCoincidencias(baseParaBuscar, query, {
          keys: ["nombre"],
          fuseThreshold: 0.3, // Más estricto para evitar ruido excesivo
        });
        setCoincidencias(results);
      } else {
        setCoincidencias([]);
      }
    }
  };

  const isEdit = !!productoEdicion;

  const handleSubmit = async () => {
    const schema = isEdit ? Schema_ActualizarProducto : Schema_CrearProducto;
    const validation = schema.safeParse(form);
    if (!validation.success) {
      notify({ type: "error", content: validation.error.issues[0].message });
      return;
    }

    setLoading(true);
    try {
      if (isEdit && productoEdicion) {
        const resp = await ProductosService.actualizar_producto(
          productoEdicion.id_producto,
          validation.data as DTO_ActualizarProducto,
        );
        if (resp.success) {
          notify({ type: "success", content: resp.message });
          onEditSuccess?.(resp.data);
          setForm(INITIAL_FORM);
          setCoincidencias([]);
        } else {
          notify({ type: "error", content: resp.message });
        }
      } else {
        const resp = await ProductosService.crear_producto(
          validation.data as DTO_CrearProducto,
        );
        if (resp.success) {
          notify({ type: "success", content: resp.message });
          onSuccess(resp.data);
          setForm(INITIAL_FORM);
          setCoincidencias([]);
        } else {
          notify({ type: "error", content: resp.message });
        }
      }
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
    unidades,
    coincidencias,
    loading,
    loadingUnidades,
    cargarUnidades,
    handleSubmit,
    isEdit,
  };
};
