import { ModalEstandar } from "./modal-estandar";
import { FormPersonalExterno } from "./form-personal-externo";
import { usePersonalExterno } from "../../hooks/usePersonalExterno";
import { useState } from "react";

/**
 * Personal creado en modo local (cuando todavia no existe el proveedor
 * y se quiere acumular para enviar al backend despues).
 */
export interface PersonalLocal {
  nombre: string;
  apellido?: string;
  dni?: string;
}

interface Props {
  opened: boolean;
  close: () => void;
  title?: string;
  /**
   * Si se pasa, el modal crea el personal directamente en backend con
   * id_proveedor (modo backend). Si NO se pasa, el modal solo acumula
   * via onCreateLocal (modo local).
   */
  idProveedor?: number;
  /**
   * Solo en modo local. Callback con el personal para acumularlo en
   * el state del padre.
   */
  onCreateLocal?: (p: PersonalLocal) => void;
  /**
   * Solo en modo backend. Callback tras crear en BD.
   */
  onCreatedBackend?: () => void;
  /**
   * Estado inicial del Switch "Es representante".
   */
  initialEsRepresentante?: boolean;
  /**
   * Si false, oculta el Switch de "Es representante" (default true).
   */
  esRepresentanteVisible?: boolean;
}

/**
 * Wrapper reusable del FormPersonalExterno dentro de un ModalEstandar.
 *
 * - Modo backend (idProveedor): usa usePersonalExterno + crea en BD.
 * - Modo local (sin idProveedor): NO toca backend, llama a onCreateLocal.
 *
 * Sirve para:
 * - Alta inline durante registro de un proveedor (modo local).
 * - Alta en cualquier consumidor que ya tenga idProveedor (modo backend).
 */
export const ModalPersonalExterno = ({
  opened,
  close,
  title = "Nuevo Personal Externo",
  idProveedor,
  onCreateLocal,
  onCreatedBackend,
  initialEsRepresentante = false,
  esRepresentanteVisible = true,
}: Props) => {
  const showRepresentanteSwitch = esRepresentanteVisible;
  const isBackendMode = typeof idProveedor === "number";

  if (!isBackendMode) {
    // MODO LOCAL: sin idProveedor. Manejamos state local.
    return (
      <ModalPersonalExternoLocal
        opened={opened}
        close={close}
        title={title}
        showRepresentanteSwitch={showRepresentanteSwitch}
        initialEsRepresentante={initialEsRepresentante}
        onCreateLocal={(p) => {
          onCreateLocal?.(p);
          close();
        }}
      />
    );
  }

  // MODO BACKEND: idProveedor presente. Delegamos al hook.
  return (
    <ModalPersonalExternoBackend
      opened={opened}
      close={close}
      title={title}
      idProveedor={idProveedor}
      showRepresentanteSwitch={showRepresentanteSwitch}
      initialEsRepresentante={initialEsRepresentante}
      onCreatedBackend={() => {
        onCreatedBackend?.();
        close();
      }}
    />
  );
};

// ──────────────────────── MODO LOCAL ────────────────────────

interface LocalProps {
  opened: boolean;
  close: () => void;
  title: string;
  showRepresentanteSwitch: boolean;
  initialEsRepresentante: boolean;
  onCreateLocal: (p: PersonalLocal) => void;
}

const ModalPersonalExternoLocal = ({
  opened,
  close,
  title,
  onCreateLocal,
}: LocalProps) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");

  const handleSubmit = () => {
    if (!nombre.trim()) return;
    onCreateLocal({
      nombre: nombre.trim(),
      dni: dni.trim(),
      apellido: apellido.trim(),
    });
    // Limpiar y cerrar lo hace el padre.
    setNombre("");
    setApellido("");
    setDni("");
  };

  return (
    <ModalEstandar opened={opened} close={close} title={title} size="md">
      <FormPersonalExterno
        nombre={nombre}
        apellido={apellido}
        dni={dni}
        setNombre={setNombre}
        setApellido={setApellido}
        setDni={setDni}
        onSubmit={handleSubmit}
      />
    </ModalEstandar>
  );
};

// ──────────────────────── MODO BACKEND ────────────────────────

interface BackendProps {
  opened: boolean;
  close: () => void;
  title: string;
  idProveedor: number;
  showRepresentanteSwitch: boolean;
  initialEsRepresentante: boolean;
  onCreatedBackend: () => void;
}

const ModalPersonalExternoBackend = ({
  opened,
  close,
  title,
  idProveedor,
  onCreatedBackend,
}: BackendProps) => {
  const {
    nombre,
    setNombre,
    apellido,
    setApellido,
    dni,
    setDni,
    isSubmitting,
    handleCrearPersonal,
  } = usePersonalExterno({
    idProveedor,
  });

  return (
    <ModalEstandar opened={opened} close={close} title={title} size="md">
      <FormPersonalExterno
        nombre={nombre}
        apellido={apellido}
        dni={dni}
        setNombre={setNombre}
        setApellido={setApellido}
        setDni={setDni}
        isSubmitting={isSubmitting}
        onSubmit={() => {
          handleCrearPersonal().then((nuevo) => {
            if (nuevo) onCreatedBackend();
          });
        }}
      />
    </ModalEstandar>
  );
};
