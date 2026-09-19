import { useState, useMemo } from "react";
import {
  Button,
  Group,
  TextInput,
  Text,
  Badge,
  Stack,
  ThemeIcon,
  ActionIcon,
  Tooltip,
  Menu,
} from "@mantine/core";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  CubeIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { type DataTableColumn } from "mantine-datatable";
import { useDisclosure } from "@mantine/hooks";
import { useTitlePage } from "../../../hooks/useTitlePage";
import { DataTableEstandar } from "../../../presentation/utils/datatable-estandar";
import { ModalEstandar } from "../../../presentation/utils/modal-estandar";
import { useProductos } from "../hooks/useProductos";
import { RegistroProducto } from "./registro-producto";
import { parseCambiosLog } from "../../../presentation/utils/parse-cambios-log";
import type { RES_ProductoResumen } from "../service/productos.responses";
import { formatNumber } from "../../../shared/functions/formatNumber";
import { BotonRecargar } from "../../../presentation/utils/boton-recargar";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface CambioProductoGlobal {
  id: string;
  id_producto: number;
  producto: string;
  fecha: string;
  id_empleado: number | null;
  nombre_empleado: string;
  campo: string;
  valor_anterior: unknown;
  valor_nuevo: unknown;
}

const formatValorCambio = (v: unknown): string => {
  if (v === null || v === undefined) return "—";
  if (typeof v === "boolean") return v ? "Sí" : "No";
  return String(v);
};

