export interface RES_Usuario {
  id_usuario: number;
  id_rol: number;
  id_empleado: number;
  nombre: string;
  apellido: string;
  dni: string;
  ruc: string;
  carnet_extranjeria: string;
  pasaporte: string;
  fecha_nacimientto: string;
  url_foto: string;
}

// Respuesta del endpoint
export interface RES_Login {
  token: string;
  usuario: RES_Usuario;
}
