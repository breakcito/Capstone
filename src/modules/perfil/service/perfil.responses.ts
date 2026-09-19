export interface RES_Perfil {
  id_usuario: number;
  username: string;
  nombre: string;
  apellido: string;
  dni: string;
  ruc?: string;
  carnet_extranjeria?: string;
  pasaporte?: string;
  fecha_nacimiento?: string;
  url_foto: string | null;
  nombre_rol: string;
  nombre_cargo: string | null;
  nombre_area: string | null;
  empresa_nombre: string | null;
  es_contratista?: boolean;
  mina_nombre?: string | null;
}
