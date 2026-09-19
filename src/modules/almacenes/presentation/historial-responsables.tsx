import { useRef } from "react";
import {
  Badge,
  Text,
  Group,
  Stack,
  Skeleton,
  ScrollArea,
  ActionIcon,
  Loader,
} from "@mantine/core";
import { UserIcon, ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import "dayjs/locale/es";
import type { IMessage } from "../../../stores/ui.store";
import type {
  RES_AlmacenResumen,
  RES_ResponsableAlmacen,
} from "../service/almacenes.responses";
import { useHistorialResponsables } from "../hooks/useHistorialResponsables";
import {
  NuevoResponsable,
  type NuevoResponsableRef,
} from "./nuevo-responsable";

interface HistorialResponsablesProps {
  almacen: RES_AlmacenResumen;
  onMessage?: (msg: IMessage) => void;
  onUpdateResponsable?: (nombre: string) => void;
}

export const HistorialResponsables = ({
  almacen,
  onUpdateResponsable,
}: HistorialResponsablesProps) => {
  const {
    responsables,
    loading,
    loadingInactivando,
    handleSuccess,
    handleInactivarResponsable,
  } = useHistorialResponsables(almacen.id_almacen);

  const registroRef = useRef<NuevoResponsableRef>(null);

  const handleInactivar = async (item: RES_ResponsableAlmacen) => {
    const success = await handleInactivarResponsable(
      item.id_responsable_almacen,
    );
    if (success && registroRef.current) {
      registroRef.current.agregarDisponible({
        id_empleado: item.id_empleado,
        nombre_completo: item.nombre_completo,
        dni: item.dni,
        url_foto: item.url_foto,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Formulario siempre visible */}
      <NuevoResponsable
        ref={registroRef}
        idAlmacen={almacen.id_almacen}
        nombreAlmacen={almacen.nombre}
        onSuccess={(nuevo) => handleSuccess(nuevo, onUpdateResponsable)}
      />

      {/* Separador */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-zinc-800" />
        <Text
          size="xs"
          fw={700}
          className="text-zinc-500 uppercase tracking-widest px-2"
        >
          Historial de Responsables
        </Text>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* Skeleton mientras carga */}
      {loading && (
        <Stack gap="sm">
          {[1, 2, 3].map((i) => (
            <Group
              key={i}
              wrap="nowrap"
              className="p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg"
            >
              <Skeleton height={40} width={40} radius="xl" />
              <Stack gap={6} className="flex-1">
                <Skeleton height={13} width="50%" radius="sm" />
                <Skeleton height={10} width="35%" radius="sm" />
              </Stack>
            </Group>
          ))}
        </Stack>
      )}

      {/* Estado vacío */}
      {!loading && responsables.length === 0 && (
        <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl">
          <UserIcon className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-500 text-sm">
            No hay responsables asignados aún.
          </p>
        </div>
      )}

      {/* Lista de responsables con ScrollArea */}
      {!loading && responsables.length > 0 && (
        <ScrollArea h={350} type="hover" offsetScrollbars>
          <div className="grid gap-3 pr-3">
            {responsables.map((item: RES_ResponsableAlmacen, idx: number) => {
              const isActive = item.estado?.toUpperCase() === "ACTIVO";
              const isInactivating =
                loadingInactivando === item.id_responsable_almacen;

              return (
                <div
                  key={item.id_responsable_almacen || idx}
                  className="flex items-center gap-3 p-3 bg-zinc-900/30 border border-zinc-800/50 rounded-lg transition-colors hover:border-zinc-700/50"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                      isActive
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        : "bg-zinc-800/50 text-zinc-500 border-zinc-700/50"
                    }`}
                  >
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <Text className="text-sm font-bold text-white truncate">
                          {item.nombre_completo}
                        </Text>
                        {isActive ? (
                          <Badge color="indigo" size="xs" variant="light">
                            RESPONSABLE
                          </Badge>
                        ) : (
                          <Badge color="gray" size="xs" variant="outline">
                            DESHABILITADO
                          </Badge>
                        )}
                      </div>

                      {isActive && (
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          size="sm"
                          radius="md"
                          onClick={() => handleInactivar(item)}
                          disabled={isInactivating}
                        >
                          {isInactivating ? (
                            <Loader size={12} color="red" />
                          ) : (
                            <XMarkIcon className="w-4 h-4" />
                          )}
                        </ActionIcon>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {dayjs(item.fecha_inicio).format("YYYY-MM-DD")}
                        <span className="mx-1.5 opacity-40">|</span>
                        {item.fecha_fin
                          ? dayjs(item.fecha_fin).format("YYYY-MM-DD")
                          : "Presente"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
