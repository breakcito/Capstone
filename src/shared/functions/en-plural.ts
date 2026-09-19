import pluralize from "pluralize";

/**
 * REGLAS DE PLURALIZACIÓN
 */
// 1. Vocales (átonas y tónicas) -> añaden 's'
pluralize.addPluralRule(/([aeiouáéíóú])$/i, "$1s");

// 2. Consonantes típicas del español (d, j, l, m, n, r, y) -> añaden 'es'
pluralize.addPluralRule(/([djlmnry])$/i, "$1es");

// 3. Terminación en 'z' -> cambia a 'ces'
pluralize.addPluralRule(/z$/i, "ces");

/**
 * REGLAS DE SINGULARIZACIÓN
 */
// 1. Terminación en 'ces' -> cambia a 'z'
pluralize.addSingularRule(/ces$/i, "z");

// 2. Terminación en consonante típica + 'es' -> quita 'es'
pluralize.addSingularRule(/([djlmnry])es$/i, "$1");

// 3. Terminación en vocal + 's' -> quita 's'
pluralize.addSingularRule(/([aeiouáéíóú])s$/i, "$1");

/**
 * PALABRAS INVARIABLES (Uncountables)
 * Palabras que no cambian de forma entre singular y plural.
 */
const invariables = [
  "lunes",
  "martes",
  "miercoles",
  "miércoles",
  "jueves",
  "viernes",
  "paraguas",
  "cumpleaños",
  "crisis",
  "tesis",
  "analisis",
  "análisis",
  "virus",
  "torax",
  "tórax",
  "caos",
];
invariables.forEach((word) => pluralize.addUncountableRule(word));

/**
 * IRREGULARES Y CAMBIOS ORTOGRÁFICOS (Tildes)
 * Reglas manuales obligatorias porque la RegEx no puede calcular sílabas tónicas.
 */
const irregulares = [
  // Pérdida de tilde (Agudas terminadas en n, s que pasan a llanas)
  ["autobús", "autobuses"],
  ["compás", "compases"],
  ["inglés", "ingleses"],
  ["francés", "franceses"],
  ["país", "países"], // Mantiene hiato
  ["raíz", "raíces"],
  ["mes", "meses"],
  ["dios", "dioses"],
  // Ganancia de tilde (Llanas que pasan a esdrújulas)
  ["joven", "jóvenes"],
  ["virgen", "vírgenes"],
  ["examen", "exámenes"],
  ["imagen", "imágenes"],
  ["volumen", "volúmenes"],
  ["resumen", "resúmenes"],
  ["origen", "orígenes"],
  ["margen", "márgenes"],
];
irregulares.forEach(([singular, plural]) =>
  pluralize.addIrregularRule(singular, plural),
);

export const enPlural = (
  word: string | undefined | null,
  count?: number | string,
) => {
  if (!word) return "";

  const normalizedWord = word.trim();

  // 1. Forzamos la conversión a número. Si viene un "1" o un 1, siempre será 1.
  const parsedCount = Number(count);

  if (parsedCount === 1) {
    // 2. Escudo (early-exit) para español: si no termina en 's', ya es singular.
    // Esto asegura que "UNIDAD" se devuelva inmediatamente sin pasar por el motor de la librería.
    if (!normalizedWord.toLowerCase().endsWith("s")) {
      return normalizedWord;
    }

    // Si termina en 's' (ej: "unidades", "luces"), aplicamos las reglas de singularización.
    return pluralize.singular(normalizedWord);
  }

  // Para 0, 2, 3, etc. o undefined, pluralizamos.
  return pluralize.plural(normalizedWord);
};
