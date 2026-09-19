import { useState, useEffect } from "react";
import { useMenuNav } from "../../../../hooks/useMenuNav";

export const useAuthLayout = () => {
  const [open, setOpen] = useState(false);
  const { getMenuNavegacion } = useMenuNav();

  useEffect(() => {
    getMenuNavegacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    open,
    setOpen,
  };
};
