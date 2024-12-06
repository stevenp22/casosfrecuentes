import sql from "mssql";
import mysql from "mysql2/promise";
import { Ingreso, User } from "./definitions";

const sqlConfig = {
  user: process.env.SQL_USERNAME || "",
  password: process.env.SQL_PASSWORD || "",
  server: process.env.SQL_HOST || "",
  port: parseInt(process.env.SQL_PORT || ""),
  database: process.env.SQL_DATABASE || "",
  options: {
    encrypt: false,
  },
};

const mySqlConfig = {
  user: process.env.MYSQL_USERNAME || "",
  password: process.env.MYSQL_PASSWORD || "",
  host: process.env.MYSQL_HOST || "",
  port: parseInt(process.env.MYSQL_PORT || ""),
  database: process.env.MYSQL_DATABASE || "",
};

let connectionPool: sql.ConnectionPool | null = null;

async function initializeDBConnection() {
  try {
    if (!connectionPool) {
      connectionPool = await sql.connect(sqlConfig);
      console.log("Database connection established successfully");
    }
    return connectionPool;
  } catch (err) {
    console.error("Error establishing database connection:", err);
    throw err;
  }
}

/*async function closeDBConnection() {
  if (connectionPool) {
    try {
      await connectionPool.close();
      console.log("Database connection closed");
    } catch (err) {
      console.error("Error closing database connection:", err);
    }
  }
}*/

