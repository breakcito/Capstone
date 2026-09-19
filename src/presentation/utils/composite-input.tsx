import { Input } from "@mantine/core";

export interface CompositeInputProps {
  label: string;
  required?: boolean;
  serieValue: string;
  numeroValue: string;
  onChangeSerie: (val: string) => void;
  onChangeNumero: (val: string) => void;
  seriePlaceholder?: string;
  numeroPlaceholder?: string;
  serieMaxLength?: number;
  numeroMaxLength?: number;
}

export const CompositeInput = ({
  label,
  required,
  serieValue,
  numeroValue,
  onChangeSerie,
  onChangeNumero,
  seriePlaceholder = "Serie",
  numeroPlaceholder = "Número",
  serieMaxLength = 10,
  numeroMaxLength = 10,
}: CompositeInputProps) => {
  return (
    <Input.Wrapper
      label={label}
      required={required}
      size="xs"
      classNames={{
        label: "text-zinc-300 font-medium mb-1 text-xs select-none",
      }}
      className="max-w-[200px] w-full"
    >
      <Input
        component="div"
        size="xs"
        radius="lg"
        classNames={{
          input:
            "flex items-center bg-zinc-900/50 border-zinc-800 focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-300 text-white transition-all px-3 h-[30px]",
        }}
      >
        <input
          type="text"
          value={serieValue}
          onChange={(e) => onChangeSerie(e.target.value.toUpperCase())}
          placeholder={seriePlaceholder}
          maxLength={serieMaxLength}
          className="w-[calc(50%-12px)] bg-transparent border-none outline-none text-xs text-white font-sans placeholder:text-zinc-500 placeholder:text-right focus:ring-0 p-0 text-right tracking-wider pr-1"
        />
        <span className="text-zinc-600 font-bold px-1.5 pointer-events-none select-none text-xs flex-none">
          -
        </span>
        <input
          type="text"
          value={numeroValue}
          onChange={(e) => onChangeNumero(e.target.value.toUpperCase())}
          placeholder={numeroPlaceholder}
          maxLength={numeroMaxLength}
          className="w-[calc(50%-12px)] bg-transparent border-none outline-none text-xs text-white font-sans placeholder:text-zinc-500 placeholder:text-left focus:ring-0 p-0 text-left tracking-wider pl-1"
        />
      </Input>
    </Input.Wrapper>
  );
};
