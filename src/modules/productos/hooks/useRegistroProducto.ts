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
import { Periodo } from "../../../shared/enums/_generic/periodo";
import { Moneda } from "../../../shared/enums/_generic/moneda";
import type { RES_UnidadMedida } from "../../../service/responses/unidad-medida";
import { TipoBien } from "../../../shared/enums/_generic/tipo-bien";
import {
  getCoincidencias,
  type SearchResult,
} from "../../../shared/functions/get-coincidencias";
import { AuxService } from "../../../service/auxiliar.service";
import type { RES_Categoria } from "../../../service/responses/categoria";

const INITIAL_FORM: DTO_CrearProducto = {
  id_categoria: 0,
  id_unidad_medida_base: 0,
  nombre: "",
  prefijo: null,
  es_auditable: false,
  es_perecible: false,
  para_mantenimiento: false,
  stock_minimo_base: 0,
  moneda: Moneda.Soles,
  costo_promedio_base: 0,
  tiempo_espera_vencimiento: null,
  periodo_espera_vencimiento: null,
};

const productoToForm = (
  producto: RES_ProductoResumen,
): DTO_ActualizarProducto => ({
  id_categoria: producto.id_categoria,
  id_unidad_medida_base: producto.id_unidad_medida_base,
  nombre: producto.nombre,
  prefijo: producto.prefijo,
  es_auditable: !!producto.es_auditable,
  es_perecible: !!producto.es_perecible,
  para_mantenimiento: !!producto.para_mantenimiento,
  stock_minimo_base: Number(producto.stock_minimo_base ?? 0),
  moneda: producto.moneda ?? Moneda.Soles,
  costo_promedio_base: Number(producto.costo_promedio_base ?? 0),
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
  const [categorias, setCategorias] = useState<RES_Categoria[]>([]);
  const [unidades, setUnidades] = useState<RES_UnidadMedida[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingCategorias, setLoadingCategorias] = useState(false);
  const [loadingUnidades, setLoadingUnidades] = useState(false);

  // Estado para coincidencias de nombres
  const [coincidencias, setCoincidencias] = useState<
    SearchResult<RES_ProductoResumen>[]
  >([]);

  const cargarCategorias = useCallback(async () => {
    setLoadingCategorias(true);
    try {
      const resp = await AuxService.get_categorias();
      if (resp.success) setCategorias(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategorias(false);
    }
  }, []);

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
    cargarCategorias();
    cargarUnidades();
  }, [cargarCategorias, cargarUnidades]);

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

      // Si cambia la categoría, verificar si es auditable
      if (field === "id_categoria") {
        const cat = categorias.find((c) => c.id_categoria === value);
        if (cat) {
          newForm.es_auditable = !!cat.es_auditable;

          // Si es Activo Fijo, la unidad de medida base es "Unidad" (ID 7)
          if (cat.clasificacion_bien === TipoBien.ActivoFijo) {
            newForm.id_unidad_medida_base = 7;
            newForm.stock_minimo_base = 0;
            newForm.es_perecible = false;
          }
        }
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
    categorias,
    unidades,
    coincidencias,
    loading,
    loadingCategorias,
    loadingUnidades,
    cargarCategorias,
    cargarUnidades,
    handleSubmit,
    isEdit,
  };
};
