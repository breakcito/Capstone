import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Grid,
  Group,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { IconAlertCircle, IconDeviceFloppy } from "@tabler/icons-react";

import { getCoincidencias } from "../../../shared/functions/get-coincidencias";
import { useUbicacionCompleta } from "../../../hooks/useUbicacionCompleta";

interface RegistroAlmacenCarbonProps {
  nombre: string;
  setNombre: (val: string) => void;
  descripcion: string;
  setDescripcion: (val: string) => void;
  // Ubicacion (opcional, en cascada)
  id_departamento: number | null;
  setIdDepartamento: (val: number | null) => void;
  id_provincia: number | null;
  setIdProvincia: (val: number | null) => void;
  id_distrito: number | null;
  setIdDistrito: (val: number | null) => void;
  direccion: string;
  setDireccion: (val: string) => void;
  formError: string;
  loading: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * Registro de almacen de carbon.
 *
 * Para carbon NO hay switch de "es principal" ni modales de responsables /
 * almacenes vecinos / minas a abastecer. Solo se piden los datos basicos
 * y, opcionalmente, su ubicacion geografica.
 *
 * La geografia (departamento / provincia / distrito) se carga completa al
 * montar y se filtra localmente; el backend no se vuelve a consultar al
 * cambiar las selecciones del cascada.
 */
export const RegistroAlmacenCarbon = ({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  id_departamento,
  setIdDepartamento,
  id_provincia,
  setIdProvincia,
  id_distrito,
  setIdDistrito,
  direccion,
  setDireccion,
  formError,
  loading,
  onSubmit,
  onCancel,
}: RegistroAlmacenCarbonProps) => {
  const {
    loading: loadingGeo,
    departamentos,
    provincias,
    distritos,
  } = useUbicacionCompleta();

  const [searchDpto, setSearchDpto] = useState("");
  const [searchProv, setSearchProv] = useState("");
  const [searchDist, setSearchDist] = useState("");

  // Filtrado local: la lista ya esta completa, no se vuelve a pedir al backend.
  const dptosVisibles = useMemo(() => {
    const q = searchDpto.trim();
    if (!q) return departamentos;
    return getCoincidencias(departamentos, q, { keys: ["nombre"] }).map(
      (r) => r.item,
    );
  }, [departamentos, searchDpto]);

  const provinciasDelDpto = useMemo(
    () =>
      id_departamento
        ? provincias.filter((p) => p.id_departamento === id_departamento)
        : provincias,
    [provincias, id_departamento],
  );

  const provVisibles = useMemo(() => {
    const q = searchProv.trim();
    if (!q) return provinciasDelDpto;
    return getCoincidencias(provinciasDelDpto, q, { keys: ["nombre"] }).map(
      (r) => r.item,
    );
  }, [provinciasDelDpto, searchProv]);

  const distritosDeLaProv = useMemo(
    () =>
      id_provincia
        ? distritos.filter((d) => d.id_provincia === id_provincia)
        : distritos,
    [distritos, id_provincia],
  );

  const distVisibles = useMemo(() => {
    const q = searchDist.trim();
    if (!q) return distritosDeLaProv;
    return getCoincidencias(distritosDeLaProv, q, { keys: ["nombre"] }).map(
      (r) => r.item,
    );
  }, [distritosDeLaProv, searchDist]);

  const inputClasses = {
    input: `bg-zinc-900/50 border-zinc-800 focus:border-zinc-300
    focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500`,
    label: "text-zinc-300 mb-1 font-medium",
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleFormSubmit} className="relative space-y-5">
      {formError && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="filled"
        >
          {formError}
        </Alert>
      )}

      <Stack gap="md">
        <TextInput
          label="Nombre del Almacén de Carbón"
          placeholder="Ej. Almacén Carbón - Zona Sur"
          required
          withAsterisk
          disabled={loading}
          radius="lg"
          classNames={inputClasses}
          value={nombre}
          onChange={(e) => setNombre(e.currentTarget.value)}
        />

        <Textarea
          label="Descripción"
          placeholder="Detalles adicionales..."
          radius="lg"
          minRows={3}
          disabled={loading}
          classNames={inputClasses}
          value={descripcion}
          onChange={(e) => setDescripcion(e.currentTarget.value)}
        />

        <div className="space-y-3">
          <span className="text-emerald-400 text-sm font-bold tracking-widest">
            Ubicación (opc)
          </span>

          <Grid mt={5}>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Departamento"
                placeholder={
                  loadingGeo && departamentos.length === 0
                    ? "Cargando..."
                    : "Seleccione"
                }
                radius="lg"
                clearable
                searchable
                searchValue={searchDpto}
                onSearchChange={setSearchDpto}
                nothingFoundMessage="Sin coincidencias"
                data={dptosVisibles.map((d) => ({
                  value: String(d.id),
                  label: d.nombre,
                }))}
                value={id_departamento ? String(id_departamento) : null}
                onChange={(v) => {
                  const num = v ? Number(v) : null;
                  setIdDepartamento(num);
                  setIdProvincia(null);
                  setIdDistrito(null);
                }}
                disabled={loadingGeo && departamentos.length === 0}
                classNames={inputClasses}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Provincia"
                placeholder={
                  !id_departamento ? "Seleccione un departamento" : "Seleccione"
                }
                radius="lg"
                clearable
                searchable
                searchValue={searchProv}
                onSearchChange={setSearchProv}
                nothingFoundMessage="Sin coincidencias"
                data={provVisibles.map((p) => ({
                  value: String(p.id),
                  label: p.nombre,
                }))}
                value={id_provincia ? String(id_provincia) : null}
                onChange={(v) => {
                  const num = v ? Number(v) : null;
                  setIdProvincia(num);
                  setIdDistrito(null);
                }}
                disabled={!id_departamento}
                classNames={inputClasses}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Select
                label="Distrito"
                placeholder={
                  !id_provincia ? "Seleccione una provincia" : "Seleccione"
                }
                radius="lg"
                clearable
                searchable
                searchValue={searchDist}
                onSearchChange={setSearchDist}
                nothingFoundMessage="Sin coincidencias"
                data={distVisibles.map((d) => ({
                  value: String(d.id),
                  label: d.nombre,
                }))}
                value={id_distrito ? String(id_distrito) : null}
                onChange={(v) => setIdDistrito(v ? Number(v) : null)}
                disabled={!id_provincia}
                classNames={inputClasses}
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Dirección (opcional)"
            placeholder="Ej. Av. Principal 123"
            radius="lg"
            disabled={loading}
            classNames={inputClasses}
            value={direccion}
            onChange={(e) => setDireccion(e.currentTarget.value)}
          />
        </div>

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
            type="submit"
            loading={loading}
            radius="lg"
            size="sm"
            leftSection={<IconDeviceFloppy size={16} />}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 font-semibold"
          >
            Guardar
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
