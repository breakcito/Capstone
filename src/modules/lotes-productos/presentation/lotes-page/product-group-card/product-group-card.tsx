import { type DataTableColumn } from "mantine-datatable";
import { DataTableEstandar } from "../../../../../presentation/utils/datatable-estandar";
import type { RES_Lote } from "../../../service/lotes.responses";
import { useProductGroupSelection } from "../../../hooks/useProductGroupSelection";
import { ProductGroupHeader } from "./product-group-header";

export interface GroupedProduct {
  id_producto: number;
  producto: string;
  categoria: string | null;
  unidad_medida_base: string;
  stock_minimo_base: number;
  lotes: RES_Lote[];
  total_stock_base: number;
  vigentes: number;
  por_vencer: number;
  vencidos: number;
  es_perecible: boolean;
  es_auditable: boolean;
}

interface ProductGroupCardProps {
  product: GroupedProduct;
  columns: DataTableColumn<RES_Lote>[];
  loading: boolean;
  onPrint: (lotes: RES_Lote | RES_Lote[]) => void;
  selection: {
    selectedRecords: RES_Lote[];
    setSelectedRecords: (
      val: RES_Lote[] | ((prev: RES_Lote[]) => RES_Lote[]),
    ) => void;
  };
}

export const ProductGroupCard = ({
  product,
  columns,
  loading,
  onPrint,
  selection,
}: ProductGroupCardProps) => {
  const { enhancedColumns } = useProductGroupSelection({
    lotes: product.lotes,
    columns,
    onPrint,
    selection,
  });

  return (
    <div className="bg-zinc-900/65 border border-zinc-800 rounded-[24px] shadow-2xl overflow-hidden flex flex-col backdrop-blur-md">
      <ProductGroupHeader product={product} />

      <div className="relative shadow-inner">
        <DataTableEstandar
          idAccessor="id_lote"
          columns={enhancedColumns}
          records={product.lotes}
          loading={loading}
          initialPageSize={5}
          minHeight={0}
        />
      </div>
    </div>
  );
};
