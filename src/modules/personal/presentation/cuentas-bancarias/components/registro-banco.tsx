import { TextInput, Button, Alert } from "@mantine/core";
import { IconBuildingBank, IconExclamationCircle } from "@tabler/icons-react";
import { useRegistroBanco } from "../../../hooks/useRegistroBanco";
import type { RES_Banco } from "../../../../../service/responses/banco";

interface Props {
  onCancel: () => void;
  onSuccess: (banco: RES_Banco) => void;
}

export const RegistroBanco = ({ onCancel, onSuccess }: Props) => {
  const { payload, handleChange, submit, loading, error } = useRegistroBanco(
    (banco: RES_Banco) => {
      onSuccess(banco);
    },
  );

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
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
        label="Nombre Oficial"
        placeholder="Ej. Banco de Crédito del Perú"
        radius="xl"
        value={payload.nombre}
        onChange={(e) => handleChange("nombre", e.target.value)}
        classNames={{
          input:
            "bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-300 transition-all",
          label: "text-zinc-400 font-medium text-xs",
        }}
      />
      <TextInput
        label="Siglas / Abreviatura"
        placeholder="Ej. BCP"
        radius="xl"
        value={payload.abreviatura}
        onChange={(e) => handleChange("abreviatura", e.target.value)}
        classNames={{
          input:
            "bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-zinc-300 transition-all",
          label: "text-zinc-400 font-medium text-xs",
        }}
      />
      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800">
        <Button
          variant="subtle"
          color="gray"
          radius="xl"
          onClick={onCancel}
          classNames={{ root: "text-zinc-400 hover:bg-zinc-800" }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          loading={loading}
          radius="xl"
          leftSection={<IconBuildingBank size={18} />}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20"
        >
          Registrar Banco
        </Button>
      </div>
    </form>
  );
};