export const ProductosPage = () => {
  useTitlePage("Catálogo de Productos");

  const {
    productos,
    loading,
    busqueda,
    setBusqueda,
    recargar,
    pushNuevoProducto,
    actualizarProducto,
    eliminarProducto,
    eliminandoId,
  } = useProductos();

  const [openedRegistro, { open: openRegistro, close: closeRegistro }] =
    useDisclosure(false);
  const [openedEdicion, { open: openEdicion, close: closeEdicion }] =
    useDisclosure(false);
  const [productoEnEdicion, setProductoEnEdicion] =
    useState<RES_ProductoResumen | null>(null);

  const [openedCambios, { open: openCambios, close: closeCambios }] =
    useDisclosure(false);

  const cambiosGlobal = useMemo<CambioProductoGlobal[]>(() => {
    const lista: CambioProductoGlobal[] = [];
    productos.forEach((p) => {
      const logs = parseCambiosLog(p.cambios_log);
      logs.forEach((log) => {
        const nombreEmpleado = log.nombre_empleado?.trim() || "—";
        log.cambios.forEach((cambio) => {
          lista.push({
            id: `${p.id_producto}-${log.update_at}-${cambio.campo_bd ?? cambio.campo ?? Math.random()}`,
            id_producto: p.id_producto,
            producto: p.nombre,
            fecha: log.update_at,
            id_empleado: log.id_empleado ?? null,
            nombre_empleado: nombreEmpleado,
            campo: cambio.campo ?? cambio.campo_bd ?? "—",
            valor_anterior: cambio.valor_anterior,
            valor_nuevo: cambio.valor_nuevo,
          });
        });
      });
    });
    // Más recientes primero
    lista.sort((a, b) => dayjs(b.fecha).valueOf() - dayjs(a.fecha).valueOf());
    return lista;
  }, [productos]);

  const handleOpenEdit = (r: RES_ProductoResumen) => {
    setProductoEnEdicion(r);
    openEdicion();
  };

  const handleCloseEdicion = () => {
    setProductoEnEdicion(null);
    closeEdicion();
  };

  const handleDelete = (r: RES_ProductoResumen) => {
    void eliminarProducto(r.id_producto);
  };

  const columns: DataTableColumn<RES_ProductoResumen>[] = [
    {
      accessor: "index",
      title: "#",
      textAlign: "center",
      width: 50,
    },
    {
      accessor: "producto",
      title: "Producto",
      render: (r) => (
        <Group gap="sm">
          <ThemeIcon variant="light" color="indigo" radius="md" size="lg">
            <CubeIcon className="w-5 h-5" />
          </ThemeIcon>
          <Text size="sm" fw={500} className="text-zinc-200">
            {r.nombre}
          </Text>
        </Group>
      ),
    },
    {
      accessor: "tipo_producto",
      title: "Tipo de Producto",
      render: (r) => (
        <Badge color="violet" variant="light" size="sm" radius="sm">
          {r.tipo_producto || "Otros"}
        </Badge>
      ),
    },
    {
      accessor: "unidad_medida_base",
      title: "Unidad de Medida",
      render: (r) => (
        <Badge
          size="sm"
          variant="outline"
          color="cyan"
          className="font-medium"
        >
          {r.unidad_medida_base} ({r.unidad_medida_base_abreviatura})
        </Badge>
      ),
    },
    {
      accessor: "stock_minimo_base",
      title: "Stock Mín.",
      textAlign: "center",
      render: (r) => (
        <div className="flex flex-row gap-2 justify-center items-center">
          <Text size="sm" fw={500} className="text-zinc-300">
            {formatNumber(r.stock_minimo_base)}
          </Text>
        </div>
      ),
    },
    {
      accessor: "vencimiento",
      title: "Plazo Alerta Venc.",
      render: (r) => {
        if (!r.es_perecible) {
          return (
            <Text size="sm" className="text-zinc-500 italic">
              No aplica
            </Text>
          );
        }

        if (r.es_perecible && !r.dias_espera_vencimiento) {
          return (
            <Text size="sm" className="text-zinc-500 italic">
              No especificado
            </Text>
          );
        }

        return (
          <Text size="sm" className="text-zinc-300">
            {r.dias_espera_vencimiento} días
          </Text>
        );
      },
    },
    {
      accessor: "estado",
      title: "Estado",
      width: 100,
      render: (r) => (
        <Badge
          color={r.estado === "Activo" ? "green" : "gray"}
          variant="light"
          size="sm"
        >
          {r.estado}
        </Badge>
      ),
    },
    {
      accessor: "actions",
      title: "",
      width: 70,
      textAlign: "right",
      render: (r) => {
        const estaEliminando = eliminandoId === r.id_producto;
        return (
          <Menu shadow="md" width={170} position="bottom-end" withArrow>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                loading={estaEliminando}
                aria-label="Abrir acciones del producto"
              >
                <EllipsisVerticalIcon className="w-5 h-5" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown className="bg-zinc-900 border-zinc-800">
              <Menu.Label className="text-zinc-500">Acciones</Menu.Label>
              <Menu.Item
                leftSection={<PencilSquareIcon className="w-4 h-4" />}
                onClick={() => handleOpenEdit(r)}
                className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Editar
              </Menu.Item>
              <Menu.Item
                leftSection={<TrashIcon className="w-4 h-4" />}
                color="red"
                onClick={() => handleDelete(r)}
                className="hover:bg-red-900/20"
              >
                Eliminar
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        );
      },
    },
  ];

  const cambiosColumns: DataTableColumn<CambioProductoGlobal>[] = [
    {
      accessor: "index",
      title: "#",
      textAlign: "center",
      width: 50,
    },
    {
      accessor: "producto",
      title: "Producto",
      width: 220,
      render: (r) => (
        <Text size="sm" className="text-zinc-200 font-medium">
          {r.producto}
        </Text>
      ),
    },
    {
      accessor: "campo",
      title: "Campo",
      width: 180,
      render: (r) => (
        <Badge color="indigo" variant="light" size="sm" radius="sm">
          {r.campo}
        </Badge>
      ),
    },
    {
      accessor: "valor_anterior",
      title: "Valor Anterior",
      width: 160,
      render: (r) => (
        <Text size="xs" className="text-zinc-400 line-through">
          {formatValorCambio(r.valor_anterior)}
        </Text>
      ),
    },
    {
      accessor: "valor_nuevo",
      title: "Valor Nuevo",
      width: 160,
      render: (r) => (
        <Text size="xs" className="text-emerald-300 font-semibold">
          {formatValorCambio(r.valor_nuevo)}
        </Text>
      ),
    },
    {
      accessor: "nombre_empleado",
      title: "Modificado por",
      width: 200,
      render: (r) => (
        <Text size="xs" className="text-zinc-300">
          {r.nombre_empleado}
        </Text>
      ),
    },
    {
      accessor: "fecha",
      title: "Fecha",
      width: 170,
      render: (r) => (
        <Text size="xs" className="text-zinc-400">
          {dayjs(r.fecha).format("DD MMM YYYY, HH:mm:ss")}
        </Text>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Stack gap="lg">
        <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
          <div className="flex-1 gap-4 w-full">
            <TextInput
              label="Buscar Producto"
              placeholder="Buscar por nombre o categoría..."
              leftSection={
                <MagnifyingGlassIcon className="w-4 h-4 text-zinc-400" />
              }
              value={busqueda}
              onChange={(e) => setBusqueda(e.currentTarget.value)}
              className="flex-1 min-w-64"
              radius="lg"
              size="sm"
              classNames={{
                input:
                  "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500",
                label: "text-zinc-400 text-xs font-semibold mb-1 ml-1",
              }}
            />
          </div>
          <div className="flex gap-2 items-center shrink-0">
            <BotonRecargar onReload={recargar} loading={loading} />
            <Tooltip
              label="Ver historial de cambios"
              position="bottom"
              withArrow
            >
              <ActionIcon
                variant="default"
                color="zinc.4"
                radius="lg"
                size={36}
                onClick={openCambios}
                className="border border-zinc-700/50"
                aria-label="Ver historial de cambios"
              >
                <EyeIcon className="w-4 h-4" />
              </ActionIcon>
            </Tooltip>
            <Button
              leftSection={<PlusIcon className="w-5 h-5" />}
              onClick={openRegistro}
              radius="lg"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 shrink-0 px-6 font-semibold h-9.5"
            >
              Nuevo Producto
            </Button>
          </div>
        </div>

        <DataTableEstandar
          idAccessor="id_producto"
          columns={columns}
          records={productos}
          loading={loading}
        />
      </Stack>

      <ModalEstandar
        opened={openedRegistro}
        close={closeRegistro}
        title="Registrar Producto"
        size="36rem"
      >
        <RegistroProducto
          productosExistentes={productos}
          onSuccess={(nuevo) => {
            pushNuevoProducto(nuevo);
            closeRegistro();
          }}
          onCancel={closeRegistro}
        />
      </ModalEstandar>

      <ModalEstandar
        opened={openedEdicion}
        close={handleCloseEdicion}
        title={
          productoEnEdicion
            ? `Editar: ${productoEnEdicion.nombre}`
            : "Editar Producto"
        }
        size="36rem"
      >
        {productoEnEdicion && (
          <RegistroProducto
            productosExistentes={productos}
            productoEdicion={productoEnEdicion}
            onSuccess={() => {
              // En modo edición no se invoca este callback, pero se exige por tipado
            }}
            onEditSuccess={(editado) => {
              actualizarProducto(editado);
              handleCloseEdicion();
            }}
            onCancel={handleCloseEdicion}
          />
        )}
      </ModalEstandar>

      <ModalEstandar
        opened={openedCambios}
        close={closeCambios}
        title="Historial de Cambios de Productos"
        size="min(1250px, 95vw)"
      >
        {cambiosGlobal.length === 0 ? (
          <Stack align="center" gap="md" py={60}>
            <EyeIcon className="w-10 h-10 text-zinc-700" />
            <Text
              size="sm"
              fw={700}
              className="text-zinc-400 uppercase tracking-widest"
            >
              Sin cambios registrados
            </Text>
            <Text size="xs" c="dimmed">
              Aún no se han registrado modificaciones en los productos.
            </Text>
          </Stack>
        ) : (
          <div className="mt-2">
            <DataTableEstandar
              idAccessor="id"
              columns={cambiosColumns}
              records={cambiosGlobal}
              loading={false}
            />
          </div>
        )}
      </ModalEstandar>
    </div>
  );
};

export default ProductosPage;
