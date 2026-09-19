import {
  Stack,
  Group,
  TextInput,
  Select,
  MultiSelect,
  Button,
  Avatar,
  FileButton,
  Text,
  Switch,
} from "@mantine/core";
import {
  UserIcon,
  IdentificationIcon,
  MapPinIcon,
  PencilIcon,
  WrenchScrewdriverIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { useRegistroContratista } from "../hooks/useRegistroContratista";
import type { RES_ContratistaResumen } from "../service/empleados.responses";
import { CustomDatePicker } from "../../../presentation/utils/date-picker-input";
import { Genero } from "../../../shared/enums/_generic/genero";
import dayjs from "dayjs";

interface RegistroContratistaProps {
  idMinaDefault?: number | null;
  onSuccess: (nuevo: RES_ContratistaResumen) => void;
  onCancel: () => void;
}

const GENERO_OPTIONS = [
  { value: Genero.Femenino, label: "Femenino" },
  { value: Genero.Masculino, label: "Masculino" },
];

export const RegistroContratista = ({
  idMinaDefault,
  onSuccess,
  onCancel,
}: RegistroContratistaProps) => {
  const {
    form,
    setField,
    setConContrato,
    minas,
    labores,
    loading,
    loadingMinas,
    loadingLabores,
    handleSubmit,
  } = useRegistroContratista(onSuccess, idMinaDefault);

  const fieldClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
    label: "text-zinc-300 mb-1 font-medium",
  };

  const photoPreview =
    form.foto instanceof File ? URL.createObjectURL(form.foto) : null;

  return (
    <Stack gap="md">
      {/* Selector de Foto Circular */}
      <div className="flex flex-col items-center justify-center py-2">
        <FileButton
          onChange={(file) => setField("foto", file)}
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
                  {form.foto ? "Cambiar imagen" : "Subir imagen"}
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
          value={form.dni || ""}
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
          onChange={(val: Date | null) =>
            setField(
              "fecha_nacimiento",
              val ? dayjs(val).format("YYYY-MM-DD") : null
            )
          }
          size="xs"
          disabled={loading}
          popoverProps={{
            withinPortal: true,
            zIndex: 10005,
          }}
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
          comboboxProps={{ withinPortal: true, zIndex: 10005 }}
        />
      </Group>

      {/* Dirección completa */}
      <TextInput
        label="Dirección"
        placeholder="Ej. Av. Principal 123, Lima"
        value={form.direccion || ""}
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
          value={form.telefono || ""}
          onChange={(e) =>
            setField("telefono", e.currentTarget.value.replace(/[^\d+\s]/g, ""))
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
          value={form.email || ""}
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

      {/* Mina y Labores */}
      <Select
        label="Mina"
        placeholder={loadingMinas ? "Cargando minas..." : "Seleccione mina"}
        data={minas.map((m) => ({
          value: m.id_mina.toString(),
          label: m.nombre,
        }))}
        value={
          form.id_mina === 0 || !form.id_mina ? null : form.id_mina.toString()
        }
        onChange={(val) => setField("id_mina", val ? Number(val) : 0)}
        leftSection={<MapPinIcon className="w-4 h-4 text-zinc-500" />}
        classNames={fieldClasses}
        radius="lg"
        size="xs"
        searchable
        required
        withAsterisk
        disabled={loadingMinas || loading}
        comboboxProps={{ withinPortal: true, zIndex: 10005 }}
      />

      <MultiSelect
        label="Asignar Labores (Opcional)"
        placeholder={
          !form.id_mina || form.id_mina === 0
            ? "Primero seleccione mina"
            : loadingLabores
              ? "Cargando labores..."
              : "Seleccione una o más labores"
        }
        data={labores.map((l) => ({
          value: l.id_labor.toString(),
          label: l.nombre,
        }))}
        value={form.ids_labor?.map((id) => id.toString()) || []}
        onChange={(vals) => setField("ids_labor", vals.map(Number))}
        leftSection={
          <WrenchScrewdriverIcon className="w-4 h-4 text-zinc-500" />
        }
        classNames={{
          ...fieldClasses,
          pill: "bg-purple-600 text-white",
        }}
        radius="lg"
        size="xs"
        searchable
        clearable
        hidePickedOptions
        disabled={
          !form.id_mina || form.id_mina === 0 || loadingLabores || loading
        }
        comboboxProps={{ withinPortal: true, zIndex: 10005 }}
      />

      {/* Switch: ¿Tiene contrato? */}
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-all ${
          form.con_contrato
            ? "bg-teal-500/10 border-teal-500/40"
            : "bg-zinc-900/50 border-zinc-800"
        }`}
      >
        <div className="flex flex-col">
          <Text
            size="sm"
            fw={700}
            className="text-zinc-200 flex items-center gap-2"
          >
            <DocumentTextIcon className="w-4 h-4 text-teal-400" />
            ¿Tiene contrato?
          </Text>
          <Text size="11px" c="dimmed" className="leading-snug">
            {form.con_contrato
              ? "Se habilitará la opción para asignarle contrato."
              : "Si no aplica por ahora, se registrará como sin contrato."}
          </Text>
        </div>
        <Switch
          checked={form.con_contrato === true}
          onChange={(e) => setConContrato(e.currentTarget.checked)}
          color="teal"
          size="md"
          disabled={loading}
        />
      </div>

      {/* Acciones */}
      <Group justify="flex-end" gap="md" mt="xl">
        <Button
          variant="subtle"
          onClick={onCancel}
          disabled={loading}
          radius="lg"
          size="sm"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
        >
          Cancelar
        </Button>
        <Button
          loading={loading}
          onClick={handleSubmit}
          radius="lg"
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 px-8"
        >
          Guardar
        </Button>
      </Group>
    </Stack>
  );
};
