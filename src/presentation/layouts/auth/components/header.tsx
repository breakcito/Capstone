import { Bars3Icon } from "@heroicons/react/24/outline";
import { UserMenu } from "./user-menu";
import { useTitlePage } from "../../../../hooks/useTitlePage";

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const { title } = useTitlePage();

  return (
    <header
      className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)]
      flex items-center justify-between px-6 h-12 bg-white/3 backdrop-blur-2xl 
      rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-40 
      transition-all duration-300"
    >
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none p-px overflow-hidden"
        style={{
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] aspect-square animate-[spin_8s_linear_infinite]"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0%, rgba(139, 92, 246, 0.4) 15%, transparent 30%, transparent 50%, rgba(59, 130, 246, 0.4) 65%, transparent 80%, transparent 100%)",
          }}
        />
      </div>
      {/* Lado izquierdo (Menu + Logo) */}
      <div className="flex items-center gap-3 relative z-10">
        {/* Icono de menu de navegacion */}
        <button
          onClick={onMenuToggle}
          className="p-2 text-zinc-400 hover:text-white transition-all duration-300 
          hover:bg-white/10 rounded-xl hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
          aria-label="Abrir menú"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>

      {/* Título (Centrado Absoluto) */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none z-10">
        <span
          className="text-sm font-bold text-white/85 tracking-wide 
          drop-shadow-md"
        >
          {title ? title : "Cupper & Hannia"}
        </span>
      </div>

      {/* Menu de usuario */}
      <div className="relative z-10">
        <UserMenu />
      </div>
    </header>
  );
};
