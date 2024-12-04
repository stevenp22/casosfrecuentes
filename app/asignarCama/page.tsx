"use client";
import { useState } from "react";
import { asignarCama } from "../lib/actions";
import { TextField, Button, Typography, Container } from "@mui/material";
import RegresarInicio from "../componentes/regresarInicio";

export default function AsignarCama() {
  const [documento, setDocumento] = useState("");
  const [resultado, setResultado] = useState<number[] | undefined>(undefined);
  const [error, setError] = useState("");

  const handleAsignarCama = async () => {
    try {
      const resultado = await asignarCama(documento);
      console.log("Resultado de asignar cama", resultado);
      setResultado(resultado);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Container>
      <RegresarInicio />
      <Typography variant="h4" component="h1" gutterBottom>
        Asignar Cama
      </Typography>
      <TextField
        label="Documento"
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAsignarCama}>
        Asignar Cama
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
