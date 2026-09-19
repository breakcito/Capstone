import {
  Badge,
  Button,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea,
  Paper,
} from "@mantine/core";
import {
  CalculatorIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

import { useAjusteStock } from "../hooks/useAjusteStock";
import type { RES_Lote } from "../service/lotes.responses";
import { formatNumber } from "../../../shared/functions/formatNumber";

interface AjusteStockModalProps {
  lote: RES_Lote;
  onSuccess: (lote: RES_Lote) => void;
  onCancel: () => void;
}

export const AjusteStockModal = ({
  lote,
  onSuccess,
  onCancel,
}: AjusteStockModalProps) => {
  const {
    nuevoStock,
    nuevoStockBase,
    motivo,
    setMotivo,
    submitting,
    error,
    isSame,
    diff,
    handleStockChange,
    handleBaseStockChange,
    handleSubmit,
  } = useAjusteStock({ lote, onSuccess });

  const inputClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500",
    dropdown:
      "bg-zinc-950 border-zinc-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl",
    option:
      "text-zinc-300 hover:bg-zinc-800 hover:text-white data-[selected]:bg-indigo-600 data-[selected]:text-white font-medium transition-colors",
    label: "text-zinc-300 mb-1 font-medium",
    description: "text-zinc-500 text-[10px] italic mt-1",
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      {/* Header con Info del Lote */}
      <Paper
        withBorder
        p="md"
        radius="lg"
        className="bg-zinc-900/20 border-zinc-800"
      >
        <Group justify="space-between">
          <Stack gap={2}>
            <Text
              size="10px"
              fw={800}
              c="zinc.5"
              className="uppercase tracking-[0.2em] leading-none mb-1 text-zinc-500"
            >
              Lote Seleccionado
            </Text>
            <Text
              fw={800}
              size="md"
              className="text-zinc-100 uppercase tracking-tight"
            >
              {lote.producto}
            </Text>
          </Stack>
          <Badge
            variant="light"
            color="violet"
            size="sm"
            radius="sm"
            className="font-bold border border-violet-500/20"
          >
            {lote.correlativo}
          </Badge>
        </Group>
      </Paper>

      {/* 1. Inputs de Cantidades (Grid Superior) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NumberInput
          label={`Stock (${lote.unidad_medida_abv})`}
          placeholder="0"
          min={0}
          value={nuevoStock}
          onChange={handleStockChange}
          radius="lg"
          size="sm"
          classNames={inputClasses}
        />

        <NumberInput
          label={`Nuevo stock total (${lote.unidad_medida_base_abv})`}
          placeholder="0"
          min={0}
          value={nuevoStockBase}
          onChange={handleBaseStockChange}
          radius="lg"
          size="sm"
          classNames={inputClasses}
        />

        <NumberInput
          label={`Contenido por ${lote.unidad_medida_abv}`}
          value={lote.contenido_por_presentacion}
          readOnly
          disabled
          radius="lg"
          size="sm"
          classNames={inputClasses}
        />
      </div>

      {/* 2. Panel de Variación (Horizontal en el medio) */}
      <Paper
        withBorder
        p="sm"
        radius="lg"
        className={`w-full transition-all duration-300 border-zinc-800 bg-zinc-900/10 ${
          !isSame
            ? diff > 0
              ? "bg-teal-950/20 border-teal-500/30"
              : "bg-red-950/20 border-red-500/30"
            : ""
        }`}
      >
        <Group justify="center" gap="xl">
          <div
            className={`p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors ${
              isSame
                ? "bg-zinc-800"
                : diff > 0
                  ? "bg-teal-500/10"
                  : "bg-red-500/10"
            }`}
          >
            {isSame ? (
              <CalculatorIcon className="w-5 h-5 text-zinc-600" />
            ) : diff > 0 ? (
              <CheckCircleIcon className="w-5 h-5 text-teal-500" />
            ) : (
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            )}
          </div>

          <div className="flex flex-col items-center">
            <Text
              size="10px"
              c="zinc.5"
              fw={800}
              className="uppercase tracking-[0.2em] leading-none mb-1 text-zinc-500"
            >
              Variación
            </Text>
            <Group gap="xs" align="baseline">
              <Text
                size="lg"
                fw={800}
                c={isSame ? "zinc.5" : diff > 0 ? "teal" : "red"}
                className="leading-none"
              >
                {isSame
                  ? "0.00"
                  : diff > 0
                    ? `+${formatNumber(diff)}`
                    : formatNumber(diff)}
              </Text>
              <Text size="xs" c="zinc.4" fw={600} className="italic opacity-80">
                {lote.unidad_medida_base_abv}
              </Text>
            </Group>
          </div>

          {!isSame && (
            <Badge
              variant="light"
              color={diff > 0 ? "teal" : "red"}
              size="sm"
              className="font-black px-4 py-3"
            >
              {diff > 0 ? "INGRESO" : "SALIDA"}
            </Badge>
          )}
        </Group>
      </Paper>

      {/* 3. Motivo (Full Width al fondo) */}
      <Textarea
        label="Motivo del ajuste"
        placeholder="Ej: Error de digitación, merma por derrame, etc."
        minRows={3}
        withAsterisk
        value={motivo}
        onChange={(e) => setMotivo(e.currentTarget.value)}
        radius="lg"
        size="sm"
        classNames={inputClasses}
      />

      {/* Avisos y Errores */}
      {isSame && (
        <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 shrink-0" />
          <Text size="xs" c="amber.5" fw={600}>
            Aviso: No has realizado ningún cambio. Ingresa una cantidad
            diferente para aplicar el ajuste.
          </Text>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-xl">
          <Text c="red.5" size="xs" ta="center" fw={700}>
            {error}
          </Text>
        </div>
      )}

      {/* Footer Buttons */}
      <Group
        justify="flex-end"
        mt="md"
        gap="md"
        className="pt-6 border-t border-zinc-800/40"
      >
        <Button
          variant="subtle"
          onClick={onCancel}
          disabled={submitting}
          radius="lg"
          size="sm"
          className="text-zinc-500 hover:text-white font-bold"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={submitting}
          radius="lg"
          size="sm"
          className="bg-linear-to-r from-zinc-100 to-zinc-300 text-zinc-900 font-bold hover:from-white hover:to-zinc-200 shadow-lg border-0 px-8"
          disabled={isSame || submitting}
        >
          Confirmar Ajuste
        </Button>
      </Group>
    </form>
  );
};
