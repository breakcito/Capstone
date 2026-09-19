import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Select,
  Switch,
  Grid,
  Alert,
  NumberInput,
  Loader,
  Group,
  ActionIcon,
} from "@mantine/core";
import { IconDeviceFloppy, IconExclamationCircle } from "@tabler/icons-react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ModalEstandar } from "./modal-estandar";
import { FormUnidadMedida } from "./form-unidad-medida";
import { AuxService } from "../../service/auxiliar.service";
import type { RES_Producto } from "../../service/responses/producto";
import type { RES_UnidadMedida } from "../../service/responses/unidad-medida";
import { useNotify } from "../../hooks/useNotify";
import { TipoProducto } from "../../shared/enums/_generic/tipo-producto";
import { Periodo } from "../../shared/enums/_generic/periodo";

export interface FormProductoProps {
  onSuccess: (producto: RES_Producto) => void;
  onCancel?: () => void;
}

export const FormProducto = ({ onSuccess, onCancel }: FormProductoProps) => {
  const { notifySuccess, notifyError } = useNotify();
  const [loading, setLoading] = useState(false);
  const [loadingMaestros, setLoadingMaestros] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openedAddUnidad, setOpenedAddUnidad] = useState(false);

  // Maestros
  const [unidades, setUnidades] = useState<RES_UnidadMedida[]>([]);

  const fetchUnidades = async () => {
    try {
      const resUni = await AuxService.get_unidades_medida();
      if (resUni.success) {
        setUnidades(resUni.data);
      }
    } catch (err) {
      console.error("Error al refrescar unidades de medida", err);
    }
  };

  // Form Fields
  const [nombre, setNombre] = useState("");
  const [tipoProducto, setTipoProducto] = useState<string | null>(TipoProducto.Herramientas);
  const [idUnidadMedidaBase, setIdUnidadMedidaBase] = useState<string | null>(null);
  const [esPerecible, setEsPerecible] = useState(false);
  const [stockMinimoBase, setStockMinimoBase] = useState<number | string>("");
  const [tiempoEsperaVencimiento, setTiempoEsperaVencimiento] = useState<number | string>("");
  const [periodoEsperaVencimiento, setPeriodoEsperaVencimiento] = useState<string | null>(Periodo.Dias);

  useEffect(() => {
    const fetchMaestros = async () => {
      try {
        setLoadingMaestros(true);
        await fetchUnidades();
      } catch (err) {
        console.error("Error al cargar maestros para el formulario de producto", err);
        setError("Error al cargar unidades de medida.");
      } finally {
        setLoadingMaestros(false);
      }
    };
    fetchMaestros();
  }, []);

  const validate = () => {
    if (!nombre.trim()) return "El nombre es requerido";
    if (nombre.trim().length < 2) return "El nombre del producto es muy corto";
    if (!tipoProducto) return "El tipo de producto es requerido";
    if (!idUnidadMedidaBase) return "La unidad de medida es requerida";
    if (esPerecible) {
      if (!tiempoEsperaVencimiento || Number(tiempoEsperaVencimiento) <= 0) {
        return "Debe indicar un tiempo de espera válido para productos perecibles";
      }
      if (!periodoEsperaVencimiento) {
        return "Debe seleccionar un periodo de espera para productos perecibles";
      }
    }
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
      const res = await AuxService.crear_producto({
        nombre: nombre.trim(),
        tipo_producto: tipoProducto as TipoProducto,
        id_unidad_medida_base: Number(idUnidadMedidaBase),
        es_perecible: esPerecible,
        stock_minimo_base: stockMinimoBase !== "" ? Number(stockMinimoBase) : undefined,
        tiempo_espera_vencimiento:
          esPerecible && tiempoEsperaVencimiento !== ""
            ? Number(tiempoEsperaVencimiento)
            : undefined,
        periodo_espera_vencimiento:
          esPerecible && periodoEsperaVencimiento
            ? periodoEsperaVencimiento
            : undefined,
      });

      if (res.success && res.data) {
        notifySuccess("Producto registrado correctamente");
        onSuccess(res.data);
      } else {
        setError(res.message || "Error al registrar producto");
        notifyError(res.message || "Error al registrar producto");
      }
    } catch (err) {
      console.error(err);
      setError("Error de red al registrar producto");
      notifyError("Error de red al registrar producto");
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
          Cargando unidades...
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

      <Grid gutter="md">
        <Grid.Col span={12}>
          <TextInput
            label="Nombre del Producto"
            placeholder="Ej. Guantes de Cuero, Taladro de Impacto..."
            required
            value={nombre}
            onChange={(e) => {
              setNombre(e.currentTarget.value);
              if (error) setError(null);
            }}
            classNames={inputClasses}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Select
            label="Tipo de Producto"
            placeholder="Seleccione un tipo"
            required
            data={Object.values(TipoProducto).map((tipo) => ({
              value: tipo,
              label: tipo,
            }))}
            value={tipoProducto}
            onChange={(val) => {
              setTipoProducto(val);
              if (error) setError(null);
            }}
            classNames={inputClasses}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <div className="flex items-end gap-2">
            <Select
              label="Unidad de Medida Base"
              placeholder="Seleccione la unidad"
              required
              className="flex-1"
              data={unidades.map((u) => ({
                value: String(u.id_unidad_medida),
                label: `${u.nombre} (${u.abreviatura})`,
              }))}
              value={idUnidadMedidaBase}
              onChange={(val) => {
                setIdUnidadMedidaBase(val);
                if (error) setError(null);
              }}
              searchable
              classNames={inputClasses}
            />
            <ActionIcon
              size="lg"
              variant="light"
              color="indigo"
              onClick={() => setOpenedAddUnidad(true)}
              className="mb-[1px]"
              title="Nueva Unidad de Medida"
            >
              <PlusIcon className="w-5 h-5" />
            </ActionIcon>
          </div>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <NumberInput
            label="Stock Mínimo Base"
            placeholder="0"
            min={0}
            value={stockMinimoBase}
            onChange={(val) => setStockMinimoBase(val)}
            classNames={inputClasses}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <div className="p-3 bg-zinc-900/30 border border-zinc-800 rounded-xl flex items-center justify-between mt-5">
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-300 font-medium text-sm">
                ¿Es perecible?
              </span>
              <span className="text-zinc-500 text-xs">
                Indica si vence con el tiempo.
              </span>
            </div>
            <Switch
              checked={esPerecible}
              onChange={(e) => setEsPerecible(e.currentTarget.checked)}
              color="indigo"
              size="md"
              className="cursor-pointer"
            />
          </div>
        </Grid.Col>

        {esPerecible && (
          <>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Tiempo de Espera de Vencimiento"
                placeholder="Ej. 15"
                required
                min={1}
                value={tiempoEsperaVencimiento}
                onChange={(val) => {
                  setTiempoEsperaVencimiento(val);
                  if (error) setError(null);
                }}
                classNames={inputClasses}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label="Periodo de Espera"
                placeholder="Seleccione el periodo"
                required
                data={[
                  { value: Periodo.Dias, label: "Día(s)" },
                  { value: Periodo.Semanal, label: "Semana(s)" },
                  { value: Periodo.Meses, label: "Mes(es)" },
                  { value: Periodo.Anos, label: "Año(s)" },
                ]}
                value={periodoEsperaVencimiento}
                onChange={(val) => {
                  setPeriodoEsperaVencimiento(val);
                  if (error) setError(null);
                }}
                classNames={inputClasses}
              />
            </Grid.Col>
          </>
        )}
      </Grid>

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
          Guardar Producto
        </Button>
      </div>

      <ModalEstandar
        opened={openedAddUnidad}
        close={() => setOpenedAddUnidad(false)}
        title="Nueva Unidad de Medida"
        size="sm"
        zIndex={1001}
      >
        <FormUnidadMedida
          onSuccess={async (nuevaUnidad) => {
            setOpenedAddUnidad(false);
            await fetchUnidades();
            setIdUnidadMedidaBase(String(nuevaUnidad.id_unidad_medida));
          }}
          onCancel={() => setOpenedAddUnidad(false)}
        />
      </ModalEstandar>
    </form>
  );
};
