export interface RES_Menu {
  id_menu: number;
  nombre: string;
  path: string;
  es_desplegable: boolean;
  submenus: RES_Submenu[];
}

export interface RES_Submenu {
  id_submenu: number;
  nombre: string;
  path: string;
  es_desplegable: boolean;
  modulos: RES_Modulo[];
}

export interface RES_Modulo {
  id_modulo: number;
  nombre: string;
  path: string;
  es_desplegable: boolean;
  tags?: string[];
}