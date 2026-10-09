import { Tooltip, Text } from "@mantine/core";

interface GaugeProgressProps {
  /** Valor actual medido. Acepta null/undefined sin romperse. */
  value: number | null | undefined;
  /** Objetivo. El gauge se rellena hasta aca. */
  target: number | null | undefined;
  /** Unidad a mostrar (ej. "min", "%", "S/."). */
  unit?: string;
  /**
   * Si true, formatea valores altos con unidad inteligente:
   * < 60 -> "min", < 1440 -> "h", >= 1440 -> "dias".
   * Util para el TDA donde el valor puede ir de minutos a dias.
   */
  unidadInteligente?: boolean;
  /** Color cuando se cumple el objetivo. */
  colorCumple?: string;
  /** Color cuando se acerca al objetivo. */
  colorEnRango?: string;
  /** Color cuando se sobrepasa. */
  colorFuera?: string;
  /** Si true, valores mayores son mejores. Default: false (TDA donde menos es mejor). */
  mayorEsMejor?: boolean;
  /** Tamano del gauge (px). */
  size?: number;
  /** Etiqueta tooltip explicativo. */
  descripcion?: string;
}

/**
 * Formatea un numero para mostrar. Tolera null/undefined/NaN.
 */
const fmtNum = (v: unknown, decimals = 1): string => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  return decimals === 0 || Number.isInteger(n)
    ? n.toString()
    : n.toFixed(decimals);
};

/**
 * Formatea minutos con unidad inteligente: SOLO el numero, sin unidad.
 * El componente padre agrega la unidad despues para evitar duplicacion
 * ("min min"). Si unidadInteligente=true, NO se deberia pasar `unit` prop.
 */
const fmtMinInteligente = (v: number): string => {
  if (v < 60) {
    return Number.isInteger(v) ? `${v} min` : `${v.toFixed(1)} min`;
  }
  if (v < 1440) return `${(v / 60).toFixed(1)} h`;
  return `${(v / 1440).toFixed(1)} dias`;
};

export const GaugeProgress = ({
  value,
  target,
  unit = "",
  unidadInteligente = false,
  colorCumple = "#22c55e",
  colorEnRango = "#eab308",
  colorFuera = "#ef4444",
  mayorEsMejor = false,
  size = 180,
  descripcion,
}: GaugeProgressProps) => {
  // ---------------------------------------------------------------------
  // Normalizar entradas: cualquier cosa no numerica se convierte a 0/1.
  // Esto protege contra null, undefined, NaN, strings vacios, etc.
  // ---------------------------------------------------------------------
  const rawValue = Number(value);
  const safeValue =
    Number.isFinite(rawValue) && rawValue >= 0 ? rawValue : 0;

  const rawTarget = Number(target);
  const safeTarget =
    Number.isFinite(rawTarget) && rawTarget > 0 ? rawTarget : 1;

  // Porcentaje del arco pintado (cap entre 0% y 100%)
  const ratio = safeValue / safeTarget;
  const cappedRatio = mayorEsMejor ? ratio : Math.min(ratio, 1);
  const pct = Math.max(0, Math.min(1, cappedRatio)) * 100;

  // Color + badge de estado segun cumplimiento
  let color = colorEnRango;
  let estado = "EN RANGO";
  let desviacionTexto = "";

  if (mayorEsMejor) {
    if (safeValue >= safeTarget) {
      color = colorCumple;
      estado = "EN META";
      const sob = ((safeValue - safeTarget) / safeTarget) * 100;
      desviacionTexto =
        sob > 1 ? `+${Math.round(sob)}% sobre la meta` : "Dentro del rango esperado";
    } else if (safeValue >= safeTarget * 0.9) {
      color = colorEnRango;
      estado = "ACEPTABLE";
      const deficit = ((safeTarget - safeValue) / safeTarget) * 100;
      desviacionTexto = `${Math.round(deficit)}% bajo la meta`;
    } else {
      color = colorFuera;
      estado = "REQUIERE ATENCIÓN";
      const deficit = ((safeTarget - safeValue) / safeTarget) * 100;
      desviacionTexto = `-${Math.round(deficit)}% bajo la meta`;
    }
  } else {
    if (safeValue <= safeTarget) {
      color = colorCumple;
      estado = "EN META";
      if (safeValue === safeTarget) {
        desviacionTexto = "En el tiempo límite";
      } else if (safeValue < safeTarget) {
        const mejora = ((safeTarget - safeValue) / safeTarget) * 100;
        desviacionTexto = `${Math.round(mejora)}% más rápido`;
      } else {
        desviacionTexto = "Dentro del rango esperado";
      }
    } else if (safeValue <= safeTarget * 1.5) {
      color = colorEnRango;
      estado = "ACEPTABLE";
      const exceso = ((safeValue - safeTarget) / safeTarget) * 100;
      desviacionTexto = `+${Math.round(exceso)}% sobre el tiempo límite`;
    } else {
      color = colorFuera;
      estado = "REQUIERE ATENCIÓN";
      const exceso = ((safeValue - safeTarget) / safeTarget) * 100;
      desviacionTexto = `+${Math.round(exceso)}% sobre el tiempo límite`;
    }
  }

  // Geometria del SVG (todo validado para no romperse)
  const safeSize = Number.isFinite(size) && size > 0 ? size : 180;
  const radius = safeSize / 2;
  const stroke = 16;
  const safeCircumference = 2 * Math.PI * (radius - stroke / 2);
  // Forzar numero en dashOffset por si acaso
  const dashOffset = safeCircumference - (pct / 100) * safeCircumference;

  // Valor mostrado: formatear segun unidad (inteligente o normal)
  const valorMostrado = unidadInteligente
    ? fmtMinInteligente(safeValue)
    : fmtNum(safeValue);

  const gaugeContent = (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex items-center justify-center"
        style={{ width: safeSize, height: safeSize }}
      >
        <svg
          width={safeSize}
          height={safeSize}
          viewBox={`0 0 ${safeSize} ${safeSize}`}
          className="transform -rotate-90"
        >
          <circle
            cx={radius}
            cy={radius}
            r={radius - stroke / 2}
            fill="none"
            stroke="rgba(63, 63, 70, 0.6)"
            strokeWidth={stroke}
          />
          <circle
            cx={radius}
            cy={radius}
            r={radius - stroke / 2}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={safeCircumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transition: "stroke-dashoffset 0.7s ease-out",
              filter: `drop-shadow(0 0 6px ${color}55)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Text
            size="xl"
            fw={900}
            className="text-white tracking-tight"
            style={{ fontSize: safeSize * 0.22 }}
          >
            {valorMostrado}
            {unit && (
              <Text component="span" size="xs" c="zinc.5" className="ml-1">
                {unit}
              </Text>
            )}
          </Text>
          <Text
            size="10px"
            c="zinc.5"
            fw={600}
            className="uppercase tracking-wider mt-0.5"
          >
            {desviacionTexto || "—"}
          </Text>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-1">
      {descripcion ? (
        <Tooltip label={descripcion} position="top" withArrow multiline w={260}>
          {gaugeContent}
        </Tooltip>
      ) : (
        gaugeContent
      )}
      <span
        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md"
        style={{
          color,
          backgroundColor: `${color}15`,
          border: `1px solid ${color}40`,
        }}
      >
        {estado}
      </span>
    </div>
  );
};