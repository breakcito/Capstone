import { ActionIcon, Tooltip } from "@mantine/core";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface BotonRecargarProps {
  onReload?: () => void | Promise<void>;
  loading?: boolean;
  tooltip?: string;
  className?: string;
}

export const BotonRecargar = ({
  onReload,
  loading = false,
  tooltip = "Recargar datos",
  className = "",
}: BotonRecargarProps) => {
  return (
    <Tooltip label={tooltip} position="top" withArrow zIndex={100}>
      <ActionIcon
        variant="default"
        size="md"
        radius="lg"
        onClick={onReload}
        loading={loading}
        aria-label={tooltip}
        className={`bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white h-9.5 w-9.5 transition-all shadow-sm shrink-0 ${className}`}
      >
        <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
      </ActionIcon>
    </Tooltip>
  );
};
