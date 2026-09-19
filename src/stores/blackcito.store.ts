import { create } from "zustand";
import type { BlackcitoEmotion } from "../presentation/assets/blackcito/blackcito-assets";

const DEFAULT_DURATION_MS = 5000;

export interface BlackcitoOptions {
  persistent?: boolean;
  duration?: number;
}

interface BlackcitoState {
  visible: boolean;
  emotion: BlackcitoEmotion;
  message: string;
  show: (
    emotion: BlackcitoEmotion,
    message: string,
    options?: BlackcitoOptions,
  ) => void;
  hide: () => void;
}

export const useBlackcitoStore = create<BlackcitoState>((set) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return {
    visible: false,
    emotion: "feliz",
    message: "",
    show: (emotion, message, options) => {
      clearTimer();
      set({ visible: true, emotion, message });

      const persistent = options?.persistent === true;
      const duration = Math.max(0, options?.duration ?? DEFAULT_DURATION_MS);

      if (!persistent && duration > 0) {
        timer = setTimeout(() => {
          set({ visible: false });
          timer = null;
        }, duration);
      }
    },
    hide: () => {
      clearTimer();
      set({ visible: false });
    },
  };
});
