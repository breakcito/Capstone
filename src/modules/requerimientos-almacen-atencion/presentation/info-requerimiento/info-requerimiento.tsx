import { Loader, Stack, Paper, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import { useGestionAtencion } from "../../hooks/useGestionAtencion";
import type { RES_RequerimientoAlmacen } from "../../../../service/responses/requerimientos-almacen/requerimiento-almacen";
import { Estado_Requerimiento } from "../../../../shared/enums/requerimiento-almacen/requerimiento";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import { InfoHeader } from "./components/InfoHeader";
import { InfoStats } from "./components/InfoStats";
import { InfoProgress } from "./components/InfoProgress";
import { InfoItemsTable } from "./components/InfoItemsTable";
import { InfoActionModals } from "./components/InfoActionModals";
import { ModalEstandar } from "../../../../presentation/utils/modal-estandar";
import { RegistroRequerimiento } from "../registrar-requerimiento/registro-requerimiento";
import { RegistrarEntrega } from "../entregas/registrar-entrega/registrar-entrega";

interface InfoRequerimientoProps {
  requerimiento: RES_RequerimientoAlmacen;
  idAlmacen?: number;
  onSuccess: (ids?: number[]) => void;
}

export const InfoRequerimiento = ({
  requerimiento,
  idAlmacen,
  onSuccess,
}: InfoRequerimientoProps) => {
  const isAnulado = requerimiento.estado === Estado_Requerimiento.Anulado;

  const {
    loading,
    detalles,
    eventos,
    loadingTrazabilidad,
    openedTrace,
    openTrace,
    closeTrace,
    openedRechazo,
    openRechazo,
    closeRechazo,
    openedEntregaBatch,
    openEntregaBatch,
    closeEntregaBatch,
    openedHistorialGlobal,
    openHistorialGlobal,
    closeHistorialGlobal,
    selectedItemId,
    setSelectedItemId,
    selectedItemName,
    setSelectedItemName,
    selectedItemsIds,
    toggleItemSelection,
    deselectAllItems,
    isAllEligibleSelected,
    hasPartialEligibleSelection,
    toggleSelectAllEligible,
    comentarioAccion,
    setComentarioAccion,
    openedAprobar,
    openAprobar,
    closeAprobar,
    isProcessing,
    progresoGeneral,
    handleAprobar,
    handleRechazar,
    handleDecisionMasiva,
    idsParaAccionMasiva,
    toggleSeleccionMasiva,
    isAllPendingSelected,
    seleccionarTodoLoPendiente,
    getStatusColor,
    loadData,
    patchDetallesLocales,
  } = useGestionAtencion({
    idRequerimiento: requerimiento.id_requerimiento,
    isAnulado,
    onSuccess,
  });

  const puedeEditar = useMemo(
    () =>
      !isAnulado &&
      detalles.some((d) => Number(d.cantidad_entregada_base ?? 0) === 0),
    [detalles, isAnulado],
  );

  const [openedEditar, setOpenedEditar] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader color="indigo" size="lg" />
      </div>
    );
  }

  if (!detalles) return null;

  return (
    <Stack gap="xl" className="pb-10">
      {isAnulado && (
        <Paper
          p="md"
          radius="lg"
          className="bg-red-500/10 border border-red-500/30 text-red-200 flex items-center gap-3.5 mx-2"
        >
          <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
            <NoSymbolIcon className="size-6 text-red-400" />
          </div>
          <div>
            <Text size="sm" fw={800} className="text-red-200 tracking-tight">
              Requerimiento Anulado · Modo Solo Lectura
            </Text>
            <Text size="xs" className="text-red-300/80 mt-0.5">
              Este requerimiento se encuentra anulado. No se permiten ediciones, aprobaciones, rechazos ni registro de entregas.
            </Text>
          </div>
        </Paper>
      )}

      <InfoHeader
        requerimiento={requerimiento}
        puedeEditar={puedeEditar}
        isAnulado={isAnulado}
        onEditar={() => !isAnulado && setOpenedEditar(true)}
      />

      <InfoStats requerimiento={requerimiento} />

      <InfoProgress progresoGeneral={progresoGeneral} />

      <InfoItemsTable
        detalles={detalles}
        isAnulado={isAnulado}
        selectedItemsIds={selectedItemsIds}
        toggleItemSelection={toggleItemSelection}
        isAllEligibleSelected={isAllEligibleSelected}
        hasPartialEligibleSelection={hasPartialEligibleSelection}
        toggleSelectAllEligible={toggleSelectAllEligible}
        openHistorialGlobal={openHistorialGlobal}
        openEntregaBatch={openEntregaBatch}
        idsParaAccionMasiva={idsParaAccionMasiva}
        setSelectedItemId={setSelectedItemId}
        openAprobar={openAprobar}
        openRechazo={openRechazo}
        isAllPendingSelected={isAllPendingSelected}
        seleccionarTodoLoPendiente={seleccionarTodoLoPendiente}
        getStatusColor={getStatusColor}
        toggleSeleccionMasiva={toggleSeleccionMasiva}
        setSelectedItemName={setSelectedItemName}
        openTrace={openTrace}
        isProcessing={isProcessing}
      />

      <InfoActionModals
        openedTrace={openedTrace}
        closeTrace={closeTrace}
        selectedItemId={selectedItemId}
        eventos={eventos}
        selectedItemName={selectedItemName}
        loadingTrazabilidad={loadingTrazabilidad}
        openedRechazo={openedRechazo}
        closeRechazo={closeRechazo}
        comentarioAccion={comentarioAccion}
        setComentarioAccion={setComentarioAccion}
        idsParaAccionMasiva={idsParaAccionMasiva}
        isProcessing={isProcessing}
        handleRechazar={handleRechazar}
        handleDecisionMasiva={
          handleDecisionMasiva as unknown as (
            e: import("../../../../shared/enums/requerimiento-almacen/requerimiento").Estado_RequerimientoDetalle,
          ) => Promise<void>
        }
        openedAprobar={openedAprobar}
        closeAprobar={closeAprobar}
        handleAprobar={handleAprobar}
        requerimiento={requerimiento}
        detalles={detalles}
        openedHistorialGlobal={openedHistorialGlobal}
        closeHistorialGlobal={closeHistorialGlobal}
      />

      <ModalEstandar
        opened={!isAnulado && openedEditar}
        close={() => setOpenedEditar(false)}
        title={`Editar Requerimiento ${requerimiento.correlativo}`}
        size="65%"
        validateClose
      >
        <RegistroRequerimiento
          modo="editar"
          requerimientoInicial={requerimiento}
          detallesIniciales={detalles}
          onSuccess={(updated) => {
            setOpenedEditar(false);
            loadData(true);
            onSuccess([updated.id_requerimiento]);
          }}
          onCancel={() => setOpenedEditar(false)}
        />
      </ModalEstandar>

      <ModalEstandar
        opened={!isAnulado && openedEntregaBatch}
        close={closeEntregaBatch}
        title={`Registrar Entrega · ${requerimiento.correlativo}`}
        size="75rem"
        validateClose
      >
        {idAlmacen !== undefined && (
          <RegistrarEntrega
            requerimiento={requerimiento}
            idRequerimiento={requerimiento.id_requerimiento}
            idAlmacen={idAlmacen}
            selectedItemsIds={selectedItemsIds}
            detallesRequerimiento={detalles}
            // Solicitante dual: si es contratista lo lleva
            // `id_contratista_solicitante`; si es empleado lo lleva
            // `id_empleado_registro` (porque en ese caso se sobrescribio
            // al logueado con el id del solicitante-empleado).
            idContratistaSolicitante={requerimiento.id_contratista_solicitante}
            idEmpleadoSolicitante={requerimiento.id_empleado_registro}
            onSuccess={(entregados) => {
              patchDetallesLocales(entregados);
              deselectAllItems();
              closeEntregaBatch();
              onSuccess(Object.keys(entregados).map(Number));
            }}
            onCancel={() => {
              deselectAllItems();
              closeEntregaBatch();
            }}
          />
        )}
      </ModalEstandar>
    </Stack>
  );
};
