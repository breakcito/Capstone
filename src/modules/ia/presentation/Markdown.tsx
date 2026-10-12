import { useMemo } from "react";
import MarkdownIt from "markdown-it";

/**
 * Renderiza la respuesta del modelo como Markdown con estilos propios.
 *
 * Se usa markdown-it (dependencia declarada en package.json). La opcion `html`
 * va en false a proposito: el texto viene de un modelo de lenguaje y no debe
 * poder inyectar HTML crudo en el DOM.
 */
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

export const Markdown = ({ texto }: { texto: string }) => {
  const html = useMemo(() => md.render(texto ?? ""), [texto]);

  return (
    <div
      className="ia-markdown text-sm leading-relaxed text-zinc-200 break-words
        [&_a]:text-violet-300 [&_a]:underline [&_a]:underline-offset-2
        [&_a:hover]:text-violet-200
        [&_code]:font-mono [&_code]:text-[12px] [&_code]:px-1 [&_code]:py-0.5
        [&_code]:rounded [&_code]:bg-white/10 [&_code]:text-amber-200
        [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:p-3
        [&_pre]:bg-black/50 [&_pre]:ring-1 [&_pre]:ring-white/10
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-zinc-300
        [&_ul]:my-2 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:marker:text-zinc-500
        [&_ol]:my-2 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:marker:text-zinc-500
        [&_li]:my-1 [&_li]:ps-1
        [&_h1]:my-3 [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-white
        [&_h2]:my-3 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-white
        [&_h3]:my-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-white
        [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-violet-500/40
        [&_blockquote]:pl-3 [&_blockquote]:text-zinc-400
        [&_strong]:font-semibold [&_strong]:text-white
        [&_hr]:my-3 [&_hr]:border-white/10
        [&table]:w-full [&table]:my-3 [&table]:border-collapse
        [&table]:text-[12px] [&table]:block [&table]:overflow-x-auto
        [&_thead]:bg-white/8
        [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold
        [&_th]:text-white [&_th]:whitespace-nowrap [&_th]:uppercase
        [&_th]:tracking-wide [&_th]:text-[10px]
        [&_th]:border-b [&_th]:border-white/15
        [&_tbody]:[&_tr:nth-child(even)]:bg-white/[0.03]
        [&_td]:px-3 [&_td]:py-1.5 [&_td]:border-b [&_td]:border-white/5
        [&_td]:whitespace-nowrap
        [&_tr:hover]:bg-white/5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};