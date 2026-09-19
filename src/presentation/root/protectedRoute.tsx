import { Navigate, Outlet } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";

// Componente que protege rutas autenticadas y verifica autorización por menú
export const ProtectedRoute = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { isAuthenticated, isAuthorized } = useAuthUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized) {
    // Si no está autorizado para esta vista específica, lo mandamos al home
    return <Navigate to="/home" replace />;
  }

  return <>{children || <Outlet />}</>;
};
