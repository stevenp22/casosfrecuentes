import sql from "mssql";

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

async function conectarDB() {
  try {
    await sql.connect(sqlConfig);
    console.log("Conexión exitosa");
  } catch (err) {
    console.error("Error de conexión:", err);
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
