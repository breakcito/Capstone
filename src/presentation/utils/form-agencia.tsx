import { useState } from "react";
import { TextInput, Button, Alert } from "@mantine/core";
import { IconDeviceFloppy, IconExclamationCircle } from "@tabler/icons-react";
import { AuxService } from "../../service/auxiliar.service";
import type { RES_Agencia } from "../../service/responses/agencia";
import { useNotify } from "../../hooks/useNotify";

export interface FormAgenciaProps {
  onSuccess: (agencia: RES_Agencia) => void;
  onCancel?: () => void;
}

export const FormAgencia = ({ onSuccess, onCancel }: FormAgenciaProps) => {
  const { notifySuccess, notifyError } = useNotify();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razonSocial, setRazonSocial] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const name = razonSocial.trim();
    if (!name) {
      setError("La razón social es requerida");
      return;
    }
    if (name.length < 3) {
      setError("La razón social debe tener al menos 3 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await AuxService.crear_agencia_transporte({
        razon_social: name,
      });

      if (res.success && res.data) {
        notifySuccess("Agencia registrada exitosamente");
        onSuccess(res.data);
      } else {
        setError(res.message || "Error al registrar agencia");
        notifyError(res.message || "Error al registrar agencia");
      }
    } catch (err) {
      console.error(err);
      setError("Error al registrar agencia");
      notifyError("Error al registrar agencia");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = {
    input: "bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-300 transition-all",
    label: "text-zinc-400 font-medium text-xs mb-1",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <Alert
          icon={<IconExclamationCircle size={16} />}
          color="red"
          variant="filled"
        >
          {error}
        </Alert>
      )}

      <TextInput
        label="Razón Social"
        placeholder="Ej. Transportes Civa"
        value={razonSocial}
        onChange={(e) => {
          setRazonSocial(e.target.value);
          if (error) setError(null);
        }}
        required
        withAsterisk
        size="xs"
        radius="lg"
        classNames={inputClasses}
      />

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800">
        {onCancel && (
          <Button
            variant="subtle"
            color="gray"
            radius="lg"
            size="xs"
            onClick={onCancel}
            classNames={{ root: "text-zinc-400 hover:bg-zinc-800" }}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          loading={loading}
          radius="lg"
          size="xs"
          leftSection={<IconDeviceFloppy size={16} />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20"
        >
          Guardar Agencia
        </Button>
      </div>
    </form>
  );
};
