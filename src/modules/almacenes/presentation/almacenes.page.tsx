import {
  ActionIcon,
  Badge,
  Button,
  ScrollArea,
  Skeleton,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  BuildingStorefrontIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { useTitlePage } from "../../../hooks/useTitlePage";
import { ModalEstandar } from "../../../presentation/utils/modal-estandar";
import { BotonRecargar } from "../../../presentation/utils/boton-recargar";

import { RegistroAlmacen } from "./registro-almacen";
import { HistorialResponsables } from "./historial-responsables";
import { useAlmacenes } from "../hooks/useAlmacenes";
import type { RES_AlmacenResumen } from "../service/almacenes.responses";

export const AlmacenesPage = () => {
  useTitlePage("Almacenes");

  const {
    loading,
    setAlmacenes,
    handleChildMessage,
    busqueda,
    setBusqueda,
    recargar,
    almacenesFiltrados,
    // Modales y Selección
    openedCreate,
    openCreate,
    closeCreate,
    openedResponsables,
    openResponsables,
    closeResponsables,
    selectedAlmacen,
    setSelectedAlmacen,
    // Registro
    formNombre,
    setFormNombre,
    formIdEmpleadoResponsable,
    setFormIdEmpleadoResponsable,
    formDireccion,
    setFormDireccion,
    formIdDepartamento,
    setFormIdDepartamento,
    formIdProvincia,
    setFormIdProvincia,
    formIdDistrito,
    setFormIdDistrito,
    formError,
    isRegistering,
    handleCrearAlmacen,
    resetForm,
  } = useAlmacenes();

  const handleOpenResponsables = (alm: RES_AlmacenResumen) => {
    setSelectedAlmacen(alm);
    openResponsables();
  };

  const renderAlmacenCard = (alm: RES_AlmacenResumen) => {
    const isActive = alm.estado === "Activo";

    return (
      <div
        key={alm.id_almacen}
        className="group relative flex flex-col bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 gap-3 hover:border-zinc-700/80 hover:bg-zinc-900/50 transition-all duration-200"
      >
        <Badge
          size="xs"
          variant="light"
          color={isActive ? "green" : "red"}
          radius="sm"
          className="absolute top-3 right-3"
        >
          {alm.estado}
        </Badge>

        <div className="pr-14">
          <div className="flex items-center gap-2 mb-1 text-zinc-400">
            <BuildingStorefrontIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
            {alm.nombre}
          </h3>

          {(alm.departamento_nombre ||
            alm.provincia_nombre ||
            alm.distrito_nombre ||
            alm.direccion) && (
            <div className="mt-2 text-[11px] text-zinc-400 flex flex-col gap-0.5">
              <Text component="span" size="xs" className="text-zinc-500">
                Ubicación:
              </Text>
              <Text component="span" size="xs" className="text-zinc-300">
                {[
                  alm.departamento_nombre,
                  alm.provincia_nombre,
                  alm.distrito_nombre,
                ]
                  .filter(Boolean)
                  .join(" / ") || "—"}
              </Text>
              {alm.direccion && (
                <Text component="span" size="xs" className="text-zinc-500">
                  {alm.direccion}
                </Text>
              )}
            </div>
          )}
        </div>

        {/* Responsables */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-800/40 border border-zinc-800/60">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
              alm.responsables
                ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                : "bg-zinc-800/50 text-zinc-600 border-zinc-700/50"
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider block mb-1">
              Responsables
            </span>
            {alm.responsables ? (
              <ScrollArea
                w="100%"
                type="never"
                scrollbarSize={0}
                offsetScrollbars={false}
              >
                <div className="flex items-center gap-1.5 pb-0.5">
                  {alm.responsables
                    ?.split(", ")
                    .map((resp: string, idx: number) => (
                      <Badge
                        key={idx}
                        variant="filled"
                        color="indigo.9"
                        size="xs"
                        radius="sm"
                        className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 lowercase first-letter:uppercase shrink-0"
                      >
                        {resp}
                      </Badge>
                    ))}
                </div>
              </ScrollArea>
            ) : (
              <span className="text-xs font-semibold text-zinc-600 italic block">
                Sin asignar
              </span>
            )}
          </div>
        </div>

        {/* Footer: acciones */}
        <div className="flex items-center justify-end pt-1 border-t border-zinc-800/50">
          <Tooltip label="Gestionar Responsables">
            <ActionIcon
              variant="filled"
              color="violet"
              size="sm"
              radius="md"
              onClick={() => handleOpenResponsables(alm)}
            >
              <UserIcon className="w-4 h-4" />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
    );
  };

  const renderGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton height={14} width="30%" radius="sm" />
                  <Skeleton height={18} width="70%" radius="sm" />
                  <Skeleton height={12} width="50%" radius="sm" />
                </div>
                <Skeleton height={16} width={45} radius="sm" />
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-800/40 border border-zinc-800/60">
                <Skeleton height={28} width={28} circle />
                <div className="space-y-1 flex-1">
                  <Skeleton height={8} width={60} radius="xs" />
                  <Skeleton height={12} width={100} radius="xs" />
                </div>
              </div>
              <div className="flex items-center justify-end pt-1 border-t border-zinc-800/50">
                <Skeleton height={26} width={26} radius="md" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (almacenesFiltrados.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800 mt-8">
          <BuildingStorefrontIcon className="w-10 h-10 text-zinc-700 mb-3" />
          <p className="text-zinc-500 text-sm font-medium">
            No se encontraron almacenes registrados
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {almacenesFiltrados.map(renderAlmacenCard)}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
        <TextInput
          label="Buscar Almacén"
          placeholder="Buscar almacén por nombre o responsable..."
          leftSection={
            <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400" />
          }
          value={busqueda}
          onChange={(e) => setBusqueda(e.currentTarget.value)}
          className="flex-1 min-w-64"
          radius="lg"
          size="sm"
          classNames={{
            label: "text-zinc-400 text-xs font-semibold mb-1 ml-1",
            input:
              "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
          }}
        />

        <div className="flex gap-2 items-center shrink-0 mb-px">
          <BotonRecargar onReload={recargar} loading={loading} />
          <Button
            leftSection={<PlusIcon className="w-5 h-5" />}
            onClick={openCreate}
            radius="lg"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 shrink-0 px-6 font-semibold"
          >
            Nuevo Almacén
          </Button>
        </div>
      </div>

      {renderGrid()}

      {/* Modal: Crear Almacén */}
      <ModalEstandar
        opened={openedCreate}
        close={closeCreate}
        title="Nuevo Almacén"
        size="lg"
      >
        <RegistroAlmacen
          nombre={formNombre}
          setNombre={setFormNombre}
          id_empleado_responsable={formIdEmpleadoResponsable}
          setIdEmpleadoResponsable={setFormIdEmpleadoResponsable}
          id_departamento={formIdDepartamento}
          setIdDepartamento={setFormIdDepartamento}
          id_provincia={formIdProvincia}
          setIdProvincia={setFormIdProvincia}
          id_distrito={formIdDistrito}
          setIdDistrito={setFormIdDistrito}
          direccion={formDireccion}
          setDireccion={setFormDireccion}
          formError={formError}
          loading={isRegistering}
          onSubmit={handleCrearAlmacen}
          onCancel={() => {
            closeCreate();
            resetForm();
          }}
        />
      </ModalEstandar>

      {/* Modal: Gestión de Responsables */}
      <ModalEstandar
        opened={openedResponsables}
        close={closeResponsables}
        title="Gestión de Responsables"
      >
        {selectedAlmacen && (
          <HistorialResponsables
            almacen={selectedAlmacen}
            onMessage={handleChildMessage}
            onUpdateResponsable={(nombre) =>
              setAlmacenes((prev) =>
                prev.map((alm) =>
                  alm.id_almacen === selectedAlmacen.id_almacen
                    ? {
                        ...alm,
                        responsables: alm.responsables
                          ? `${nombre}, ${alm.responsables}`
                          : nombre,
                      }
                    : alm,
                ),
              )
            }
          />
        )}
      </ModalEstandar>
    </div>
  );
};

export default AlmacenesPage;
