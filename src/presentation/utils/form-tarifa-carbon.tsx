import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Grid,
  NumberInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { IconDeviceFloppy, IconExclamationCircle } from "@tabler/icons-react";
import { AuxService } from "../../service/auxiliar.service";
import { TipoCarbonService } from "../../modules/tipo-carbon/service/tipo-carbon.service";
import type { RES_TipoCarbon } from "../../modules/tipo-carbon/service/tipo-carbon.responses";
import type { RES_TarifaCarbon } from "../../service/responses/tarifa-carbon";
import { useNotify } from "../../hooks/useNotify";

export interface FormTarifaCarbonProps {
  /**
   * Tipo de carbon preseleccionado (cuando el modal se abre desde el item
   * de una compra). Si llega null, el usuario debe elegir uno.
   */
  idTipoCarbonInicial?: number | null;
  /**
   * % de ceniza del item que abrio el modal. Se usa solo como sugerencia
   * para prefijar los rangos inicio/fin (inicio = ceniza, fin = ceniza + 5).
   */
  cenizaReferenciaInicial?: number;
  onSuccess: (nueva: RES_TarifaCarbon) => void;
  onCancel?: () => void;
}

const inputClasses = {
  input:
    "bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 transition-all",
  label: "text-zinc-300 mb-1 font-medium text-xs",
};

export const FormTarifaCarbon = ({
  idTipoCarbonInicial = null,
  cenizaReferenciaInicial = 0,
  onSuccess,
  onCancel,
}: FormTarifaCarbonProps) => {
  const { notifySuccess, notifyError } = useNotify();
  const [tipos, setTipos] = useState<RES_TipoCarbon[]>([]);
  const [loadingTipos, setLoadingTipos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [idTipoCarbon, setIdTipoCarbon] = useState<string | null>(
    idTipoCarbonInicial ? String(idTipoCarbonInicial) : null,
  );
  // Sugerimos un rango centrado en la ceniza de referencia (ej. ceniza=8
  // => inicio=5, fin=10) para que sea util de entrada. El usuario puede
  // ajustarlo.
  const cenizaSugerida =
    cenizaReferenciaInicial && cenizaReferenciaInicial > 0
      ? cenizaReferenciaInicial
      : 0;
  const [inicioCeniza, setInicioCeniza] = useState<number | string>(
    cenizaSugerida > 0 ? Math.max(0, cenizaSugerida - 2) : 0,
  );
  const [finCeniza, setFinCeniza] = useState<number | string>(
    cenizaSugerida > 0 ? cenizaSugerida + 3 : 0,
  );
  const [precioUnitario, setPrecioUnitario] = useState<number | string>(0);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoadingTipos(true);
      try {
        const resp = await TipoCarbonService.getTipos({ para_compra: true });
        if (cancel) return;
        if (resp.success && Array.isArray(resp.data)) {
          setTipos(resp.data);
        }
      } catch (e) {
        console.error("No se pudieron cargar los tipos de carbon", e);
      } finally {
        if (!cancel) setLoadingTipos(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const opcionesTipos = useMemo(
    () =>
      tipos.map((t) => ({
        value: String(t.id_tipo_carbon),
        label: t.codigo ? `${t.nombre} (${t.codigo})` : t.nombre,
      })),
    [tipos],
  );

  const validate = (): string | null => {
    if (!idTipoCarbon) return "Selecciona un tipo de carbon";
    const inicio = Number(inicioCeniza);
    const fin = Number(finCeniza);
    const precio = Number(precioUnitario);
    if (!Number.isFinite(inicio) || inicio < 0)
      return "Inicio del rango de ceniza invalido";
    if (!Number.isFinite(fin) || fin < 0)
      return "Fin del rango de ceniza invalido";
    if (inicio >= fin) return "El inicio del rango debe ser menor que el fin";
    if (inicio > 100 || fin > 100)
      return "Los porcentajes de ceniza no pueden superar 100";
    if (!Number.isFinite(precio) || precio <= 0)
      return "Precio unitario debe ser mayor a 0";
    return null;
  };

  const submitValido = useMemo(
    () => validate() === null,
    [idTipoCarbon, inicioCeniza, finCeniza, precioUnitario],
  );

  const onSubmit = async () => {
    setError(null);
    const ve = validate();
    if (ve) {
      setError(ve);
      return;
    }

    setLoading(true);
    try {
      const res = await AuxService.crear_tarifa_carbon({
        id_tipo_carbon: Number(idTipoCarbon),
        inicio_porcentaje_ceniza: Number(inicioCeniza),
        fin_porcentaje_ceniza: Number(finCeniza),
        precio_unitario: Number(precioUnitario),
      });

      if (res.success && res.data) {
        notifySuccess("Tarifa de carbon registrada correctamente");
        onSuccess(res.data);
      } else {
        const msg = res.message || "No se pudo registrar la tarifa";
        setError(msg);
        notifyError(msg);
      }
    } catch (err) {
      console.error(err);
      const msg = "Error al registrar la tarifa de carbon";
      setError(msg);
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="md">
      {error && (
        <Alert
          icon={<IconExclamationCircle size={16} />}
          color="red"
          variant="filled"
        >
          {error}
        </Alert>
      )}

      <Grid>
        <Grid.Col span={{ base: 12 }}>
          <Select
            label="Tipo de Carbon"
            placeholder={loadingTipos ? "Cargando..." : "Seleccione"}
            withAsterisk
            radius="xl"
            data={opcionesTipos}
            value={idTipoCarbon}
            onChange={(v) => {
              setIdTipoCarbon(v);
              if (error) setError(null);
            }}
            classNames={inputClasses}
            searchable
            nothingFoundMessage="Sin tipos de carbon"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6 }}>
          <NumberInput
            label="Ceniza desde (%)"
            placeholder="0.00"
            withAsterisk
            radius="xl"
            min={0}
            max={100}
            fixedDecimalScale
            value={inicioCeniza}
            onChange={(v) => {
              setInicioCeniza(v);
              if (error) setError(null);
            }}
            classNames={inputClasses}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 6 }}>
          <NumberInput
            label="Ceniza hasta (%)"
            placeholder="0.00"
            withAsterisk
            radius="xl"
            min={0}
            max={100}
            fixedDecimalScale
            value={finCeniza}
            onChange={(v) => {
              setFinCeniza(v);
              if (error) setError(null);
            }}
            classNames={inputClasses}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12 }}>
          <NumberInput
            label="Precio unitario (S/ x TON)"
            placeholder="0.00"
            withAsterisk
            radius="xl"
            min={0.01}
            decimalScale={2}
            fixedDecimalScale
            hideControls={false}
            value={precioUnitario}
            onChange={(v) => {
              setPrecioUnitario(v);
              if (error) setError(null);
            }}
            classNames={inputClasses}
          />
        </Grid.Col>
      </Grid>

      <Text size="xs" c="dimmed">
        La tarifa define el precio por tonelada segun el porcentaje de ceniza
        del carbon. Debe ser unica por tipo y sin solaparse con otra tarifa
        activa del mismo tipo.
      </Text>

      <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-zinc-800">
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
          onClick={onSubmit}
          loading={loading}
          disabled={!submitValido || loading}
          radius="xl"
          leftSection={<IconDeviceFloppy size={18} />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20"
        >
          Guardar Tarifa
        </Button>
      </div>
    </Stack>
  );
};
