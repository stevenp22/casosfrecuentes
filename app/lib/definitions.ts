export type Folio = {
  HISCSEC: number;
};

export type User = {
  id: string;
  documento: string;
  contraseña: string;
};

export type Ingreso = {
  MPNumC: string;
  MPCodP: string;
  ClaPro: string;
  MPTDoc: string;
  IngCsc: string;
  IngEntDx: string;
};

export type Contrato = {
  MENNIT: string;
  MENOMB: string;
};
