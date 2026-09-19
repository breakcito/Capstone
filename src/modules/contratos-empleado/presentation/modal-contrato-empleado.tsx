import { Modal, Text, Button, Stack } from "@mantine/core";

interface ModalContratoEmpleadoProps {
  idEmpleado?: number;
  opened: boolean;
  close: () => void;
  onSuccess?: (payload?: any) => void;
  [key: string]: any;
}

export const ModalContratoEmpleado = ({
  opened,
  close,
}: ModalContratoEmpleadoProps) => {
  return (
    <Modal opened={opened} onClose={close} title="Contrato de Empleado" centered>
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Módulo de contratos no disponible en esta versión reducida.
        </Text>
        <Button onClick={close} variant="light">
          Cerrar
        </Button>
      </Stack>
    </Modal>
  );
};
