import { Paper, Select, Textarea, ActionIcon, Tooltip } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconUser, IconUsers } from "@tabler/icons-react";
import { MultiFilePicker } from "../../../../../../presentation/utils/archivo/multifile-picker";

interface EntregaHeaderProps {
  empleados: { value: string; label: string }[];
  contratistas: { value: string; label: string }[];
  idEmpleadoRecibe: string | null;
  setIdEmpleadoRecibe: (val: string | null) => void;
  idContratistaRecibe: string | null;
  setIdContratistaRecibe: (val: string | null) => void;
  esContratistaRecibe: boolean;
  setEsContratistaRecibe: (val: boolean) => void;
  observacion: string;
  setObservacion: (val: string) => void;
  evidencias: File[];
  setEvidencias: React.Dispatch<React.SetStateAction<File[]>>;
  /** Fecha real de la entrega. Por defecto es "ahora" pero es editable
   *  para soportar carga de data retroactiva. Importante para que el TDA
   *  del Dashboard BI refleje el momento del despacho, no del registro. */
  fechaEntrega: string;
  setFechaEntrega: (val: string) => void;
}

export const EntregaHeader = ({
  empleados,
  contratistas,
  idEmpleadoRecibe,
  setIdEmpleadoRecibe,
  idContratistaRecibe,
  setIdContratistaRecibe,
  esContratistaRecibe,
  setEsContratistaRecibe,
  observacion,
  setObservacion,
  evidencias,
  setEvidencias,
  fechaEntrega,
  setFechaEntrega,
}: EntregaHeaderProps) => {
  return (
    <Paper
      p="md"
      radius="lg"
      className="bg-zinc-900/40 border border-zinc-800 shadow-sm"
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-end gap-2">
            <Select
              label={
                esContratistaRecibe
                  ? "¿Quién recibe? (Contratista)"
                  : "¿Quién recibe? (Empleado)"
              }
              placeholder={
                esContratistaRecibe
                  ? "Seleccione contratista"
                  : "Seleccione empleado"
              }
              data={esContratistaRecibe ? contratistas : empleados}
              searchable
              required
              withAsterisk
              value={
                esContratistaRecibe ? idContratistaRecibe : idEmpleadoRecibe
              }
              onChange={(val) => {
                if (esContratistaRecibe) {
                  setIdContratistaRecibe(val);
                  setIdEmpleadoRecibe(null);
                } else {
                  setIdEmpleadoRecibe(val);
                  setIdContratistaRecibe(null);
                }
              }}
              size="sm"
              radius="lg"
              className="flex-1"
              classNames={{
                input:
                  "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500",
                label: "text-zinc-300 mb-1 font-medium text-sm",
              }}
            />
            <Tooltip
              label={esContratistaRecibe ? "Ver empleados" : "Ver contratistas"}
              position="top"
              withArrow
            >
              <ActionIcon
                variant="light"
                color={esContratistaRecibe ? "teal" : "indigo"}
                onClick={() => {
                  setEsContratistaRecibe(!esContratistaRecibe);
                  setIdEmpleadoRecibe(null);
                  setIdContratistaRecibe(null);
                }}
                radius="lg"
                className="shrink-0"
                style={{ height: 36, width: 36 }}
              >
                {esContratistaRecibe ? (
                  <IconUser size={18} />
                ) : (
                  <IconUsers size={18} />
                )}
              </ActionIcon>
            </Tooltip>
          </div>
          <DateTimePicker
            label="Fecha y hora de la entrega"
            placeholder="Seleccione fecha y hora"
            value={fechaEntrega ? new Date(fechaEntrega) : null}
            onChange={(date: Date | string | null) => {
              // Mantenemos el formato YYYY-MM-DD HH:mm:ss que espera el backend
              if (!date) {
                setFechaEntrega("");
                return;
              }
              const d = typeof date === "string" ? new Date(date) : date;
              if (isNaN(d.getTime())) {
                setFechaEntrega("");
                return;
              }
              const pad = (n: number) => String(n).padStart(2, "0");
              const formatted =
                `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
                `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
              setFechaEntrega(formatted);
            }}
            valueFormat="DD/MM/YYYY HH:mm"
            clearable={false}
            withAsterisk
            required
            size="sm"
            radius="lg"
            classNames={{
              input:
                "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500",
              label: "text-zinc-300 mb-1 font-medium text-sm",
            }}
          />
        </div>

        <Textarea
          label="Observación"
          placeholder="Escriba detalles adicionales si es necesario..."
          value={observacion}
          onChange={(e) => setObservacion(e.currentTarget.value)}
          size="sm"
          radius="lg"
          minRows={1}
          classNames={{
            input:
              "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 py-2",
            label: "text-zinc-300 mb-1 font-medium text-sm",
          }}
        />

        <div className="border-t border-zinc-800/50 pt-4">
          <MultiFilePicker
            label="Evidencias de Entrega"
            files={evidencias}
            onFilesChange={setEvidencias}
          />
        </div>
      </div>
    </Paper>
  );
};
