import {
  ActionIcon,
  Badge,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Checkbox,
  Tooltip,
} from "@mantine/core";
import {
  ShoppingCartIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  UserGroupIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { useRegistroRequerimiento } from "../../hooks/useRegistroRequerimiento";
import type { ModoRequerimiento } from "../../hooks/useRegistroRequerimiento";
import { TipoBien } from "../../../../shared/enums/_generic/tipo-producto";
import { CustomDatePicker } from "../../../../presentation/utils/date-picker-input";
import { enPlural } from "../../../../shared/functions/en-plural";
import { formatNumber } from "../../../../shared/functions/formatNumber";
import { MultiFilePicker } from "../../../../presentation/utils/archivo/multifile-picker";
import type { RES_Producto } from "../../../../service/responses/producto";
import type { RES_UnidadMedida } from "../../../../service/responses/unidad-medida";
import type {
  RES_DetalleRequerimiento,
  RES_RequerimientoAlmacen,
} from "../../../../service/responses/requerimientos-almacen/requerimiento-almacen";

interface RegistroRequerimientoProps {
  modo?: ModoRequerimiento;
  onSuccess: (
    item: RES_RequerimientoAlmacen,
    printerTarget?: string,
    printerWin?: Window | null,
  ) => void;
  onCancel: () => void;
  idAlmacenFijo?: number;
  requerimientoInicial?: RES_RequerimientoAlmacen;
  detallesIniciales?: RES_DetalleRequerimiento[];
}

const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) => (
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

export const RegistroRequerimiento = ({
  modo = "crear",
  onSuccess,
  onCancel,
  idAlmacenFijo,
  requerimientoInicial,
  detallesIniciales,
}: RegistroRequerimientoProps) => {
  const {
    state: {
      empleados,
      contratistas,
      verContratistas,
      setVerContratistas,
      idEmpleadoSolicitante,
      setIdEmpleadoSolicitante,
      productos,
      unidades,
      detalles,
      fechaSolicitud,
      setFechaSolicitud,
      observacion,
      setObservacion,
      evidencias,
      setEvidencias,
      idProducto,
      setIdProducto,
      idUnidadMedida,
      setIdUnidadMedida,
      cantidad,
      setCantidad,
      contenido,
      setContenido,
      calculoInteligente,
      setCalculoInteligente,
      comentarioItem,
      setComentarioItem,
      productoBusqueda,
      setProductoBusqueda,
      unidadBusqueda,
      setUnidadBusqueda,
    },
    status: { submitting, error },
    derived: {
      sonUnidadesIdenticas,
      productoSeleccionado,
      conversionAutomatica,
      contenidoBloqueado,
      calculoInteligenteDisponible,
      canAdd,
      productosVisibles,
      unidadesVisibles,
    },
    actions: {
      agregarItem,
      eliminarItem,
      actualizarCantidadItems,
      actualizarValorMagnitud,
      actualizarCantidadDetalleItem,
      actualizarFactorItem,
      actualizarTotalBaseItem,
      handleSubmit,
    },
  } = useRegistroRequerimiento({
    modo,
    onSuccess,
    idAlmacenFijo,
    requerimientoInicial,
    detallesIniciales,
  });

  const esEdicion = modo === "editar";

  const inputClasses = {
    input:
      "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 transition-all",
    dropdown: "bg-zinc-900 border-zinc-800 shadow-2xl ",
    option:
      "hover:bg-zinc-800 text-zinc-300 data-[selected]:bg-zinc-100 data-[selected]:text-zinc-900 rounded-md my-1",
    label: "text-zinc-300 mb-1.5 font-semibold tracking-tight",
  };

  const unidadSeleccionada = unidades.find(
    (u) => u.id_unidad_medida === idUnidadMedida,
  );
  const unidadNombre = unidadSeleccionada?.nombre || "";
  const unidadAbbr = unidadSeleccionada?.abreviatura || "---";
  const baseAbbr = productoSeleccionado?.unidad_medida_base_abv || "---";

  /**
   * Modo "magnitud por ítem con unidades diferentes": el usuario ingresa
   * `cantidad` como N de ítems y `contenido` como la magnitud por ítem en la
   * unidad del detalle (ej. 1.5 metros por Guía). El total en detalle y
   * en base hay que calcularlo aplicando el factor de conversión.
   */
  const smartCalcMagnitudEnDetalle =
    calculoInteligente &&
    !sonUnidadesIdenticas &&
    conversionAutomatica !== null;

  /** Total en la unidad del detalle (lo que se muestra como "En metros" / "En centímetros"). */
  const totalDetalle = smartCalcMagnitudEnDetalle
    ? cantidad * contenido
    : cantidad;

  /** Total en la unidad base del producto (lo que va a Kardex / stock). */
  const totalBase = smartCalcMagnitudEnDetalle
    ? cantidad * contenido * (conversionAutomatica ?? 1)
    : cantidad * contenido;

  return (
    <Stack gap={24} p="xs" className="animate-fade-in">
      {/* cabecera del requerimiento  */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-6">
          {/* "Labor (opc.)" eliminado: la tabla requerimiento_almacen ya no
              tiene la columna id_labor. */}

          <div className="flex items-end gap-2">
            <Select
              label={
                verContratistas
                  ? "Solicitante (Contratista)"
                  : "Solicitante (Empleado)"
              }
              placeholder={
                verContratistas
                  ? "Seleccione contratista"
                  : "Seleccione empleado"
              }
              data={
                verContratistas
                  ? contratistas.map((r) => ({
                      // El endpoint /api/aux/contratistas devuelve
                      // `id_empleado` (porque los contratistas viven en la
                      // tabla empleado con es_contratista=1). Algunos
                      // endpoints viejos devuelven `id_contratista`.
                      value: String(
                        r.id_empleado ?? r.id_contratista ?? r.idContratista ?? 0,
                      ),
                      label:
                        r.nombre_completo ??
                        `${r.nombre ?? ""} ${r.apellido ?? ""}`.trim() ??
                        "",
                    }))
                  : empleados.map((r) => ({
                      value: String(r.id_empleado),
                      label: r.nombre_completo,
                    }))
              }
              value={
                idEmpleadoSolicitante ? String(idEmpleadoSolicitante) : null
              }
              onChange={(val) => setIdEmpleadoSolicitante(Number(val))}
              classNames={inputClasses}
              radius="lg"
              searchable
              className="flex-1"
              leftSection={
                verContratistas ? (
                  <BriefcaseIcon className="w-4 h-4 text-zinc-400" />
                ) : (
                  <UserIcon className="w-4 h-4 text-zinc-400" />
                )
              }
            />
            <Tooltip
              label={verContratistas ? "Ver empleados" : "Ver contratistas"}
              position="top"
              withArrow
            >
              <ActionIcon
                variant="light"
                color={verContratistas ? "teal" : "indigo"}
                onClick={() => {
                  setVerContratistas((prev) => !prev);
                  setIdEmpleadoSolicitante(0);
                }}
                radius="lg"
                className="shrink-0"
                style={{ height: 36, width: 36 }}
              >
                {verContratistas ? (
                  <UserIcon className="w-5 h-5" />
                ) : (
                  <UserGroupIcon className="w-5 h-5" />
                )}
              </ActionIcon>
            </Tooltip>
          </div>

          <CustomDatePicker
            label="Fecha de Solicitud"
            placeholder="Seleccione fecha"
            value={fechaSolicitud}
            onChange={(val) => setFechaSolicitud(val as Date | null)}
            radius="lg"
          />

          {/* "Fecha de Entrega (opc.)" eliminado: la tabla
              requerimiento_almacen ya no tiene la columna
              fecha_entrega_requerida. */}

          <div className="lg:col-span-2">
            <Textarea
              label="Observaciones Generales"
              placeholder="Notas sobre el requerimiento completo..."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              radius="lg"
              minRows={2}
              classNames={inputClasses}
            />
          </div>

          <div className="lg:col-span-3">
            {/* "Bloque de Prioridad (NORMAL/URGENTE/EMERGENCIA)" eliminado: la
                tabla requerimiento_almacen ya no tiene la columna premura. */}
            <MultiFilePicker
              label="Evidencias"
              files={evidencias}
              onFilesChange={setEvidencias}
            />
          </div>
        </div>
      </section>

      {/* inputs para llenar el detalle del requerimiento  */}
      <section>
        <SectionHeader
          icon={ShoppingCartIcon}
          title={esEdicion ? "Agregar más productos" : "Items a solicitar"}
        />

        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-6 items-end">
            <div className="md:col-span-3">
              <Select
                label="Producto"
                placeholder="Seleccione producto"
                data={productosVisibles.map((p: RES_Producto) => ({
                  value: String(p.id_producto),
                  label: p.nombre,
                }))}
                value={idProducto ? String(idProducto) : null}
                onChange={(val) => setIdProducto(Number(val))}
                searchable
                searchValue={productoBusqueda}
                onSearchChange={setProductoBusqueda}
                // Desactivar el filtro interno de Mantine (substring case-
                // insensitive SIN normalización de tildes). El filtrado real
                // lo hace getCoincidencias() y se ve reflejado en `data`.
                filter={({ options }) => options}
                nothingFoundMessage="Sin coincidencias"
                classNames={inputClasses}
                radius="lg"
                size="sm"
              />
            </div>

            <div className="md:col-span-3">
              <div className="flex items-center justify-between gap-2 mb-1.5 min-h-5">
                <Text
                  component="label"
                  fw={600}
                  fz="sm"
                  c="zinc.3"
                  className="tracking-tight"
                >
                  {calculoInteligente ? "Cantidad (ítems)" : "Cantidad"}
                </Text>
                {calculoInteligenteDisponible && (
                  <Tooltip
                    label="Cálculo inteligente: ingresa 'cantidad de ítems' y 'magnitud por ítem' por separado"
                    position="top"
                    withArrow
                    multiline
                    w={220}
                  >
                    <Checkbox
                      size="xs"
                      color="indigo"
                      radius="sm"
                      // label="Cálculo inteligente"
                      checked={calculoInteligente}
                      onChange={(event) =>
                        setCalculoInteligente(event.currentTarget.checked)
                      }
                      classNames={{
                        input: "cursor-pointer",
                        label:
                          "text-zinc-300 text-[11px] font-semibold uppercase tracking-wider cursor-pointer",
                      }}
                    />
                  </Tooltip>
                )}
              </div>
              <NumberInput
                placeholder="0"
                value={cantidad}
                onChange={(val) => setCantidad(Number(val))}
                min={0}
                classNames={inputClasses}
                radius="lg"
                size="sm"
              />
            </div>

            <div className="md:col-span-3">
              <Select
                label="Unidad de Medida"
                placeholder="Seleccione unidad"
                data={unidadesVisibles.map((u: RES_UnidadMedida) => ({
                  value: String(u.id_unidad_medida),
                  label: `${u.nombre} (${u.abreviatura})`,
                }))}
                value={idUnidadMedida ? String(idUnidadMedida) : null}
                onChange={(val) => setIdUnidadMedida(Number(val))}
                disabled={
                  productoSeleccionado?.tipo_bien === TipoBien.ActivoFijo
                }
                searchable
                searchValue={unidadBusqueda}
                onSearchChange={setUnidadBusqueda}
                // Ver comentario en el Select de Producto más arriba.
                filter={({ options }) => options}
                nothingFoundMessage="Sin coincidencias"
                classNames={inputClasses}
                radius="lg"
                size="sm"
              />
            </div>

            <div className="md:col-span-3">
              <Text
                component="label"
                fw={600}
                fz="sm"
                c="zinc.3"
                className="tracking-tight mb-1.5 block"
              >
                {calculoInteligente
                  ? // Magnitud por ítem: si las unidades son idénticas, la
                    // magnitud está en la unidad base; si difieren, está en
                    // la unidad del detalle seleccionada.
                    `${sonUnidadesIdenticas ? productoSeleccionado?.unidad_medida_base_abv || unidadAbbr : unidadAbbr} por ${productoSeleccionado?.nombre ? enPlural(productoSeleccionado.nombre.toLowerCase()) : "pieza"}`
                  : // Factor de conversión: "base x detalle" (1 detalle = N base).
                    `${productoSeleccionado?.unidad_medida_base_abv || "---"} x ${unidadAbbr}`}
              </Text>
              <NumberInput
                placeholder={
                  calculoInteligente
                    ? sonUnidadesIdenticas
                      ? "Ej: 70"
                      : "Ej: 1.2"
                    : conversionAutomatica !== null
                      ? "Auto-completado"
                      : "Ingrese el factor"
                }
                value={contenido}
                onChange={(val) => setContenido(Number(val))}
                min={calculoInteligente ? 0 : 0.01}
                disabled={contenidoBloqueado}
                classNames={inputClasses}
                radius="lg"
                size="sm"
              />
            </div>
            <div className="md:col-span-6 self-start flex flex-col gap-1.5">
              <span className="text-zinc-300 font-semibold tracking-tight text-[13px] md:text-sm">
                Comentario del ítem
              </span>
              {/* Bloque "Mantenimiento" eliminado: la tabla
                  requerimiento_almacen_detalle ya no tiene las columnas
                  para_mantenimiento / id_activo_fijo_destino. */}
              <TextInput
                placeholder="Notas adicionales para este producto..."
                value={comentarioItem}
                onChange={(e) => setComentarioItem(e.target.value)}
                classNames={inputClasses}
                radius="lg"
                size="sm"
              />
            </div>
            <div className="md:col-span-2 self-start mt-6.5">
              <Button
                onClick={agregarItem}
                disabled={!canAdd}
                variant="filled"
                color="indigo"
                size="sm"
                fullWidth
                className="shadow-lg h-10 mb-0.5"
                leftSection={<PlusIcon className="w-5 h-5 text-white" />}
                radius="lg"
              >
                Agregar
              </Button>
            </div>

            <div className="md:col-span-4 self-start ml-2">
              <Text
                component="div"
                size="xs"
                fw={700}
                c="zinc.5"
                mb="xs"
                className="uppercase tracking-widest flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                Resumen del pedido
              </Text>

              <Group gap="xl" wrap="nowrap">
                <Stack gap={2}>
                  <Text size="10px" c="zinc.5" fw={700} className="uppercase">
                    {calculoInteligente && sonUnidadesIdenticas
                      ? `Cantidad (${productoSeleccionado?.nombre ? enPlural(productoSeleccionado.nombre.toLowerCase()) : "piezas"})`
                      : `En ${unidadNombre ? enPlural(unidadNombre) : "---"}`}
                  </Text>
                  <div className="flex items-baseline gap-1.5">
                    <Text
                      fw={800}
                      size="xl"
                      className={
                        idUnidadMedida > 0 ? "text-white" : "text-zinc-700"
                      }
                    >
                      {formatNumber(totalDetalle)}
                    </Text>
                    <Text
                      size="xs"
                      fw={700}
                      c="zinc.5"
                      className="uppercase tracking-wider"
                    >
                      {calculoInteligente && sonUnidadesIdenticas
                        ? productoSeleccionado?.nombre
                          ? enPlural(productoSeleccionado.nombre.toLowerCase())
                          : "pz"
                        : unidadAbbr}
                    </Text>
                  </div>
                </Stack>

                <div className="h-10 w-px bg-zinc-800" />

                <Stack gap={2}>
                  <Text size="10px" c="zinc.5" fw={700} className="uppercase">
                    {calculoInteligente && sonUnidadesIdenticas
                      ? "Total"
                      : `En ${
                          productoSeleccionado?.unidad_medida_base
                            ? enPlural(productoSeleccionado?.unidad_medida_base)
                            : "---"
                        }`}
                  </Text>
                  <div className="flex items-baseline gap-1.5">
                    <Text
                      fw={800}
                      size="xl"
                      className={
                        idProducto > 0 ? "text-emerald-400" : "text-zinc-700"
                      }
                    >
                      {formatNumber(totalBase)}
                    </Text>
                    <Text
                      size="xs"
                      fw={700}
                      c="zinc.5"
                      className="uppercase tracking-wider"
                    >
                      {baseAbbr}
                    </Text>
                  </div>
                </Stack>
              </Group>
            </div>
          </div>
        </div>
      </section>

      {/* detalle del requerimiento */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 shadow-sm">
        <Table variant="unstyled" className="w-full text-zinc-300">
          <thead className="bg-zinc-900 text-zinc-400 text-xs font-medium">
            <tr>
              <th className="px-4 py-3 text-center w-12">#</th>
              <th className="px-4 py-3 text-left font-semibold min-w-32">
                Producto
              </th>
              <th className="px-3 py-2 text-center min-w-65">Cantidad</th>
              <th className="px-4 py-3 text-left font-semibold min-w-55">
                Comentario
              </th>
              <th className="px-4 py-3 text-center w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-900/40">
            {detalles.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-zinc-500 italic"
                >
                  No hay productos agregados al requerimiento
                </td>
              </tr>
            ) : (
              detalles.map((det, index) => {
                const prod = productos.find(
                  (p) => p.id_producto === det.id_producto,
                );
                const unidadDetalle = unidades.find(
                  (u) => u.id_unidad_medida === det.id_unidad_medida,
                );
                const mismaUnidadQueBase =
                  prod?.id_unidad_medida_base === det.id_unidad_medida;
                const usaMagnitudEnDetalle =
                  det.cantidad_items !== undefined &&
                  det.valor_magnitud_base !== undefined &&
                  det.cantidad_items > 0 &&
                  det.valor_magnitud_base > 0;
                /**
                 * La tabla siempre refleja el TOTAL REAL en unidad base del
                 * producto. Cuando el ítem fue creado con el modelo
                 * "magnitud por ítem con unidades diferentes" (smart calc
                 * activo y unidades distintas de la base), `cantidad_solicitada`
                 * guarda el total en la unidad del detalle y
                 * `contenido_por_presentacion` queda en 1, por lo que el
                 * producto daría el resultado equivocado. En ese caso se
                 * reconstruye el total con `cantidad_items × valor_magnitud_base`.
                 */
                const totalBase = usaMagnitudEnDetalle
                  ? (det.cantidad_items ?? 0) * (det.valor_magnitud_base ?? 0)
                  : (det.cantidad_solicitada || 0) *
                    (det.contenido_por_presentacion || 0);
                const conError = totalBase <= 0;
                const onChangeTotalBase = (val: number | string) => {
                  actualizarTotalBaseItem(index, Number(val));
                };

                return (
                  <tr
                    key={index}
                    className={`hover:bg-white/5 transition-colors ${
                      det.bloqueado ? "opacity-60" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-xs text-center text-zinc-500">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-zinc-100">
                      <div className="flex items-center gap-2">
                        <span>{prod?.nombre}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Group
                        gap="md"
                        align="center"
                        justify="center"
                        w="100%"
                        wrap="nowrap"
                      >
                        {/* Bloque principal: TOTAL REAL en unidad base del producto */}
                        <div
                          className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                            conError
                              ? "bg-red-900/10 border-red-500"
                              : "bg-zinc-950/40 border-zinc-800"
                          }`}
                        >
                          <input
                            type="number"
                            value={totalBase}
                            onChange={(e) => onChangeTotalBase(e.target.value)}
                            disabled={det.bloqueado}
                            step="any"
                            className={`w-12 bg-transparent text-center font-black text-xs h-5 outline-none focus:bg-zinc-900/60 rounded px-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                              conError ? "text-red-400" : "text-cyan-400"
                            }`}
                          />
                          <Text
                            size="9px"
                            fw={900}
                            className={`uppercase whitespace-nowrap ${conError ? "text-red-400" : "text-zinc-500"}`}
                          >
                            {prod?.unidad_medida_base_abv}
                          </Text>
                        </div>

                        {/* Componentes editables: cualquier valor que el usuario
                            tipeó debe poder editarse; los demás se recalculan.
                            Aplicamos la heurística de Nielsen "user control
                            and freedom". */}
                        {(() => {
                          // Caso 1: ítem con magnitud por unidad (smart calc
                          // activo) → "N × M {unidad detalle} c/u"
                          if (usaMagnitudEnDetalle) {
                            const items = det.cantidad_items ?? 0;
                            const mag = det.valor_magnitud ?? 0;
                            return (
                              <div className="flex items-center justify-center gap-1.5 text-zinc-500">
                                <input
                                  type="number"
                                  value={items}
                                  onChange={(e) =>
                                    actualizarCantidadItems(
                                      index,
                                      Number(e.target.value),
                                    )
                                  }
                                  disabled={det.bloqueado}
                                  step="any"
                                  min={0}
                                  className="w-10 bg-transparent text-center font-bold text-xs h-5 outline-none border-b border-transparent hover:border-zinc-700 focus:border-indigo-400 focus:text-cyan-400 px-1 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <Text size="xs" fw={400} c="gray.2">
                                  {enPlural(prod?.nombre, items)} x
                                </Text>
                                <input
                                  type="number"
                                  value={mag}
                                  onChange={(e) =>
                                    actualizarValorMagnitud(
                                      index,
                                      Number(e.target.value),
                                    )
                                  }
                                  disabled={det.bloqueado}
                                  step="any"
                                  min={0}
                                  className="w-14 bg-transparent text-center font-bold text-xs h-5 outline-none border-b border-transparent hover:border-zinc-700 focus:border-indigo-400 focus:text-cyan-400 px-1 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <Text
                                  size="xs"
                                  fw={700}
                                  className="uppercase whitespace-nowrap"
                                >
                                  {unidadDetalle?.abreviatura} c/u
                                </Text>
                              </div>
                            );
                          }
                          // Caso 2: ítem clásico con unidades distintas a la
                          // base → editable: cantidad en detalle × factor
                          if (
                            !mismaUnidadQueBase &&
                            (det.cantidad_solicitada ?? 0) > 0
                          ) {
                            return (
                              <div className="flex items-center justify-center gap-1.5 text-zinc-500">
                                <input
                                  type="number"
                                  value={det.cantidad_solicitada}
                                  onChange={(e) =>
                                    actualizarCantidadDetalleItem(
                                      index,
                                      Number(e.target.value),
                                    )
                                  }
                                  disabled={det.bloqueado}
                                  step="any"
                                  min={0}
                                  className="w-14 bg-transparent text-center font-bold text-xs h-5 outline-none border-b border-transparent hover:border-zinc-700 focus:border-indigo-400 focus:text-cyan-400 px-1 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <Text
                                  size="xs"
                                  fw={700}
                                  className="uppercase whitespace-nowrap"
                                >
                                  x
                                </Text>
                                <input
                                  type="number"
                                  value={det.contenido_por_presentacion}
                                  onChange={(e) =>
                                    actualizarFactorItem(
                                      index,
                                      Number(e.target.value),
                                    )
                                  }
                                  disabled={det.bloqueado}
                                  step="any"
                                  min={0}
                                  className="w-14 bg-transparent text-center font-bold text-xs h-5 outline-none border-b border-transparent hover:border-zinc-700 focus:border-indigo-400 focus:text-cyan-400 px-1 transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <Text
                                  size="xs"
                                  fw={700}
                                  className="uppercase whitespace-nowrap"
                                >
                                  {prod?.unidad_medida_base_abv}/
                                  {unidadDetalle?.abreviatura}
                                </Text>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </Group>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {det.comentario || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {det.bloqueado ? (
                        <Badge
                          variant="light"
                          color="orange"
                          radius="md"
                          size="sm"
                          className="font-semibold"
                        >
                          Entrega iniciada
                        </Badge>
                      ) : (
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => eliminarItem(index)}
                          radius="md"
                          size="sm"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </ActionIcon>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      {/* boton de guardar/cerrar */}
      <Group justify="flex-end">
        {error && (
          <div className="px-4 py-2 bg-red-900/20 border border-red-500/50 rounded-xl animate-pulse">
            <Text
              c="red.5"
              size="sm"
              fw={700}
              className="flex items-center gap-2"
            >
              {error}
            </Text>
          </div>
        )}
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
          onClick={handleSubmit}
          loading={submitting}
          disabled={
            esEdicion
              ? !detalles.some((d) => !d.bloqueado)
              : detalles.length === 0
          }
          radius="lg"
          className={`font-semibold shadow-lg border-0 px-8 transition-all ${
            detalles.some(
              (d) =>
                d.cantidad_solicitada <= 0 || d.contenido_por_presentacion <= 0,
            )
              ? "bg-red-900/50 text-red-200 cursor-not-allowed border border-red-500/50"
              : "bg-linear-to-r from-zinc-100 to-zinc-300 text-zinc-900 hover:from-white hover:to-zinc-200 hover:text-black"
          }`}
        >
          {esEdicion ? "Guardar Cambios" : "Guardar Requerimiento"}
        </Button>
      </Group>
    </Stack>
  );
};
