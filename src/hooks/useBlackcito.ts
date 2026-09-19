import { useBlackcitoStore, type BlackcitoOptions } from "../stores/blackcito.store";
import type { BlackcitoEmotion } from "../presentation/assets/blackcito/blackcito-assets";

export type { BlackcitoOptions } from "../stores/blackcito.store";

export const useBlackcito = () => {
  const { visible, emotion, message, show, hide } = useBlackcitoStore();

  const say = (
    emotion: BlackcitoEmotion,
    text: string,
    options?: BlackcitoOptions,
  ) => {
    show(emotion, text, options);
  };

  const happy = (text: string, options?: BlackcitoOptions) =>
    say("feliz", text, options);

  const angry = (text: string, options?: BlackcitoOptions) =>
    say("enojado", text, options);

  return {
    visible,
    emotion,
    message,
    say,
    happy,
    angry,
    close: hide,
  };
};