export async function usuarios() {
  const connection = await mysql.createConnection(mySqlConfig);
  try {
    const [results] = await connection.query("SELECT * FROM Usuarios");
    return results;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users.");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function usuario(documento: string): Promise<User | undefined> {
  const connection = await mysql.createConnection(mySqlConfig);
  try {
    const [results] = await connection.query(
      "SELECT * FROM Usuarios WHERE documento = ?",
      [documento]
    );
    const resultados = results as User[];
    return resultados[0];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users.");
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function verificarIngreso(documento: string) {
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  try {
    await initializeDBConnection();
    const resultadoPaciente =
      await sql.query`select * from ingresos where mpcedu = ${documento}`;
    return resultadoPaciente.recordset.length;
  } catch (error) {
    console.log("Error al conectar con SQLServer", error);
  } finally {
    if (connectionPool) {
      await connectionPool.close();
      connectionPool = null;
    }
  }
}

export async function foliosAbiertosPaciente(
  tipoDocumento: string,
  documento: string
) {
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  if (!tipoDocumento || tipoDocumento.trim() === "") {
    throw new Error("Invalid document type");
  }
  try {
    await initializeDBConnection();
    const resultadoFolios =
      await sql.query`select HISCSEC from hccom1 where hisckey=${documento} and histipdoc=${tipoDocumento} and HISCCIE=0`;
    return resultadoFolios.recordset;
  } catch (error) {
    console.log("Error al conectar con SQLServer", error);
  } finally {
    if (connectionPool) {
      await connectionPool.close();
      connectionPool = null;
    }
  }
}

export async function cerrarFolioDB(
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
    await initializeDBConnection();
    const cerrarFolio =
      await sql.query`update hccom1 set HISCCIE = 1 where hisckey = ${documento} and histipdoc = ${tipoDocumento} and HISCSEC = ${folio}`;
    return cerrarFolio.rowsAffected;
  } catch (error) {
    console.log("Error al conectar con SQLServer", error);
  } finally {
    if (connectionPool) {
      await connectionPool.close();
      connectionPool = null;
    }
  }
}

export async function consultaIngresoDB(documento: string) {
  function getLastArrayValue(arr: Ingreso[]) {
    return arr[arr.length - 1];
  }
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  try {
    await initializeDBConnection();
    const resultIngreso =
      await sql.query`SELECT MPNumC, MPCodP, ClaPro, MPTDoc, IngCsc, IngEntDx FROM INGRESOS WHERE MPCEDU = ${documento}`;
    return getLastArrayValue(resultIngreso.recordset);
  } catch (error) {
    console.log("Error al consultar el ingreso en data", error);
  } finally {
    if (connectionPool) {
      await connectionPool.close();
      connectionPool = null;
    }
  }
}

export async function asignarCamaDB(
  documento: string,
  codigoCama: string,
  codigoPabellon: number,
  claseProcedimiento: string,
  tipoDocumento: string,
  consecutivoIngreso: number,
  diagnostico: string,
  fechaInicial: string
) {
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  if (!codigoCama || codigoCama.trim() === "") {
    throw new Error("Invalid bed code");
  }
  if (!codigoPabellon || isNaN(codigoPabellon)) {
    throw new Error("Invalid ward code");
  }
  if (!claseProcedimiento || claseProcedimiento.trim() === "") {
    throw new Error("Invalid procedure class");
  }
  if (!tipoDocumento || tipoDocumento.trim() === "") {
    throw new Error("Invalid document type");
  }
  if (!consecutivoIngreso || isNaN(consecutivoIngreso)) {
    throw new Error("Invalid admission number");
  }
  if (!diagnostico || diagnostico.trim() === "") {
    throw new Error("Invalid diagnosis");
  }
  if (!fechaInicial || fechaInicial.trim() === "") {
    throw new Error("Invalid initial date");
  }
  try {
    await initializeDBConnection();
    const resultAsignado = await sql.query`
      UPDATE TMPFAC SET TFCCODCAM=${codigoCama}, TFCCODPAB=${codigoPabellon}, CLAPRO=${claseProcedimiento} WHERE TFCEDU=${documento} AND TFTDOC=${tipoDocumento} AND TMCTVING=${consecutivoIngreso};

        UPDATE MAEPAB1 SET MPDISP='1', MPFCHI=${fechaInicial},  MPUCED=${documento}, MPUDOC=${tipoDocumento}, MPCTVIN=${consecutivoIngreso}, MPUDX=${diagnostico} WHERE MPNUMC=${codigoCama};

        INSERT INTO MAEPAB11
        SELECT MAEPAB11.MPCODP, 
               MAEPAB11.MPNUMC, 
               (SUM(MAEPAB11.HISCAMCTV)+1), 
               'L', 
               GETDATE(), 
               REPLACE(CONVERT(VARCHAR(10), GETDATE(), 108), '.', ':'), 
               MAEPAB11.MPCEDU, 
               MAEPAB11.MPTDOC, 
               'SISTEMAS', 
               MAEPAB11.HISCNSING    
        FROM MAEPAB11 
        WHERE MAEPAB11.MPNUMC = (SELECT MPNUMC FROM MAEPAB1 WHERE MPUCED=${documento} AND MPUDOC=${tipoDocumento}) 
          AND MPCEDU=${documento}
          AND MPTDOC=${tipoDocumento}
          AND HISCAMEDO='O' 
        GROUP BY MAEPAB11.MPCODP, 
                 MAEPAB11.MPNUMC, 
                 MAEPAB11.HISCAMEDO, 
                 MAEPAB11.HISCAMFEC, 
                 MAEPAB11.HISCAMHOR, 
                 MAEPAB11.MPCEDU, 
                 MAEPAB11.MPTDOC, 
                 MAEPAB11.HISCAMUSU, 
                 MAEPAB11.HISCNSING;

        INSERT INTO MAEPAB11 
        SELECT MAEPAB11.MPCODP, 
               MAEPAB11.MPNUMC, 
               (SUM(MAEPAB11.HISCAMCTV)+1), 
               'O', 
               GETDATE(), 
               REPLACE(CONVERT(VARCHAR(10), GETDATE(), 108), '.', ':'), 
               MAEPAB11.MPCEDU, 
               MAEPAB11.MPTDOC, 
               'SISTEMAS', 
               MAEPAB11.HISCNSING   
        FROM MAEPAB11 
        WHERE MAEPAB11.MPNUMC = ${codigoCama} 
          AND HISCAMEDO='L' 
          AND MAEPAB11.HISCAMCTV IN (SELECT MAX(HISCAMCTV) FROM MAEPAB11 WHERE MPNUMC = ${codigoCama}) 
        GROUP BY MAEPAB11.MPCODP, 
                 MAEPAB11.MPNUMC, 
                 MAEPAB11.HISCAMEDO, 
                 MAEPAB11.HISCAMFEC, 
                 MAEPAB11.HISCAMHOR, 
                 MAEPAB11.MPCEDU, 
                 MAEPAB11.MPTDOC, 
                 MAEPAB11.HISCAMUSU, 
                 MAEPAB11.HISCNSING;
      `;
    return resultAsignado.rowsAffected;
  } catch (error) {
    console.log("Error al asignar la cama en data", error);
    throw error;
  } finally {
    if (connectionPool) {
      await connectionPool.close();
      connectionPool = null;
    }
  }
}

export async function consultaIngresoContrato(
  documento: string,
  año: number,
  mes: number,
  dia: number
) {
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  if (!año || isNaN(año)) {
    throw new Error("Invalid year");
  }
  if (!mes || isNaN(mes)) {
    throw new Error("Invalid month");
  }
  if (!dia || isNaN(dia)) {
    throw new Error("Invalid day");
  }
  try {
    await initializeDBConnection();
    const resultIngreso =
      await sql.query`select IngNit, IngCsc from ingresos where mpcedu LIKE '%' + ${documento} + '%' AND YEAR(IngFecAdm) = ${año} AND MONTH(IngFecAdm) = ${mes} AND DAY(IngFecAdm) = ${dia}`;
    return resultIngreso.recordset[0];
  } catch (error) {
    console.log("Error al consultar el ingreso en data", error);
    throw error;
  } finally {
    if (connectionPool) {
      await connectionPool.close();
      connectionPool = null;
    }
  }
}

export async function consultaHistoriaContrato(
  documento: string,
  año: number,
  folio1: number,
  folio2: number
) {
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  if (!año || isNaN(año)) {
    throw new Error("Invalid year");
  }
  if (!folio1 || isNaN(folio1)) {
    throw new Error("Invalid folio 1");
  }
  if (!folio2 || isNaN(folio2)) {
    throw new Error("Invalid folio 2");
  }
  try {
    await initializeDBConnection();
    const resultIngreso =
      await sql.query`select FHCCodCto from hccom1 where hisckey LIKE '%' + ${documento} + '%' AND YEAR(hiscfk)=${año} AND (HISCSEC between ${folio1} and ${folio2})`;
    return resultIngreso.recordset[0];
  } catch (error) {
    console.log("Error al consultar la Historia en data", error);
    throw error;
  } finally {
    if (connectionPool) {
      await connectionPool.close();
      connectionPool = null;
    }
  }
}

export async function consultaContratosDB(documento: string) {
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  try {
    await initializeDBConnection();
    const resultIngreso = await sql.query`
      SELECT MENNIT, MENOMB 
      FROM MAEEMP 
      WHERE MENNIT IN (
        SELECT MENNIT 
        FROM MAEPAC 
        WHERE MPCedu LIKE '%' + ${documento} + '%'
      )`;
    return resultIngreso.recordset;
  } catch (error) {
    console.log("Error al consultar los contratos en data", error);
    throw error;
  } finally {
    if (connectionPool) {
      await connectionPool.close();
      connectionPool = null;
    }
  }
}

export async function cambioContratoDB(
  documento: string,
  año: number,
  folio1: number,
  folio2: number,
  contratoNuevo: string,
  contratoAnterior: string,
  nitContrato: string,
  consecutivoIngreso: number
) {
  if (!documento || documento.trim() === "") {
    throw new Error("Invalid document number");
  }
  if (!año || isNaN(año)) {
    throw new Error("Invalid year");
  }
  if (!folio1 || isNaN(folio1)) {
    throw new Error("Invalid folio 1");
  }
  if (!folio2 || isNaN(folio2)) {
    throw new Error("Invalid folio 2");
  }
  if (!contratoNuevo || contratoNuevo.trim() === "") {
    throw new Error("Invalid new contract");
  }
  if (!contratoAnterior || contratoAnterior.trim() === "") {
    throw new Error("Invalid previous contract");
  }
  if (!nitContrato || nitContrato.trim() === "") {
    throw new Error("Invalid contract nit");
  }
  if (!consecutivoIngreso || isNaN(consecutivoIngreso)) {
    throw new Error("Invalid admission number");
  }
  try {
    await initializeDBConnection();
    const resultCambio =
      await sql.query`update hccom1 set FHCCodCto = ${contratoNuevo} where hisckey = ${documento} AND (HISCSEC between ${folio1} and ${folio2}) AND FHCCodCto = ${contratoAnterior} AND YEAR(HISFSAL) = ${año};

        update INGRESOS set IngNit = ${contratoNuevo} where MPCedu = ${documento} and IngNit = ${nitContrato} AND IngCsc = ${consecutivoIngreso}`;
    return resultCambio.rowsAffected;
  } catch (error) {
    console.log("Error al cambiar el contrato en data", error);
    throw error;
  } finally {
    if (connectionPool) {
      await connectionPool.close();
      connectionPool = null;
    }
  }
}
