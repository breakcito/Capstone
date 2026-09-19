import {
  Button,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
  Badge,
  Checkbox,
  NumberInput,
} from "@mantine/core";
import {
  BoltIcon,
  FireIcon,
  HandThumbUpIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useRegistrarSolicitudLogistica } from "../../hooks/useRegistrarSolicitudLogistica";
import { Premura } from "../../../../shared/enums/_generic/premura";
import { CustomDatePicker } from "../../../../presentation/utils/date-picker-input";
import type { DetalleRequerimientoExtendido } from "../../service/atencion.responses";
import { formatNumber } from "../../../../shared/functions/formatNumber";
import type { RES_RequerimientoAlmacen } from "../../../../service/responses/requerimientos-almacen/requerimiento-almacen";

interface RegistrarSolicitudLogisticaProps {
  requerimiento: RES_RequerimientoAlmacen;
  detalles: DetalleRequerimientoExtendido[];
  onSuccess: (ids?: number[]) => void;
  onCancel: () => void;
}

const inputClasses = {
  input:
    "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
  dropdown: "bg-zinc-900 border-zinc-800 shadow-2xl ",
  option:
    "hover:bg-zinc-800 text-zinc-300 data-[selected]:bg-zinc-100 data-[selected]:text-zinc-900 rounded-md my-1",
  label: "text-zinc-300 mb-1.5 font-semibold tracking-tight",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex flex-col gap-2 mb-6">
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-amber-500" />
      <Text fw={700} size="sm" c="white" className="tracking-tight uppercase">
        {title}
      </Text>
    </div>
    <div className="h-0.5 w-full bg-linear-to-r from-amber-500/50 to-transparent rounded-full" />
  </div>
);

