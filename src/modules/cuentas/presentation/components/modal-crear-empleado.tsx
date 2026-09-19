import { useState } from "react";
import {
  Stack,
  TextInput,
  Switch,
  Button,
  Group,
} from "@mantine/core";
import {
  UserIcon,
  IdentificationIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { ModalEstandar } from "../../../../presentation/utils/modal-estandar";

interface ModalCrearEmpleadoProps {
  opened: boolean;
  onClose: () => void;
  onGuardar: (payload: {
    nombre: string;
    apellido: string;
    dni?: string;
    es_contratista?: boolean;
  }) => void;
  loading: boolean;
}

export const ModalCrearEmpleado = ({
  opened,
  onClose,
  onGuardar,
  loading,
}: ModalCrearEmpleadoProps) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [esContratista, setEsContratista] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      nombre,
      apellido,
      dni: dni.trim() || undefined,
      es_contratista: esContratista,
    });
  };

  const handleResetAndClose = () => {
    setNombre("");
    setApellido("");
    setDni("");
    setEsContratista(false);
    onClose();
  };

  const fieldClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
    label: "text-zinc-300 mb-1 font-medium text-xs",
  };

  return (
    <ModalEstandar
      opened={opened}
      close={handleResetAndClose}
      title="Registrar Nuevo Empleado"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Stack gap="sm">
          <TextInput
            label="Nombres"
            placeholder="Ej: Juan Carlos"
            value={nombre}
            onChange={(e) => setNombre(e.currentTarget.value)}
            required
            radius="lg"
            leftSection={<UserIcon className="w-4 h-4 text-zinc-500" />}
            classNames={fieldClasses}
            disabled={loading}
          />

          <TextInput
            label="Apellidos"
            placeholder="Ej: Pérez Quispe"
            value={apellido}
            onChange={(e) => setApellido(e.currentTarget.value)}
            required
            radius="lg"
            leftSection={<UserIcon className="w-4 h-4 text-zinc-500" />}
            classNames={fieldClasses}
            disabled={loading}
          />

          <TextInput
            label="Documento de Identidad (DNI)"
            placeholder="8 dígitos"
            maxLength={8}
            value={dni}
            onChange={(e) => setDni(e.currentTarget.value.replace(/\D/g, ""))}
            radius="lg"
            leftSection={<IdentificationIcon className="w-4 h-4 text-zinc-500" />}
            classNames={fieldClasses}
            disabled={loading}
          />

          <div className="pt-2">
            <Switch
              label="¿Es personal contratista?"
              description="Marcar si el personal pertenece a una contrata externa"
              checked={esContratista}
              onChange={(e) => setEsContratista(e.currentTarget.checked)}
              color="indigo"
              size="sm"
              disabled={loading}
              thumbIcon={<BriefcaseIcon className="w-3 h-3 text-zinc-600" />}
            />
          </div>
        </Stack>

        <Group justify="flex-end" gap="sm" mt="lg">
          <Button
            type="button"
            variant="subtle"
            onClick={handleResetAndClose}
            disabled={loading}
            radius="lg"
            size="sm"
            className="text-zinc-400 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            radius="lg"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 px-6 font-semibold"
          >
            Registrar Empleado
          </Button>
        </Group>
      </form>
    </ModalEstandar>
  );
};
