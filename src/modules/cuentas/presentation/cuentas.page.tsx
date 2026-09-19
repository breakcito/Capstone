import {
  ActionIcon,
  Badge,
  Button,
  Group,
  TextInput,
  Tooltip,
  Avatar,
  Text,
  Stack,
  Skeleton,
  Loader,
  FileButton,
  SegmentedControl,
} from "@mantine/core";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UserIcon,
  KeyIcon,
  PencilSquareIcon,
  Squares2X2Icon,
  CameraIcon,
  IdentificationIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { useTitlePage } from "../../../hooks/useTitlePage";
import { useCuentas, type FiltroCuenta } from "../hooks/useCuentas";
import { BotonRecargar } from "../../../presentation/utils/boton-recargar";
import { ModalCrearCuenta } from "./components/modal-crear-cuenta";
import { ModalEditarCuenta } from "./components/modal-editar-cuenta";
import { ModalCrearEmpleado } from "./components/modal-crear-empleado";

export const CuentasPage = () => {
  useTitlePage("Usuarios");

  const {
    empleados,
    roles,
    loading,
    busqueda,
    setBusqueda,
    filtroCuenta,
    setFiltroCuenta,
    totalEmpleados,
    totalConCuenta,
    totalSinCuenta,
    updatingPhoto,
    handleUpdatePhoto,
    // Crear cuenta
    empleadoParaCuenta,
    abrirCrearCuenta,
    cerrarCrearCuenta,
    handleCrearCuenta,
    loadingCrearCuenta,
    // Editar cuenta
    empleadoParaEditar,
    abrirEditarCuenta,
    cerrarEditarCuenta,
    handleEditarCuenta,
    loadingEditarCuenta,
    // Crear empleado
    openedCrearEmpleado,
    abrirCrearEmpleado,
    cerrarCrearEmpleado,
    handleCrearEmpleado,
    loadingCrearEmpleado,
    // Refresco
    refresh,
  } = useCuentas();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header con filtros y acciones */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
          <TextInput
            label="Buscar Personal"
            placeholder="Buscar por nombre, apellido, DNI, usuario o rol..."
            leftSection={
              <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400" />
            }
            value={busqueda}
            onChange={(e) => setBusqueda(e.currentTarget.value)}
            className="flex-1 min-w-64 w-full sm:w-auto"
            radius="lg"
            size="sm"
            classNames={{
              label: "text-zinc-400 text-xs font-semibold mb-1 ml-1",
              input:
                "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
            }}
          />
          <div className="flex gap-2 items-center shrink-0 w-full sm:w-auto justify-end">
            <BotonRecargar onReload={refresh} loading={loading} />
            <Button
              leftSection={<PlusIcon className="w-5 h-5" />}
              onClick={abrirCrearEmpleado}
              radius="lg"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 shrink-0 px-5 font-semibold"
            >
              Nuevo Empleado
            </Button>
          </div>
        </div>

        {/* Barra de Filtros por Estado de Cuenta */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <SegmentedControl
            value={filtroCuenta}
            onChange={(value) => setFiltroCuenta(value as FiltroCuenta)}
            data={[
              { label: `Todos (${totalEmpleados})`, value: "todos" },
              { label: `Con Cuenta (${totalConCuenta})`, value: "con_cuenta" },
              { label: `Sin Cuenta (${totalSinCuenta})`, value: "sin_cuenta" },
            ]}
            radius="lg"
            size="xs"
            color="indigo"
            classNames={{
              root: "bg-zinc-900/70 border border-zinc-800/80 p-0.5",
              label: "text-zinc-400 font-medium px-3 py-1",
              indicator: "bg-indigo-600 shadow-md",
            }}
          />

          <Text size="xs" c="dimmed">
            Mostrando <span className="text-white font-semibold">{empleados.length}</span> trabajadores
          </Text>
        </div>
      </div>

      {/* Grid de Cards de Empleados */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-5 gap-4"
            >
              <div className="flex justify-between items-center">
                <Skeleton height={16} width={90} radius="sm" />
                <Skeleton height={16} width={60} radius="md" />
              </div>

              <div className="flex items-center gap-4">
                <Skeleton height={56} width={56} circle />
                <div className="space-y-2 flex-1">
                  <Skeleton height={16} width="80%" radius="sm" />
                  <Skeleton height={14} width="40%" radius="sm" />
                </div>
              </div>

              <div className="bg-zinc-950/40 rounded-2xl p-4 border border-zinc-800/40 space-y-2">
                <Skeleton height={12} width="50%" radius="xs" />
                <Skeleton height={28} width="100%" radius="md" />
              </div>
            </div>
          ))}
        </div>
      ) : empleados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800">
          <Squares2X2Icon className="w-10 h-10 text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-sm font-medium">
            No se encontró personal con los filtros seleccionados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {empleados.map((emp) => {
            const tieneCuenta = emp.id_usuario !== null && emp.id_usuario !== undefined;
            const esActivo = emp.estado === "Activo";

            return (
              <div
                key={emp.id_empleado}
                className="group flex flex-col bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-5 gap-4 hover:border-indigo-500/30 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative Gradient */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/5 blur-3xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

                {/* Fila 1: Badges Superiores (Tipo de Personal y Estado) */}
                <div className="flex items-center justify-between">
                  <Badge
                    size="xs"
                    variant={emp.es_contratista ? "filled" : "light"}
                    color={emp.es_contratista ? "orange" : "blue"}
                    radius="sm"
                    className="font-bold border-none"
                  >
                    {emp.es_contratista ? "Contratista" : "Personal de Planta"}
                  </Badge>

                  <Badge
                    color={esActivo ? "teal" : "gray"}
                    variant="light"
                    radius="md"
                    size="sm"
                  >
                    {emp.estado}
                  </Badge>
                </div>

                {/* Fila 2: Avatar del Empleado y Datos Personales */}
                <div className="flex items-center gap-4">
                  <div className="relative group/avatar">
                    <FileButton
                      onChange={(file) =>
                        file && handleUpdatePhoto(emp.id_empleado, file)
                      }
                      accept="image/png,image/jpeg,image/jpg"
                      disabled={updatingPhoto === emp.id_empleado}
                    >
                      {(props) => (
                        <div
                          {...props}
                          className={`relative cursor-pointer rounded-full transition-transform active:scale-95 ${
                            updatingPhoto === emp.id_empleado
                              ? "pointer-events-none"
                              : ""
                          }`}
                        >
                          <Avatar
                            src={emp.url_foto}
                            size={56}
                            radius="xl"
                            className="border-2 border-zinc-800 group-hover/avatar:border-indigo-500/50 transition-all shadow-xl"
                            imageProps={{ style: { objectFit: "cover" } }}
                          >
                            <UserIcon className="w-6 h-6 text-zinc-600" />
                          </Avatar>

                          {/* Overlay de Carga o Cámara */}
                          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                            {updatingPhoto === emp.id_empleado ? (
                              <Loader size="xs" color="indigo" />
                            ) : (
                              <CameraIcon className="w-5 h-5 text-white" />
                            )}
                          </div>

                          {updatingPhoto === emp.id_empleado && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 z-10">
                              <Loader size="xs" color="indigo" />
                            </div>
                          )}
                        </div>
                      )}
                    </FileButton>
                  </div>

                  <Stack gap={2} className="flex-1 min-w-0">
                    <Text
                      size="sm"
                      fw={800}
                      className="text-white line-clamp-1 group-hover:text-indigo-200 transition-colors"
                    >
                      {emp.apellido}, {emp.nombre}
                    </Text>
                    <Group gap="xs" wrap="nowrap">
                      <IdentificationIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      <Text size="xs" c="dimmed" fw={600} className="truncate">
                        {emp.dni ? `DNI ${emp.dni}` : "Sin DNI"}
                      </Text>
                    </Group>
                  </Stack>
                </div>

                {/* Fila 3: Información de Cuenta de Usuario */}
                {tieneCuenta ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                      <Text
                        size="10px"
                        fw={800}
                        color="dimmed"
                        className="uppercase tracking-widest italic"
                      >
                        Cuenta de Acceso
                      </Text>
                      <Badge
                        size="xs"
                        variant="filled"
                        color={emp.nombre_rol === "Administrador" ? "grape" : "indigo"}
                        radius="sm"
                        className="text-white font-bold border-none"
                      >
                        {emp.nombre_rol}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Box Usuario */}
                      <div className="bg-zinc-950/50 rounded-2xl p-2.5 border border-zinc-800/50">
                        <Text size="9px" fw={700} c="dimmed" className="uppercase">
                          Usuario
                        </Text>
                        <Group gap={6} mt={2}>
                          <UserIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <Text size="xs" fw={700} className="text-white truncate">
                            {emp.username}
                          </Text>
                        </Group>
                      </div>

                      {/* Box Contraseña y Acción */}
                      <div className="bg-zinc-950/50 rounded-2xl p-2.5 border border-zinc-800/50 flex items-center justify-between">
                        <div>
                          <Text size="9px" fw={700} c="dimmed" className="uppercase">
                            Contraseña
                          </Text>
                          <Group gap={6} mt={2}>
                            <KeyIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <Text size="xs" fw={700} className="text-zinc-300 italic">
                              ••••••••
                            </Text>
                          </Group>
                        </div>
                        <Tooltip label="Cambiar Contraseña / Rol" withArrow position="top">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            color="zinc"
                            onClick={() => abrirEditarCuenta(emp)}
                            className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </ActionIcon>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-950/40 rounded-2xl p-3 border border-dashed border-zinc-800/80 flex flex-col gap-2.5 items-center justify-center text-center">
                    <Text size="xs" c="dimmed" fw={500}>
                      Este empleado no tiene cuenta de acceso
                    </Text>
                    <Button
                      size="xs"
                      radius="lg"
                      variant="light"
                      color="indigo"
                      leftSection={<UserPlusIcon className="w-4 h-4" />}
                      onClick={() => abrirCrearCuenta(emp)}
                      className="w-full font-semibold bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-300 border border-indigo-500/20"
                    >
                      Registrar Cuenta
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear Cuenta para Empleado */}
      <ModalCrearCuenta
        empleado={empleadoParaCuenta}
        opened={!!empleadoParaCuenta}
        onClose={cerrarCrearCuenta}
        onGuardar={handleCrearCuenta}
        loading={loadingCrearCuenta}
        roles={roles}
      />

      {/* Modal Editar Cuenta / Cambiar Contraseña */}
      <ModalEditarCuenta
        empleado={empleadoParaEditar}
        opened={!!empleadoParaEditar}
        onClose={cerrarEditarCuenta}
        onGuardar={handleEditarCuenta}
        loading={loadingEditarCuenta}
        roles={roles}
      />

      {/* Modal Registrar Nuevo Empleado */}
      <ModalCrearEmpleado
        opened={openedCrearEmpleado}
        onClose={cerrarCrearEmpleado}
        onGuardar={handleCrearEmpleado}
        loading={loadingCrearEmpleado}
      />
    </div>
  );
};
