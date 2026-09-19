import {
  Button,
  Select,
  TextInput,
  Stack,
  ActionIcon,
  Checkbox,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  InboxStackIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { BotonRecargar } from "../../../../presentation/utils/boton-recargar";

interface LotesFilterProps {
  almacenes: { id_almacen: number; nombre: string }[];
  loadingAlmacenes?: boolean;
  loading?: boolean;
  onReload?: () => void;
  idAlmacen: string | null;
  setIdAlmacen: (val: string | null) => void;
  busqueda: string;
  setBusqueda: (val: string) => void;
  categoriasUnicas: (string | { value: string; label: string })[];
  filtroCategoria: string | null;
  setFiltroCategoria: (val: string | null) => void;
  productosUnicos: (string | { value: string; label: string })[];
  filtroProducto: string | null;
  setFiltroProducto: (val: string | null) => void;
  openCreate: () => void;
  // Acciones masivas
  selectedCount: number;
  onPrintSelected: () => void;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

export const LotesFilter = ({
  almacenes,
  loadingAlmacenes = false,
  loading = false,
  onReload,
  idAlmacen,
  setIdAlmacen,
  busqueda,
  setBusqueda,
  categoriasUnicas,
  filtroCategoria,
  setFiltroCategoria,
  productosUnicos,
  filtroProducto,
  setFiltroProducto,
  openCreate,
  selectedCount,
  onPrintSelected,
  onToggleSelectAll,
  isAllSelected,
  isIndeterminate,
}: LotesFilterProps) => {
  const inputClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
    label: "text-zinc-400 text-xs font-semibold mb-1 ml-1",
    dropdown:
      "bg-zinc-950 border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl",
    option:
      "text-zinc-300 hover:bg-zinc-800 hover:text-white data-[selected]:bg-indigo-600 data-[selected]:text-white font-medium transition-colors",
  };

  return (
    <Stack gap="md">
      {/* Fila Inferior: Filtros de Selección Fluidos */}
      <div className="flex flex-col md:flex-row items-end gap-3 w-full">
        <div className="w-full md:w-64">
          <Select
            label="Almacén de consulta"
            placeholder="Seleccionar..."
            data={almacenes.map((a) => ({
              value: String(a.id_almacen),
              label: a.nombre,
            }))}
            value={idAlmacen}
            onChange={setIdAlmacen}
            searchable
            clearable
            disabled={loadingAlmacenes}
            radius="lg"
            size="sm"
            leftSection={<InboxStackIcon className="size-4 text-zinc-400" />}
            classNames={inputClasses}
            comboboxProps={{
              withinPortal: true,
              zIndex: 9999,
              transitionProps: { transition: "pop", duration: 200 },
            }}
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            label="Categoría"
            placeholder="Todas..."
            data={categoriasUnicas}
            value={filtroCategoria}
            onChange={setFiltroCategoria}
            searchable
            clearable
            disabled={!idAlmacen}
            radius="lg"
            size="sm"
            classNames={inputClasses}
            comboboxProps={{
              withinPortal: true,
              zIndex: 9999,
              transitionProps: { transition: "pop", duration: 200 },
            }}
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            label="Producto"
            placeholder="Todos..."
            data={productosUnicos}
            value={filtroProducto}
            onChange={setFiltroProducto}
            searchable
            clearable
            disabled={!idAlmacen}
            radius="lg"
            size="sm"
            classNames={inputClasses}
            comboboxProps={{
              withinPortal: true,
              zIndex: 9999,
              transitionProps: { transition: "pop", duration: 200 },
            }}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <TextInput
            label="Buscar registro"
            placeholder="Buscar por lote, producto..."
            leftSection={
              <MagnifyingGlassIcon className="w-4 h-4 text-zinc-500" />
            }
            value={busqueda}
            onChange={(e) => setBusqueda(e.currentTarget.value)}
            disabled={!idAlmacen}
            radius="lg"
            size="sm"
            classNames={inputClasses}
          />
        </div>

        <div className="shrink-0">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl h-[38px] flex items-center px-3 gap-3">
            <Checkbox
              size="xs"
              color="indigo"
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={onToggleSelectAll}
              disabled={!idAlmacen}
            />
            
            <div className="w-px h-4 bg-zinc-800" />

            <Tooltip label={selectedCount > 0 ? `Imprimir ${selectedCount} tickets` : "Seleccione lotes para imprimir"}>
              <ActionIcon
                variant={selectedCount > 0 ? "filled" : "light"}
                color={selectedCount > 0 ? "indigo" : "zinc"}
                disabled={selectedCount === 0}
                onClick={onPrintSelected}
                size="sm"
                radius="md"
                className="transition-all active:scale-95"
              >
                <PrinterIcon className="w-4 h-4" />
              </ActionIcon>
            </Tooltip>

            {selectedCount > 0 && (
              <Text size="xs" fw={700} className="text-indigo-400 animate-pulse">
                {selectedCount}
              </Text>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <BotonRecargar onReload={onReload} loading={loading} />
          <Button
            leftSection={<PlusIcon className="w-5 h-5" />}
            onClick={openCreate}
            disabled={!idAlmacen}
            radius="lg"
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white 
            shadow-lg shadow-indigo-900/20 px-6 font-semibold"
          >
            Nuevo Lote
          </Button>
        </div>
      </div>
    </Stack>
  );
};
