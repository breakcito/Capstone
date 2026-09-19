import { Badge, Text, Group, Stack, ThemeIcon, Grid, ActionIcon, Tooltip } from "@mantine/core";
import {
  IconCreditCard,
  IconCash,
  IconBuildingBank,
} from "@tabler/icons-react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { MONEDAS } from "../../../../../shared/variables/monedas";
import type { RES_CuentaBancariaEmpleado } from "../../../service/empleados.responses";
import { TipoCuentaBank } from "../../../../../shared/enums/tipo-cuenta-bank";

interface Props {
  cuenta: RES_CuentaBancariaEmpleado;
  onEdit?: (cuenta: RES_CuentaBancariaEmpleado) => void;
}

export const CuentaBancaria = ({ cuenta, onEdit }: Props) => {
  const isSoles = cuenta.moneda === MONEDAS.PEN.label;
  const isCuentaSueldo =
    !cuenta.tipo_cuenta_bancaria ||
    cuenta.tipo_cuenta_bancaria === TipoCuentaBank.CuentaSueldo;

  return (
    <div className="group relative p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl hover:bg-zinc-800/40 hover:border-zinc-700/50 transition-all duration-200">
      {onEdit && (
        <Tooltip label="Editar cuenta" withArrow position="top">
          <ActionIcon
            variant="subtle"
            color="blue"
            radius="md"
            size="sm"
            onClick={() => onEdit(cuenta)}
            className="absolute bottom-2.5 right-2.5 hover:bg-blue-500/10 transition-colors"
          >
            <PencilSquareIcon className="w-4 h-4" />
          </ActionIcon>
        </Tooltip>
      )}

      <Grid align="center" gutter="lg" className="pr-6">
        {/* Info Banco */}
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Group gap="md">
            <ThemeIcon
              variant="light"
              color={isSoles ? "blue" : "emerald"}
              size="lg"
              radius="xl"
              className="bg-zinc-950/50 shrink-0"
            >
              <IconBuildingBank size={20} stroke={1.5} />
            </ThemeIcon>

            <Stack gap={0} className="min-w-0 flex-1">
              <Text size="sm" fw={600} className="text-zinc-200 truncate">
                {cuenta.banco}{" "}
                {cuenta.banco_abv && (
                  <span className="text-zinc-500 font-medium text-[10px] ml-1">
                    ({cuenta.banco_abv})
                  </span>
                )}
              </Text>
              <Group gap={6}>
                <IconCreditCard size={14} className="text-zinc-500 shrink-0" />
                <Text
                  size="xs"
                  className="text-zinc-400 font-mono tracking-tight truncate"
                >
                  {cuenta.numero_cuenta}
                </Text>
              </Group>
            </Stack>
          </Group>
        </Grid.Col>

        {/* Tipo de Cuenta */}
        <Grid.Col span={{ base: 6, sm: 3 }}>
          <Stack gap={2} align="center">
            <Text
              size="10px"
              fw={700}
              className="text-zinc-600 uppercase tracking-widest text-center"
            >
              TIPO CUENTA
            </Text>
            <Badge
              color={isCuentaSueldo ? "violet" : "cyan"}
              variant="light"
              size="sm"
              radius="xl"
              className="whitespace-nowrap px-3"
            >
              {isCuentaSueldo ? "Cuenta Sueldo" : "Cuenta Corriente"}
            </Badge>
          </Stack>
        </Grid.Col>

        {/* Moneda */}
        <Grid.Col span={{ base: 6, sm: 2 }}>
          <Stack gap={2} align="center">
            <Text
              size="10px"
              fw={700}
              className="text-zinc-600 uppercase tracking-widest text-center"
            >
              MONEDA
            </Text>
            <Badge
              color={isSoles ? "blue" : "emerald"}
              variant="light"
              size="sm"
              radius="xl"
              leftSection={<IconCash size={12} />}
              className="whitespace-nowrap px-3"
            >
              {cuenta.moneda}
            </Badge>
          </Stack>
        </Grid.Col>

        {/* CCI */}
        <Grid.Col span={{ base: 12, sm: 3 }}>
          <Stack gap={2} align="center">
            <Text
              size="10px"
              fw={700}
              className="text-zinc-600 uppercase tracking-widest text-center"
            >
              CCI
            </Text>
            {cuenta.cci ? (
              <Text size="xs" fw={500} className="text-zinc-300 font-mono text-center">
                {cuenta.cci}
              </Text>
            ) : (
              <Text size="xs" className="text-zinc-700 italic text-center">
                No registrado
              </Text>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  );
};
