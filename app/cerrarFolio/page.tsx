import Folios from "./buscarFolios";
import VerFolios from "./verFolios";
import { cerrarFolio, verificarPacienteyFolio } from "../lib/actions";
import { Container } from "@mui/material";
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
      <Container>
      <RegresarInicio />
          <Folios />

          <VerFolios folios={folios} resultado={resultado} />
      </Container>
  );
}
