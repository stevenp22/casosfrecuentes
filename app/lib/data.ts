import sql from "mssql";
import mysql from "mysql2/promise";
import { User } from "./definitions";

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
