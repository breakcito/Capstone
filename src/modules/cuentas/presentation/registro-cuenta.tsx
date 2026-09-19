import { useState, useEffect } from "react";
import {
  TextInput,
  Select,
  Button,
  Stack,
  Group,
  PasswordInput,
  Loader,
  ActionIcon,
  Tooltip,
  Modal,
} from "@mantine/core";
import {
  UserIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  KeyIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useRegistroCuenta } from "../hooks/useRegistroCuenta";
import type { RES_Cuenta } from "../service/cuentas.responses";
import type { RES_Empleado } from "../../../service/responses/empleado";
import type { RES_Rol } from "../../../service/responses/rol";
import { api } from "../../../service/_api";
import { useNotify } from "../../../hooks/useNotify";

interface RegistroCuentaProps {
  cuentaEdit: RES_Cuenta | null;
  onClose: () => void;
  onSuccess: (nueva: RES_Cuenta) => void;
  refresh: () => void;
  roles: RES_Rol[];
  empleadosSinCuenta: RES_Empleado[];
  loadingRoles?: boolean;
  loadingEmpleados?: boolean;
}

export const RegistroCuenta = ({
  cuentaEdit,
  onClose,
  onSuccess,
  refresh,
  roles,
  empleadosSinCuenta,
  loadingRoles = false,
  loadingEmpleados = false,
}: RegistroCuentaProps) => {
  const { form, updateForm, loading, handleGuardar, isEdit } =
    useRegistroCuenta(cuentaEdit, onClose, onSuccess, refresh);

  const { notifySuccess, notifyError } = useNotify();
  const [openedNuevoEmp, setOpenedNuevoEmp] = useState(false);
  const [nombreEmp, setNombreEmp] = useState("");
  const [apellidoEmp, setApellidoEmp] = useState("");
  const [dniEmp, setDniEmp] = useState("");
  const [creandoEmp, setCreandoEmp] = useState(false);
  const [listaEmpleados, setListaEmpleados] =
    useState<RES_Empleado[]>(empleadosSinCuenta);

  useEffect(() => {
    setListaEmpleados(empleadosSinCuenta);
  }, [empleadosSinCuenta]);

  const handleCrearEmpleado = async () => {
    if (!nombreEmp.trim() || !apellidoEmp.trim()) {
      notifyError("Nombre y apellido son obligatorios");
      return;
    }
    setCreandoEmp(true);
    try {
      const res = await api.post("/empleados", {
        nombre: nombreEmp.trim(),
        apellido: apellidoEmp.trim(),
        dni: dniEmp.trim() || null,
      });
      if (res.data.success) {
        const nuevoEmp = res.data.data;
        notifySuccess("Empleado registrado exitosamente");
        setListaEmpleados((prev) => [
          ...prev,
          {
            id_empleado: nuevoEmp.id_empleado,
            nombre: nuevoEmp.nombre,
            apellido: nuevoEmp.apellido,
            nombre_completo: `${nuevoEmp.nombre} ${nuevoEmp.apellido}`,
            dni: nuevoEmp.dni,
          } as RES_Empleado,
        ]);
        updateForm({ id_empleado: nuevoEmp.id_empleado });
        setOpenedNuevoEmp(false);
        setNombreEmp("");
        setApellidoEmp("");
        setDniEmp("");
      } else {
        notifyError(res.data.message || "Error al crear empleado");
      }
    } catch {
      notifyError("Error al registrar empleado");
    } finally {
      setCreandoEmp(false);
    }
  };

  const fieldClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
    label: "text-zinc-300 mb-1 font-medium",
  };

  return (
    <Stack gap="md">
      <Group grow align="flex-end">
        <div className="flex gap-2 items-end">
          <Select
            label="Empleado"
            placeholder="Seleccione un empleado"
            data={
              isEdit && cuentaEdit
                ? [
                    {
                      value: cuentaEdit.id_empleado.toString(),
                      label: `${cuentaEdit.nombre_empleado} ${cuentaEdit.apellido_empleado}`,
                    },
                  ]
                : listaEmpleados.map((e: RES_Empleado) => ({
                    value: e.id_empleado.toString(),
                    label: e.nombre_completo,
                  }))
            }
            value={form.id_empleado ? form.id_empleado.toString() : null}
            onChange={(val) => updateForm({ id_empleado: Number(val) })}
            disabled={isEdit || loading || loadingEmpleados}
            rightSection={
              loadingEmpleados ? <Loader size="xs" color="indigo" /> : undefined
            }
            radius="lg"
            required
            withAsterisk
            leftSection={
              <IdentificationIcon className="w-4 h-4 text-zinc-500" />
            }
            classNames={fieldClasses}
            searchable
            className="flex-1"
          />
          {!isEdit && (
            <Tooltip label="Registrar nuevo empleado">
              <ActionIcon
                size="lg"
                radius="lg"
                variant="filled"
                color="indigo"
                onClick={() => setOpenedNuevoEmp(true)}
                className="mb-0.5 shrink-0 bg-indigo-600 hover:bg-indigo-700"
              >
                <PlusIcon className="w-5 h-5 text-white" />
              </ActionIcon>
            </Tooltip>
          )}
        </div>

        <Select
          label="Rol de Usuario"
          placeholder="Seleccione un rol"
          data={roles.map((r: RES_Rol) => ({
            value: r.id_rol.toString(),
            label: r.nombre,
          }))}
          value={form.id_rol ? form.id_rol.toString() : null}
          onChange={(val) => updateForm({ id_rol: Number(val) })}
          radius="lg"
          required
          withAsterisk
          leftSection={<ShieldCheckIcon className="w-4 h-4 text-zinc-500" />}
          classNames={fieldClasses}
          disabled={isEdit || loading || loadingRoles}
          rightSection={loadingRoles ? <Loader size="xs" color="indigo" /> : undefined}
        />
      </Group>

      <Group grow>
        <TextInput
          label="Nombre de Usuario"
          placeholder="Ej: joe"
          value={form.username}
          onChange={(e) => updateForm({ username: e.currentTarget.value })}
          radius="lg"
          required
          withAsterisk
          leftSection={<UserIcon className="w-4 h-4 text-zinc-500" />}
          classNames={fieldClasses}
          disabled={isEdit || loading}
        />

        <PasswordInput
          label={isEdit ? "Nueva Contraseña" : "Contraseña"}
          placeholder={isEdit ? "Nueva contraseña..." : "Mínimo 6 caracteres"}
          value={form.password}
          onChange={(e) => updateForm({ password: e.currentTarget.value })}
          radius="lg"
          required={!isEdit}
          withAsterisk={!isEdit}
          leftSection={<KeyIcon className="w-4 h-4 text-zinc-500" />}
          classNames={{
            ...fieldClasses,
            innerInput: "text-white placeholder:text-zinc-500",
            visibilityToggle:
              "text-zinc-500 hover:text-zinc-300 transition-colors",
          }}
          disabled={loading}
        />
      </Group>

      <Group justify="flex-end" gap="md" mt="xl">
        <Button
          variant="subtle"
          onClick={onClose}
          disabled={loading}
          radius="lg"
          size="sm"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800/50"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleGuardar}
          loading={loading}
          radius="lg"
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 px-8"
        >
          {isEdit ? "Guardar Cambios" : "Registrar Cuenta"}
        </Button>
      </Group>

      {/* Modal para crear nuevo empleado */}
      <Modal
        opened={openedNuevoEmp}
        onClose={() => setOpenedNuevoEmp(false)}
        title="Registrar Nuevo Empleado"
        centered
        radius="lg"
        zIndex={10002}
      >
        <Stack gap="md">
          <TextInput
            label="Nombres"
            placeholder="Ej: Juan Carlos"
            value={nombreEmp}
            onChange={(e) => setNombreEmp(e.currentTarget.value)}
            radius="lg"
            required
            withAsterisk
            classNames={fieldClasses}
          />
          <TextInput
            label="Apellidos"
            placeholder="Ej: Pérez Quispe"
            value={apellidoEmp}
            onChange={(e) => setApellidoEmp(e.currentTarget.value)}
            radius="lg"
            required
            withAsterisk
            classNames={fieldClasses}
          />
          <TextInput
            label="DNI"
            placeholder="8 dígitos"
            maxLength={8}
            value={dniEmp}
            onChange={(e) => setDniEmp(e.currentTarget.value)}
            radius="lg"
            classNames={fieldClasses}
          />
          <Group justify="flex-end" gap="sm" mt="md">
            <Button
              variant="subtle"
              onClick={() => setOpenedNuevoEmp(false)}
              disabled={creandoEmp}
              radius="lg"
              size="sm"
              className="text-zinc-400"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCrearEmpleado}
              loading={creandoEmp}
              radius="lg"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Guardar Empleado
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
};
