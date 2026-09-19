/**
 * Mapeo de etiquetas (tags) operativas y de negocio por módulo o URL.
 * Permite que las búsquedas del usuario relacionen términos coloquiales o de negocio
 * con el módulo correcto aunque el título no coincida de forma literal.
 */
export const MODULO_TAGS_MAP: Record<string, string[]> = {
  // --- Configuración / Empresa ---
  empresas: [
    "empresa",
    "matriz",
    "ruc",
    "razon social",
    "corporativo",
    "entidad",
    "organizacion",
    "compañia",
    "sociedad",
  ],
  concesiones: [
    "concesion",
    "minera",
    "legal",
    "territorio",
    "terreno",
    "propiedad",
    "lote minero",
    "yacimiento",
    "denuncio",
  ],
  "minas-labores": [
    "mina",
    "labor",
    "frente",
    "trabajo",
    "excavacion",
    "zona",
    "contratista",
    "subterranea",
    "socavon",
    "tajo",
    "operacion",
  ],
  almacenes: [
    "almacen",
    "bodega",
    "deposito",
    "stock",
    "inventario",
    "puente",
    "central",
    "custodia",
    "ubicacion",
    "lote",
  ],

  // --- Configuración / Personal y Usuarios ---
  personal: [
    "personal",
    "empleado",
    "trabajador",
    "contratista",
    "operador",
    "planilla",
    "rrhh",
    "recursos humanos",
    "obrero",
    "ingeniero",
  ],
  usuarios: [
    "usuario",
    "cuenta",
    "acceso",
    "login",
    "password",
    "clave",
    "seguridad",
    "rol",
    "permisos",
    "perfil",
  ],
  "socios-comerciales": [
    "proveedor",
    "socio",
    "comercial",
    "vendor",
    "vendedor",
    "ruc",
    "contacto",
    "tercero",
    "contratista",
  ],
  proveedores: [
    "proveedor",
    "socio",
    "comercial",
    "vendor",
    "vendedor",
    "ruc",
    "contacto",
    "compras",
  ],

  // --- Logística / Inventario y Almacén ---
  inventario: [
    "inventario",
    "producto",
    "stock",
    "lote",
    "kardex",
    "saldo",
    "material",
    "insumo",
    "categoria",
    "explosivos",
    "herramientas",
    "repuestos",
    "existencias",
  ],
  productos: [
    "producto",
    "item",
    "catalogo",
    "articulo",
    "material",
    "insumo",
    "unidad",
    "medida",
    "presentacion",
    "marca",
  ],
  "requerimiento-almacen": [
    "requerimiento",
    "pedido",
    "despacho",
    "solicitud",
    "material",
    "herramienta",
    "atencion",
    "salida",
    "vale",
    "entrega",
    "insumo",
  ],
  "requerimientos-almacen": [
    "requerimiento",
    "pedido",
    "despacho",
    "solicitud",
    "material",
    "herramienta",
    "atencion",
    "salida",
    "vale",
    "entrega",
    "insumo",
  ],
  "solicitud-reabastecimiento": [
    "reabastecimiento",
    "reposicion",
    "stock",
    "compra",
    "pedido",
    "almacen",
    "abastecer",
    "transferencia",
    "minimo",
  ],
  "solicitudes-reabastecimiento": [
    "reabastecimiento",
    "reposicion",
    "stock",
    "compra",
    "pedido",
    "almacen",
    "abastecer",
    "transferencia",
    "minimo",
  ],
  "prestamos-almacen": [
    "prestamo",
    "devolucion",
    "herramienta",
    "equipo",
    "salida",
    "temporal",
    "retorno",
    "custodia",
  ],
  compras: [
    "compra",
    "cotizacion",
    "orden",
    "oc",
    "po",
    "proveedor",
    "precio",
    "igv",
    "auto-po",
    "adquisicion",
    "licitacion",
    "factura",
  ],

  // --- Operaciones ---
  "control-activos": [
    "activo",
    "fijo",
    "maquinaria",
    "equipo",
    "vehiculo",
    "placa",
    "unidad",
    "mantenimiento",
    "camion",
    "maquina",
  ],
  produccion: [
    "produccion",
    "planta",
    "procesamiento",
    "mineral",
    "tonelaje",
    "rendimiento",
    "extraccion",
    "ley",
    "chancado",
  ],
  "control-personal": [
    "asistencia",
    "turno",
    "control",
    "personal",
    "marcacion",
    "ingreso",
    "salida",
    "asistencia minera",
  ],
};

/**
 * Obtiene las etiquetas asociadas a un módulo buscando por su URL, path o nombre.
 */
export const getTagsParaModulo = (
  urlOrName: string,
  extraTags?: string[],
): string[] => {
  if (!urlOrName) return extraTags || [];

  const lower = urlOrName.toLowerCase();
  const tagsSet = new Set<string>(extraTags || []);

  Object.entries(MODULO_TAGS_MAP).forEach(([key, tags]) => {
    if (lower.includes(key)) {
      tags.forEach((t) => tagsSet.add(t));
    }
  });

  return Array.from(tagsSet);
};
