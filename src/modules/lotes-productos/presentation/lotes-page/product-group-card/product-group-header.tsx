import { Badge, Group, Stack, Text } from "@mantine/core";
import {
  InboxStackIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useBlackcito } from "../../../../../hooks/useBlackcito";
import { formatNumber } from "../../../../../shared/functions/formatNumber";
import type { GroupedProduct } from "./product-group-card";

export const ProductGroupHeader = ({
  product,
}: {
  product: GroupedProduct;
}) => {
  const { angry, close } = useBlackcito();

  const isBajoStock =
    Number(product.total_stock_base) < Number(product.stock_minimo_base);

  return (
    <div className="p-4 bg-zinc-900/20 border-b border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
          <InboxStackIcon className="w-4 h-4 text-indigo-400" />
        </div>
        <Stack gap={2}>
          <Text
            fw={800}
            className="uppercase tracking-widest text-zinc-500 text-[10px]!"
          >
            {product.categoria || "S/C"}
          </Text>
          <div className="flex flex-row gap-3">
            <Text size="md" fw={900} className="text-white tracking-tight">
              {product.producto}
            </Text>
            <Group gap={4} className="flex flex-row self-end gap-3 mb-0.5">
              {product.es_auditable && (
                <Badge color="yellow" variant="light" size="xs">
                  Auditable
                </Badge>
              )}
              {product.es_perecible && (
                <Badge color="red" variant="light" size="xs">
                  Perecible
                </Badge>
              )}
              {isBajoStock && (
                <>
                  <div
                    className="bg-rose-500/20 border-2 border-rose-500/60 rounded-md py-1 px-2.5 w-fit animate-pulse flex items-center gap-1.5 shadow-[0_0_12px_rgba(249,115,22,0.4)] cursor-help"
                    onMouseEnter={() =>
                      angry(
                        `El inventario de ${product.producto} está por debajo del mínimo. Te sugiero reabastecerte pronto!`,
                        { persistent: true },
                      )
                    }
                    onMouseLeave={close}
                  >
                    <ExclamationTriangleIcon className="w-3 h-3 text-rose-400" />
                    <Text
                      size="9px"
                      c="white"
                      fw={900}
                      className="uppercase tracking-widest leading-none"
                      style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.8)" }}
                    >
                      ¡Stock crítico!
                    </Text>
                  </div>
                </>
              )}
            </Group>
          </div>
        </Stack>
      </div>

      <div className="flex items-center gap-6">
        {/* Expiration Mini-Summary */}
        {product.es_perecible == true && (
          <div className="hidden sm:flex items-center gap-4 p-2 bg-zinc-950/40 rounded-xl border border-zinc-800/50 px-4">
            <div className="flex flex-col items-center">
              <Text size="9px" fw={900} className="text-zinc-600 uppercase">
                Vigentes
              </Text>
              <Text size="xs" fw={900} className="text-emerald-500">
                {product.vigentes}
              </Text>
            </div>
            <div className="w-px h-6 bg-zinc-800/50" />
            <div className="flex flex-col items-center">
              <Text size="9px" fw={900} className="text-zinc-600 uppercase">
                Por Vencer
              </Text>
              <Text size="xs" fw={900} className="text-amber-500">
                {product.por_vencer}
              </Text>
            </div>
            <div className="w-px h-6 bg-zinc-800/50" />
            <div className="flex flex-col items-center">
              <Text size="9px" fw={900} className="text-zinc-600 uppercase">
                Vencidos
              </Text>
              <Text size="xs" fw={900} className="text-red-500">
                {product.vencidos}
              </Text>
            </div>
          </div>
        )}

        <div className="flex flex-col items-end gap-2">
          <Badge
            variant="gradient"
            gradient={{ from: "indigo.8", to: "cyan.8" }}
            radius="md"
            size="md"
            className="h-9 px-6 border-0 shadow-lg shadow-indigo-900/20"
          >
            <Text size="xs" fw={800} className="text-center">
              {product.total_stock_base} {product.unidad_medida_base}
            </Text>
          </Badge>
          <div className="flex items-center gap-1 px-1">
            <Text size="10px" c="zinc.5" fw={700}>
              Mínimo:
            </Text>
            <Text size="10px" c="pink.5" fw={800}>
              {formatNumber(product.stock_minimo_base)}{" "}
              {product.unidad_medida_base}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};
