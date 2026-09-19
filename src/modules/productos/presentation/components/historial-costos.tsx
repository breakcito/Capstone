import { Stack, ThemeIcon, Text, Group, Box, Badge } from "@mantine/core";
import {
  TableCellsIcon,
  CubeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { formatNumber } from "../../../../shared/functions/formatNumber";
import { type RES_LogCostoPromedio } from "../../service/productos.responses";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { motion, AnimatePresence } from "motion/react";

dayjs.locale("es");

interface HistorialCostosProps {
  logs: RES_LogCostoPromedio[];
  productoNombre: string;
}

export const HistorialCostos = ({
  logs,
  productoNombre,
}: HistorialCostosProps) => {
  const sortedLogs = [...logs].sort((a, b) =>
    dayjs(b.created_at).diff(dayjs(a.created_at)),
  );

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800">
        <TableCellsIcon className="w-10 h-10 text-zinc-700 mb-3" />
        <p className="text-zinc-500 text-sm font-medium">
          No se encontraron variaciones registradas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header — Estilo Minas/Labores */}
      <div className="flex items-center justify-between bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4">
        <Group gap="md">
          <ThemeIcon
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
            size="xl"
            radius="md"
          >
            <CubeIcon className="w-6 h-6 text-white" />
          </ThemeIcon>
          <Stack gap={0}>
            <Text
              size="10px"
              fw={800}
              className="text-zinc-100 tracking-widest"
            >
              Producto
            </Text>
            <h3 className="text-sm font-bold text-white truncate">
              {productoNombre}
            </h3>
          </Stack>
        </Group>

        <Stack gap={2} align="flex-end">
          <Text
            size="10px"
            fw={800}
            className="text-zinc-100 tracking-widest"
          >
            Última variación
          </Text>
          <Badge
            size="xs"
            variant="light"
            color="cyan"
            radius="sm"
            className="font-bold border-cyan-500/20"
          >
            {dayjs(sortedLogs[0].created_at).format("DD/MM/YYYY")}
          </Badge>
        </Stack>
      </div>

      {/* Lista de Registros */}
      <Stack gap="sm">
        <AnimatePresence>
          {sortedLogs.map((log, idx) => {
            const diff =
              log.costo_promedio_resultante - log.costo_promedio_anterior;
            const subida = diff > 0;
            const porcentaje = (
              (diff / log.costo_promedio_anterior) *
              100
            ).toFixed(1);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 gap-3 hover:border-zinc-700/80 hover:bg-zinc-900/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="light"
                    color="indigo"
                    size="xs"
                    radius="sm"
                    className="font-bold border-indigo-500/20"
                    leftSection={<CalendarIcon className="w-3 h-3" />}
                  >
                    {dayjs(log.created_at).format("DD [de] MMMM, YYYY · HH:mm")}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-4 px-3 py-2 rounded-lg bg-zinc-800/40 border border-zinc-800/60">
                  <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center">
                    <Stack gap={0}>
                      <span className="text-[10px] text-zinc-100 font-bold tracking-wider block mb-0.5">
                        Costo anterior
                      </span>
                      <Text size="sm" fw={600} className="text-zinc-400">
                        S/. {formatNumber(log.costo_promedio_anterior)}
                      </Text>
                    </Stack>

                    <div className="text-white font-bold px-6 text-center">→</div>

                    <Stack gap={0}>
                      <span className="text-[10px] text-zinc-100 font-bold tracking-wider block mb-0.5">
                        Costo resultante
                      </span>
                      <Text size="sm" fw={700} className="text-white">
                        S/. {formatNumber(log.costo_promedio_resultante)}
                      </Text>
                    </Stack>
                  </div>

                  <div className="h-6 w-px bg-zinc-700/50 mx-4" />

                  <Box className="flex flex-col items-start min-w-[130px]">
                    <Group gap={4} align="center">
                      {subida ? (
                        <ArrowUpIcon className="w-3 h-3 text-rose-500" />
                      ) : (
                        <ArrowDownIcon className="w-3 h-3 text-emerald-500" />
                      )}
                      <Text
                        fw={800}
                        size="sm"
                        className={subida ? "text-rose-500" : "text-emerald-500"}
                      >
                        {subida ? "+" : "-"} {formatNumber(Math.abs(diff))}
                      </Text>
                    </Group>
                    <Text
                      size="10px"
                      fw={600}
                      className={
                        subida ? "text-rose-400/50" : "text-emerald-400/50"
                      }
                    >
                      {subida ? "Incremento" : "Reducción"} de{" "}
                      {Math.abs(Number(porcentaje))}%
                    </Text>
                  </Box>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Stack>
    </div>
  );
};
