import {
  BuildingOffice2Icon,
  UserGroupIcon,
  UsersIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon,
  ReceiptRefundIcon,
  ShoppingCartIcon,
  CubeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Asociacion de iconos a cada nivel de menú mediante
// el campo "path". Visible en el menu de navegacion.
// modulo_path -> menu_path
// submodulo_path -> submenu_path
export const iconos_menu_navegacion = [
  {
    menu_path: "configuracion",
    icono: Cog6ToothIcon,
    submenus: [
      { submenu_path: "empresas", icono: BuildingOffice2Icon },
      { submenu_path: "personal", icono: UserGroupIcon },
      { submenu_path: "usuarios", icono: UsersIcon },
    ],
  },
  {
    menu_path: "logistica",
    icono: TruckIcon,
    submenus: [
      { submenu_path: "inventario", icono: ClipboardDocumentListIcon },
      { submenu_path: "requerimiento_almacen", icono: DocumentTextIcon },
      {
        submenu_path: "solicitud_reabastecimiento",
        icono: ArrowsRightLeftIcon,
      },
      { submenu_path: "prestamos_almacen", icono: ReceiptRefundIcon },
      { submenu_path: "compras", icono: ShoppingCartIcon },
    ],
  },
  {
    menu_path: "operaciones",
    icono: TruckIcon,
    submenus: [
      { submenu_path: "control-activos", icono: ClipboardDocumentListIcon },
      { submenu_path: "produccion", icono: CubeIcon },
      { submenu_path: "control-personal", icono: ClockIcon },
    ],
  },
];