export const RegistrarSolicitudLogistica = ({
  requerimiento,
  detalles,
  onSuccess,
  onCancel,
}: RegistrarSolicitudLogisticaProps) => {
  const {
    state: {
      submitting,
      localSelectedIds,
      observacion,
      premura,
      fechaEntrega,
      comentarios,
      cantidades,
      factores,
      cantidadesBase,
      itemsPendientes,
      itemsSeleccionados,
    },
    actions: {
      setObservacion,
      setPremura,
      setFechaEntrega,
      setComentarios,
      setCantidades,
      setCantidadesBase,
      toggleSelection,
      toggleAll,
      handleConsultar,
    },
  } = useRegistrarSolicitudLogistica({ requerimiento, detalles, onSuccess });

  return (
    <Stack gap={32} p="md">
      <section>
        <SectionHeader
          icon={ClipboardDocumentListIcon}
          title="Datos Generales"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
          <CustomDatePicker
            label="Fecha de Entrega (opc.)"
            placeholder="Seleccione fecha"
            value={fechaEntrega}
            onChange={(val) => setFechaEntrega(val as Date | null)}
            radius="lg"
            minDate={new Date()}
          />

          <TextInput
            label="Observación"
            placeholder="Algún motivo o comentario general..."
            value={observacion}
            onChange={(e) => setObservacion(e.currentTarget.value)}
            classNames={inputClasses}
            radius="lg"
            size="sm"
          />

          <div className="lg:col-span-3 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50">
            <Group justify="space-between" align="center" wrap="nowrap">
              <Stack gap={0}>
                <Text
                  size="xs"
                  fw={700}
                  className="text-zinc-400 uppercase tracking-widest"
                >
                  Prioridad
                </Text>
                <Text size="sm" fw={600} className="text-white">
                  Nivel de Urgencia
                </Text>
              </Stack>
              <Group gap="xs">
                <Button
                  size="xs"
                  variant={premura === Premura.Normal ? "filled" : "light"}
                  color="blue"
                  onClick={() => setPremura(Premura.Normal)}
                  leftSection={<HandThumbUpIcon className="w-3.5 h-3.5" />}
                  radius="md"
                  className="h-10 px-5 font-bold"
                >
                  NORMAL
                </Button>
                <Button
                  size="xs"
                  variant={premura === Premura.Urgente ? "filled" : "light"}
                  color="orange"
                  onClick={() => setPremura(Premura.Urgente)}
                  leftSection={<BoltIcon className="w-3.5 h-3.5" />}
                  radius="md"
                  className="h-10 px-5 font-bold"
                >
                  URGENTE
                </Button>
                <Button
                  size="xs"
                  variant={premura === Premura.Emergencia ? "filled" : "light"}
                  color="red"
                  onClick={() => setPremura(Premura.Emergencia)}
                  leftSection={<FireIcon className="w-3.5 h-3.5" />}
                  radius="md"
                  className="h-10 px-5 font-bold"
                >
                  EMERGENCIA
                </Button>
              </Group>
            </Group>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader icon={ShoppingCartIcon} title="Items a solicitar" />
        <div className="overflow-x-auto rounded-xl border border-zinc-800 shadow-sm">
          <Table variant="unstyled" className="w-full text-zinc-300">
            <thead className="bg-zinc-900 text-zinc-400 text-xs font-medium uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-center w-12">
                  <Checkbox
                    size="xs"
                    checked={
                      localSelectedIds.length > 0 &&
                      localSelectedIds.length === itemsPendientes.length
                    }
                    indeterminate={
                      localSelectedIds.length > 0 &&
                      localSelectedIds.length !== itemsPendientes.length
                    }
                    onChange={toggleAll}
                    color="indigo"
                  />
                </th>
                <th className="px-4 py-3 text-left min-w-[180px]">Producto</th>
                <th className="px-4 py-3 text-center min-w-[200px] font-semibold whitespace-nowrap">
                  Cant. Requerida
                </th>
                <th className="px-4 py-3 text-center min-w-[200px] font-semibold">
                  Cant. a Solicitar
                </th>
                <th className="px-4 py-3 text-left min-w-[280px] font-semibold">
                  Comentarios
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
              {itemsPendientes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-zinc-500 italic"
                  >
                    No hay productos pendientes para consulta.
                  </td>
                </tr>
              ) : (
                itemsPendientes.map((item) => {
                  const isSelected = localSelectedIds.includes(
                    item.id_requerimiento_almacen_detalle,
                  );
                  const idDetalle = item.id_requerimiento_almacen_detalle;
                  const canSolicitada = cantidades[idDetalle] || 0;
                  const canBase = cantidadesBase[idDetalle] || 0;
                  const factorVal = factores[idDetalle] || 1;
                  const isDifferentUnit =
                    item.id_unidad_medida_req !== item.id_unidad_medida_base;

                  return (
                    <tr
                      key={idDetalle}
                      className={`${isSelected ? "hover:bg-white/5" : "opacity-40"} transition-colors`}
                    >
                      <td className="px-4 py-3 text-center">
                        <Checkbox
                          size="xs"
                          checked={isSelected}
                          onChange={() => toggleSelection(idDetalle)}
                          color="indigo"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Text size="sm" fw={700} className="text-zinc-100">
                          {item.producto}
                        </Text>
                      </td>
                      <td className="px-2 py-3 text-sm text-cente flex flex-row justify-center items-center gap-0.5">
                        <Badge
                          variant="filled"
                          color="teal.9"
                          radius="sm"
                          className="text-white font-bold h-7 px-3 shadow-lg shadow-teal-900/40"
                        >
                          {formatNumber(item.cantidad_solicitada)}{" "}
                          {item.unidad_medida_req_abv}
                        </Badge>
                        {item.id_unidad_medida_req !=
                          item.id_unidad_medida_base && (
                          <>
                            <Badge
                              variant="light"
                              color="zinc"
                              radius="sm"
                              size="sm"
                              className="font-medium whitespace-nowrap"
                            >
                              {formatNumber(item.contenido_por_presentacion)}{" "}
                              {item.unidad_medida_base_abv}{" "}
                              <span className="lowercase">x</span>{" "}
                              {item.unidad_medida_req_abv}
                            </Badge>
                            <Badge
                              variant="filled"
                              color="pink"
                              radius="sm"
                              className="font-bold shadow-xs whitespace-nowrap"
                            >
                              {formatNumber(item.cantidad_solicitada_base)}{" "}
                              {item.unidad_medida_base_abv}
                            </Badge>
                          </>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Group gap="xs" justify="center" wrap="nowrap">
                          {isDifferentUnit && (
                            <>
                              {/* Cantidad en Unidad Elegida */}
                              <NumberInput
                                size="xs"
                                radius="md"
                                disabled={!isSelected}
                                value={canSolicitada || ""}
                                onChange={(val) => {
                                  const num = Number(val);
                                  setCantidades((prev) => ({
                                    ...prev,
                                    [idDetalle]: num,
                                  }));
                                  setCantidadesBase((prev) => ({
                                    ...prev,
                                    [idDetalle]: Number(
                                      (num * (factorVal || 1)).toFixed(4),
                                    ),
                                  }));
                                }}
                                min={0}
                                placeholder="0"
                                rightSection={
                                  <Text size="10px" fw={800} c="zinc.5">
                                    {item.unidad_medida_req_abv}
                                  </Text>
                                }
                                rightSectionWidth={35}
                                className="w-24"
                                classNames={{
                                  input:
                                    "bg-zinc-900 border-zinc-800 text-right pr-9 font-bold text-xs h-9",
                                }}
                              />
                            </>
                          )}

                          {/* Cantidad Base */}
                          <NumberInput
                            size="xs"
                            radius="md"
                            disabled={!isSelected}
                            value={canBase || ""}
                            onChange={(val) => {
                              const num = Number(val);
                              setCantidadesBase((prev) => ({
                                ...prev,
                                [idDetalle]: num,
                              }));
                              if (isDifferentUnit) {
                                setCantidades((prev) => ({
                                  ...prev,
                                  [idDetalle]: Number(
                                    (num / (factorVal || 1)).toFixed(4),
                                  ),
                                }));
                              } else {
                                setCantidades((prev) => ({
                                  ...prev,
                                  [idDetalle]: num,
                                }));
                              }
                            }}
                            min={0}
                            placeholder="0"
                            rightSection={
                              <Text size="10px" fw={800} c="indigo.4">
                                {item.unidad_medida_base_abv}
                              </Text>
                            }
                            rightSectionWidth={35}
                            className={`${isDifferentUnit ? "w-24" : "w-32 mx-auto"}`}
                            classNames={{
                              input: `bg-zinc-900 border-zinc-800 text-right pr-9 font-bold text-xs h-9 ${!isDifferentUnit ? "border-indigo-500/30 ring-1 ring-indigo-500/20" : ""}`,
                            }}
                          />
                        </Group>
                      </td>
                      <td className="px-4 py-3">
                        <TextInput
                          placeholder="Comentario opcional..."
                          size="sm"
                          radius="lg"
                          disabled={!isSelected}
                          value={comentarios[idDetalle] || ""}
                          onChange={(e) =>
                            setComentarios((prev) => ({
                              ...prev,
                              [idDetalle]: e.target.value,
                            }))
                          }
                          classNames={inputClasses}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </section>

      <Group justify="flex-end" mt="md">
        <Button
          variant="subtle"
          onClick={onCancel}
          disabled={submitting}
          radius="lg"
          className="text-zinc-400 hover:text-white"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConsultar}
          loading={submitting}
          disabled={itemsSeleccionados.length === 0}
          radius="lg"
          className="bg-zinc-100 text-zinc-900 font-semibold hover:bg-white shadow-lg border-0 px-8"
        >
          Enviar Solicitud
        </Button>
      </Group>
    </Stack>
  );
};
