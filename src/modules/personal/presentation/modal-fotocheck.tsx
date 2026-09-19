import { useState } from "react";
import {
  Stack,
  Group,
  Text,
  Button,
  NumberInput,
  Alert,
  Badge,
  Divider,
} from "@mantine/core";
import {
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { ModalEstandar } from "../../../presentation/utils/modal-estandar";
import { useFotocheckEmpleado } from "../hooks/useFotocheckEmpleado";
import type { RES_EmpleadoResumen } from "../service/empleados.responses";

interface ModalFotocheckProps {
  opened: boolean;
  close: () => void;
  empleados: RES_EmpleadoResumen[];
}

export const ModalFotocheck = ({
  opened,
  close,
  empleados,
}: ModalFotocheckProps) => {
  const [ancho, setAncho] = useState<number>(400);
  const [alto, setAlto] = useState<number>(600);

  const { generando, descargar } = useFotocheckEmpleado({
    empleados,
  });

  return (
    <ModalEstandar
      opened={opened}
      close={close}
      title={
        <Group gap="xs">
          <Text fw={900} className="uppercase tracking-wider">
            Generar Fotocheck
          </Text>
          <Badge
            variant="light"
            color="indigo"
            size="sm"
            radius="md"
            className="font-bold"
          >
            {empleados.length}{" "}
            {empleados.length === 1 ? "empleado" : "empleados"}
          </Badge>
        </Group>
      }
      size="md"
    >
      <Stack gap="md" className="max-h-[80vh] overflow-y-auto px-2 py-2">
        {/* Configuración */}
        <Alert
          variant="light"
          color="indigo"
          radius="md"
          styles={{ message: { fontSize: "12px" } }}
        >
          Configura el tamaño del fotocheck (en píxeles). Se generará un PDF
          con 1 página por empleado seleccionado. Al imprimir, cada página sale
          por separado.
        </Alert>

        <Stack gap="sm">
          <NumberInput
            label="Ancho (px)"
            value={ancho}
            onChange={(v) => setAncho(typeof v === "number" ? v : 0)}
            min={200}
            max={1200}
            step={10}
            hideControls
            radius="lg"
            classNames={{
              label: "text-zinc-400 mb-1 font-medium text-xs",
              input: "bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-300 transition-all h-[38px]",
            }}
          />
          <NumberInput
            label="Alto (px)"
            value={alto}
            onChange={(v) => setAlto(typeof v === "number" ? v : 0)}
            min={300}
            max={1800}
            step={10}
            hideControls
            radius="lg"
            classNames={{
              label: "text-zinc-400 mb-1 font-medium text-xs",
              input: "bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-300 transition-all h-[38px]",
            }}
          />
        </Stack>

        <Divider color="zinc.8" />

        {/* Lista de empleados seleccionados */}
        <Stack gap="xs">
          <Text
            size="xs"
            fw={900}
            c="zinc.4"
            className="uppercase tracking-widest"
          >
            Empleados seleccionados
          </Text>
          <div className="flex flex-wrap gap-2">
            {empleados.map((emp) => (
              <Badge
                key={emp.id_empleado}
                variant="light"
                color="indigo"
                size="md"
                radius="lg"
                className="font-medium"
                leftSection={
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                }
              >
                {emp.nombre} {emp.apellido}
              </Badge>
            ))}
            {empleados.length === 0 && (
              <Text size="xs" c="dimmed" fs="italic">
                No hay empleados seleccionados.
              </Text>
            )}
          </div>
        </Stack>

        {/* Botón de descarga */}
        <Group justify="flex-end" gap="md" mt="md">
          <Button
            variant="subtle"
            onClick={close}
            disabled={generando}
            radius="lg"
            size="sm"
            className="text-zinc-400 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            loading={generando}
            onClick={() => {
              void descargar(ancho, alto);
            }}
            disabled={empleados.length === 0}
            leftSection={<ArrowDownTrayIcon className="w-4 h-4" />}
            radius="lg"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 px-8"
          >
            Descargar PDF
          </Button>
        </Group>
      </Stack>
    </ModalEstandar>
  );
};
