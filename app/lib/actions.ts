"use server";
import {
  asignarCamaDB,
  cerrarFolioDB,
  consultaIngresoDB,
  foliosAbiertosPaciente,
  usuario,
  usuarios,
  verificarIngreso,
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

export async function asignarCama(documento: string) {
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
