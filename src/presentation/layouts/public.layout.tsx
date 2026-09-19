import { Outlet } from "react-router-dom";
import { GlobalNotification } from "./auth/components/global-notification";

export const PublicLayout = () => {
  return (
    <div
      className="w-full h-full flex items-center justify-center 
      bg-slate-950 bg-linear-to-tr from-gray-950 to-slate-900 relative overflow-hidden"
    >
      <GlobalNotification />
      <Outlet />
    </div>
  );
};
