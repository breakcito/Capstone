import { TextInput, Button, Stack, Text, Alert, Group } from "@mantine/core";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { getCoincidencias } from "../../shared/functions/get-coincidencias";
import type { RES_Marca } from "../../service/responses/marca";
import { AuxService } from "../../service/auxiliar.service";
import { useNotify } from "../../hooks/useNotify";
import { useState } from "react";

export interface FormMarcaProps {
  nombre: string;
  setNombre: (val: string) => void;
  onSuccess: (nuevaMarca: RES_Marca) => void;
  marcasExistentes?: RES_Marca[];
}

export const FormMarca = ({
  nombre,
  setNombre,
  onSuccess,
  marcasExistentes = [],
}: FormMarcaProps) => {
  const { notifySuccess, notifyError } = useNotify();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Buscar coincidencias similares (no exactas) para avisar al usuario
  const coincidencias = useMemo(() => {
    if (!nombre.trim() || nombre.length < 3) return [];

    return getCoincidencias(marcasExistentes, nombre, {
      keys: ["nombre"],
      fuseThreshold: 0.3, // Un poco más estricto para evitar ruido
    });
  }, [nombre, marcasExistentes]);

  // Verificar si hay una coincidencia exacta
  const existeExacto = useMemo(() => {
    return marcasExistentes.some(
      (m) => m.nombre.toLowerCase().trim() === nombre.toLowerCase().trim(),
    );
  }, [nombre, marcasExistentes]);

  const handleSubmit = async () => {
    if (!nombre.trim() || existeExacto) return;
    setIsSubmitting(true);
    try {
      const res = await AuxService.crear_marca({ nombre });
      if (res.success) {
        notifySuccess("Marca registrada correctamente");
        onSuccess(res.data);
      } else {
        notifyError(res.message);
      }
    } catch (error) {
      console.error("Error al registrar marca", error);
      notifyError("Error al registrar marca");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack gap="md">
      <TextInput
        label="Nombre de la Marca"
        placeholder="Ej. Caterpillar, Toyota, etc."
        withAsterisk
        required
        radius="lg"
        data-autofocus
        value={nombre}
        onChange={(e) => setNombre(e.currentTarget.value)}
        error={existeExacto ? "Esta marca ya está registrada" : null}
        classNames={{
          input:
            "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 w-full",
          label: "text-zinc-300 mb-1 font-medium text-sm",
        }}
      />

      {coincidencias.length > 0 && !existeExacto && (
        <Alert
          variant="light"
          color="orange"
          title="Posibles duplicados encontrados"
          icon={<ExclamationCircleIcon className="w-5 h-5" />}
          radius="lg"
          styles={{
            title: { fontSize: "13px", fontWeight: 700 },
            message: { fontSize: "12px" },
          }}
        >
          <Text size="xs">Se encontraron marcas con nombres similares:</Text>
          <Group gap={6} mt={4}>
            {coincidencias.slice(0, 3).map((c) => (
              <Text key={c.item.id_marca} fw={700} c="orange.4" size="xs">
                • {c.item.nombre}
              </Text>
            ))}
            {coincidencias.length > 3 && (
              <Text size="xs" c="dimmed">
                y {coincidencias.length - 3} más...
              </Text>
            )}
          </Group>
        </Alert>
      )}

      <Button
        fullWidth
        className="font-bold shadow-lg shadow-indigo-500/20"
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={!nombre.trim() || existeExacto}
        color="indigo"
        radius="lg"
        size="sm"
      >
        Registrar Marca
      </Button>
    </Stack>
  );
};
