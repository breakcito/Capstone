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
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { ModalEstandar } from "../../../presentation/utils/modal-estandar";
import { useFotocheckContratista } from "../hooks/useFotocheckContratista.tsx";
import type { RES_ContratistaResumen } from "../service/empleados.responses";

interface ModalFotocheckContratistaProps {
  opened: boolean;
  close: () => void;
  contratistas: RES_ContratistaResumen[];
}

export const ModalFotocheckContratista = ({
  opened,
  close,
  contratistas,
}: ModalFotocheckContratistaProps) => {
  const [ancho, setAncho] = useState<number>(400);
  const [alto, setAlto] = useState<number>(600);

  const { generando, descargar } = useFotocheckContratista({
    contratistas,
  });

  return (
    <ModalEstandar
      opened={opened}
      close={close}
      title={
        <Group gap="xs">
          <Text fw={900} className="uppercase tracking-wider">
            Generar Fotocheck de Contratistas
          </Text>
          <Badge
            variant="light"
            color="cyan"
            size="sm"
            radius="md"
            className="font-bold"
          >
            {contratistas.length}{" "}
            {contratistas.length === 1 ? "contratista" : "contratistas"}
          </Badge>
        </Group>
      }
      size="md"
    >
      <Stack gap="md" className="max-h-[80vh] overflow-y-auto px-2 py-2">
        {/* Configuración */}
        <Alert
          variant="light"
          color="cyan"
          radius="md"
          styles={{ message: { fontSize: "12px" } }}
        >
          Configura el tamaño del fotocheck (en píxeles). Se generará un PDF
          con 1 página por contratista seleccionado. Cada fotocheck mostrará
          mina, primera labor asignada y código QR.
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
              input:
                "bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-300 transition-all h-[38px]",
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
              input:
                "bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-300 transition-all h-[38px]",
            }}
          />
        </Stack>

        <Divider color="zinc.8" />

        {/* Lista de contratistas seleccionados */}
        <Stack gap="xs">
          <Text
            size="xs"
            fw={900}
            c="zinc.4"
            className="uppercase tracking-widest"
          >
            Contratistas seleccionados
          </Text>
          <div className="flex flex-wrap gap-2">
            {contratistas.map((c) => (
              <Badge
                key={c.id_contratista}
                variant="light"
                color="cyan"
                size="md"
                radius="lg"
                className="font-medium"
                leftSection={
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                }
              >
                {c.nombre} {c.apellido}
              </Badge>
            ))}
            {contratistas.length === 0 && (
              <Text size="xs" c="dimmed" fs="italic">
                No hay contratistas seleccionados.
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
            disabled={contratistas.length === 0}
            leftSection={<ArrowDownTrayIcon className="w-4 h-4" />}
            radius="lg"
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-900/20 px-8"
          >
            Descargar PDF
          </Button>
        </Group>
      </Stack>
    </ModalEstandar>
  );
};