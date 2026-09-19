import {
  Button,
  Group,
  Select,
  Stack,
  TextInput,
  Alert,
} from "@mantine/core";
import {
  IconDeviceFloppy,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { MONEDAS } from "../../../../../shared/variables/monedas";
import { useEdicionCuentaBancariaEmpleado } from "../../../hooks/useEdicionCuentaBancariaEmpleado";
import { useEffect } from "react";
import { TipoCuentaBank } from "../../../../../shared/enums/tipo-cuenta-bank";

interface EdicionCuentaBancariaEmpleadoProps {
  hook: ReturnType<typeof useEdicionCuentaBancariaEmpleado>;
  onCancel: () => void;
}

export const EdicionCuentaBancariaEmpleadoComponent = ({
  hook,
  onCancel,
}: EdicionCuentaBancariaEmpleadoProps) => {
  const {
    bancos,
    loadingBancos,
    cargarBancos,
    idBanco,
    setIdBanco,
    tipoCuentaBancaria,
    setTipoCuentaBancaria,
    moneda,
    setMoneda,
    numeroCuenta,
    setNumeroCuenta,
    cci,
    setCci,
    error,
    isSubmitting,
    handleGuardar,
    reset,
  } = hook;

  useEffect(() => {
    cargarBancos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
    label: "text-zinc-300 mb-1 font-medium text-xs",
  };

  const selectBancos = bancos.map((b) => ({
    value: String(b.id_banco),
    label: `${b.nombre}${b.abreviatura ? ` (${b.abreviatura})` : ""}`,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectMonedas = Object.values(MONEDAS).map((m: any) => ({
    value: m.label,
    label: `${m.label} (${m.symbol})`,
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleGuardar();
      }}
      className="flex flex-col gap-6"
    >
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Banco"
            placeholder="Seleccione un banco"
            withAsterisk
            required
            radius="xl"
            size="xs"
            searchable
            disabled={isSubmitting || loadingBancos}
            data={selectBancos}
            value={idBanco}
            onChange={setIdBanco}
            classNames={inputClasses}
            comboboxProps={{ withinPortal: true }}
          />

          <Select
            label="Tipo de Cuenta"
            data={[
              { value: TipoCuentaBank.CuentaSueldo, label: "Cuenta Sueldo" },
              { value: TipoCuentaBank.CuentaCorriente, label: "Cuenta Corriente" },
            ]}
            radius="xl"
            size="xs"
            disabled={isSubmitting}
            value={tipoCuentaBancaria}
            onChange={(val) => setTipoCuentaBancaria(val || TipoCuentaBank.CuentaSueldo)}
            classNames={inputClasses}
            comboboxProps={{ withinPortal: true }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Moneda"
            withAsterisk
            required
            radius="xl"
            size="xs"
            disabled={isSubmitting}
            data={selectMonedas}
            value={moneda}
            onChange={(val) => setMoneda(val || "Soles")}
            classNames={inputClasses}
            comboboxProps={{ withinPortal: true }}
          />

          <div className="md:col-span-2">
            <TextInput
              label="Número de Cuenta"
              placeholder="Ej. 191-23132-..."
              withAsterisk
              required
              disabled={isSubmitting}
              radius="xl"
              size="xs"
              classNames={inputClasses}
              value={numeroCuenta}
              onChange={(e) => setNumeroCuenta(e.currentTarget.value)}
            />
          </div>
        </div>

        <TextInput
          label="CCI (opcional)"
          placeholder="Ej. 002-191-23132-41-098"
          disabled={isSubmitting}
          radius="xl"
          size="xs"
          classNames={inputClasses}
          value={cci}
          onChange={(e) => setCci(e.currentTarget.value)}
        />
      </Stack>

      <Group justify="flex-end" gap="md" mt="xs">
        <Button
          variant="subtle"
          onClick={() => {
            reset();
            onCancel();
          }}
          disabled={isSubmitting}
          radius="xl"
          size="xs"
          className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          radius="xl"
          size="xs"
          leftSection={<IconDeviceFloppy size={16} />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 border-0 px-6"
        >
          Guardar Cambios
        </Button>
      </Group>
    </form>
  );
};
