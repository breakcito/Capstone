import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "../layouts/public.layout.tsx";
import { AuthLayout } from "../layouts/auth/auth.layout.tsx";
import { ProtectedRoute } from "./protectedRoute.tsx";
import { PublicRoute } from "./publicRoute.tsx";
import { LoginPage } from "../../modules/login/presentation/login.page.tsx";
import { HomePage } from "../pages/home/home.page.tsx";
import { CuentasPage } from "../../modules/cuentas/presentation/cuentas.page.tsx";
import { AlmacenesPage } from "../../modules/almacenes/presentation/almacenes.page.tsx";
import { ProductosPage } from "../../modules/productos/presentation/productos.page.tsx";
import { LotesPage } from "../../modules/lotes-productos/presentation/lotes-page/lotes.page.tsx";
import { RequerimientosAlmacenAtencionPage } from "../../modules/requerimientos-almacen-atencion/presentation/atencion-requerimientos.page.tsx";
import { KardexProductosPage } from "../../modules/kardex-productos/presentation/kardex.page.tsx";
import { PerfilPage } from "../../modules/perfil/presentation/perfil.page.tsx";
import SystemPage from "../../modules/system/presentation/system.page.tsx";

export const App = () => {
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

        {/* Modulos */}
        <Route path="/usuarios" element={<CuentasPage />} />
        <Route path="/almacenes" element={<AlmacenesPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/inventario" element={<LotesPage />} />
        <Route path="/kardex" element={<KardexProductosPage />} />
        <Route
          path="/pedidos"
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
