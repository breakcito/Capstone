import { useState } from "react";
import { Button, Stack, Text, Textarea, Group } from "@mantine/core";
import { ModalEstandar } from "../../../../presentation/utils/modal-estandar";
import { AtencionService } from "../../service/atencion.service";
import { useNotify } from "../../../../hooks/useNotify";
import type { RES_RequerimientoAlmacen } from "../../../../service/responses/requerimientos-almacen/requerimiento-almacen";
import { Estado_Requerimiento } from "../../../../shared/enums/requerimiento-almacen/requerimiento";

interface Props {
  opened: boolean;
  close: () => void;
  requerimiento: RES_RequerimientoAlmacen | null;
  /**
   * Callback que se ejecuta DESPUES de anular exitosamente. La pagina
   * lo usa para refrescar el item en su lista local.
   */
  onAnulado: (id: number) => void;
}

/**
 * Modal de confirmacion para anular un requerimiento completo.
 *
 * Reglas que se aplican en backend (el modal solo refleja el mensaje):
 * - El requerimiento no debe tener entregas ACTIVAS (estado='Entregado').
 * - Si ya esta anulado, devuelve ok para idempotencia.
 * - No se puede anular si esta Completado (primero hay que anular entregas).
 */
export const ModalAnularRequerimiento = ({
  opened,
  close,
  requerimiento,
  onAnulado,
}: Props) => {
  const { notifySuccess, notifyError } = useNotify();
  const [motivo, setMotivo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConfirmar = async () => {
    if (!requerimiento) return;
    setSubmitting(true);
    try {
      const res = await AtencionService.anularRequerimiento(
        requerimiento.id_requerimiento,
        motivo || undefined,
      );
      if (res.success) {
        notifySuccess(
          res.message || "Requerimiento anulado correctamente",
        );
        onAnulado(requerimiento.id_requerimiento);
        close();
        setMotivo("");
      } else {
        notifyError(res.message || "Error al anular requerimiento");
      }
    } catch (err) {
      console.error(err);
      notifyError("Error de conexion al anular requerimiento");
    } finally {
      setSubmitting(false);
    }
  };

  const isAnulado = requerimiento?.estado === Estado_Requerimiento.Anulado;

  return (
    <ModalEstandar
      opened={opened}
      close={close}
      title={`Anular requerimiento ${requerimiento?.correlativo ?? ""}`}
      size="md"
    >
      <Stack gap="md">
        {isAnulado ? (
          <Text c="dimmed" size="sm">
            Este requerimiento ya se encuentra anulado. No se puede volver a
            anular.
          </Text>
        ) : (
          <>
            <Text size="sm">
              Vas a <strong>anular</strong> el requerimiento{" "}
              <strong>{requerimiento?.correlativo}</strong>. Esto cambiara su
              estado a <em>Anulado</em>.
            </Text>
            <Text size="xs" c="orange" fw={600}>
              Si el requerimiento tiene entregas activas (estado = &quot;Entregado&quot;),
              tambien se anularan automaticamente: el stock de cada item sera
              reintegrado al lote original y se registrara el movimiento
              inverso en Kardex (Ingreso / Reingreso).
            </Text>
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