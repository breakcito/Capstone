/**
 * Contratista en el sistema.
 *
 * En el modelo actual, los contratistas se almacenan en la tabla `empleado`
 * con `es_contratista = 1`. Por eso `id_empleado` es el identificador
 * real que se guarda en `requerimiento_almacen.id_contratista_solicitante`.
 *
 * Esta interfaz refleja los campos que entrega actualmente el endpoint
 * `/api/aux/contratistas` (ver `App\Data\EmpleadosData::get_empleados`
 * con `es_contratista = true`). Si mas adelante se separa la entidad
 * contratista en su propia tabla, este shape se ajustara.
 */
export interface RES_Contratista {
  /** Alias de id_empleado. La respuesta puede traer uno u otro. */
  id_empleado?: number;
  id_contratista?: number;
  /** Algunos endpoints lo devuelven en camelCase */
  idContratista?: number;
  nombre?: string;
  apellido?: string;
  nombre_completo?: string | null;
  dni?: string | null;
  url_foto?: string | null;
  es_contratista?: boolean;
  estado?: string;
  // Para compatibilidad con hooks viejos
  ruc?: string | null;
  fecha_nacimiento?: string | null;
  id_mina?: number | null;
  mina?: string | null;
  /** IDs de labores activas separados por coma, ej: "1,3,5" */
  ids_labores_activas?: string | null;
}
