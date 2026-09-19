import { Button, Group, Loader, Stack, Text } from "@mantine/core";
import { useRegistrarEntregaBatch } from "../../../hooks/useRegistrarEntrega";
import type { DetalleRequerimientoExtendido } from "../../../service/atencion.responses";
import { EntregaHeader } from "./header/entrega-header";
import { GroupByProducto } from "./detalle/group-by-producto";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import type {
  RES_DetalleRequerimiento,
  RES_RequerimientoAlmacen,
} from "../../../../../service/responses/requerimientos-almacen/requerimiento-almacen";

interface RegistrarEntregaProps {
  requerimiento: RES_RequerimientoAlmacen;
  idRequerimiento: number;
  idAlmacen: number;
  selectedItemsIds: number[];
  detallesRequerimiento: RES_DetalleRequerimiento[];
  idContratistaSolicitante: number | null;
  idEmpleadoSolicitante: number | null;
  onSuccess: (entregados: Record<number, number>) => void;
  onCancel: () => void;
}

export const RegistrarEntrega = ({
  requerimiento,
  idRequerimiento,
  idAlmacen,
  selectedItemsIds,
  detallesRequerimiento,
  idContratistaSolicitante,
  idEmpleadoSolicitante,
  onSuccess,
  onCancel,
}: RegistrarEntregaProps) => {
  const {
    loading,
    selectedDetalles,
    allActivos,
    lotesMineral,
    lotesPorProducto,
    activosFijosPorProducto,
    entregaCantidades,
    entregaCantidadesActivos,
    destinosMap,
    empleados,
    contratistas,
    idEmpleadoRecibe,
    setIdEmpleadoRecibe,
    idContratistaRecibe,
    setIdContratistaRecibe,
    esContratistaRecibe,
    setEsContratistaRecibe,
    observacion,
    setObservacion,
    evidencias,
    setEvidencias,
    error,
    isProcessing,
    totalEntregaGeneralBase,
    handleCantChange,
    handleCantLoteChange,
    handleCantActivoChange,
    handleDestinoChange,
    handleConfirmar,
  } = useRegistrarEntregaBatch({
    requerimiento,
    idRequerimiento,
    idAlmacen,
    selectedItemsIds,
    detallesRequerimiento,
    idContratistaSolicitante,
    idEmpleadoSolicitante,
    onSuccess: (entregados) => {
      onSuccess(entregados);
    },
  });

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader color="indigo" size="lg" />
      </div>
    );

  if (selectedDetalles.length === 0)
    return <Text c="red">No hay ítems seleccionados o válidos.</Text>;

  // Grouping logic for products
  const groupedByProduct: Record<
    number,
    {
      name: string;
      stock_minimo_base: number;
      stock_disponible: number;
      unidad_medida_base_abv: string;
      details: DetalleRequerimientoExtendido[];
    }
  > = {};

  selectedDetalles.forEach((d) => {
    if (!groupedByProduct[d.id_producto]) {
      groupedByProduct[d.id_producto] = {
        name: d.producto,
        stock_minimo_base: d.stock_minimo_base,
        stock_disponible: d.stock_disponible_base,
        unidad_medida_base_abv: d.unidad_medida_base_abv,
        details: [],
      };
    }
    groupedByProduct[d.id_producto].details.push(d);
  });

  return (
    <Stack gap="lg" className="font-sans">
      <EntregaHeader
        empleados={empleados}
        contratistas={contratistas}
        idEmpleadoRecibe={idEmpleadoRecibe}
        setIdEmpleadoRecibe={setIdEmpleadoRecibe}
        idContratistaRecibe={idContratistaRecibe}
        setIdContratistaRecibe={setIdContratistaRecibe}
        esContratistaRecibe={esContratistaRecibe}
        setEsContratistaRecibe={setEsContratistaRecibe}
        observacion={observacion}
        setObservacion={setObservacion}
        evidencias={evidencias}
        setEvidencias={setEvidencias}
      />

      <Stack gap="xl">
        {Object.entries(groupedByProduct).map(([id_prod, group]) => (
          <GroupByProducto
            key={id_prod}
            idProducto={Number(id_prod)}
            group={group}
            lotesPorProducto={lotesPorProducto}
            activosFijosPorProducto={activosFijosPorProducto}
            allActivos={allActivos}
            lotesMineral={lotesMineral}
            entregaCantidades={entregaCantidades}
            entregaCantidadesActivos={entregaCantidadesActivos}
            destinosMap={destinosMap}
            handleCantChange={handleCantChange}
            handleCantLoteChange={handleCantLoteChange}
            handleCantActivoChange={handleCantActivoChange}
            handleDestinoChange={handleDestinoChange}
          />
        ))}
      </Stack>

      <Group
        justify="flex-end"
        gap="md"
        className="pt-6 border-t border-zinc-800 mt-2"
      >
        {error && (
          <Text
            c="red"
            size="xs"
            ta="center"
            fw={800}
            className="italic bg-red-950/10 py-3 rounded-2xl border border-red-900/30 font-mono tracking-wide"
          >
            {error}
          </Text>
        )}
        <Button
          variant="subtle"
          radius="lg"
          size="sm"
          onClick={onCancel}
          className="text-zinc-400 hover:text-white px-8 font-bold"
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          radius="lg"
          leftSection={<ClipboardDocumentCheckIcon className="w-5 h-5" />}
          disabled={
            !(esContratistaRecibe ? idContratistaRecibe : idEmpleadoRecibe) || totalEntregaGeneralBase <= 0 || isProcessing
          }
          loading={isProcessing}
          onClick={handleConfirmar}
          className="bg-linear-to-r from-zinc-100 to-zinc-300 text-zinc-900 font-semibold hover:from-white hover:to-zinc-200 shadow-lg border-0 px-8"
        >
          Guardar Entrega
        </Button>
      </Group>
    </Stack>
  );
};
