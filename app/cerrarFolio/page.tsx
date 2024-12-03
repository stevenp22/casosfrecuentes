import Folios from "./buscarFolios";
import VerFolios from "./verFolios";
import { cerrarFolio, verificarPacienteyFolio } from "../lib/actions";
import { Box, Container } from "@mui/material";
import { Folio } from "../lib/definitions";
import RegresarInicio from "../componentes/regresarInicio";

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
  let folios: Folio[] = [];
  if (tipoDocumento != "" || documento != "") {
    folios = (await verificarPacienteyFolio(tipoDocumento, documento)) || [];
  }
  let resultado: number[] = [];
  if (folio != "") {
    resultado = (await cerrarFolio(tipoDocumento, documento, folio)) || [];
  }
  return (
    <div>
      <RegresarInicio />
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="top"
          minHeight="100vh"
          padding={2}
        >
          <Folios />

          <VerFolios folios={folios} resultado={resultado} />
        </Box>
      </Container>
    </div>
  );
}
