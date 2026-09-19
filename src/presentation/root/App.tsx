import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "../layouts/public.layout.tsx";
import { AuthLayout } from "../layouts/auth/auth.layout.tsx";
import { ProtectedRoute } from "./protectedRoute.tsx";
import { PublicRoute } from "./publicRoute.tsx";
import { LoginPage } from "../../modules/login/presentation/login.page.tsx";
import { HomePage } from "../pages/home/home.page.tsx";
import { PersonalPage } from "../../modules/personal/presentation/personal.page.tsx";
import { AlmacenesPage } from "../../modules/almacenes/presentation/almacenes.page.tsx";
import { ProductosPage } from "../../modules/productos/presentation/productos.page.tsx";
import { LotesPage } from "../../modules/lotes-productos/presentation/lotes-page/lotes.page.tsx";
import { RequerimientosAlmacenAtencionPage } from "../../modules/requerimientos-almacen-atencion/presentation/atencion-requerimientos.page.tsx";
import { KardexProductosPage } from "../../modules/kardex-productos/presentation/kardex.page.tsx";
import { RolesPage } from "../../modules/roles/presentation/roles.page.tsx";
import { CuentasPage } from "../../modules/cuentas/presentation/cuentas.page.tsx";
import { PerfilPage } from "../../modules/perfil/presentation/perfil.page.tsx";
import { useEffect } from "react";
import { onSocketEvent } from "../../service/_socket.ts";
import { useAuditoriaStore } from "../../stores/auditoria.store.ts";
import SystemPage from "../../modules/system/presentation/system.page.tsx";

export const App = () => {
  const { setModoAuditoria } = useAuditoriaStore();

  useEffect(() => {
    const channel = onSocketEvent(
      "global-audit-mode",
      "audit.mode.toggled",
      (data: { en_modo_auditable: boolean }) => {
        setModoAuditoria(data.en_modo_auditable);
      },
    );

    return () => {
      channel.stopListening(".audit.mode.toggled");
    };
  }, [setModoAuditoria]);

  return (
    <Routes>
      {/* Rutas publicas */}
      <Route
        element={
          <PublicRoute>
            <PublicLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Rutas protegidas */}
      <Route
        element={
          <ProtectedRoute>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/perfil" element={<PerfilPage />} />

        {/* Configuracion (rutas planas) */}
        <Route path="/trabajadores" element={<PersonalPage />} />
        <Route path="/almacenes" element={<AlmacenesPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/cuentas" element={<CuentasPage />} />

        {/* Logistica */}
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/lotes" element={<LotesPage />} />
        <Route path="/kardex" element={<KardexProductosPage />} />
        <Route
          path="/atencion-requerimientos"
          element={<RequerimientosAlmacenAtencionPage />}
        />

        {/* System module (oculto, solo URL directa) */}
        <Route path="/system" element={<SystemPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
};
