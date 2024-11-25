import Folios from "./buscarFolios";
import VerFolios from "./verFolios";
import { cerrarFolio, verificarPacienteyFolio } from "../lib/actions";
import { Box } from "@mui/material";

export default async function Page(props: {
  searchParams?: Promise<{
    tipoDocumento?: string;
    documento?: string;
    folio?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const tipoDocumento = searchParams?.tipoDocumento || "";
  const documento = searchParams?.documento || "";
  const folio = searchParams?.folio || "";
  const folios =
    (await verificarPacienteyFolio(tipoDocumento, documento)) || [];
  let resultado: number[] = [];
  if (folio) {
    resultado =
      (await cerrarFolio(tipoDocumento, documento, folio)) || [];
  }
  return (
    <Box component="section" sx={{ p: 4 }}>
      <Folios />
      <VerFolios folios={folios} resultado={resultado} />
    </Box>
  );
}
