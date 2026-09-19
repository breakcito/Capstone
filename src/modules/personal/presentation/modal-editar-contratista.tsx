import { useMemo } from "react";
import {
  Stack,
  Group,
  TextInput,
  Select,
  Button,
  Avatar,
  FileButton,
  Text,
} from "@mantine/core";
import {
  UserIcon,
  IdentificationIcon,
  PencilIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useEdicionContratista } from "../hooks/useEdicionContratista";
import type { RES_ContratistaResumen } from "../service/empleados.responses";
import { CustomDatePicker } from "../../../presentation/utils/date-picker-input";
import { ModalEstandar } from "../../../presentation/utils/modal-estandar";
import { Genero } from "../../../shared/enums/_generic/genero";

interface ModalEditarContratistaProps {
  contratista: RES_ContratistaResumen;
  opened: boolean;
  onSuccess: (editado: RES_ContratistaResumen) => void;
  close: () => void;
}

const GENERO_OPTIONS = [
  { value: Genero.Femenino, label: "Femenino" },
  { value: Genero.Masculino, label: "Masculino" },
];

export const ModalEditarContratista = ({
  contratista,
  opened,
  onSuccess,
  close,
}: ModalEditarContratistaProps) => {
  const {
    form,
    setField,
    loading,
    fotoFile,
    handleFoto,
    submit,
  } = useEdicionContratista(contratista, onSuccess);

  const photoPreview = useMemo(
    () =>
      fotoFile
        ? URL.createObjectURL(fotoFile)
        : (contratista.url_foto ?? null),
    [fotoFile, contratista.url_foto],
  );

  const fieldClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
    label: "text-zinc-300 mb-1 font-medium",
  };

  return (
    <ModalEstandar
      opened={opened}
      close={close}
      title={`Editar contratista: ${contratista.nombre} ${contratista.apellido}`}
      size="lg"
      validateClose={loading}
    >
      <Stack gap="md">
      {/* Foto (editable siempre) */}
      <div className="flex flex-col items-center justify-center py-2">
        <FileButton
          onChange={(file) => handleFoto(file)}
          accept="image/png,image/jpeg,image/jpg"
        >
          {(props) => (
            <div
              {...props}
              className="relative cursor-pointer group rounded-full overflow-hidden border-2 border-indigo-500/30 bg-indigo-600/10 transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-600/20"
              style={{ width: 100, height: 100 }}
            >
              <Avatar
                src={photoPreview}
                size={100}
                radius={100}
                className="bg-transparent"
              >
                <UserIcon className="w-10 h-10 text-indigo-400/40" />
              </Avatar>
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2 text-center">
                <PencilIcon className="w-5 h-5 text-white mb-1 drop-shadow-md" />
                <Text size="10px" fw={700} className="text-white leading-tight">
                  Cambiar imagen
                </Text>
              </div>
            </div>
          )}
        </FileButton>
      </div>

      {/* Nombres y Apellidos */}
      <Group grow align="flex-start" gap="md">
        <TextInput
          label="Nombres"
          placeholder="Ej. Juan"
          value={form.nombre}
          onChange={(e) => setField("nombre", e.currentTarget.value)}
          leftSection={<UserIcon className="w-4 h-4 text-zinc-500" />}
          classNames={fieldClasses}
          radius="lg"
          size="xs"
          required
          withAsterisk
          disabled={loading}
        />
        <TextInput
          label="Apellidos"
          placeholder="Ej. Pérez"
          value={form.apellido}
          onChange={(e) => setField("apellido", e.currentTarget.value)}
          leftSection={<UserIcon className="w-4 h-4 text-zinc-500" />}
          classNames={fieldClasses}
          radius="lg"
          size="xs"
          required
          withAsterisk
          disabled={loading}
        />
      </Group>

      {/* DNI, Fecha de Nacimiento y Género */}
      <Group grow align="flex-start" gap="md">
        <TextInput
          label="DNI"
          placeholder="12345678"
          value={form.dni ?? ""}
          onChange={(e) =>
            setField("dni", e.currentTarget.value.replace(/\D/g, ""))
          }
          leftSection={<IdentificationIcon className="w-4 h-4 text-zinc-500" />}
          classNames={fieldClasses}
          radius="lg"
          size="xs"
          maxLength={8}
          disabled={loading}
        />
        <CustomDatePicker
          label="Fecha de Nacimiento"
          placeholder="Seleccione fecha"
          value={form.fecha_nacimiento || null}
          onChange={(val: unknown) =>
            setField("fecha_nacimiento", val as string | null)
          }
          size="xs"
          disabled={loading}
        />
        <Select
          label="Género"
          placeholder="Seleccione"
          data={GENERO_OPTIONS}
          value={form.genero ?? null}
          onChange={(val) =>
            setField("genero", val ? (val as Genero) : null)
          }
          leftSection={<UserCircleIcon className="w-4 h-4 text-zinc-500" />}
          classNames={fieldClasses}
          radius="lg"
          size="xs"
          clearable
          disabled={loading}
          comboboxProps={{ withinPortal: true }}
        />
      </Group>

      {/* Dirección */}
      <TextInput
        label="Dirección"
        placeholder="Ej. Av. Principal 123, Lima"
        value={form.direccion ?? ""}
        onChange={(e) => setField("direccion", e.currentTarget.value)}
        leftSection={<MapPinIcon className="w-4 h-4 text-zinc-500" />}
        classNames={fieldClasses}
        radius="lg"
        size="xs"
        maxLength={255}
        disabled={loading}
      />

      {/* Teléfono y Email */}
      <Group grow align="flex-start" gap="md">
        <TextInput
          label="Teléfono"
          placeholder="987654321"
          value={form.telefono ?? ""}
          onChange={(e) =>
            setField(
              "telefono",
              e.currentTarget.value.replace(/[^\d+\s]/g, ""),
            )
          }
          leftSection={<PhoneIcon className="w-4 h-4 text-zinc-500" />}
          classNames={fieldClasses}
          radius="lg"
          size="xs"
          maxLength={32}
          disabled={loading}
        />
        <TextInput
          label="Email"
          placeholder="ejemplo@correo.com"
          value={form.email ?? ""}
          onChange={(e) => setField("email", e.currentTarget.value)}
          leftSection={<EnvelopeIcon className="w-4 h-4 text-zinc-500" />}
          classNames={fieldClasses}
          radius="lg"
          size="xs"
          maxLength={128}
          type="email"
          disabled={loading}
        />
      </Group>

      <Text size="11px" c="dimmed" fs="italic" ta="center">
        La asignación de <strong>mina</strong> y <strong>labores</strong> se
        gestiona desde el botón de la columna correspondiente.
      </Text>

      <Group justify="flex-end" gap="md" mt="xl">
        <Button
          variant="subtle"
          onClick={close}
          disabled={loading}
          radius="lg"
          size="sm"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
        >
          Cancelar
        </Button>
        <Button
          loading={loading}
          onClick={() => {
            void submit();
          }}
          radius="lg"
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 px-8"
        >
          Guardar Cambios
        </Button>
      </Group>
      </Stack>
    </ModalEstandar>
  );
};
