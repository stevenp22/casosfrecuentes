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

async function conectarDB() {
  try {
    await sql.connect(sqlConfig);
    console.log("Conexión exitosa");
  } catch (err) {
    console.error("Error de conexión:", err);
  }
}

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
  try {
    await conectarDB();
    const resultadoPaciente =
      await sql.query`select * from ingresos where mpcedu = ${documento}`;
    return resultadoPaciente.recordset.length;
  } catch (error) {
    console.log("Error al conectar con SQLServer", error);
  }
}

export async function foliosAbiertosPaciente(
  tipoDocumento: string,
  documento: string
) {
  try {
    await conectarDB();
    const resultadoFolios =
      await sql.query`select HISCSEC from hccom1 where hisckey=${documento} and histipdoc=${tipoDocumento} and HISCCIE=0`;
    return resultadoFolios.recordset;
  } catch (error) {
    console.log("Error al conectar con SQLServer", error);
  }
}

export async function cerrarFolioDB(
  tipoDocumento: string,
  documento: string,
  folio: string
) {
  try {
    await conectarDB();
    const cerrarFolio =
      await sql.query`update hccom1 set HISCCIE = 1 where hisckey = ${documento} and histipdoc = ${tipoDocumento} and HISCSEC = ${folio}`;
    return cerrarFolio.rowsAffected;
  } catch (error) {
    console.log("Error al conectar con SQLServer", error);
  }
}

export async function consultaIngresoDB(documento: string) {
  function getLastArrayValue(arr: Ingreso[]) {
    return arr[arr.length - 1];
  }
  try {
    await conectarDB();
    const resultIngreso =
      await sql.query`SELECT MPNumC, MPCodP, ClaPro, MPTDoc, IngCsc, IngEntDx FROM INGRESOS WHERE MPCEDU = ${documento}`;
    return getLastArrayValue(resultIngreso.recordset);
  } catch (error) {
    console.log("Error al consultar el ingreso en data", error);
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
  try {
    await conectarDB();
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
  }
}
