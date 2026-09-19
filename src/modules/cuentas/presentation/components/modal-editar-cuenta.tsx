import { useState, useEffect } from "react";
import {
  Stack,
  TextInput,
  PasswordInput,
  Select,
  Button,
  Group,
  Text,
  Paper,
  Badge,
} from "@mantine/core";
import {
  UserIcon,
  KeyIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { ModalEstandar } from "../../../../presentation/utils/modal-estandar";
import type { RES_EmpleadoUsuario } from "../../service/cuentas.responses";
import type { RES_Rol } from "../../../../service/responses/rol";

interface ModalEditarCuentaProps {
  empleado: RES_EmpleadoUsuario | null;
  opened: boolean;
  onClose: () => void;
  onGuardar: (payload: {
    id_rol: number;
    username: string;
    password?: string;
  }) => void;
  loading: boolean;
  roles: RES_Rol[];
}

export const ModalEditarCuenta = ({
  empleado,
  opened,
  onClose,
  onGuardar,
  loading,
  roles,
}: ModalEditarCuentaProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [idRol, setIdRol] = useState<number | null>(null);

  useEffect(() => {
    if (empleado) {
      setUsername(empleado.username || "");
      setPassword("");
      setIdRol(empleado.id_rol || (roles.length > 0 ? roles[0].id_rol : null));
    }
  }, [empleado, roles]);

  if (!empleado) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idRol) return;
    onGuardar({
      id_rol: idRol,
      username,
      password: password ? password : undefined,
    });
  };

  const fieldClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
    label: "text-zinc-300 mb-1 font-medium text-xs",
  };

  return (
    <ModalEstandar
      opened={opened}
      close={onClose}
      title="Actualizar Cuenta / Contraseña"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card resumen del empleado */}
        <Paper className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl">
          <Group justify="space-between" align="center">
            <div>
              <Text size="xs" c="dimmed" fw={600} className="uppercase tracking-wider">
                Empleado
              </Text>
              <Text size="sm" fw={700} c="white">
                {empleado.apellido}, {empleado.nombre}
              </Text>
            </div>
            {empleado.nombre_rol && (
              <Badge variant="filled" color="grape" radius="md" size="sm">
                {empleado.nombre_rol}
              </Badge>
            )}
          </Group>
        </Paper>

        <Stack gap="sm">
          <Select
            label="Rol en el Sistema"
            placeholder="Seleccione el rol"
            data={roles.map((r) => ({
              value: r.id_rol.toString(),
              label: r.nombre,
            }))}
            value={idRol ? idRol.toString() : null}
            onChange={(val) => setIdRol(val ? Number(val) : null)}
            required
            radius="lg"
            leftSection={<ShieldCheckIcon className="w-4 h-4 text-zinc-500" />}
            classNames={fieldClasses}
            disabled={loading}
          />

          <TextInput
            label="Nombre de Usuario"
            placeholder="Ej: juan.perez"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
            required
            radius="lg"
            leftSection={<UserIcon className="w-4 h-4 text-zinc-500" />}
            classNames={fieldClasses}
            disabled={loading}
          />

          <PasswordInput
            label="Nueva Contraseña (opcional)"
            placeholder="Dejar en blanco para mantener la actual"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            radius="lg"
            leftSection={<KeyIcon className="w-4 h-4 text-zinc-500" />}
            classNames={{
              ...fieldClasses,
              innerInput: "text-white placeholder:text-zinc-500",
              visibilityToggle: "text-zinc-500 hover:text-zinc-300",
            }}
            disabled={loading}
          />
        </Stack>

        <Group justify="flex-end" gap="sm" mt="lg">
          <Button
            type="button"
            variant="subtle"
            onClick={onClose}
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
            Guardar Cambios
          </Button>
        </Group>
      </form>
    </ModalEstandar>
  );
};
