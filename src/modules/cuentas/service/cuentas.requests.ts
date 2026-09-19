export interface REQ_CrearCuenta {
  id_rol: number;
  id_empleado: number;
  username: string;
  password: string;
}

export interface REQ_ActualizarCuenta {
  id_rol: number;
  username: string;
  password?: string;
  estado?: string;
}

export interface REQ_CrearEmpleado {
  nombre: string;
  apellido: string;
  dni?: string | null;
  es_contratista?: boolean;
}
