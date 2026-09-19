import { Modal, Text, Button, Stack } from "@mantine/core";

interface ModalHistorialContratosEmpleadoProps {
  idEmpleado?: number;
  nombreEmpleado?: string;
  opened: boolean;
  close: () => void;
  onContratoCreado?: (payload?: any) => void;
  onNuevoContrato?: (id: number, nombre: string) => void;
  onCrearContratoClick?: () => void;
  esContratista?: boolean;
  [key: string]: any;
}

export const ModalHistorialContratosEmpleado = ({
  nombreEmpleado,
  opened,
  close,
}: ModalHistorialContratosEmpleadoProps) => {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`Historial de Contratos ${nombreEmpleado ? `- ${nombreEmpleado}` : ""}`}
      centered
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Historial de contratos no disponible en esta versión reducida.
        </Text>
        <Button onClick={close} variant="light">
          Cerrar
        </Button>
      </Stack>
    </Modal>
  );
};
