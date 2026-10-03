import { useState } from "react";
import {
  Stack,
  Text,
  Badge,
  Paper,
  Group,
  Collapse,
  UnstyledButton,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import dayjs from "dayjs";
import { useHistorialEntregasRequerimiento } from "../../hooks/useHistorialEntregasRequerimiento";
import {
  TruckIcon,
  CalendarDaysIcon,
  UserIcon,
  ClipboardDocumentCheckIcon,
  CubeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { formatNumber } from "../../../../shared/functions/formatNumber";
import { ArchivoCard } from "../../../../presentation/utils/archivo/archivo-card";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { Estado_EntregaRequerimiento } from "../../../../shared/enums/requerimiento-almacen/requerimiento-entrega";
import { ModalAnularEntrega } from "../components/ModalAnularEntrega";

interface HistorialProps {
  idRequerimiento: number;
  readOnly?: boolean;
  /**
   * Callback que se llama cuando una entrega fue anulada exitosamente.
   * La pagina padre lo usa para refrescar el requerimiento completo
   * (porque la entrega afecta la cantidad_entregada_base del detalle).
   */
  onEntregaAnulada?: (idEntrega: number) => void;
}

export const HistorialEntregasRequerimiento = ({
  idRequerimiento,
  readOnly = false,
  onEntregaAnulada,
}: HistorialProps) => {
  const { loading, historial, error } =
    useHistorialEntregasRequerimiento(idRequerimiento);

  // Mantiene el estado de qué entregas están expandidas. Por defecto, expandir la primera.
  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});

  // Modal de anulacion de entrega
  const [entregaAAnular, setEntregaAAnular] = useState<{
    id_requerimiento_almacen_entrega: number;
    correlativo: string;
    estado: string;
  } | null>(null);
  const [openedAnularEntrega, setOpenedAnularEntrega] = useState(false);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isExpanded = (id: number, index: number) => {
    if (expandedIds[id] !== undefined) return expandedIds[id];
    return index === 0; // Abre la primera por defecto
  };

  // Skeleton mientras carga: muestra 3 placeholders animados con la
  // misma forma que una tarjeta de entrega, asi el usuario sabe que
  // se estan trayendo los datos.
  if (loading) {
    return (
      <Stack gap="md" className="pt-2 px-2" data-testid="historial-skeleton">
        {[0, 1, 2].map((i) => (
          <Paper
            key={i}
            radius="xl"
            className="bg-zinc-900/30 border border-zinc-800/80 p-4 shrink-0"
          >
            <div className="p-5 sm:p-6 flex items-center gap-4">
              <div className="p-3 bg-zinc-800/50 rounded-2xl border border-zinc-700/50 shrink-0">
                <div className="w-6 h-6 bg-zinc-700/60 rounded animate-pulse" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 bg-zinc-700/60 rounded animate-pulse" />
                <div className="h-2 w-48 bg-zinc-800/60 rounded animate-pulse" />
              </div>
            </div>
          </Paper>
        ))}
      </Stack>
    );
  }

  // Orden importante: primero verificamos el empty state (caso normal
  // cuando no hay entregas). Solo si el error es real Y todavia no
  // hay historial para mostrar, mostramos el mensaje de error. Asi un
  // falso positivo del catch (por CORS, timeout, etc.) no tapa el
  // empty state cuando el backend en realidad respondio bien.

  if (historial.length === 0)
    return (
      <div className="py-12 text-center flex flex-col items-center gap-3">
        <div className="p-4 bg-zinc-900/30 rounded-full border border-zinc-800/50">
          <TruckIcon className="w-8 h-8 text-zinc-600" />
        </div>
        <Text c="zinc.5" size="sm" fw={600}>
          No se han registrado entregas para este requerimiento.
        </Text>
        <Text c="zinc.6" size="xs">
          Cuando registres una entrega, aparecera aqui.
        </Text>
      </div>
    );

  if (error)
    return (
      <div className="py-10 text-center flex flex-col items-center gap-3">
        <Text c="dimmed" size="sm" fw={600}>
          {error}
        </Text>
        <Text c="zinc.6" size="xs">
          Si el problema persiste, contacte al administrador.
        </Text>
      </div>
    );

  return (
    <Stack
      gap="xl"
      className="font-sans pt-2 pb-6 max-h-[70vh] overflow-y-auto px-2"
    >
      {historial.map((h, index) => {
        const expanded = isExpanded(h.id_requerimiento_almacen_entrega, index);

        return (
          <Paper
            key={h.id_requerimiento_almacen_entrega}
            radius="xl"
            className="bg-zinc-900/30 border border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all hover:bg-zinc-900/50 hover:border-indigo-500/20 group relative overflow-hidden p-4 shrink-0"
          >
            {/* Elemento decorativo superior */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-violet-500/20 via-indigo-500/40 to-indigo-500/5 group-hover:from-violet-500/40 group-hover:via-indigo-500/60 transition-colors" />

            <UnstyledButton
              className="w-full p-5 sm:p-6"
              onClick={() => toggleExpand(h.id_requerimiento_almacen_entrega)}
            >
              <Group
                justify="space-between"
                align="center"
                wrap="nowrap"
                gap="xl"
              >
                <Group gap="md" wrap="nowrap" className="shrink-0">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors shrink-0">
                    <TruckIcon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Group gap="xs">
                      <Text
                        size="sm"
                        fw={900}
                        className="text-white tracking-wide"
                      >
                        {h.correlativo}
                      </Text>
                      <Badge
                        variant="light"
                        color={
                          h.estado === Estado_EntregaRequerimiento.Entregado
                            ? "teal"
                            : "red"
                        }
                        radius="sm"
                        className="font-bold"
                        size="xs"
                      >
                        {h.estado}
                      </Badge>
                      {!readOnly &&
                        h.estado === Estado_EntregaRequerimiento.Entregado && (
                        <Tooltip
                          label="Anular entrega y reintegrar stock al lote"
                          position="top"
                          withArrow
                        >
                          <ActionIcon
                            size="xs"
                            color="red"
                            variant="light"
                            radius="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEntregaAAnular({
                                id_requerimiento_almacen_entrega:
                                  h.id_requerimiento_almacen_entrega,
                                correlativo: h.correlativo,
                                estado: h.estado,
                              });
                              setOpenedAnularEntrega(true);
                            }}
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Group>
                    <Group gap="xs" className="text-zinc-400" wrap="nowrap">
                      <Group gap="xs" wrap="nowrap">
                        <CalendarDaysIcon className="w-4 h-4 shrink-0 text-indigo-400/70" />
                        <Text size="xs" fw={600} className="whitespace-nowrap">
                          {dayjs(h.fecha_hora_entrega).format(
                            "DD/MM/YYYY hh:mm A",
                          )}
                        </Text>
                      </Group>
                      <Group
                        gap="xs"
                        className="bg-zinc-950/50 px-2.5 py-1 rounded-md border border-zinc-800/60 ml-1 shrink-0"
                        wrap="nowrap"
                      >
                        <UserIcon className="w-3 h-3 text-zinc-400" />
                        <Text
                          size="10px"
                          fw={700}
                          c="zinc.4"
                          className="whitespace-nowrap"
                        >
                          Por:{" "}
                          <span className="text-zinc-300">
                            {h.empleado_entrega}
                          </span>
                        </Text>
                      </Group>
                    </Group>
                  </div>
                </Group>

                <Group
                  gap="lg"
                  wrap="nowrap"
                  justify="flex-end"
                  className="flex-1 min-w-0"
                >
                  <div className="text-right hidden md:flex flex-col items-end gap-0.5 truncate shrink">
                    <Text
                      size="9px"
                      c="zinc.5"
                      fw={800}
                      className="uppercase tracking-widest"
                    >
                      Entregado a
                    </Text>
                    <Text
                      size="sm"
                      fw={800}
                      className="text-zinc-200 truncate max-w-[200px] lg:max-w-[300px]"
                    >
                      {h.contratista_recibe
                        ? `${h.contratista_recibe}`
                        : h.empleado_recibe || "—"}
                    </Text>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-zinc-800/40 flex items-center justify-center shrink-0 border border-zinc-700/50 group-hover:bg-zinc-800/80 transition-colors">
                    {expanded ? (
                      <ChevronUpIcon className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-zinc-400" />
                    )}
                  </div>
                </Group>
              </Group>
            </UnstyledButton>

            <Collapse in={expanded}>
              <div className="px-6 pt-2 border-t border-zinc-800/30">
                <div className="mb-6 bg-zinc-950/40 rounded-xl p-4 border border-zinc-800/40 flex gap-3 items-start shadow-inner">
                  <ClipboardDocumentCheckIcon className="w-5 h-5 text-indigo-400/50 mt-0.5 shrink-0" />
                  <div>
                    <Text
                      size="10px"
                      fw={800}
                      c="zinc.5"
                      className="uppercase tracking-widest mb-1.5"
                    >
                      Observaciones de la Entrega
                    </Text>
                    <Text
                      size="sm"
                      c="zinc.3"
                      className="italic max-w-2xl leading-relaxed"
                    >
                      {h.observacion || "Sin observaciones adicionales."}
                    </Text>
                  </div>
                </div>

                {/* Sección de Evidencias */}
                {h.evidencias && h.evidencias.length > 0 && (
                  <div className="mt-8 pb-4">
                    <Group gap="xs" mb="md" className="pl-1">
                      <PaperClipIcon className="w-4 h-4 text-zinc-500" />
                      <Text
                        size="xs"
                        fw={800}
                        c="zinc.4"
                        className="uppercase tracking-widest"
                      >
                        Evidencias de Entrega ({h.evidencias.length})
                      </Text>
                    </Group>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {h.evidencias.map((ev, idx) => (
                        <ArchivoCard
                          key={`${h.id_requerimiento_almacen_entrega}-ev-${idx}`}
                          archivo={ev}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <Group gap="xs" mb="md" mt="md" className="pl-1">
                  <CubeIcon className="w-4 h-4 text-zinc-500" />
                  <Text
                    size="xs"
                    fw={800}
                    c="zinc.4"
                    className="uppercase tracking-widest"
                  >
                    Productos Despachados ({h.detalles?.length || 0})
                  </Text>
                </Group>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pb-2">
                  {h.detalles?.map((d) => (
                    <div
                      key={d.id_entrega_detalle}
                      className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/40 hover:border-indigo-500/30 transition-colors flex justify-between items-center relative overflow-hidden group/item"
                    >
                      {/* Highlight lateral en hover item */}
                      <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500/0 group-hover/item:bg-indigo-500/50 transition-colors" />

                      <div className="flex flex-col gap-1.5 pl-2 z-10 w-full pr-4">
                        <Text
                          size="sm"
                          fw={900}
                          className="text-white leading-tight"
                        >
                          {d.producto}
                        </Text>

                        <Group gap="xs" wrap="nowrap" align="center">
                          <CubeIcon className="w-3.5 h-3.5 text-indigo-400" />
                          <Text
                            size="11px"
                            fw={800}
                            c="zinc.4"
                            className="uppercase tracking-widest leading-none"
                          >
                            Lote/Activo:
                          </Text>
                          <Badge
                            variant="light"
                            color="indigo"
                            size="sm"
                            className="font-bold tracking-wider"
                          >
                            {d.correlativo || d.correlativo_activo_fijo}
                          </Badge>
                        </Group>
                      </div>

                      <div className="text-right pl-4 pr-1 border-l border-zinc-800/50 min-w-max z-10 flex flex-col items-end justify-center">
                        <Group gap="xs" wrap="nowrap" align="center">
                          <Text
                            size="md"
                            fw={900}
                            className="text-emerald-400 font-mono leading-none"
                          >
                            +{formatNumber(d.cantidad_lote)}
                          </Text>
                          <Text
                            size="12px"
                            fw={800}
                            c="zinc.5"
                            className="uppercase tracking-widest bg-zinc-900 px-2 py-0.5 rounded-md inline-block mr-1"
                          >
                            {d.unidad_lote_abv || "UND"}
                          </Text>

                          {d.unidad_lote_abv !== d.unidad_base_abv && (
                            <>
                              <div className="w-px h-6 bg-zinc-800/80 mx-1"></div>
                              <Text
                                size="md"
                                fw={700}
                                className="text-emerald-500/70 font-mono leading-none"
                              >
                                +{formatNumber(d.cantidad_base)}
                              </Text>
                              <Text
                                size="12px"
                                fw={800}
                                c="zinc.5"
                                className="uppercase tracking-widest bg-zinc-900/50 px-1.5 py-0.5 rounded-md inline-block"
                              >
                                {d.unidad_base_abv}
                              </Text>
                            </>
                          )}
                        </Group>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Collapse>
          </Paper>
        );
      })}

      <ModalAnularEntrega
        opened={openedAnularEntrega}
        close={() => {
          setOpenedAnularEntrega(false);
          setEntregaAAnular(null);
        }}
        entrega={entregaAAnular}
        onAnulada={(idEntrega) => {
          setOpenedAnularEntrega(false);
          setEntregaAAnular(null);
          if (onEntregaAnulada) {
            onEntregaAnulada(idEntrega);
          }
        }}
      />
    </Stack>
  );
};
