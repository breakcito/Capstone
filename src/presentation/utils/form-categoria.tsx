import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Group,
  TextInput,
  Textarea,
  Stack,
  Select,
  Switch,
  Checkbox,
  Text,
  Popover,
  Tooltip,
  Alert,
  Loader,
  MultiSelect,
} from "@mantine/core";
import { TipoBien } from "../../shared/enums/_generic/tipo-bien";
import { TipoProducto } from "../../shared/enums/_generic/tipo-producto";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { IconDeviceFloppy, IconExclamationCircle } from "@tabler/icons-react";
import { AuxService } from "../../service/auxiliar.service";
import type { RES_Categoria } from "../../service/responses/categoria";
import { useNotify } from "../../hooks/useNotify";
import { useAuditoriaStore } from "../../stores/auditoria.store";
import {
  getCoincidencias,
  type SearchResult,
} from "../../shared/functions/get-coincidencias";

export interface FormCategoriaProps {
  onSuccess: (categoria: RES_Categoria) => void;
  onCancel?: () => void;
}

export const FormCategoria = ({ onSuccess, onCancel }: FormCategoriaProps) => {
  const { en_modo_auditable } = useAuditoriaStore();
  const { notifySuccess, notifyError } = useNotify();
  const [loading, setLoading] = useState(false);
  const [loadingMaestros, setLoadingMaestros] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lista de categorías existentes para validación y coincidencia
  const [categorias, setCategorias] = useState<RES_Categoria[]>([]);

  // Form Fields
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoProducto, setTipoProducto] = useState<TipoProducto>(
    TipoProducto.Bien,
  );
  const [clasificacionBien, setClasificacionBien] = useState<TipoBien | null>(
    null,
  );

  // Destinos de uso
  const [paraMina, setParaMina] = useState(true);
  const [paraCocina, setParaCocina] = useState(false);

  // Consumible y Auditable
  const [esConsumible, setEsConsumible] = useState(false);
  const [esAuditable, setEsAuditable] = useState(false);

  // Opciones de control (solo para Activo Fijo)
  const [paraTransporte, setParaTransporte] = useState(false);
  const [controlPorOdometro, setControlPorOdometro] = useState(false);
  const [controlPorHorometro, setControlPorHorometro] = useState(false);
  const [controlPorVueltas, setControlPorVueltas] = useState(false);

  // Categorías consumidoras
  const [idsConsumidoras, setIdsConsumidoras] = useState<number[]>([]);

  // Búsqueda de coincidencia
  const [coincidencias, setCoincidencias] = useState<
    SearchResult<RES_Categoria>[]
  >([]);
  const [focused, setFocused] = useState(false);

  // Cargar categorías existentes al montar
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoadingMaestros(true);
        const res = await AuxService.get_categorias();
        if (res.success) {
          setCategorias(res.data);
        }
      } catch (err) {
        console.error("Error al cargar categorías", err);
        setError("Error al cargar categorías existentes.");
      } finally {
        setLoadingMaestros(false);
      }
    };
    fetchCategorias();
  }, []);

  const handleNombreChange = (val: string) => {
    setNombre(val);
    if (error) setError(null);
    if (val.length >= 3) {
      const results = getCoincidencias(categorias, val, {
        keys: ["nombre"],
        fuseThreshold: 0.3,
      });
      setCoincidencias(results);
    } else {
      setCoincidencias([]);
    }
  };

  const handleClasificacionChange = (val: string | null) => {
    if (val) {
      const cb = val as TipoBien;
      setClasificacionBien(cb);
      if (cb === TipoBien.Suministro) {
        setEsConsumible(true);
      } else {
        setEsConsumible(false);
        setIdsConsumidoras([]);
      }
      if (error) setError(null);
    } else {
      setClasificacionBien(null);
      setEsConsumible(false);
      setIdsConsumidoras([]);
    }
  };

  const handleParaTransporteChange = (val: boolean) => {
    setParaTransporte(val);
    if (val) {
      setControlPorOdometro(true);
    }
  };

  // Agrupar coincidencias por clasificación
  const groupedCoincidencias = useMemo(() => {
    const groups: Record<string, typeof coincidencias> = {};
    coincidencias.forEach((res) => {
      const cls = res.item.clasificacion_bien || "Sin Clasificación";
      if (!groups[cls]) groups[cls] = [];
      groups[cls].push(res);
    });
    return groups;
  }, [coincidencias]);

  // Si es suministro, solo puede abastecer a Activos Fijos
  const categoriasParaConsumo = useMemo(() => {
    return categorias
      .filter((c) => c.clasificacion_bien === TipoBien.ActivoFijo)
      .map((c) => ({
        value: String(c.id_categoria),
        label: c.nombre,
      }));
  }, [categorias]);

  const validate = () => {
    if (!nombre.trim()) return "El nombre de la categoría es requerido";
    if (nombre.trim().length < 3)
      return "El nombre debe tener al menos 3 caracteres";
    if (!clasificacionBien) return "La clasificación es requerida";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await AuxService.crear_categoria({
        nombre: nombre.trim(),
        tipo_producto: tipoProducto,
        clasificacion_bien: clasificacionBien!,
        descripcion: descripcion.trim() || undefined,
        para_transporte: paraTransporte,
        control_por_odometro: controlPorOdometro,
        control_por_horometro: controlPorHorometro,
        control_por_vueltas: controlPorVueltas,
        es_consumible: esConsumible,
        para_cocina: paraCocina,
        para_mina: paraMina,
        es_auditable: esAuditable,
        ids_categorias_consumidoras: esConsumible ? idsConsumidoras : [],
      });

      if (res.success && res.data) {
        notifySuccess("Categoría registrada correctamente");
        onSuccess(res.data);
      } else {
        setError(res.message || "Error al registrar la categoría");
        notifyError(res.message || "Error al registrar la categoría");
      }
    } catch (err) {
      console.error(err);
      setError("Error al registrar la categoría");
      notifyError("Error al registrar la categoría");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-300 transition-all",
    label: "text-zinc-400 font-medium text-xs mb-1",
  };

  if (loadingMaestros) {
    return (
      <Group justify="center" py="xl">
        <Loader size="sm" color="indigo" />
        <span className="text-zinc-400 text-xs font-medium">
          Cargando categorías existentes...
        </span>
      </Group>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <Alert
          icon={<IconExclamationCircle size={16} />}
          color="red"
          variant="filled"
        >
          {error}
        </Alert>
      )}

      <Stack gap="md">
        <Popover
          opened={coincidencias.length > 0 && !!focused}
          position="bottom"
          width="target"
          transitionProps={{ transition: "pop", duration: 200 }}
          shadow="xl"
          radius="lg"
          offset={2}
        >
          <Popover.Target>
            <TextInput
              label="Nombre"
              placeholder="Ej. Herramientas, EPP, Consumibles..."
              required
              withAsterisk
              disabled={loading}
              radius="lg"
              classNames={inputClasses}
              value={nombre}
              onChange={(e) => handleNombreChange(e.currentTarget.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rightSection={
                nombre.length >= 3 && (
                  <Tooltip
                    label={
                      coincidencias.length > 0
                        ? `${coincidencias.length} coincidencias encontradas`
                        : "Nombre disponible"
                    }
                    color={coincidencias.length > 0 ? "orange" : "teal"}
                    withArrow
                    position="top-end"
                  >
                    <div className="flex items-center justify-center">
                      {coincidencias.length > 0 ? (
                        <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 animate-pulse" />
                      ) : (
                        <CheckCircleIcon className="w-5 h-5 text-teal-500" />
                      )}
                    </div>
                  </Tooltip>
                )
              }
            />
          </Popover.Target>
          <Popover.Dropdown className="bg-zinc-950 border-zinc-800 p-2 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-2.5 py-2 border-b border-zinc-800/60 mb-2">
              <Text
                size="10px"
                fw={800}
                className="text-zinc-500 uppercase tracking-widest"
              >
                Categorías Similares
              </Text>
            </div>

            <div className="max-h-60 overflow-y-auto px-1 custom-scrollbar">
              {Object.entries(groupedCoincidencias).map(
                ([clasificacion, items]) => (
                  <div key={clasificacion} className="mb-4 last:mb-1">
                    <div className="flex items-center gap-2 px-1.5 mb-1.5">
                      <TagIcon className="w-3 h-3 text-indigo-400" />
                      <Text
                        size="10px"
                        fw={700}
                        className="text-zinc-600 uppercase tracking-tight"
                      >
                        {clasificacion}
                      </Text>
                    </div>

                    <Stack gap={3}>
                      {items.map((res) => (
                        <div
                          key={res.item.id_categoria}
                          className="group flex items-center justify-between p-2.5 bg-zinc-900/30 hover:bg-zinc-800/40 border border-zinc-800/30 hover:border-zinc-700/50 rounded-xl transition-all duration-200 cursor-default"
                        >
                          <Text
                            size="xs"
                            fw={600}
                            className="text-zinc-200 group-hover:text-white transition-colors"
                          >
                            {res.item.nombre}
                          </Text>
                        </div>
                      ))}
                    </Stack>
                  </div>
                ),
              )}
            </div>
          </Popover.Dropdown>
        </Popover>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo"
            disabled
            radius="lg"
            classNames={inputClasses}
            data={Object.values(TipoProducto)}
            value={tipoProducto}
            onChange={(val) => setTipoProducto(val as TipoProducto)}
          />

          <Select
            label="Clasificación"
            placeholder="Seleccione una clasificación..."
            required
            withAsterisk
            disabled={loading}
            radius="lg"
            classNames={inputClasses}
            data={Object.values(TipoBien)}
            value={clasificacionBien}
            onChange={handleClasificacionChange}
            comboboxProps={{
              withinPortal: true,
              zIndex: 99999,
              transitionProps: { transition: "pop", duration: 200 },
            }}
          />
        </div>

        {clasificacionBien === TipoBien.ActivoFijo && (
          <div className="flex flex-col gap-1 px-1 justify-center border border-zinc-800 bg-zinc-900/10 p-3 rounded-xl">
            <Text
              size="xs"
              fw={600}
              className="text-zinc-500 uppercase tracking-wider mb-2"
            >
              Opciones de Control
            </Text>
            <Group gap="md">
              <Tooltip
                label="Permite registrar datos propios de un vehículo para consultas y gestión de flota."
                position="top"
                withArrow
                multiline
                w={220}
              >
                <Checkbox
                  label="Transporte"
                  checked={paraTransporte}
                  onChange={(e) =>
                    handleParaTransporteChange(e.currentTarget.checked)
                  }
                  disabled={loading}
                  color="indigo"
                  size="xs"
                  classNames={{
                    label: "text-zinc-300",
                    input: "cursor-pointer",
                  }}
                />
              </Tooltip>

              <Tooltip
                label="Lleva un control por kilometraje para el módulo de Uso."
                position="top"
                withArrow
                multiline
                w={220}
              >
                <Checkbox
                  label="Odómetro"
                  checked={controlPorOdometro}
                  onChange={(e) =>
                    setControlPorOdometro(e.currentTarget.checked)
                  }
                  disabled={loading}
                  color="indigo"
                  size="xs"
                  classNames={{
                    label: "text-zinc-300",
                    input: "cursor-pointer",
                  }}
                />
              </Tooltip>

              <Tooltip
                label="Lleva un control por horas de trabajo para el módulo de Uso."
                position="top"
                withArrow
                multiline
                w={220}
              >
                <Checkbox
                  label="Horómetro"
                  checked={controlPorHorometro}
                  onChange={(e) =>
                    setControlPorHorometro(e.currentTarget.checked)
                  }
                  disabled={loading}
                  color="indigo"
                  size="xs"
                  classNames={{
                    label: "text-zinc-300",
                    input: "cursor-pointer",
                  }}
                />
              </Tooltip>

              <Tooltip
                label="Lleva un control por número de vueltas para el módulo de Uso."
                position="top"
                withArrow
                multiline
                w={220}
              >
                <Checkbox
                  label="Vueltas"
                  checked={controlPorVueltas}
                  onChange={(e) =>
                    setControlPorVueltas(e.currentTarget.checked)
                  }
                  disabled={loading}
                  color="indigo"
                  size="xs"
                  classNames={{
                    label: "text-zinc-300",
                    input: "cursor-pointer",
                  }}
                />
              </Tooltip>
            </Group>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 bg-zinc-900/40 p-3.5 rounded-xl border border-zinc-800">
          <div className="text-zinc-300 text-sm font-medium">Destino de Uso</div>
          <Group gap="xl">
            <Checkbox
              label="Mina"
              checked={paraMina}
              onChange={(e) => setParaMina(e.currentTarget.checked)}
              disabled={loading}
              color="indigo"
              size="sm"
              classNames={{
                label: "text-zinc-300 cursor-pointer",
                input: "cursor-pointer",
              }}
            />
            <Checkbox
              label="Cocina"
              checked={paraCocina}
              onChange={(e) => setParaCocina(e.currentTarget.checked)}
              disabled={loading}
              color="indigo"
              size="sm"
              classNames={{
                label: "text-zinc-300 cursor-pointer",
                input: "cursor-pointer",
              }}
            />
          </Group>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between transition-all duration-200 ${
              en_modo_auditable ? "md:col-span-2" : ""
            }`}
          >
            <div className="flex flex-col gap-1 pr-4">
              <Text size="sm" fw={600} className="text-indigo-200">
                Consumible
              </Text>
              <Text size="xs" className="text-indigo-100/70 leading-snug">
                ¿Abastece a otras?
              </Text>
            </div>
            <Switch
              checked={esConsumible}
              onChange={(e) => setEsConsumible(e.currentTarget.checked)}
              disabled={loading || clasificacionBien !== TipoBien.Suministro}
              color="indigo"
              size="xs"
              className={
                clasificacionBien !== TipoBien.Suministro
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }
            />
          </div>

          {!en_modo_auditable && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between transition-all duration-200">
              <div className="flex flex-col gap-1 pr-4">
                <Text size="sm" fw={600} className="text-red-200">
                  Auditable
                </Text>
                <Text size="xs" className="text-red-100/70 leading-snug">
                  Ocultar en auditoría.
                </Text>
              </div>
              <Switch
                checked={esAuditable}
                onChange={(e) => setEsAuditable(e.currentTarget.checked)}
                disabled={loading}
                color="red"
                size="xs"
                className="cursor-pointer"
              />
            </div>
          )}
        </div>

        {esConsumible && (
          <MultiSelect
            label="Categorías consumidoras (Destinos de consumo)"
            placeholder="Seleccione las categorías que este insumo puede abastecer..."
            radius="lg"
            searchable
            clearable
            disabled={loading}
            data={categoriasParaConsumo}
            value={idsConsumidoras.map(String)}
            onChange={(values) => setIdsConsumidoras(values.map(Number))}
            classNames={inputClasses}
            comboboxProps={{
              withinPortal: true,
              zIndex: 99999,
              transitionProps: { transition: "pop", duration: 200 },
            }}
          />
        )}

        <Textarea
          label="Descripción (Opcional)"
          placeholder="Detalles adicionales sobre esta categoría..."
          radius="lg"
          minRows={3}
          disabled={loading}
          classNames={inputClasses}
          value={descripcion}
          onChange={(e) => setDescripcion(e.currentTarget.value)}
        />
      </Stack>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800">
        {onCancel && (
          <Button
            variant="subtle"
            color="gray"
            radius="xl"
            onClick={onCancel}
            classNames={{ root: "text-zinc-400 hover:bg-zinc-800" }}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          loading={loading}
          radius="xl"
          leftSection={<IconDeviceFloppy size={18} />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20"
        >
          Guardar Categoría
        </Button>
      </div>
    </form>
  );
};
