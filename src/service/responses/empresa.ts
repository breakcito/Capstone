export interface RES_Empresa {
  id_empresa: number;
  ruc: string;
  razon_social: string;
  domicilio_fiscal: string | null;
  url_logo: string | null;
  color_predominante: string | null;
}
