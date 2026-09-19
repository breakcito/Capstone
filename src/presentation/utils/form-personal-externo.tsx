import { Switch, TextInput, Button, Grid } from "@mantine/core";

export interface FormPersonalExternoProps {
  nombre: string;
  apellido: string;
  dni: string;
  setNombre: (val: string) => void;
  setApellido: (val: string) => void;
  setDni: (val: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  /**
   * Si se pasa esta prop, el form muestra un Switch "Es representante".
   * El padre controla el estado (esRepresentante / setEsRepresentante) y
   * envia el flag al backend en onSubmit.
   */
  esRepresentante?: boolean;
  setEsRepresentante?: (val: boolean) => void;
}

export const FormPersonalExterno = ({
  nombre,
  apellido,
  dni,
  setNombre,
  setApellido,
  setDni,
  onSubmit,
  isSubmitting,
  esRepresentante,
  setEsRepresentante,
}: FormPersonalExternoProps) => {
  const showRepresentante =
    typeof esRepresentante === "boolean" &&
    typeof setEsRepresentante === "function";

  return (
    <div className="flex flex-col gap-4">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Nombres"
            placeholder="Ej. Juan Carlos"
            withAsterisk
            required
            radius="lg"
            data-autofocus
            value={nombre}
            onChange={(e) => setNombre(e.currentTarget.value)}
            classNames={{
              input:
                "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 w-full",
              label: "text-zinc-300 mb-1 font-medium text-sm",
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="Apellidos (opc.)"
            radius="lg"
            placeholder="Ej. Perez"
            value={apellido}
            onChange={(e) => setApellido(e.currentTarget.value)}
            classNames={{
              input:
                "bg-zinc-900/50  border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 w-full",
              label: "text-zinc-300 mb-1 font-medium text-sm",
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <TextInput
            label="DNI (opc.)"
            radius="lg"
            placeholder="Ej. 70987654"
            value={dni}
            onChange={(e) => setDni(e.currentTarget.value)}
            classNames={{
              input:
                "bg-zinc-900/50 border-zinc-800 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-300 text-white placeholder:text-zinc-500 w-full",
              label: "text-zinc-300 mb-1 font-medium text-sm",
            }}
            maxLength={8}
          />
        </Grid.Col>
        {showRepresentante && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <div className="h-full flex items-end pb-1">
              <Switch
                checked={esRepresentante}
                onChange={(e) => setEsRepresentante(e.currentTarget.checked)}
                color="indigo"
                size="md"
                label="Es representante"
                description="Persona de contacto del proveedor"
                classNames={{
                  label: "text-zinc-300 font-medium text-sm",
                  description: "text-zinc-500 text-xs",
                }}
              />
            </div>
          </Grid.Col>
        )}
      </Grid>

      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={!nombre.trim()}
          color="indigo"
          radius="lg"
          className="font-bold shadow-lg shadow-indigo-500/20"
        >
          Registrar
        </Button>
      </div>
    </div>
  );
};