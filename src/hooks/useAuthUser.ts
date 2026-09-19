import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { useMenuNavegacionStore } from "../stores/menu.store";
import { usePerfilStore } from "../modules/perfil/hooks/usePerfilStore";
import { useCallback, useMemo } from "react";

export const useAuthUser = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const menu = useMenuNavegacionStore((state) => state.menu);
  const clearMenu = useMenuNavegacionStore((state) => state.clearMenu);
  const resetPerfil = usePerfilStore((state) => state.reset);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    clearAuth();
    clearMenu();
    resetPerfil();
    sessionStorage.removeItem("blackcito_saludo_inicial");
    navigate("/login", { viewTransition: true });
  }, [clearAuth, clearMenu, resetPerfil, navigate]);

  const isAuthorized = useMemo(() => {
    // Rutas universalmente permitidas (incluye /system que es oculto por URL directa)
    const universallyAllowed = ["/", "/home", "/perfil", "/system"];
    if (universallyAllowed.includes(location.pathname)) return true;

    // Si el menú aún no carga pero está autenticado, permitimos el paso inicial.
    if (!menu || menu.length === 0) return true;

    // Aplanamos el menú para obtener todas las URLs autorizadas (path plano)
    const authorizedUrls: string[] = [];
    menu.forEach((menuItem) => {
      if (menuItem.path) authorizedUrls.push(`/${menuItem.path}`);
      menuItem.submenus?.forEach((submenu) => {
        if (submenu.path) authorizedUrls.push(`/${submenu.path}`);
        submenu.modulos?.forEach((modulo) => {
          if (modulo.path) authorizedUrls.push(`/${modulo.path}`);
        });
      });
    });

    return authorizedUrls.some(
      (url) =>
        location.pathname === url || location.pathname.startsWith(url + "/"),
    );
  }, [location.pathname, menu]);

  return {
    usuario,
    isAuthenticated,
    isAuthorized,
    logout,
  };
};
