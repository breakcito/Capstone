import { useEffect } from "react";
import { notifications } from "@mantine/notifications";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import { useNotify } from "../../../../hooks/useNotify";
import { useSound } from "react-sounds";

export const GlobalNotification = () => {
  const { message, clearMessage } = useNotify();

  // Modern, subtle, futuristic notification sounds
  const { play: playSuccess } = useSound("ui/success_blip");
  const { play: playError } = useSound("ui/blocked");
  const { play: playInfo } = useSound("ui/pop_open");

  useEffect(() => {
    if (!message.type || !message.content) return;

    // Trigger subtle sound based on notification type
    if (message.type === "success") playSuccess({ volume: 0.35 });
    else if (message.type === "error") playError({ volume: 0.35 });
    else playInfo({ volume: 0.35 });

    const titleMap: Record<string, string> = {
      success: "Operación Exitosa",
      error: "Ha ocurrido un error",
      info: "Información",
    };

    const iconMap: Record<string, React.ReactNode> = {
      success: (
        <CheckCircleIcon
          style={{
            width: 28,
            height: 28,
            color: "#34d399",
            filter: "drop-shadow(0 0 8px rgba(52,211,153,0.4))",
          }}
        />
      ),
      error: (
        <XCircleIcon
          style={{
            width: 28,
            height: 28,
            color: "#fb7185",
            filter: "drop-shadow(0 0 8px rgba(251,113,133,0.4))",
          }}
        />
      ),
      info: (
        <InformationCircleIcon
          style={{
            width: 28,
            height: 28,
            color: "#60a5fa",
            filter: "drop-shadow(0 0 8px rgba(96,165,250,0.4))",
          }}
        />
      ),
    };

    notifications.show({
      title: titleMap[message.type] || "Aviso",
      message: message.content,
      icon: iconMap[message.type],
      autoClose: 5000,
      withBorder: true,
      withCloseButton: true,
      styles: () => ({
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.4)", // Ultra transparent
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderWidth: "1px",
          boxShadow:
            "0 20px 40px -12px rgba(0, 0, 0, 0.8), inset 0 0 15px rgba(255,255,255,0.05)",
          borderRadius: "24px",
          padding: "16px 20px",
          "&::before": { display: "none" }, // Remove default left color bar if present
        },
        title: {
          color: "#f4f4f5", // zinc-100
          fontWeight: 800,
          fontSize: "14px",
          letterSpacing: "-0.01em",
          marginBottom: "4px",
        },
        description: {
          color: "#a1a1aa", // zinc-400
          fontSize: "12px",
          lineHeight: "1.5",
          fontWeight: 500,
        },
        closeButton: {
          color: "#71717a", // zinc-500
          transition: "all 0.3s",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
          },
        },
        icon: {
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          marginRight: "16px",
        },
      }),
    });

    clearMessage();
  }, [message, clearMessage, playSuccess, playError, playInfo]);

  return null;
};
