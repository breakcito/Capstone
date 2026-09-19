import { useCuentasBancarias } from "../../hooks/useCuentasBancarias";
import { useEdicionCuentaBancariaEmpleado } from "../../hooks/useEdicionCuentaBancariaEmpleado";
import type { RES_EmpleadoResumen, RES_CuentaBancariaEmpleado } from "../../service/empleados.responses";
import {
  RegistroCuenta,
  type RegistroCuentaRef,
} from "./components/registro-cuenta";
import { CuentaBancaria } from "./components/cuenta-bancaria";
import { EdicionCuentaBancariaEmpleadoComponent } from "./components/edicion-cuenta-empleado";
import { ModalEstandar } from "../../../../presentation/utils/modal-estandar";
import { useEffect, useRef, useState } from "react";
import { Loader, Text } from "@mantine/core";
import { IconCreditCard } from "@tabler/icons-react";

interface Props {
  empleado: RES_EmpleadoResumen;
  onCuentaAddedGlobal?: () => void;
}

export const CuentasBancarias = ({ empleado, onCuentaAddedGlobal }: Props) => {
  const {
    cuentas,
    bancos,
    setBancos,
    loadingCuentas,
    loadingBancos,
    insertCuenta,
    updateCuenta,
  } = useCuentasBancarias(empleado.id_empleado);

  const regCuentaRef = useRef<RegistroCuentaRef>(null);
  const [cuentaAEditar, setCuentaAEditar] = useState<RES_CuentaBancariaEmpleado | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const edicion = useEdicionCuentaBancariaEmpleado({
    onSuccess: (cuentaActualizada) => {
      updateCuenta(cuentaActualizada);
      if (onCuentaAddedGlobal) {
        onCuentaAddedGlobal();
      }
    },
    onClose: () => setOpenEdit(false),
  });

  useEffect(() => {
    if (cuentaAEditar) {
      edicion.cargarCuenta(cuentaAEditar);
    } else {
      edicion.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuentaAEditar]);

  const handleCuentaAdded = (nuevaCuenta: RES_CuentaBancariaEmpleado) => {
    insertCuenta(nuevaCuenta);
    if (onCuentaAddedGlobal) {
      onCuentaAddedGlobal();
    }
  };

  const handleOpenEdit = (cuenta: RES_CuentaBancariaEmpleado) => {
    setCuentaAEditar(cuenta);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setCuentaAEditar(null);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Formulario arriba */}
      <RegistroCuenta
        ref={regCuentaRef}
        idEmpleado={empleado.id_empleado}
        bancos={bancos}
        loadingBancos={loadingBancos}
        onCuentaAdded={handleCuentaAdded}
        onBancoAdded={(b) => {
          setBancos((prev) => [...prev, b]);
          regCuentaRef.current?.autoSelectBanco(b.id_banco);
        }}
      />

      {/* Lista de Cuentas usando items individuales en vez de tabla */}
      <div className="flex flex-col gap-3">
        <h3 className="text-zinc-300 font-medium text-sm uppercase tracking-widest px-1">
          Cuentas Registradas
        </h3>

        {loadingCuentas ? (
          <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/20 rounded-xl border border-zinc-800/50">
            <Loader color="indigo" type="bars" size="sm" />
            <Text
              size="xs"
              mt="sm"
              className="text-zinc-500 font-medium uppercase tracking-widest"
            >
              Cargando cuentas...
            </Text>
          </div>
        ) : cuentas.length > 0 ? (
          <div className="flex flex-col gap-3">
            {cuentas.map((cuenta) => (
              <CuentaBancaria
                key={cuenta.id_cuenta_bancaria}
                cuenta={cuenta}
                onEdit={handleOpenEdit}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-xl">
            <IconCreditCard
              size={40}
              className="text-zinc-700 mb-3"
              stroke={1}
            />
            <Text size="sm" className="text-zinc-500 font-medium">
              Este empleado no tiene cuentas bancarias registradas.
            </Text>
          </div>
        )}
      </div>

      {/* Modal: Edición de Cuenta Bancaria */}
      <ModalEstandar
        opened={openEdit}
        close={handleCloseEdit}
        title="Editar Cuenta Bancaria"
        size="md"
        validateClose
        closeConfirmationMessage="Vas a descartar los cambios no guardados de esta cuenta bancaria."
      >
        {cuentaAEditar && (
          <EdicionCuentaBancariaEmpleadoComponent
            hook={edicion}
            onCancel={handleCloseEdit}
          />
        )}
      </ModalEstandar>
    </div>
  );
};
