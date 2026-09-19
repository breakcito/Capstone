import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Group,
  Loader,
  Popover,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import {
  IconDeviceFloppy,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { AuxService } from "../../service/auxiliar.service";
import type { RES_UnidadMedida } from "../../service/responses/unidad-medida";
import { useNotify } from "../../hooks/useNotify";
import {
  getCoincidencias,
  type SearchResult,
} from "../../shared/functions/get-coincidencias";

export interface FormUnidadMedidaProps {
  onSuccess: (unidad: RES_UnidadMedida) => void;
  onCancel?: () => void;
}

export const FormUnidadMedida = ({
  onSuccess,
  onCancel,
}: FormUnidadMedidaProps) => {
  const { notifySuccess, notifyError } = useNotify();
  const [loading, setLoading] = useState(false);
  const [loadingMaestros, setLoadingMaestros] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [unidades, setUnidades] = useState<RES_UnidadMedida[]>([]);
  const [nombre, setNombre] = useState("");
  const [abreviatura, setAbreviatura] = useState("");
  const [coincidencias, setCoincidencias] = useState<
    SearchResult<RES_UnidadMedida>[]
  >([]);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        setLoadingMaestros(true);
        const res = await AuxService.get_unidades_medida();
        if (res.success) {
          setUnidades(res.data);
        }
      } catch (err) {
        console.error("Error al cargar unidades de medida", err);
        setError("Error al cargar unidades de medida existentes.");
      } finally {
        setLoadingMaestros(false);
      }
    };
    fetchUnidades();
  }, []);

  const existeExacto = useMemo(() => {
    const n = nombre.trim().toLowerCase();
    const a = abreviatura.trim().toLowerCase();
    if (!n && !a) return false;
    return unidades.some(
      (u) =>
        u.nombre.toLowerCase().trim() === n ||
        u.abreviatura.toLowerCase().trim() === a,
    );
  }, [nombre, abreviatura, unidades]);

  const handleNombreChange = (val: string) => {
    setNombre(val);
    if (error) setError(null);
    if (val.trim().length >= 3) {
      const results = getCoincidencias(unidades, val, {
        keys: ["nombre", "abreviatura"],
        fuseThreshold: 0.3,
      });
      setCoincidencias(results);
    } else {
      setCoincidencias([]);
    }
  };

  const handleAbreviaturaChange = (val: string) => {
    setAbreviatura(val.toUpperCase().replace(/\s+/g, ""));
    if (error) setError(null);
  };

  const validate = () => {
    const n = nombre.trim();
    if (n.length < 2) return "El nombre debe tener al menos 2 caracteres";
    if (n.length > 64) return "El nombre no puede tener más de 64 caracteres";
    if (!abreviatura.trim()) return "La abreviatura es requerida";
    if (abreviatura.trim().length > 8)
      return "La abreviatura no puede tener más de 8 caracteres";
    if (existeExacto)
      return "Ya existe una unidad de medida con ese nombre o abreviatura";
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
      const res = await AuxService.crear_unidad_medida({
        nombre: nombre.trim(),
        abreviatura: abreviatura.trim(),
      });

      if (res.success && res.data) {
        notifySuccess("Unidad de medida registrada correctamente");
        onSuccess(res.data);
      } else {
        setError(res.message || "Error al registrar la unidad de medida");
        notifyError(res.message || "Error al registrar la unidad de medida");
      }
    } catch (err) {
      console.error(err);
      setError("Error al registrar la unidad de medida");
      notifyError("Error al registrar la unidad de medida");
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
          Cargando unidades de medida existentes...
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
              placeholder="Ej. Kilogramo, Metro, Galón, Caja..."
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
                nombre.trim().length >= 3 && (
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
                Unidades Similares
              </Text>
            </div>
            <div className="max-h-60 overflow-y-auto px-1 custom-scrollbar">
              {coincidencias.map((res) => (
                <div
                  key={res.item.id_unidad_medida}
                  className="flex items-center justify-between p-2.5 bg-zinc-900/30 hover:bg-zinc-800/40 border border-zinc-800/30 hover:border-zinc-700/50 rounded-xl transition-all duration-200 cursor-default mb-1.5"
                >
                  <div className="flex items-center gap-2">
                    <ScaleIcon className="w-3.5 h-3.5 text-indigo-400" />
                    <Text
                      size="xs"
                      fw={600}
                      className="text-zinc-200 transition-colors"
                    >
                      {res.item.nombre}
                    </Text>
                  </div>
                  <Text size="10px" fw={700} className="text-zinc-500">
                    ({res.item.abreviatura})
                  </Text>
                </div>
              ))}
            </div>
          </Popover.Dropdown>
        </Popover>

        <TextInput
          label="Abreviatura"
          placeholder="Ej. KG, M, GL, CJ"
          required
          withAsterisk
          disabled={loading}
          radius="lg"
          maxLength={8}
          classNames={inputClasses}
          value={abreviatura}
          onChange={(e) => handleAbreviaturaChange(e.currentTarget.value)}
          description="Máximo 8 caracteres. Se guardará en mayúsculas."
        />
      </Stack>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800">
        {onCancel && (
          <Button
            variant="subtle"
            color="gray"
            radius="xl"
            onClick={onCancel}
            disabled={loading}
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
          disabled={existeExacto}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20"
        >
          Guardar Unidad
        </Button>
      </div>
    </form>
  );
};
