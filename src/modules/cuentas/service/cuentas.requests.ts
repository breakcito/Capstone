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
