import { useState } from "react";
import { Button, Stack, Text, Textarea, Group } from "@mantine/core";
import { ModalEstandar } from "../../../../presentation/utils/modal-estandar";
import { AtencionService } from "../../service/atencion.service";
import { useNotify } from "../../../../hooks/useNotify";

interface Props {
  opened: boolean;
  close: () => void;
  /**
   * Si esta definido, el modal muestra el boton de anular.
   * Si es null, el modal no se muestra visualmente (no-op).
   */
  entrega:
    | {
        id_requerimiento_almacen_entrega: number;
        correlativo: string;
        estado: string;
      }
    | null;
  onAnulada: (idEntrega: number) => void;
}

/**
 * Modal para anular una entrega: devuelve el stock al lote original y
 * registra el movimiento inverso en Kardex (Ingreso / Reingreso).
 */
export const ModalAnularEntrega = ({
  opened,
  close,
  entrega,
  onAnulada,
}: Props) => {
  const { notifySuccess, notifyError } = useNotify();
  const [motivo, setMotivo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirmar = async () => {
    if (!entrega) return;
    setSubmitting(true);
    try {
      const res = await AtencionService.anularEntrega(
        entrega.id_requerimiento_almacen_entrega,
        motivo || undefined,
      );
      if (res.success) {
        notifySuccess(
          res.message || "Entrega anulada y stock reintegrado",
        );
        onAnulada(entrega.id_requerimiento_almacen_entrega);
        close();
        setMotivo("");
      } else {
        notifyError(res.message || "Error al anular la entrega");
      }
    } catch (err) {
      console.error(err);
      notifyError("Error de conexion al anular entrega");
    } finally {
      setSubmitting(false);
    }
  };

  const isAnulado = entrega?.estado === "Anulado";

  return (
    <ModalEstandar
      opened={opened && !!entrega}
      close={close}
      title={`Anular entrega ${entrega?.correlativo ?? ""}`}
      size="md"
    >
      <Stack gap="md">
        {isAnulado ? (
          <Text c="dimmed" size="sm">
            Esta entrega ya se encuentra anulada.
          </Text>
        ) : (
          <>
            <Text size="sm">
              Vas a <strong>anular</strong> la entrega{" "}
              <strong>{entrega?.correlativo}</strong>. Esta accion:
            </Text>
            <ul className="text-sm text-zinc-300 list-disc pl-5 space-y-1">
              <li>
                Reintegra el stock a cada lote (movimiento Kardex inverso,
                tipo_origen = &quot;Reingreso&quot;, tipo_movimiento = &quot;Ingreso&quot;).
              </li>
              <li>
                Marca la entrega como <em>Anulado</em>.
              </li>
              <li>
                Si despues de esta anulacion el requerimiento ya no tiene
                entregas activas, vuelve a estado <em>Generado</em>.
              </li>
            </ul>
            <Textarea
              label="Motivo (opcional)"
              placeholder="Describe brevemente el motivo de la anulacion"
              value={motivo}
              onChange={(e) => setMotivo(e.currentTarget.value)}
              minRows={3}
              radius="md"
            />
            <Group justify="flex-end" gap="sm" mt="md">
              <Button
                variant="subtle"
                radius="md"
                onClick={close}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                color="red"
                radius="md"
                loading={submitting}
                onClick={handleConfirmar}
              >
                Si, anular
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </ModalEstandar>
  );
};