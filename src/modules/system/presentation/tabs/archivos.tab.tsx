import { useState } from "react";
import { Button, Chip, Group, ActionIcon, TextInput } from "@mantine/core";
import {
  ArrowDownTrayIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { DataTableEstandar } from "../../../../presentation/utils/datatable-estandar";
import { ModalEstandar } from "../../../../presentation/utils/modal-estandar";
import { useArchivosSystem } from "../../hooks/useArchivosSystem";
import type { RES_Archivo } from "../../service/archivos.responses";

const CARPETAS = [
  { value: "contratos_concesion", label: "Contratos Concesión" },
  { value: "documentos-empresas", label: "Documentos Empresas" },
  { value: "logos-empresas", label: "Logos Empresas" },
  { value: "ordenes-compra-comprobantes", label: "OC Comprobantes" },
  { value: "ordenes-compra-recepciones", label: "OC Recepciones" },
  { value: "reabastecimiento_entregas", label: "Reabastecimiento" },
  { value: "requerimientos_almacen", label: "Requerimientos Almacén" },
];

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const ArchivosTab = () => {
  const { items, loading, cargar, descargar, renombrar, eliminar } =
    useArchivosSystem();
  const [carpeta, setCarpeta] = useState<string>("");
  const [renameTarget, setRenameTarget] = useState<{ old: string; nuevo: string } | null>(null);
  const [savingRename, setSavingRename] = useState(false);

  const handleSelectCarpeta = (val: string) => {
    setCarpeta(val);
    cargar(val);
  };

  const handleDownload = async (item: RES_Archivo) => {
    if (!carpeta) return;
    await descargar(carpeta, item.nombre);
  };

  const handleDelete = async (item: RES_Archivo) => {
    if (!carpeta) return;
    if (!confirm(`¿Eliminar "${item.nombre}"?`)) return;
    await eliminar(carpeta, item.nombre);
  };

  const handleRename = async () => {
    if (!renameTarget || !carpeta) return;
    setSavingRename(true);
    try {
      const r = await renombrar(carpeta, renameTarget.old, renameTarget.nuevo);
      if (r.success) setRenameTarget(null);
    } finally {
      setSavingRename(false);
    }
  };

  const fieldClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder:text-zinc-500",
    label: "text-zinc-300 mb-1 font-medium text-xs",
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Archivos del Storage</h2>
        <p className="text-xs text-zinc-500">
          Gestiona los archivos del storage público. Selecciona una carpeta para listar.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CARPETAS.map((c) => (
          <Chip
            key={c.value}
            checked={carpeta === c.value}
            onChange={() => handleSelectCarpeta(c.value)}
            color="indigo"
            variant="light"
            radius="md"
          >
            {c.label}
          </Chip>
        ))}
      </div>

      {carpeta && (
        <DataTableEstandar
          records={items}
          loading={loading}
          columns={[
            { accessor: "nombre", title: "Nombre", sortable: true },
            {
              accessor: "tamano",
              title: "Tamaño",
              render: (item: RES_Archivo) => formatBytes(item.tamano_bytes),
            },
            {
              accessor: "fecha",
              title: "Modificado",
              render: (item: RES_Archivo) =>
                new Date(item.fecha_modificacion).toLocaleString("es-PE"),
            },
            {
              accessor: "actions",
              title: "Acciones",
              render: (item: RES_Archivo) => (
                <Group gap={4}>
                  <ActionIcon variant="subtle" color="indigo" onClick={() => handleDownload(item)}>
                    <ArrowDownTrayIcon className="w-4 h-4" />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="indigo" onClick={() => setRenameTarget({ old: item.nombre, nuevo: item.nombre })}>
                    <PencilSquareIcon className="w-4 h-4" />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(item)}>
                    <TrashIcon className="w-4 h-4" />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
        />
      )}

      <ModalEstandar
        opened={renameTarget !== null}
        close={() => setRenameTarget(null)}
        title="Renombrar archivo"
        size="sm"
      >
        {renameTarget && (
          <div className="space-y-3">
            <TextInput label="Nombre actual" value={renameTarget.old} disabled classNames={fieldClasses} radius="lg" />
            <TextInput
              label="Nuevo nombre"
              value={renameTarget.nuevo}
              onChange={(e) => setRenameTarget({ ...renameTarget, nuevo: e.currentTarget.value })}
              required
              classNames={fieldClasses}
              radius="lg"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="subtle" onClick={() => setRenameTarget(null)} disabled={savingRename}>
                Cancelar
              </Button>
              <Button onClick={handleRename} loading={savingRename} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Renombrar
              </Button>
            </div>
          </div>
        )}
      </ModalEstandar>
    </div>
  );
};
