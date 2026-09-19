import { useBlackcito } from "../../../../hooks/useBlackcito";
import { BlackcitoMascot } from "../../../../presentation/utils/blackcito-pet";

import { Portal } from "@mantine/core";

export const GlobalBlackcito = () => {
  const { visible, emotion, message, close } = useBlackcito();

  return (
    <Portal>
      <BlackcitoMascot
        visible={visible}
        emotion={emotion}
        message={message}
        onClose={close}
      />
    </Portal>
  );
};
