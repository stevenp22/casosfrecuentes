"use client";
import { useState } from "react";
import { consultaContratos, cambioContrato } from "../lib/actions";
import {
  TextField,
  Button,
  Typography,
  Container,
  Autocomplete,
  Box,
} from "@mui/material";
import RegresarInicio from "../componentes/regresarInicio";
import { Contrato } from "../lib/definitions";

export default function CambioContrato() {
  const [documento, setDocumento] = useState("");
  const [año, setAño] = useState<number>(0);
  const [mes, setMes] = useState<number>(0);
  const [dia, setDia] = useState<number>(0);
  const [folio1, setFolio1] = useState<number>(0);
  const [folio2, setFolio2] = useState<number>(0);
  const [contratoNuevo, setContratoNuevo] = useState("");
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [resultado, setResultado] = useState<number[]>([]);
  const [error, setError] = useState("");

  const handleAsignarCama = async () => {
    try {
      if (
        documento !== "" &&
        año !== 0 &&
        mes !== 0 &&
        dia !== 0 &&
        folio1 !== 0 &&
        folio2 !== 0 &&
        contratoNuevo !== ""
      ) {
        const resultado = await cambioContrato(
          documento,
          año,
          mes,
          dia,
          folio1,
          folio2,
          contratoNuevo
        );
        console.log("Resultado de asignar cama", resultado);
        setResultado(resultado);
      } else {
        setError("Todos los campos son obligatorios.");
      }
      console.log("Resultado de asignar cama", resultado);
      setResultado(resultado);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleConsultarContratos = async () => {
    try {
      if (documento !== "") {
        const resultado = await consultaContratos(documento);
        console.log("Resultado de la busqueda de consultaContratos", resultado);
        setContratos(resultado);
        setError("");
      } else {
        setError("El documento es obligatorio.");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Container>
      <RegresarInicio />
      <Typography variant="h4" component="h1" gutterBottom>
        Cambio contrato
      </Typography>
      <TextField
        label="Documento"
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
        onBlur={handleConsultarContratos}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Año"
        value={año === 0 ? "" : año}
        onChange={(e) => setAño(Number(e.target.value))}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Mes"
        value={mes === 0 ? "" : mes}
        onChange={(e) => setMes(Number(e.target.value))}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Dia"
        value={dia === 0 ? "" : dia}
        onChange={(e) => setDia(Number(e.target.value))}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Rango inferior de folio"
        value={folio1 === 0 ? "" : folio1}
        onChange={(e) => setFolio1(Number(e.target.value))}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Rango superior de folio"
        value={folio2 === 0 ? "" : folio2}
        onChange={(e) => setFolio2(Number(e.target.value))}
        fullWidth
        margin="normal"
        required
      />
      <Box margin="normal">
        <Autocomplete
          options={contratos}
          getOptionLabel={(option) => option.MENOMB}
          renderOption={(props, option) => (
            <li {...props} key={option.MENNIT}>
              {option.MENOMB}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="contratoNuevo" fullWidth required />
          )}
          onChange={(event, newValue) =>
            setContratoNuevo(newValue ? newValue.MENNIT : "")
          }
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleAsignarCama}>
        Cambiar contrato
      </Button>
      {resultado && (
        <Typography variant="body1" color="textPrimary">
          {resultado}
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
    </Container>
  );
}
