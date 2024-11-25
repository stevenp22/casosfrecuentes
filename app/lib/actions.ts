import {
  cerrarFolioDB,
  foliosAbiertosPaciente,
  verificarIngreso,
} from "./data";

export async function verificarPacienteyFolio(
  tipoDocumento: string,
  documento: string
) {
  try {
    const paciente = await verificarIngreso(documento);
    if (paciente !== undefined && paciente > 0) {
      const folios = await foliosAbiertosPaciente(tipoDocumento, documento);
      return folios;
    }
  } catch (error) {
    console.log("Error al verificar paciente y folio", error);
  }
}

export async function cerrarFolio(
  tipoDocumento: string,
  documento: string,
  folio: string
) {
  try {
    const folios = await cerrarFolioDB(tipoDocumento, documento, folio);
    return folios;
  } catch (error) {
    console.log("Error al cerrar el folio", error);
  }
}
