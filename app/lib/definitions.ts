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

export type Cita = {
  CodProCit: number;
  EstCitPac: number;
  FchCitPac: Date;
  HorCitPac: string;
  NomEspCit: string;
  NomEspcCit: string;
  NomProCit: string;
  NombPac: string;
  NumCitPac: number;
  NumDocPac: string;
  TelPac: string;
  TipDocPac: string;
};
