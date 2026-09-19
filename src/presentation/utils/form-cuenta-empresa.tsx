import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Group,
  Select,
  Stack,
  Switch,
  TextInput,
  Text,
  Alert,
  Loader,
  Tooltip,
} from "@mantine/core";
import { IconDeviceFloppy, IconExclamationCircle } from "@tabler/icons-react";
import { AuxService } from "../../service/auxiliar.service";
import { useNotify } from "../../hooks/useNotify";
import { Moneda } from "../../shared/enums/_generic/moneda";
import type { RES_Banco } from "../../service/responses/banco";
import type { RES_CuentaEmpresa } from "../../service/responses/cuenta-empresa";
import { Schema_RegistroCuenta } from "../../modules/empresas/service/cuentas-empresa.requests";

export interface FormCuentaEmpresaProps {
  id_empresa: number;
  onSuccess: (cuenta: RES_CuentaEmpresa) => void;
  onCancel?: () => void;
  monedaDefault?: Moneda;
}

export const FormCuentaEmpresa = ({
  id_empresa,
  onSuccess,
  onCancel,
  monedaDefault = Moneda.Soles,
}: FormCuentaEmpresaProps) => {
  const { notifySuccess, notifyError } = useNotify();
  const [loading, setLoading] = useState(false);
  const [loadingBancos, setLoadingBancos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bancos, setBancos] = useState<RES_Banco[]>([]);

  const [idBanco, setIdBanco] = useState<string | null>(null);
  const [moneda, setMoneda] = useState<Moneda>(monedaDefault);
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [cci, setCci] = useState("");
  const [esParaDetraccion, setEsParaDetraccion] = useState(false);

  useEffect(() => {
    const fetchBancos = async () => {
      try {
        setLoadingBancos(true);
        const res = await AuxService.get_bancos();
        if (res.success) setBancos(res.data);
      } catch (err) {
        console.error("Error al cargar bancos", err);
        setError("Error al cargar los bancos.");
      } finally {
        setLoadingBancos(false);
      }
    };
    fetchBancos();
  }, []);

  const bancoSeleccionado = useMemo(
    () => bancos.find((b) => String(b.id_banco) === idBanco) ?? null,
    [bancos, idBanco],
  );

  const esBancoNacional = Boolean(bancoSeleccionado?.es_nacional);
  const esMonedaSoles = moneda === Moneda.Soles;
  const detraccionHabilitada = esBancoNacional && esMonedaSoles;

  const bancosOptions = useMemo(
    () =>
      bancos.map((b) => ({
        value: String(b.id_banco),
        label: b.nombre,
      })),
    [bancos],
  );

  const handleBancoChange = (val: string | null) => {
    setIdBanco(val);
    setError(null as string | null);
    const banco = bancos.find((b) => String(b.id_banco) === val);
    if (!banco) return;
    const nuevoEsBancoNacional = Boolean(banco.es_nacional);
    if (
      esParaDetraccion &&
      (!nuevoEsBancoNacional || moneda !== Moneda.Soles)
    ) {
      setEsParaDetraccion(false);
    }
  };

  const handleMonedaChange = (val: Moneda | null) => {
    if (!val) return;
    setMoneda(val);
    if (esParaDetraccion && val !== Moneda.Soles) {
      setEsParaDetraccion(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const payload = {
      id_empresa,
      id_banco: idBanco ? Number(idBanco) : 0,
      moneda,
      numero_cuenta: numeroCuenta.trim(),
      cci: cci.trim() || undefined,
      es_para_detraccion: esParaDetraccion,
    };

    const result = Schema_RegistroCuenta.safeParse(payload);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Datos inválidos");
      return;
    }

    setLoading(true);
    try {
      const res = await AuxService.crear_cuenta_empresa({
        id_empresa: result.data.id_empresa,
        id_banco: result.data.id_banco,
        moneda: result.data.moneda,
        numero_cuenta: result.data.numero_cuenta,
        cci: result.data.cci ?? null,
        es_para_detraccion: result.data.es_para_detraccion,
      });

      if (res.success && res.data) {
        notifySuccess("Cuenta bancaria registrada correctamente");
        onSuccess(res.data);
      } else {
        setError(res.message || "Error al registrar la cuenta bancaria");
        notifyError(res.message || "Error al registrar la cuenta bancaria");
      }
    } catch (err) {
      console.error(err);
      setError("Error al registrar la cuenta bancaria");
      notifyError("Error al registrar la cuenta bancaria");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
    label: "text-zinc-300 mb-1 font-medium text-xs",
  };

  if (loadingBancos) {
    return (
      <Group justify="center" py="xl">
        <Loader size="sm" color="indigo" />
        <Text size="xs" fw={500} className="text-zinc-400">
          Cargando bancos...
        </Text>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Select
              label="Banco"
              placeholder="Seleccione un banco"
              withAsterisk
              required
              radius="lg"
              searchable
              disabled={loading}
              data={bancosOptions}
              value={idBanco}
              onChange={handleBancoChange}
              classNames={inputClasses}
              comboboxProps={{ withinPortal: true }}
            />
          </div>
          <Select
            label="Moneda"
            withAsterisk
            required
            radius="lg"
            disabled={loading}
            data={Object.values(Moneda)}
            value={moneda}
            onChange={(val) => handleMonedaChange(val as Moneda | null)}
            classNames={inputClasses}
            comboboxProps={{ withinPortal: true }}
          />
        </div>

        <div className="flex items-end gap-4">
          <TextInput
            className="flex-1"
            label="Número de Cuenta"
            placeholder="Ej. 1234567890"
            withAsterisk
            required
            maxLength={128}
            disabled={loading}
            radius="lg"
            classNames={inputClasses}
            value={numeroCuenta}
            onChange={(e) => {
              setNumeroCuenta(e.currentTarget.value.replace(/\D/g, ""));
              if (error) setError(null);
            }}
          />
          <Tooltip
            label={
              detraccionHabilitada
                ? "Marca si esta cuenta se usará para detracciones"
                : "Solo aplica para cuentas en Soles del Banco de la Nación"
            }
            withArrow
            position="top"
            multiline
            w={220}
          >
            <div className="pb-2">
              <Switch
                label="Detracción"
                checked={esParaDetraccion}
                onChange={(e) => setEsParaDetraccion(e.currentTarget.checked)}
                disabled={loading || !detraccionHabilitada}
                color="teal"
                size="sm"
              />
            </div>
          </Tooltip>
        </div>

        <TextInput
          label="CCI (opcional)"
          placeholder="Ej. 00212345678901234567"
          maxLength={128}
          disabled={loading}
          radius="lg"
          classNames={inputClasses}
          value={cci}
          onChange={(e) => {
            setCci(e.currentTarget.value.replace(/\D/g, ""));
            if (error) setError(null);
          }}
        />
      </Stack>

      <Group justify="flex-end" gap="md" mt="xs">
        {onCancel && (
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
        )}
        <Button
          type="submit"
          loading={loading}
          radius="lg"
          size="sm"
          leftSection={<IconDeviceFloppy size={16} />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 border-0 px-8"
        >
          Registrar Cuenta
        </Button>
      </Group>
    </form>
  );
};
