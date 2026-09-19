import { useUIStore, type IMessage } from "../stores/ui.store";

export const useNotify = () => {
  const notify = useUIStore((state) => state.notify);
  const message = useUIStore((state) => state.message);
  const clearMessage = useUIStore((state) => state.clearMessage);

  return {
    message,
    clearMessage,
    notify: (message: IMessage) => notify(message),
    notifySuccess: (content: string) => notify({ type: "success", content }),
    notifyError: (content: string) => notify({ type: "error", content }),
    notifyInfo: (content: string) => notify({ type: "info", content }),
    clearNotify: () => notify({ type: "", content: "" }),
  };
};
