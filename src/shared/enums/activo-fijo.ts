export enum EstadoActivoFijo {
  EnUso = 'En Uso',
  EnMantenimiento = 'En Mantenimiento',
  EnAlmacen = 'En Almacén',
  DadoDeBaja = 'Dado de Baja',
}

export enum MovimientoActivoFijo {
  DeAlmacenAMina = 'De Almacén a Mina',
  DeAlmacenAAlmacen = 'De Almacén a Almacén',
  DeMinaAMina = 'De Mina a Mina',
  DeMinaAAlmacen = 'De Mina a Almacén',
  NuevoActivo = 'Nuevo Activo',
  DadoDeBaja = 'Dado de Baja',
}
