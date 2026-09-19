import { useState, useCallback, useEffect, useMemo } from "react";
import { useNotify } from "../../../hooks/useNotify";
import { ProductosService } from "../service/productos.service";
import type { RES_ProductoResumen } from "../service/productos.responses";
import { useAuditoriaStore } from "../../../stores/auditoria.store";

export const useProductos = () => {
  const { en_modo_auditable } = useAuditoriaStore();
  const { notify } = useNotify();
  const [productos, setProductos] = useState<RES_ProductoResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  const listar = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await ProductosService.get_productos();
      if (resp.success) setProductos(resp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    listar();
  }, [listar]);

  const filtrados = useMemo(() => {
    const query = busqueda.toLowerCase().trim();

    const result = productos.filter(
      (p) => !(en_modo_auditable && p.es_auditable),
    );

    if (!query) return result;

    return result.filter(
      (p) =>
        p.nombre.toLowerCase().includes(query) ||
        p.categoria.toLowerCase().includes(query) ||
        p.unidad_medida_base_abreviatura.toLowerCase().includes(query),
    );
  }, [productos, busqueda, en_modo_auditable]);

  const pushNuevoProducto = (nuevo: RES_ProductoResumen) => {
    setProductos((prev) => [nuevo, ...prev]);
  };

  /**
   * Reemplaza el producto en la lista con la versión devuelta por la API.
   * Garantiza que la fila siempre refleje el shape exacto que entrega el backend.
   */
  const actualizarProducto = (editado: RES_ProductoResumen) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id_producto === editado.id_producto ? editado : p,
      ),
    );
  };

  /**
   * Solicita la eliminación al backend y, según la respuesta, retira la fila
   * de la lista visible. El backend devuelve el producto Inactivo, pero la API
   * de listado ya lo filtra, por lo que el efecto visible es el mismo.
   */
  const eliminarProducto = useCallback(
    async (id_producto: number): Promise<boolean> => {
      if (
        !window.confirm(
          "¿Está seguro de eliminar este producto? Esta acción lo desactivará del catálogo.",
        )
      ) {
        return false;
      }

      setEliminandoId(id_producto);
      try {
        const resp = await ProductosService.eliminar_producto(id_producto);
        if (resp.success) {
          notify({ type: "success", content: resp.message });
          setProductos((prev) =>
            prev.filter((p) => p.id_producto !== id_producto),
          );
          return true;
        }
        notify({ type: "error", content: resp.message });
        return false;
      } catch (err) {
        console.error(err);
        notify({ type: "error", content: "Error inesperado al eliminar" });
        return false;
      } finally {
        setEliminandoId(null);
      }
    },
    [notify],
  );

  return {
    productos: filtrados,
    loading,
    busqueda,
    setBusqueda,
    recargar: listar,
    pushNuevoProducto,
    actualizarProducto,
    eliminarProducto,
    eliminandoId,
  };
};
