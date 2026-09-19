import { Tabs } from "@mantine/core";
import { useTitlePage } from "../../../hooks/useTitlePage";
import { UnidadesMedidaTab } from "./tabs/unidades-medida.tab";
import { ConversionesTab } from "./tabs/conversiones.tab";

const SystemPage = () => {
  useTitlePage("Sistema - Unidades y Conversiones");
  return (
    <div className="space-y-4">
      <Tabs defaultValue="unidades" color="indigo">
        <Tabs.List>
          <Tabs.Tab value="unidades">Unidades de Medida</Tabs.Tab>
          <Tabs.Tab value="conversiones">Conversiones</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="unidades" pt="md">
          <UnidadesMedidaTab />
        </Tabs.Panel>
        <Tabs.Panel value="conversiones" pt="md">
          <ConversionesTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default SystemPage;