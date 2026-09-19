import { useEffect } from "react";
import { useUIStore } from "../stores/ui.store";

// Hook para manejar el titulo de la pagina y el titulo de la pestaña
export const useTitlePage = (title?: string) => {
  const currentTitle = useUIStore((state) => state.title);
  const setTitle = useUIStore((state) => state.setTitle);

  useEffect(() => {
    if (title !== undefined) {
      setTitle(title);
    }
  }, [title, setTitle]);

  return {
    title: currentTitle,
    setTitlePage: setTitle,
  };
};
