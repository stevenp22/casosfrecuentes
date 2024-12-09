"use server";
import {
  asignarCamaDB,
  cambioContratoDB,
  cerrarFolioDB,
  consultaHistoriaContrato,
  consultaIngresoContrato,
  consultaIngresoDB,
  foliosAbiertosPaciente,
  usuario,
  usuarios,
  verificarIngreso,
  consultaContratosDB,
  consultaCita,
  desconfirmarCitaDB,
  consultaCitasDB,
} from "./data";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function buscarUsuario(documento: string) {
  try {
    const resultado = await usuario(documento);
    console.log("Resultado de la busqueda de usuarios", resultado);
    return resultado;
  } catch (error) {
    console.log("Error al buscar usuario", error);
  }
}

export async function buscarUsuarios() {
  try {
    const resultado = await usuarios();
    console.log("Resultado de la busqueda de usuarios", resultado);
    return resultado;
  } catch (error) {
    console.log("Error al buscar usuarios", error);
  }
}

export async function verificarPacienteyFolio(
  tipoDocumento: string,
  documento: string
) {
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  if (!tipoDocumento || tipoDocumento.trim() === "") {
    throw new Error("Invalid document number");
  }
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
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  if (!tipoDocumento || tipoDocumento.trim() === "") {
    throw new Error("Invalid document type");
  }
  if (!folio || folio.trim() === "") {
    throw new Error("Invalid folio");
  }
  try {
    const folios = await cerrarFolioDB(tipoDocumento, documento, folio);
    return folios;
  } catch (error) {
    console.log("Error al cerrar el folio", error);
  }
}

export async function asignarCama(documento: string) {
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  try {
    const ingreso = await consultaIngresoDB(documento);
    if (ingreso) {
      const codigoCama = ingreso.MPNumC;
      const codigoPabellon = parseInt(ingreso.MPCodP);
      const claseProcedimiento = ingreso.ClaPro;
      const tipoDocumento = ingreso.MPTDoc;
      const consecutivoIngreso = parseInt(ingreso.IngCsc);
      const diagnostico = ingreso.IngEntDx;
      const fechaInicial = getCurrentDate();
      try {
        const resultado = await asignarCamaDB(
          documento,
          codigoCama,
          codigoPabellon,
          claseProcedimiento,
          tipoDocumento,
          consecutivoIngreso,
          diagnostico,
          fechaInicial
        );
        console.log("Resultado de la asignacion de cama", resultado);
        return resultado;
      } catch (error) {
        console.log("Error al asignar cama en actions", error);
        throw error;
      }
    } else {
      console.log("Ingreso is undefined");
    }
  } catch (error) {
    console.log("Error consultar el ingreso en actions", error);
    throw error;
  }
}

export async function consultaContratos(documento: string) {
  try {
    const resultado = await consultaContratosDB(documento);
    console.log("Resultado de la busqueda de consultaContratos", resultado);
    return resultado;
  } catch (error) {
    console.log("Error al usar consultaContratos", error);
    throw error;
  }
}

export async function cambioContrato(
  documento: string,
  año: number,
  mes: number,
  dia: number,
  folio1: number,
  folio2: number,
  contratoNuevo: string
) {
  let nitContrato;
  let consecutivoIngreso;
  let contratoAnterior;
  try {
    const resultadoIngreso = await consultaIngresoContrato(
      documento,
      año,
      mes,
      dia
    );
    //console.log("Resultado de la busqueda de consultaIngresoContrato", resultado);
    nitContrato = resultadoIngreso.IngNit;
    consecutivoIngreso = resultadoIngreso.IngCsc;
  } catch (error) {
    console.log("Error al usar consultaIngresoContrato", error);
    throw error;
  }
  try {
    const resultadoContrato = await consultaIngresoContrato(
      documento,
      año,
      mes,
      dia
    );
    //console.log("Resultado de la busqueda de consultaHistoriaContrato", resultado);
    contratoAnterior = resultadoContrato.FHCCodCto;
  } catch (error) {
    console.log("Error al usar consultaIngresoContrato", error);
    throw error;
  }
  try {
    const resultadoContrato = await consultaHistoriaContrato(
      documento,
      año,
      folio1,
      folio2
    );
    //console.log("Resultado de la busqueda de consultaHistoriaContrato", resultado);
    contratoAnterior = resultadoContrato.FHCCodCto;
  } catch (error) {
    console.log("Error al usar consultaIngresoContrato", error);
    throw error;
  }
  try {
    const resultado = await cambioContratoDB(
      documento,
      año,
      folio1,
      folio2,
      contratoNuevo,
      contratoAnterior,
      nitContrato,
      consecutivoIngreso
    );
    //console.log("Resultado de cambioContratoDB", resultado);
    return resultado;
  } catch (error) {
    console.log("Error al usar consultaIngresoContrato", error);
    throw error;
  }
}

export async function desconfirmarCita(
  documento: string,
  cita: number,
  citProcedimiento: string
) {
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  if (!cita || cita === 0) {
    throw new Error("Invalid appointment number");
  }
  if (!citProcedimiento || citProcedimiento.trim() === "") {
    throw new Error("Invalid appointment procedure");
  }
  try {
    const resultadoCita = await consultaCita(cita);
    console.log("Resultado de desconfirmarCita", resultadoCita);
    const citFolio = resultadoCita.CitFolio;
    const citTipoDoc = resultadoCita.CitTipDoc;
    const resultado = await desconfirmarCitaDB(
      cita,
      documento,
      citTipoDoc,
      citFolio,
      citProcedimiento
    );
    return resultado;
  } catch (error) {
    console.log("Error al desconfirmar cita", error);
  }
}

export async function consultarCitas(documento: string) {
  try {
    const resultado = await consultaCitasDB(documento);
    console.log("Resultado de la busqueda de consultaCita", resultado);
    return resultado;
  } catch (error) {
    console.log("Error al usar consultaCita", error);
    throw error;
  }
}
